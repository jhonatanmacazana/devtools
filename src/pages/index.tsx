import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "@/utils/trpc";

const RepositoriesView = () => {
  const repos = trpc.useQuery(["question.getRepos"]);
  return (
    <div>
      Repositories view
      <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
        {repos.data ? <p>{JSON.stringify(repos.data, null, 2)}</p> : <p>Loading..</p>}
      </div>
    </div>
  );
};

const NavButtons = () => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => signOut()}
        className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

const HomeContent = () => {
  const { data: sesh } = useSession();

  if (!sesh) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <div className="text-xl font-bold">Please log in below</div>
        <div className="p-4" />
        <button
          onClick={() => signIn("github")}
          className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-xl text-black"
        >
          <span>Sign in with Github</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between py-4 px-8 shadow">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
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
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        <p className="text-2xl text-gray-700">This stack uses:</p>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
          {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
        </div>

        <HomeContent />
      </main>
    </>
  );
};

export default Home;
