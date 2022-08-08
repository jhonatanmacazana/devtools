import { t } from "../trpc";
import { protectedProcedure } from "../utils/protected-procedure";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = t.router({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
  }),
  getRepos: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.session);
    return 1;
  }),
});
