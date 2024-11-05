import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";
import { noteService } from "../../infrastructure/ioc/container";
import { validateSession } from "../controllers/auth_controller";

import { CreateNoteSchema } from "../../application/note/note.service";

export const noteRouter = new Elysia({ prefix: "/notes" })
  .derive(async (context) => {
    const whitelistedPath = ["/v1/login", "/v1/register"];
    if (whitelistedPath.includes(context.path)) return;

    const { userId } = await validateSession(context);
    return { userId };
  })

  .get(
    "/",
    async ({ query, userId }) => {
      const { search } = query;
      const notes = await noteService.getAll({ search, userId: userId! });
      return notes;
    },
    {
      query: t.Object(
        {
          search: t.Optional(
            t.String({
              description:
                "Narrow down notes by one or more tags. Example: #food #nasigoreng",
            })
          ),
        },
        {
          examples: {
            query: "#food #nasigoreng",
          },
        }
      ),
    }
  )

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
      return updatedNote;
    },
    {
      body: t.Object({
        content: t.String(),
        isPrivate: t.Boolean(),
      }),
    }
  );
