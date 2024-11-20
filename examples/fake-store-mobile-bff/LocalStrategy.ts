import { AuthenticationStrategy } from "../../src/app.ts";
import { Context } from "jacu";

export interface User {
  id: string;
}

export class LocalStrategy<T extends User>
  implements AuthenticationStrategy<T>
{
  fetchUser: (token: string) => Promise<T>;

  constructor(fetchUser: (token: string) => Promise<T>) {
    this.fetchUser = fetchUser;
  }

  authenticate(ctx: Context): Promise<T> {
    return new Promise((resolve) => {
      const token = ctx.request.headers.get("Authentication");

      if (!token) {
        throw Error("Not found token in header Authentication");
      }

      resolve(this.fetchUser(token));
    });
  }
}
