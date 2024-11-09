import type Context from "../context.ts";

export default function (ctx: Context) {
  const url = ctx.url;

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    return ctx.redirect(`${url.pathname.slice(0, -1)}${url.search}`);
  }

  return ctx.next();
}
