import { Elysia } from "elysia";

export const userRouter = new Elysia({ prefix: "/users" })

  //routes
  .get("/", () => {
    return "user router";
  });
