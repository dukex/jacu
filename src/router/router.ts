import type Context from "../context.ts";

export type Method = "HEAD" | "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type HandlerFn = (ctx: Context) => Promise<Response>;

export interface Route {
  path: string;
  method: Method;
  handler: HandlerFn;
  name?: string;
}

export default class Router {
  #routes: Route[] = [];

  get routes(): Route[] {
    return this.#routes;
  }

  add(method: Method, path: string, handler: HandlerFn): void {
    this.#routes.push({
      path,
      handler,
      method,
    });
  }

  match(method: Method, url: URL): Route | null {
    return this.#routes.filter((route: Route) => {
      return route.method === method && route.path === url.pathname;
    })[0];
  }
}
