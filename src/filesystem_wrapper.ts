import { walk, type WalkEntry, type WalkOptions } from "@std/fs/walk";
import type { HandlerFn } from "./context.ts";

export interface FilesystemWrapper {
  cwd(): string;
  walk(
    root: string | URL,
    options?: WalkOptions,
  ): AsyncIterableIterator<WalkEntry>;
  isDirectory(path: string | URL): Promise<boolean>;
  import(path: string): Promise<null | { default?: HandlerFn }>;
}

export class FilesystemWrapperImpl implements FilesystemWrapper {
  constructor() {}

  isDirectory(_dir: string | URL) {
    return Promise.resolve(true);
  }

  walk(root: string | URL, options?: WalkOptions) {
    return walk(root, options);
  }

  cwd() {
    return Deno.cwd();
  }

  import(path: string) {
    return import(path);
  }
}

export async function walkDir(
  dir: string,
  fs: FilesystemWrapper,
): Promise<string[]> {
  if (!(await fs.isDirectory(dir))) return [];

  const entries = fs.walk(dir, {
    includeDirs: false,
    includeFiles: true,
    exts: ["ts", "js"],
    skip: [],
  });

  const _entries: string[] = [];

  for await (const entry of entries) {
    _entries.push(entry.path);
  }

  return _entries;
}
