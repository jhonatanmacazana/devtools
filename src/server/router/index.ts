// src/server/router/index.ts
import { githubRouter } from "./subroutes/github";
import { t } from "./trpc";

export const appRouter = t.router({
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
