import { injectable } from "inversify";

import { prisma } from "../../utils/prisma";
import { Note } from "@prisma/client";
import "reflect-metadata";
import { GetNotesProps } from "../../application/note/note.props";
import { extractHashTags } from "../../application/note/note.lib";

import { error } from "elysia";
import { userSerializer } from "../../interfaces/user";

@injectable()
export class NoteRepo {
  async getAll({ search, userId, isPrivate }: GetNotesProps): Promise<Note[]> {
    const include = {
      user: { select: userSerializer },
    };
    const where = search
      ? {
          AND: extractHashTags(search).map((tagName) => ({
            tags: { some: { name: tagName } },
          })),
          userId,
          isPrivate,
        }
      : { userId, isPrivate };
    return await prisma.note.findMany({ where, include });
  }

  async getById(id: string): Promise<Note | null> {
    const note = await prisma.note.findFirst({ where: { id } });
    return note;
  }

  async delete(id: string): Promise<Note | null> {
    const note = await prisma.note.findFirst({ where: { id } });
    if (!note) throw error(400, "Note not found");
    return await prisma.note.delete({ where: { id } });
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
