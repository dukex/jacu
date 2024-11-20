import type { Context } from "jacu";

type WithUser = {
  userId: string;
  user: Record<string, never>;
};

type WithTenant = {
  tenantId: string;
};

export default function handler(ctx: Context<WithUser & WithTenant>) {
  const { userId, tenantId, user } = ctx.state;

  return Response.json({
    userId,
    tenantId,
    user,
  });
}
