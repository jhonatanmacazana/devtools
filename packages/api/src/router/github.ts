import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { octokit } from "../github/octokit";
import { aw } from "../utils/aw";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const githubRouter = createTRPCRouter({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
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
      const [responses, err] = await aw(
        Promise.all([
          octokit.rest.repos.listBranches({
            headers: { authorization: `token ${ctx.session.accessToken}` },
            owner: input.owner,
            repo: input.repo,
          }),

          octokit.rest.repos.listCollaborators({
            headers: { authorization: `token ${ctx.session.accessToken}` },
            owner: input.owner,
            repo: input.repo,
          }),

          octokit.rest.issues.listLabelsForRepo({
            headers: { authorization: `token ${ctx.session.accessToken}` },
            owner: input.owner,
            repo: input.repo,
          }),
        ]),
      );

      if (err) {
        // @ts-ignore
        const status = err?.response.status || err?.status || 500;
        throw new TRPCError({
          message: err.message || "Something bad just happened",
          code: status === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
          cause: err,
        });
      }
      const branches = responses[0];
      const collaborators = responses[1];
      const labelsForRepo = responses[2];

      return {
        branches: branches.data,
        protectedBranches: branches.data.filter((branch) => branch.protected),
        labels: labelsForRepo.data,
        collaborators: collaborators.data,
      };
    }),

  compareBranches: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        source: z.string(),
        targets: z.array(z.string()).nonempty(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [responses, err] = await aw(
        Promise.all(
          input.targets.map(async (target) =>
            octokit.rest.repos.compareCommitsWithBasehead({
              headers: { authorization: `token ${ctx.session.accessToken}` },
              owner: input.owner,
              repo: input.repo,
              basehead: `${target}...${input.source}`,
            }),
          ),
        ),
      );

      if (err) {
        // @ts-ignore
        const status = err?.response.status || err?.status || 500;
        throw new TRPCError({
          message: err.message || "Something bad just happened",
          code: status === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
          cause: err,
        });
      }

      return responses.map((r) => {
        const baseHead = r.data.url.split("/").pop()?.split("...");
        const base = baseHead?.[0];
        const head = baseHead?.[1];
        return {
          base,
          head,
          url: r.data.html_url,
          status: r.data.status,
          ahead_by: r.data.ahead_by,
          behind_by: r.data.behind_by,
          total_commits: r.data.total_commits,
          // commits: r.data.commits,
        };
      });
    }),

  createPRs: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        source: z.string(),
        targets: z.array(z.string()).nonempty(),
        title: z.string(),
        content: z.string(),
        reviewers: z.array(z.string()),
        labels: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      // octokit.rest.pulls.create({
      //   headers: { authorization: `token ${ctx.session.accessToken}` },
      //   owner: input.owner,
      //   repo: input.repo,
      //   base: input.targets[0],
      //   head: input.source,
      //   title: input.title,
      //   body: input.content,
      // });
    }),
});
