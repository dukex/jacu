import { JacuContext } from "./context.ts";
import {
  Router,
  FilesystemRoutes,
  type HandlerFn,
  type Method,
} from "./router/mod.ts";
import type { IApp } from "./type.ts";

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

  handler(): (
    request: Request,
    info?: Deno.ServeHandlerInfo,
  ) => Promise<Response> {
    return async (request: Request, info?: Deno.ServeHandlerInfo) => {
      const url = new URL(request.url);
      // Prevent open redirect attacks
      // url.pathname = url.pathname.replace(/\/+/g, "/");
      const method = request.method.toUpperCase() as Method;
      const found = this.#router.match(method, url);

      if (!found) {
        return new Response("not found", { status: 404 });
      }

      const ctx = new JacuContext(request, url, info);

      return await found.handler(ctx);
    };
  }

  async listen() {
    await this.enableFilesystemRoutes();
    // await this.enableLogging();

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
