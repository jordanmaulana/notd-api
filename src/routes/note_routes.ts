import { Elysia, error, t } from "elysia";

import { prisma } from "../utils/prisma";
import { noteService } from "../infrastructure/ioc/container";

export const noteRouter = new Elysia({ prefix: "/notes" }).guard((app) => {
  app
    .onBeforeHandle(async ({ headers, set }) => {
      if (!("session-id" in headers)) {
        set.status = 401;
        return { message: "Unauthorized" };
      }

      const session = await prisma.session.findUnique({
        where: { id: headers["session-id"] },
      });

      // Check if the session exists
      if (!session) {
        set.status = 401;
        return error(401, "Unauthorized");
      }
    })
    .derive(async ({ headers }) => {
      const session = await prisma.session.findUnique({
        where: { id: headers["session-id"] },
        include: { user: true },
      });

      /**
       * Session is marked as non nullable because it's already
       * handled by @function .onBeforeHandle
       */
      const { user } = session!;

      return { userId: user.id };
    })

    //routes
    .get("/", async () => {
      const notes = await noteService.getAll();
      return notes;
    })

    .get("/:id", async ({ params }) => {
      const { id } = params;
      const note = await noteService.getById(id);
      return note;
    })

    .delete("/:id", async ({ params }) => {
      const { id } = params;
      await prisma.note.delete({ where: { id } });
      return { message: `Note deleted` };
    })

    .post(
      "/",
      async ({ body, set, userId }) => {
        const { content } = body;
        const newNote = await prisma.note.create({
          data: { content, userId },
        });
        set.status = 201;
        return newNote;
      },
      {
        // Schema Guard
        body: t.Object({
          content: t.String(),
        }),
      }
    )

    .patch(
      "/:id",
      async ({ body, set, params }) => {
        const { id } = params;
        const { content, isPrivate } = body;

        const updatedNote = await prisma.note.update({
          where: { id },
          data: { content, isPrivate },
        });

        set.status = 200;
        return { message: "Create post" };
      },
      {
        body: t.Object({
          content: t.String(),
          isPrivate: t.Boolean(),
        }),
      }
    );
});
