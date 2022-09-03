import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { getAuthSession } from "@/server/common/get-server-session";
import { prisma } from "@/server/db/client";

export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = req && res && (await getAuthSession({ req, res }));

  return { session, prisma };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
