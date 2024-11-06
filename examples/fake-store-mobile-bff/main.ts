import { App } from "jacu";

export const app = new App();

await app.enableFilesystemRoutes();

if (import.meta.main) {
  app.listen();
}
