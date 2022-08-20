import { z } from "zod";

import { octokit } from "@/server/github/octokit";

import { t } from "../trpc";
import { protectedProcedure } from "../utils/protected-procedure";

export const githubRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string().nullish() }).nullish())
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
  getRepos: protectedProcedure
    .input(z.object({ page: z.number().nullish(), perPage: z.number().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const repos = await octokit.rest.repos.listForAuthenticatedUser({
        headers: { authorization: `token ${ctx.session.accessToken}` },
        sort: "updated",
        direction: "desc",
        per_page: input?.perPage || 100,
        page: input?.page || 0,
      });

      return repos.data;
    }),
  getRepoData: protectedProcedure
    .input(z.object({ owner: z.string(), repo: z.string() }))
    .query(async ({ ctx, input }) => {
      const repos = await octokit.rest.repos.listBranches({
        headers: { authorization: `token ${ctx.session.accessToken}` },
        owner: input.owner,
        repo: input.repo,
      });

      return {
        branches: repos.data,
        protectedBranches: repos.data.filter((branch) => branch.protected),
      };
    }),
  compareBranches: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        base: z.string(),
        heads: z.array(z.string()).nonempty(),
      })
    )
    .query(async ({ ctx, input }) => {
      const responses = await Promise.all(
        input.heads.map(async (head) =>
          octokit.rest.repos.compareCommitsWithBasehead({
            headers: { authorization: `token ${ctx.session.accessToken}` },
            owner: input.owner,
            repo: input.repo,
            basehead: `${input.base}...${head}`,
          })
        )
      );

      return responses.map((r) => {
        const baseHead = r.data.url.split("/").pop()?.split("...");
        const base = baseHead?.[0];
        const head = baseHead?.[1];
        return {
          base,
          head,
          url: r.data.url,
          status: r.data.status,
          ahead_by: r.data.ahead_by,
          behind_by: r.data.behind_by,
          total_commits: r.data.total_commits,
          // commits: r.data.commits,
        };
      });
    }),
});
