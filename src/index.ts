import { Elysia } from "elysia";
import { userRouter } from "./routes/user_routes";
import { postRouter } from "./routes/note_routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia()

  .use(swagger({ path: "/docs" }))

  .onBeforeHandle(() => {
    console.log("before handle hooks");

    // Authorization
  })

  .group("/api/v1", (app) =>
    app

      //routes
      .use(userRouter)
      .use(postRouter)
  )

  .get("/", (ctx) => {
    return { message: "Hello Elysia" };
  })

  .listen(3000);

console.log(
  `🦊 Notd API is running at ${app.server?.hostname}:${app.server?.port}`
);
