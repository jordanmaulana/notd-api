import { Elysia } from "elysia";
import { userRouter } from "./routes/user_routes";
import { noteRouter } from "./routes/note_routes";
import swagger from "@elysiajs/swagger";
import { authRouter } from "./routes/auth_routes";
import { prisma } from "./utils/prisma";

const app = new Elysia()

  .use(swagger({ path: "/docs" }))

  .group("/v1", (app) =>
    app

      //routes
      .use(userRouter)
      .use(noteRouter)
      .use(authRouter)
  )

  .listen(3000);

console.log(
  `🦊 Notd API is running at ${app.server?.hostname}:${app.server?.port}`
);
