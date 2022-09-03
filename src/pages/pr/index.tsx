import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowUp,
  HiOutlineExternalLink,
  HiLockClosed,
  HiLockOpen,
} from "react-icons/hi";
import { z } from "zod";

import { Link } from "@/components/link";
import { NavButtons } from "@/components/nav-buttons";
import { SignIn } from "@/components/sign-in";
import { getAuthSession } from "@/server/common/get-server-session";
import { prisma } from "@/server/db/client";
import { trpc } from "@/utils/trpc";
import { CheckboxInput, RadioInput, TextareaInput, TextInput } from "@/components/inputs";

const multipleValueParser = z.array(z.object({ name: z.string(), value: z.boolean().nullish() }));
const multipleValueNonEmptyParser = multipleValueParser.refine(
  (val) => val.some((item) => item.value),
  { message: "At least one target branch must be selected" }
);
const multipleValueTransformer = multipleValueParser.transform((array) =>
  array.filter((item) => item.value).map((item) => item.name)
);
const multipleValueNonEmptyTransformer = multipleValueNonEmptyParser.transform((array) =>
  array.filter((item) => item.value).map((item) => item.name)
);
const nonEmptyArrayParser = z.array(z.string()).nonempty();

const prSchema = z.object({
  sourceBranch: z.string(),
  targetBranches: multipleValueNonEmptyParser,
  prLabels: multipleValueParser,
  prReviewers: multipleValueParser,
  prTitle: z.string(),
  prContent: z.string(),
});
type PrSchemaType = z.infer<typeof prSchema>;

const isNonEmptyArray = (array: unknown) => Array.isArray(array) && array.length > 0;

const parseNonEmptyArray = <T,>(array: T[]) => {
  if (!isNonEmptyArray(array)) return null;
  const first = multipleValueNonEmptyTransformer.safeParse(array);
  if (!first.success) return null;
  const second = nonEmptyArrayParser.safeParse(first.data);
  if (!second.success) return null;
  return second.data;
};

const RepoActionSection: React.FC<{ owner: string; repo: string }> = ({ owner, repo }) => {
  const [isLocked, setIsLocked] = useState(false);

  const { handleSubmit, register, watch } = useForm<PrSchemaType>({
    resolver: zodResolver(prSchema),
  });

  const { mutate: createPRs } = trpc.github.createPRs.useMutation();
  const repoData = trpc.github.getRepoData.useQuery({ owner, repo });

  const sourceBranch = watch("sourceBranch");
  const watchedTargetBranches = watch("targetBranches");
  const targetBranches = parseNonEmptyArray(watchedTargetBranches);

  const compareBranchesResponse = trpc.github.compareBranches.useQuery(
    { owner, repo, source: sourceBranch, targets: targetBranches! },
    {
      enabled:
        isNonEmptyArray(targetBranches) && typeof sourceBranch === "string" && sourceBranch !== "",
    }
  );

  const onSubmit = (data: PrSchemaType) => {
    createPRs({
      content: data.prContent,
      title: data.prTitle,
      owner,
      repo,
      targets: nonEmptyArrayParser.parse(
        multipleValueNonEmptyTransformer.parse(data.targetBranches)
      ),
      source: data.sourceBranch,
      labels: multipleValueTransformer.parse(data.prLabels),
      reviewers: multipleValueTransformer.parse(data.prReviewers),
    });
    console.log(data);
  };

  const isSubmitDisabled = true;

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
      <div className="grid w-full grid-cols-1 justify-around gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <section className="col-span-1">
          <h3 className="text-xl font-semibold" title="Branch to be merged from">
            Source Branch
          </h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {repoData.data.branches.map((branch) => (
              <RadioInput
                disabled={!isLocked}
                id={`radio-${branch.name}`}
                key={branch.commit.sha}
                label={branch.name}
                registerReturn={register("sourceBranch")}
                value={branch.name}
              />
            ))}
          </div>
        </section>

        <section className="col-span-1">
          <h3 className="text-xl font-semibold" title="Branches to be merged to">
            Target Branches
          </h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {repoData.data.branches.map((branch, idx) => (
              <CheckboxInput
                disabled={!isLocked}
                id={`checkbox-${branch.commit.sha}`}
                key={branch.commit.sha}
                label={branch.name}
                registerReturnName={register(`targetBranches.${idx}.name` as const)}
                registerReturnValue={register(`targetBranches.${idx}.value` as const)}
              />
            ))}
          </div>
        </section>

        <section className="col-span-1 md:col-span-2 lg:col-span-2">
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
                  <span>{compareBranchData.head}</span>
                  <HiOutlineArrowNarrowRight width={10} />
                  <span>{compareBranchData.base}</span>
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
                  className="flex items-center gap-0.5 rounded border border-solid border-gray-500 px-2 py-1 font-mono text-sm"
                  title={`Ahead by ${compareBranchData.ahead_by} commits`}
                >
                  <HiOutlineArrowNarrowUp width={8} />
                  <span>{compareBranchData.ahead_by}</span>
                </div>

                <div
                  className="flex items-center gap-0.5 rounded border border-solid border-gray-500 px-2 py-1 font-mono text-sm"
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
        className={clsx(
          "flex w-40 items-center justify-center gap-x-1 rounded px-5 py-3 text-sm transition duration-300",
          isLocked ? "bg-red-400 text-white hover:bg-red-500" : "bg-green-300 hover:bg-green-400"
        )}
        onClick={() => setIsLocked((x) => !x)}
        type="button"
      >
        {isLocked ? <HiLockClosed /> : <HiLockOpen />}

        <span>{isLocked ? "Unlock State" : "Lock State"}</span>
      </button>

      <div className="grid w-full grid-cols-5 gap-x-4">
        <section className="col-span-3">
          <TextInput
            disabled={!isLocked}
            id="title-id"
            label="Title"
            placeholder="Title of the PR"
            registerReturn={register("prTitle")}
            type="text"
          />

          <div className="pb-2" />

          <TextareaInput
            disabled={!isLocked}
            id="content-id"
            label="Content"
            placeholder="Content"
            registerReturn={register("prContent")}
            type="text"
          />
        </section>

        <section className="col-span-1">
          <h3 className="text-xl font-semibold">Assign reviewers</h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {repoData.data?.collaborators?.map((collaborator, idx) => (
              <CheckboxInput
                disabled={!isLocked}
                id={`checkbox-${collaborator.login}`}
                key={collaborator.login}
                label={collaborator.login ?? ""}
                registerReturnName={register(`prReviewers.${idx}.name` as const)}
                registerReturnValue={register(`prReviewers.${idx}.value` as const)}
              />
            ))}
          </div>
        </section>

        <section className="col-span-1">
          <h3 className="text-xl font-semibold">Labels</h3>
          <div className="flex flex-col items-center justify-center gap-2 pt-4 text-lg">
            {repoData.data?.labels?.map((label, idx) => (
              <CheckboxInput
                disabled={!isLocked}
                id={`checkbox-${label.name}`}
                key={label.name}
                label={label.name}
                registerReturnName={register(`prLabels.${idx}.name` as const)}
                registerReturnValue={register(`prLabels.${idx}.value` as const)}
              />
            ))}
          </div>
        </section>
      </div>
      <button
        className="w-40 rounded bg-cyan-300 px-5 py-3 text-sm transition duration-300 hover:bg-cyan-400"
        // disabled={isSubmitDisabled}
        type="submit"
      >
        Submit PRs
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
      <div className="flex w-full items-center justify-between py-4 px-2 shadow lg:px-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold lg:text-2xl">
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
  const fullRepo = `${props.owner}/${props.repo}`;
  return (
    <>
      <Head>
        <title>{`PR - ${fullRepo}`}</title>
        <meta name="description" content={`Tools for creating PRs on ${fullRepo}"`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="justify-between text-center text-3xl font-extrabold leading-normal text-gray-700 sm:text-4xl md:text-5xl">
          {fullRepo}
        </h1>

        {props.owner && <CreatePrPageContent owner={props.owner} repo={props.repo} />}
      </main>
    </>
  );
};

export default CreatePrPage;
