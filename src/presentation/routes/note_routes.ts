import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";
import { noteService } from "../../infrastructure/ioc/container";
import { validateSession } from "../controllers/auth_controller";
import { Note } from "@prisma/client";
import { CreateNoteSchema } from "../../application/note.service";

export const noteRouter = new Elysia({ prefix: "/notes" })
  .derive(async (context) => {
    const whitelistedPath = ["/v1/login", "/v1/register"];
    if (whitelistedPath.includes(context.path)) return;

    const { userId } = await validateSession(context);
    return { userId };
  })

  .get("/", async ({}) => {
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
    async (context) => {
      const { userId } = context;
      const note = await noteService.create({ context, userId: userId! });
      return note;
    },
    CreateNoteSchema
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