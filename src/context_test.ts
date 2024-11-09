import { expect } from "@std/expect";
import { JacuContext } from "./context.ts";

Deno.test("create a new App", async (t) => {
  const url = new URL("http://localhost/testing/handler");
  const request = new Request(url);
  const context = new JacuContext(request, url, () => {
    return Promise.resolve(new Response());
  });

  await t.step("just redirect", () => {
    const response = context.redirect("/testing/redirected");

    expect(response.headers.get("Location")).toEqual("/testing/redirected");
    expect(response.status).toEqual(302);
  });

  await t.step("redirect using custom status", () => {
    const response = context.redirect("/testing/redirected", 304);

    expect(response.headers.get("Location")).toEqual("/testing/redirected");
    expect(response.status).toEqual(304);
  });
});
