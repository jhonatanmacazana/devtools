import { Octokit } from "@octokit/rest";

import { env } from "@/env/server.mjs";

declare global {
  var octokit: Octokit | undefined;
}

export const octokit =
  global.octokit ||
  new Octokit({
    userAgent: "jm/devtools",
  });

if (env.NODE_ENV !== "production") {
  global.octokit = octokit;
}
