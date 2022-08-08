import { Octokit } from "@octokit/rest";
import { TRPCError } from "@trpc/server";

import { t } from "../trpc";
import { protectedProcedure } from "../utils/protected-procedure";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = t.router({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
  }),
  getRepos: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.account.findFirst({
      where: { userId: ctx.session.user.id },
      select: { access_token: true },
    });

    if (!res?.access_token) {
      throw new TRPCError({ message: "No access token found", code: "UNAUTHORIZED" });
    }

    const octokit = new Octokit({ auth: res.access_token });
    const orgs = await octokit.rest.repos.listForAuthenticatedUser();

    return orgs.data;
  }),
});
