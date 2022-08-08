import { Octokit } from "@octokit/rest";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { t } from "../trpc";
import { protectedProcedure } from "../utils/protected-procedure";

export const githubRouter = t.router({
  hello: t.procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.example.findMany();
  }),
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
    const repos = await octokit.rest.repos.listForAuthenticatedUser();

    return repos.data;
  }),
});
