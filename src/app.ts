import type Context from "./context.ts";
import { JacuContext, type HandlerFn } from "./context.ts";
import { Router, FilesystemRoutes, type Method } from "./router/mod.ts";
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

  get routes() {
    return this.#router.routes;
  }

  async enableFilesystemRoutes(): Promise<void> {
    const feature = new FilesystemRoutes(this);
    await feature.enable();
  }

  enableLogging() {
    this.#router.addMiddleware(async (ctx: Context) => {
      const t1 = performance.now();
      const response = await ctx.next();
      const t2 = performance.now();
      const responseTime = Math.round(t2 - t1);

      console.log(
        `${ctx.request.method} ${ctx.url.pathname} ${response.status} - ${responseTime.toString()}ms`,
      );

      return response;
    });
  }

  handler(): (
    request: Request,
    info?: Deno.ServeHandlerInfo,
  ) => Promise<Response> {
    return async (request: Request, info?: Deno.ServeHandlerInfo) => {
      const url = new URL(request.url);
      // Prevent open redirect attacks
      // url.pathname = url.pathname.replace(/\/+/g, "/");
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
        fn = async () => {
          ctx.next = local;
          try {
            return await next(ctx);
          } catch (error) {
            throw error;
          }
        };
      }

      return await fn();
    };
  }

  async listen() {
    await this.enableFilesystemRoutes();
    this.enableLogging();

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
