import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { formatRelative } from "date-fns";

import { SignIn } from "@/components/sign-in";
import { NavButtons } from "@/components/nav-buttons";
import { getServerSession } from "@devtools/auth";
import { api } from "@/utils/api";

const RepositoriesView = () => {
  const router = useRouter();
  const repos = api.github.getRepos.useQuery();
  return (
    <div className="w-full px-4 py-4 shadow-lg">
      <h2 className="text-xl font-semibold">Available Repositories</h2>
      <div className="flex w-full items-center justify-center pt-6 text-lg">
        {repos.data ? (
          <div className="flex w-full flex-wrap gap-2">
            {repos.data.map((repo) => (
              // eslint-disable-next-line react/no-unknown-property
              <div className="flex items-center gap-2 px-3 py-2 shadow" key={repo.id}>
                <span>{repo.full_name}</span>

                {repo.updated_at && (
                  <span className="text-sm">
                    Updated {formatRelative(new Date(repo.updated_at), new Date())}
                  </span>
                )}

                <button
                  className="ease rounded bg-cyan-300 px-2 py-1 text-sm transition duration-300 hover:bg-cyan-400"
                  onClick={() => router.push(`/pr?owner=${repo.owner.login}&repo=${repo.name}`)}
                >
                  Create PRs
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading..</p>
        )}
      </div>
    </div>
  );
};

const HomeContent = () => {
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

      <RepositoriesView />
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>DevTools - PR</title>
        <meta name="description" content="Tools for developers - focused on github PRs for now" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Devtools - PR
        </h1>

        <HomeContent />
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: { session: await getServerSession(ctx) } };
};

export default Home;
