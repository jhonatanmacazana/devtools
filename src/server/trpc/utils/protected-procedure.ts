import { TRPCError } from "@trpc/server";

import { t } from "../trpc";

export const protectedMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const res = await ctx.prisma.account.findFirst({
    where: { userId: ctx.session.user.id },
    select: { access_token: true },
  });

  if (!res?.access_token) {
    throw new TRPCError({ message: "No access token found", code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      // infers that `session` is non-nullable to downstream resolvers
      session: { ...ctx.session, user: ctx.session.user, accessToken: res.access_token },
    },
  });
});

export const protectedProcedure = t.procedure.use(protectedMiddleware);
