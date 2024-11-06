import type { HandlerFn } from "./router/mod.ts";

export interface IApp {
  get(path: string, handler: HandlerFn): void;
}
