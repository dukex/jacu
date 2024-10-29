import { fsRoutes, staticFiles } from "fresh";
import { App } from "jacu";
import { define, type State } from "./utils.ts";

export const app = new App<State>();
// app.use(staticFiles());

// this can also be defined via a file. feel free to delete this!
// const exampleLoggerMiddleware = define.middleware((ctx) => {
//  console.log(`${ctx.req.method} ${ctx.req.url}`);
//  return ctx.next();
// });
// app.use(exampleLoggerMiddleware);
//

console.log(JSON.stringify(import.meta));

//await fsRoutes(app, {
//  dir: "./",
//  loadIsland: (path) => import(`./islands/${path}`),
//  loadRoute: (path) => import(`./routes/${path}`),
//});

if (import.meta.main) {
  await app.listen();
}
