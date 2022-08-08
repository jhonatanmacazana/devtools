// src/server/router/index.ts
import { exampleRouter } from "./subroutes/example";
import { protectedExampleRouter } from "./subroutes/protected-example-router";
import { t } from "./trpc";

export const appRouter = t.router({
  example: exampleRouter,
  secret: protectedExampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
