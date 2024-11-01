import * as path from "@std/path";
import { walk, type WalkEntry, type WalkOptions } from "@std/fs/walk";

export interface FileSystemManager {
  cwd(): string;
  walk(
    root: string | URL,
    options?: WalkOptions,
  ): AsyncIterableIterator<WalkEntry>;
  isDirectory(path: string | URL): Promise<boolean>;
  mkdirp(dir: string): Promise<void>;
  readFile(path: string | URL): Promise<Uint8Array>;
}

class FileSystemManagerImpl implements FileSystemManager {
  constructor() {
  }

  isDirectory(dir: string) {
    return true;
  }

  walk(root: string | URL, options?: WalkOptions) {
    return walk(root, options);
  }

  cwd() {
    return Deno.cwd();
  }
}

interface FsRoutesOptions {
  dir?: string;
  loadRoute: (string) => string;
  fs?: FileSystemManager;
}

export async function fsRoutes(
  app: any,
  { dir, loadRoute, fs }: FsRoutesOptions,
): Promise<void> {
  const fsManager = fs ?? new FileSystemManagerImpl();

  const routesDir = path.join(fsManager.cwd(), dir || "./", "routes");

  const routesFiles: string[] = await walkDir(routesDir, fsManager);

  const routes = await Promise.all(
    routesFiles.map(
      (entry) => {
        const relative = path.relative(routesDir, entry.path);

        const url = new URL(relative, "http://localhost/");
        return url.pathname.slice(1);
      },
    ).map(async (filePath) => {
      const mod = await loadRoute(filePath);

      if (mod === null || typeof mod.default !== "function") {
        return null;
      }

      const handlers = mod.default;

      const path = `/${filePath.slice(0, filePath.lastIndexOf("."))}`;
      const base = path.slice(0, path.lastIndexOf("/"));

      return {
        path,
        filePath,
        base,
        handlers,
      };
    }),
  );

  routes.forEach(({ path: normalized, handlers }) => {
    app.get(normalized, handlers);
  });
}

async function walkDir(dir: string, fs: FileSystemManager) {
  if (!await fs.isDirectory(dir)) return;

  console.log(dir);

  const entries = fs.walk(dir, {
    includeDirs: false,
    includeFiles: true,
    exts: ["ts", "js"],
    skip: [],
  });

  const _entries = [];

  for await (const entry of entries) {
    _entries.push(entry);
  }

  return _entries;
}
