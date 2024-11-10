import { Elysia } from "elysia";
import { userRouter } from "./presentation/routes/user_routes";
import { noteRouter } from "./presentation/routes/note_routes";
import swagger from "@elysiajs/swagger";
import { authRouter } from "./presentation/routes/auth_routes";
import { tagsRouter } from "./presentation/routes/tags_routes";

const app = new Elysia()
  .use(swagger({ path: "/docs" }))

  .group("/v1", (app) =>
    app

      //routes
      .use(userRouter)
      .use(noteRouter)
      .use(authRouter)
      .use(tagsRouter)
  )

  .listen(3000);

console.log(
  `🦊 Notd API is running at ${app.server?.hostname}:${app.server?.port}`
);
