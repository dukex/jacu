import { App } from "jacu";

export const app = new App();

if (import.meta.main) {
  app.listen();
}
