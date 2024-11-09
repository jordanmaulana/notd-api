import { injectable } from "inversify";

import { prisma } from "../../utils/prisma";
import { Note } from "@prisma/client";
import "reflect-metadata";
import { GetNotesProps } from "../../application/note/note.props";
import { extractHashTags } from "../../application/note/note.lib";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { error } from "elysia";
import { userSerializer } from "../../interfaces/user";
import { tagSerializer } from "../../interfaces/tag";

@injectable()
export class NoteRepo {
  async getAll(props: GetNotesProps): Promise<Note[]> {
    const { search } = props;
    if (!search)
      return await prisma.note.findMany({
        include: {
          user: {
            select: userSerializer,
          },
          tags: { select: tagSerializer },
        },
      });

    const tags = extractHashTags(search);
    const notes = await prisma.note.findMany({
      where: {
        AND: tags.map((tagName) => ({
          tags: {
            some: {
              name: tagName,
            },
          },
        })),
      },
      include: {
        user: {
          select: userSerializer,
        },
        tags: { select: tagSerializer },
      },
    });
    return notes;
  }

  async getById(id: string): Promise<Note | null> {
    const note = await prisma.note.findFirst({ where: { id } });
    return note;
  }

  async delete(id: string): Promise<Note | null> {
    try {
      const note = await prisma.note.delete({ where: { id } });
      return note;
    } catch (e) {
      /**
       * Check if the error is due to the record not being found
       * Docs:
       * https://www.prisma.io/docs/orm/reference/error-reference#p2025
       */
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        console.log(`Note with id ${id} not found`);
        throw error(400, "Note not found");
      } else {
        throw error(500);
      }
    }
  }

  async create(data: Omit<Note, "id">): Promise<Note> {
    const newNote = await prisma.note.create({
      data,
      include: { tags: true },
    });
    return newNote;
  }
  //   update: (id: string, data: Partial<Note>) => Promise<Note>;
}
