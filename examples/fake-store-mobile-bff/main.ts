import { App, fsRoutes } from "jacu";

export const app = new App();
// app.use(staticFiles());

// this can also be defined via a file. feel free to delete this!
// const exampleLoggerMiddleware = define.middleware((ctx) => {
//  console.log(`${ctx.req.method} ${ctx.req.url}`);
//  return ctx.next();
// });
// app.use(exampleLoggerMiddleware);
//

await fsRoutes(app, {
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
