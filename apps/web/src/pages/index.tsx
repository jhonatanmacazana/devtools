/* eslint-disable */
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { getServerSession } from "@devtools/auth";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>DevTools - JM</title>
        <meta name="description" content="Tools for developers - focused on github PRs for now" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Devtools
        </h1>

        <p className="text-2xl">DevOps tools for ease of use</p>

        <div className="pt-20" />

        <div className="flex min-h-0 w-full flex-1 flex-col">
          <ul className="grid w-full grid-cols-2 place-items-center items-center justify-between gap-6">
            {[
              {
                label: "PRs",
                href: "/pr",
                description: "Create PRs for Github repos",
              },
              {
                label: "Compose File Generator",
                href: "/compose",
                description: "Generate compose files",
              },
            ].map((link) => (
              <Link href={link.href} key={link.label}>
                <li className="h-32 w-80 items-center justify-between py-4 px-8 shadow hover:bg-gray-100">
                  <h3 className="text-xl font-semibold">{link.label}</h3>

                  <p className="text-sm">{link.description}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { props: { session: await getServerSession(ctx) } };
};

export default Home;
