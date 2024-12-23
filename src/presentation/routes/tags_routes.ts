import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";
import { validateSession } from "../controllers/auth_controller";

export const tagsRouter = new Elysia({ prefix: "/tags" })
 .derive(async (context) => {
    const whitelistedPath = ["/v1/login", "/v1/register"];
    if (whitelistedPath.includes(context.path)) return;

    const { user } = await validateSession(context);
    return { user };
  })
  
  //routes
  .get("/", async ({user}) => {
    const tagCounts = await prisma.tag.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      where: {
        user: {
          id: user?.id,
        },
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
