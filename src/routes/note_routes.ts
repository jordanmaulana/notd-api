import { Elysia, t } from "elysia";

import { prisma } from "../utils/prisma";

export const postRouter = new Elysia({ prefix: "/notes" })

  //routes
  .get("/", async () => {
    const notes = await prisma.note.findMany();

    return notes;
  })

  .get("/:id", async ({ params }) => {
    const { id } = params;
    const note = await prisma.note.findFirst({ where: { id } });
    return note;
  })

  .delete("/:id", async ({ params }) => {
    const { id } = params;

    await prisma.note.delete({ where: { id } });

    return { message: `Note deleted` };
  })

  .post(
    "/",
    async ({ body, set }) => {
      const { content } = body;
      const newNote = await prisma.note.create({ data: { content } });
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
      // Schema Guard
      body: t.Object({
        content: t.String(),
        isPrivate: t.Boolean(),
      }),
    }
  );
