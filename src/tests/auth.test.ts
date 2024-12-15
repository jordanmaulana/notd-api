// test/index.test.ts
import { describe, expect, it } from "bun:test";

import { treaty } from "@elysiajs/eden";
import { App } from "..";

const app = treaty<App>("localhost:3000");

/**
 * Make sure your server is online before you run this test
 */
describe("Login Test", () => {
  it("If user exists", async () => {
    const { status } = await app.v1.login.post({
      email: "demo@gmail.com",
      password: "admin123",
    });

    expect(status).toBe(200);
  });
});
