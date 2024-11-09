import { App, simpleLogging, tralingSlashes } from "jacu";

export const app = new App();

app.use(simpleLogging);
app.use(tralingSlashes);

if (import.meta.main) {
  app.listen();
}
