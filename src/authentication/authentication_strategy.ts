import type { Context } from "../mod.ts";

export interface AuthenticationStrategy<T> {
  authenticate(ctx: Context): Promise<T>;
}
