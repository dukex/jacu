import type { HandlerFn } from "./context.ts";

export interface IApp {
  get(path: string, handler: HandlerFn): void;
}
