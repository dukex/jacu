class Router {
  _routes = [];

  construtor() {
  }

  add(method: string, path: string, handler: () => void) {
    this._routes.push({
      path,
      handler,
      method,
    });
  }

  match(method: string, url: URL) {
    return this._routes.filter((route) => {
      return route.method === method && route.path === url.pathname;
    })[0];
  }
}

export class App {
  #router: Router = new Router();

  get(path: string, handler: () => void) {
    this.#router.add("GET", path, handler);
  }

  async handler(): Promise<
    (request: Request, info?: Deno.ServeHandlerInfo) => Promise<Response>
  > {
    return async (
      request: Request,
      info: Deno.ServeHandlerInfo = {},
    ) => {
      const url = new URL(request.url);
      // Prevent open redirect attacks
      url.pathname = url.pathname.replace(/\/+/g, "/");

      const method = request.method.toUpperCase() as Method;
      const { handler } = this.#router.match(method, url);

      const ctx = {};

      return await handler(ctx);
    };
  }

  async listen() {
    const handler = await this.handler();

    await Deno.serve({ port: 9000 }, handler);
  }
}
