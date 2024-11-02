import { Elysia, t } from "elysia";

export const tagsRouter = new Elysia({ prefix: "/tags" })

  //routes
  .get("/", () => {
    return { message: `Get tags` };
  })

  .get("/tags/:tagId", (ctx) => {
    const postId = ctx.params.tagId;
    return { message: `Get posts id ${postId}` };
  })

  .post(
    "/",
    ({ body, set }) => {
      console.log(body);
      set.status = 201;
      return { message: "Create tag" };
    },
    {
      // Schema Guard
      body: t.Object({
        body: t.String(),
        tags: t.String(),
      }),
    }
  );
