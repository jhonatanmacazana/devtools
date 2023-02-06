import { Octokit } from "@octokit/rest";

import { env } from "@/env/server.mjs";

const globalForOctokit = globalThis as unknown as { octokit: Octokit };

export const octokit =
  globalForOctokit.octokit ||
  new Octokit({
    userAgent: "jm/devtools",
  });

if (env.NODE_ENV !== "production") {
  globalForOctokit.octokit = octokit;
}
