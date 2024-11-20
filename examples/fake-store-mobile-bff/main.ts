import { App, simpleLogging, tralingSlashes } from "jacu";
import { LocalStrategy } from "./LocalStrategy.ts";

export const app = new App();

app.use(simpleLogging);
app.use(tralingSlashes);

app.authentication(
  new LocalStrategy((token) => {
    if (token === "123") {
      return Promise.resolve({ id: "o12", name: "Duke" });
    } else {
      return Promise.reject(Error("Wrong token"));
    }
  }),
);

if (import.meta.main) {
  app.listen();
}
