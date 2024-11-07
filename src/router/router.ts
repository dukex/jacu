import type { HandlerFn } from "../context.ts";

export type Method = "HEAD" | "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface Route {
  path: string;
  method: Method;
  handler: HandlerFn;
  name?: string;
}

export interface RouteResult {
  handlers: HandlerFn[];
}

export default class Router {
  #routes: Route[] = [];
  #middlewares: HandlerFn[] = [];

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

  match(method: Method, url: URL): RouteResult {
    const routes = this.#routes.filter((route: Route) => {
      return route.method === method && route.path === url.pathname;
    });

    const [route] = routes;
    const handlers = [...this.#middlewares];

    if (route) {
      return {
        handlers: [...handlers, route.handler],
      };
    }

    return {
      handlers,
    };
  }

  addMiddleware(middleware: HandlerFn) {
    this.#middlewares.push(middleware);
  }
}
