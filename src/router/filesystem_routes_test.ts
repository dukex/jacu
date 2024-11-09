import { expect } from "@std/expect";
import { App } from "../app.ts";
import FilesystemRoutes from "./filesystem_routes.ts";
import type { FilesystemWrapper } from "../filesystem_wrapper.ts";
import type { HandlerFn } from "../context.ts";
import type Context from "../context.ts";

type FileImported = null | { default?: HandlerFn };

function createFakeFs(files: Record<string, FileImported>): FilesystemWrapper {
  return {
    cwd: () => ".",
    async *walk(_root) {
      for (const file of Object.keys(files)) {
        const entry = {
          isDirectory: false,
          isFile: true,
          isSymlink: false,
          name: file,
          path: file,
        };
        yield entry;
      }
    },
    isDirectory(dir) {
      return Promise.resolve(
        Object.keys(files).some((file) => file.startsWith(dir + "/")),
      );
    },
    import(path: string): Promise<null | { default?: HandlerFn }> {
      return Promise.resolve(files[path]);
    },
    async mkdirp(_dir: string) {},
    readFile: Deno.readFile,
  };
}

Deno.test("setup routes via file system", async (t) => {
  const app = new App();

  await t.step("with not routes added", async () => {
    const routes = new FilesystemRoutes(app, createFakeFs({}));
    await routes.enable();

    expect(app.routes).toEqual([]);
  });

  await t.step("with not routes added", async () => {
    const handler = (_ctx: Context) => Promise.resolve(new Response("ok"));
    const routes = new FilesystemRoutes(
      app,
      createFakeFs({
        "routes/v1/home.ts": { default: handler },
      }),
    );
    await routes.enable();

    expect(app.routes).toEqual([{ method: "GET", path: "/v1/home", handler }]);
  });

  await t.step("with index file", async () => {
    const handler = (_ctx: Context) => Promise.resolve(new Response("ok"));
    const routes = new FilesystemRoutes(
      app,
      createFakeFs({
        "routes/v1/me/index.ts": { default: handler },
      }),
    );
    await routes.enable();

    expect(app.routes[1]).toEqual({ method: "GET", path: "/v1/me", handler });
  });
});
