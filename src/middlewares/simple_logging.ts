import type Context from "../context.ts";

export default async function (ctx: Context) {
  const t1 = performance.now();
  const response = await ctx.next();
  const t2 = performance.now();

  const responseTime = Math.round(t2 - t1);

  console.log(
    `${ctx.request.method} ${ctx.url.pathname} ${response.status} - ${responseTime.toString()}ms`,
  );

  return response;
}
