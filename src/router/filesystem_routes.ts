import {
  type FilesystemWrapper,
  FilesystemWrapperImpl,
  walkDir,
} from "../filesystem_wrapper.ts";
import * as path from "@std/path";
import type { IApp } from "../type.ts";

export default class FilesystemRoutes {
  app: IApp;
  fs: FilesystemWrapper;
  routerDir: string;

  constructor(app: IApp, fs?: FilesystemWrapper, rootDir?: string) {
    this.app = app;
    this.fs = fs ?? new FilesystemWrapperImpl();
    this.routerDir = path.join(this.fs.cwd(), rootDir || "./", "routes");
  }

  toRoutePath(filePath: string): string {
    const relative = path.relative(this.routerDir, filePath);
    const url: URL = new URL(relative, "http://localhost/");
    const routePath: string = url.pathname
      .slice(0, url.pathname.lastIndexOf("."))
      .slice(1);

    const parts = routePath.split("/");

    if (parts[parts.length - 1] === "index") {
      parts.pop();
    }

    return parts.join("/");
  }

  async enable(): Promise<void> {
    const routesFiles: string[] = await walkDir(this.routerDir, this.fs);

    const routes = await Promise.all(
      routesFiles
        .map((filePath) => {
          return {
            routePath: `/${this.toRoutePath(filePath)}`,
            filePath,
          };
        })
        .map(async ({ routePath, filePath }) => {
          const mod = await this.fs.import(filePath);

          // TODO: test it
          if (mod === null || typeof mod.default !== "function") {
            return null;
          }

          const handlers = mod.default;

          return {
            routePath,
            filePath,
            handlers,
          };
        }),
    );

    routes
      .filter((r) => !!r)
      .map(({ handlers, routePath }) => {
        this.app.get(routePath, handlers);
      });

    return Promise.resolve();
  }
}
