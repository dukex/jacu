import { expect } from "@std/expect";
import { App } from "./app.ts";
import type Context from "./context.ts";

Deno.test("create a new App", async (t) => {
  const app = new App();
  const dummyHandler = (_ctx: Context) => {
    return Promise.resolve(new Response());
  };

  await t.step("with not routes added", () => {
    expect(app.routes).toEqual([]);
  });

  await t.step("with GET route added", () => {
    app.get("/testing/abc", dummyHandler);

    expect(app.routes[0]).toEqual({
      path: "/testing/abc",
      method: "GET",
      handler: dummyHandler,
    });
  });

  await t.step("with POST route added", () => {
    app.post("/testing/abc", dummyHandler);

    expect(app.routes[1]).toEqual({
      path: "/testing/abc",
      method: "POST",
      handler: dummyHandler,
    });
  });

  await t.step("handle GET correctly", async () => {
    const appHandler = app.handler();

    const handler = ({ request, url }: Context) => {
      expect(request.method).toEqual("GET");
      expect(url.pathname).toEqual("/testing/handler");

      return Promise.resolve(Response.json({ test: "get", ok: true }));
    };

    app.get("/testing/handler", handler);

    const request = new Request(new URL("http://localhost/testing/handler"));

    const response = await appHandler(request);

    expect(await response.json()).toEqual({ test: "get", ok: true });
  });

  await t.step("handle not found", async () => {
    const appHandler = app.handler();

    const request = new Request(new URL("http://localhost/testing/not-found"));

    const response = await appHandler(request);

    expect(response.ok).toBeFalsy();
    expect(response.status).toEqual(404);
  });

  await t.step("handle POST correctly", async () => {
    const appHandler = app.handler();

    const handler = ({ request, url }: Context) => {
      expect(request.method).toEqual("POST");
      expect(url.pathname).toEqual("/testing/handler");

      return Promise.resolve(Response.json({ test: "post", ok: true }));
    };

    app.post("/testing/handler", handler);

    const request = new Request(new URL("http://localhost/testing/handler"), {
      method: "post",
    });

    const response = await appHandler(request);

    expect(await response.json()).toEqual({ test: "post", ok: true });
  });
});
