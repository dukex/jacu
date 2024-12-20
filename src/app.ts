import type { AuthenticationStrategy } from "./authentication/mod.ts";
import { type HandlerFn, JacuContext } from "./context.ts";
import type { Context } from "./mod.ts";
import { FilesystemRoutes, type Method, Router } from "./router/mod.ts";
import type { Route } from "./router/router.ts";
import type { IApp } from "./type.ts";

const DEFAULT_NOT_FOUND = () =>
  Promise.resolve(new Response("not found", { status: 404 }));

export class App implements IApp {
  #router: Router = new Router();

  get(path: string, handler: HandlerFn) {
    this.#router.add("GET", path, handler);
  }

  post(path: string, handler: HandlerFn) {
    this.#router.add("POST", path, handler);
  }

  get routes(): Route[] {
    return this.#router.routes;
  }

  async enableFilesystemRoutes(): Promise<void> {
    const feature = new FilesystemRoutes(this);
    await feature.enable();
  }

  use(handler: HandlerFn) {
    this.#router.addMiddleware(handler);
    return this;
  }

  authentication<T>(strategy: AuthenticationStrategy<T>) {
    return this.use((ctx: Context) => {
      return strategy
        .authenticate(ctx)
        .then((user) => {
          ctx.state.user = user;
          return ctx.next();
        })
        .catch((err) => {
          console.log(err);
          return new Response("", { status: 401 });
        });
    });
  }

  handler(): (
    request: Request,
    info?: Deno.ServeHandlerInfo,
  ) => Promise<Response> {
    return (request: Request, info?: Deno.ServeHandlerInfo) => {
      const url = new URL(request.url);
      // Prevent open redirect attacks
      url.pathname = url.pathname.replace(/\/+/g, "/");
      const method = request.method.toUpperCase() as Method;
      const routeResult = this.#router.match(method, url);

      const ctx = new JacuContext<{ a: string }>(
        request,
        url,
        DEFAULT_NOT_FOUND,
        info,
      );

      let fn = ctx.next;

      let j = routeResult.handlers.length;
      while (j--) {
        const next = routeResult.handlers[j];
        const local = fn;
        fn = () => {
          ctx.next = local;
          return next(ctx);
        };
      }

      return fn();
    };
  }

  async listen(): Promise<Deno.HttpServer<Deno.NetAddr>> {
    await this.enableFilesystemRoutes();

    return Deno.serve(
      {
        port: 9000,
        onListen: ({ port, hostname }) => {
          console.log(`Server started at http://${hostname}:${port}`);
          console.table(this.routes, ["method", "path", "name"]);
        },
      },
      this.handler(),
    );
  }
}
