import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowUp,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { z } from "zod";

import { Link } from "@/components/link";
import { NavButtons } from "@/components/nav-buttons";
import { SignIn } from "@/components/sign-in";
import { getAuthSession } from "@/server/common/get-server-session";
import { trpc } from "@/utils/trpc";

const prSchema = z.object({
  baseBranch: z.string(),
  targetBranches: z
    .array(z.object({ name: z.string(), value: z.boolean() }))
    .refine((val) => val.some((item) => item.value), {
      message: "At least one target branch must be selected",
    }),
});
type PrSchemaType = z.infer<typeof prSchema>;

const RepoActionSection: React.FC<{ owner: string; repo: string }> = ({ owner, repo }) => {
  const { handleSubmit, register, watch } = useForm<PrSchemaType>({
    resolver: zodResolver(prSchema),
  });
  const repoData = trpc.proxy.github.getRepoData.useQuery({ owner, repo });
  const baseBranch = watch("baseBranch");
  const headBranches =
    watch("targetBranches")
      ?.filter((tb) => tb.value)
      .map((tb) => tb.name) || null;
  const compareBranchesResponse = trpc.proxy.github.compareBranches.useQuery(
    // @ts-ignore
    { owner, repo, base: baseBranch, heads: headBranches },
    {
      enabled:
        Array.isArray(headBranches) &&
        headBranches.length > 0 &&
        typeof baseBranch === "string" &&
        baseBranch !== "",
    }
  );

  const onSubmit = (data: PrSchemaType) => console.log(data);

  if (repoData.error)
    return (
      <div className="flex w-full flex-col py-8">
        <h2 className="text-center text-2xl font-semibold text-red-500">There was an error</h2>

        <p className="text-lg">{repoData.error.message}</p>
      </div>
    );

  if (!repoData.data) return <p>Loading..</p>;

  return (
    <form
      className="flex w-full flex-col items-center gap-4 p-4 shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col justify-around gap-4 lg:flex-row">
        <section className="w-full lg:w-1/4">
          <h3 className="text-xl font-semibold">Base Branch</h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {repoData.data.branches.map((branch) => {
              const id = `radio-${branch.name}`;
              return (
                <div
                  className="flex w-full items-center gap-2 px-3 py-2 shadow "
                  key={branch.commit.sha}
                >
                  <div className="flex items-center">
                    <input
                      {...register("baseBranch")}
                      id={id}
                      type="radio"
                      value={branch.name}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    />
                    <label
                      htmlFor={id}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {branch.name}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="w-full lg:w-1/4">
          <h3 className="text-xl font-semibold">Target Branches</h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {repoData.data.branches.map((branch, idx) => {
              const htmlId = `checkbox-${branch.commit.sha}`;
              return (
                <div
                  className="flex w-full items-center gap-2 px-3 py-2 shadow"
                  key={branch.commit.sha}
                >
                  <input
                    {...register(`targetBranches.${idx}.name` as const)}
                    hidden
                    value={branch.name}
                  />
                  <input
                    {...register(`targetBranches.${idx}.value` as const)}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    id={htmlId}
                    type="checkbox"
                  />
                  <label
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    htmlFor={htmlId}
                  >
                    {branch.name}
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        <section className="w-full lg:w-1/4">
          <h3 className="text-xl font-semibold">Available to merge?</h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {compareBranchesResponse.data?.map((compareBranchData) => (
              <div
                className="flex w-full items-center gap-2 px-3 py-2 shadow"
                key={compareBranchData.url}
              >
                <Link
                  className="flex items-center gap-2 px-3 py-2  transition hover:bg-gray-100"
                  href={compareBranchData.url}
                  isExternal
                >
                  <span>{compareBranchData.base}</span>
                  <HiOutlineArrowNarrowLeft width={10} />
                  <span>{compareBranchData.head}</span>
                  <HiOutlineExternalLink className="self-start" width={10} />
                </Link>

                <span
                  className={clsx(
                    "rounded px-2 py-1 font-mono text-sm",
                    compareBranchData.status === "diverged" && "bg-red-300",
                    compareBranchData.status === "ahead" && "bg-green-400",
                    compareBranchData.status === "behind" && "bg-yellow-500",
                    compareBranchData.status === "identical" && "bg-gray-300"
                  )}
                >
                  {compareBranchData.status}
                </span>

                <div
                  className="flex items-center gap-0.5"
                  title={`Ahead by ${compareBranchData.ahead_by} commits`}
                >
                  <HiOutlineArrowNarrowUp width={8} />
                  <span>{compareBranchData.ahead_by}</span>
                </div>

                <div
                  className="flex items-center gap-0.5"
                  title={`Behind by ${compareBranchData.behind_by} commits`}
                >
                  <HiOutlineArrowNarrowDown width={8} />
                  <span>{compareBranchData.behind_by}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <button
        className="w-32 rounded bg-cyan-300 px-5 py-3 text-sm transition duration-300 hover:bg-cyan-400"
        type="submit"
      >
        Target PRs
      </button>
    </form>
  );
};

const CreatePrPageContent: React.FC<{ owner: string; repo: string }> = ({ owner, repo }) => {
  const { data: sesh } = useSession();

  if (!sesh) {
    return <SignIn />;
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex w-full items-center justify-between py-4 px-8 shadow">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          {sesh.user?.image && (
            <img src={sesh.user?.image} alt="pro pic" className="w-16 rounded-full" />
          )}
          {sesh.user?.name}
        </h1>
        <NavButtons />
      </div>

      <RepoActionSection owner={owner} repo={repo} />
    </div>
  );
};

export const getServerSideProps = async ({ query, req, res }: GetServerSidePropsContext) => {
  if (
    !query ||
    !query.repo ||
    typeof query.repo !== "string" ||
    !query.owner ||
    typeof query.owner !== "string"
  ) {
    console.error("Get bad query", query);
    return { props: {}, notFound: true };
  }

  const { repo, owner } = query;

  const session = await getAuthSession({ req, res });
  if (!session) {
    console.error("Got no session");
    return { props: {}, notFound: true };
  }

  const account = await prisma?.account.findFirst({
    where: { userId: session.user?.id },
    select: { access_token: true },
  });
  if (!account?.access_token) {
    console.error("Got no access token");
    return { props: {}, notFound: true };
  }

  return { props: { session: session, repo, owner } };
};

const CreatePrPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Devtools
        </h1>

        {props.owner && <CreatePrPageContent owner={props.owner} repo={props.repo} />}
      </main>
    </>
  );
};

export default CreatePrPage;
