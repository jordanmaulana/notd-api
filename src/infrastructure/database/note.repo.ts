import { injectable } from "inversify";

import { prisma } from "../../utils/prisma";
import { Note } from "@prisma/client";
import "reflect-metadata";
import { GetNotesProps } from "../../application/note/note.props";
import { extractHashTags } from "../../application/note/note.lib";

@injectable()
export class NoteRepo {
  async getAll(props: GetNotesProps): Promise<Note[]> {
    const { search } = props;
    if (!search) return await prisma.note.findMany();

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
        tags: true, // Include tags to see the associated tags with each note
      },
    });
    return notes;
  }

  async getById(id: string): Promise<Note | null> {
    const note = await prisma.note.findFirst({ where: { id } });
    return note;
  }
  async create(data: Omit<Note, "id">): Promise<Note> {
    const newNote = await prisma.note.create({
      data,
      include: { tags: true },
    });
    return newNote;
  }
  //   update: (id: string, data: Partial<Note>) => Promise<Note>;
  //   delete: (id: string) => void;
}
