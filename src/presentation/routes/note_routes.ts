import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";
import { noteService } from "../../infrastructure/ioc/container";
import { validateSession } from "../controllers/auth_controller";
import {
  GetNotesSchema,
  CreateNoteSchema,
} from "../../application/note/note.schema";

export const noteRouter = new Elysia({ prefix: "/notes" })
  .derive(async (context) => {
    const whitelistedPath = ["/v1/login", "/v1/register"];
    if (whitelistedPath.includes(context.path)) return;

    const { user } = await validateSession(context);
    return { user };
  })

  .get(
    "/",
    async ({ query, user }) => {
      const { search } = query;
      const notes = await noteService.getAll({ search, userId: user!.id! });
      return notes;
    },
    GetNotesSchema
  )

  .get("/:id", async ({ params }) => {
    const { id } = params;
    const note = await noteService.getById(id);
    return note;
  })

  .delete("/:id", async ({ params }) => {
    const { id } = params;
    await noteService.delete(id);
    return { message: `Note deleted` };
  })

  .post(
    "/",
    async (context) => {
      const { user } = context;
      const note = await noteService.create({ context, userId: user!.id });
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
      return updatedNote;
    },
    {
      body: t.Object({
        content: t.String(),
        isPrivate: t.Boolean(),
      }),
    }
  );
