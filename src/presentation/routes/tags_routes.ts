import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";

export const tagsRouter = new Elysia({ prefix: "/tags" })

  //routes
  .get("/", async () => {
    const tagCounts = await prisma.tag.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
    });

    return tagCounts.map((tag) => ({
      name: tag.name,
      count: tag._count.name,
    }));
  })

  .get("/:tagId", (ctx) => {
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
