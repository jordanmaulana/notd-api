import { injectable } from "inversify";
import { INote } from "../../interfaces/entities";
import { prisma } from "../../utils/prisma";
import { Note } from "@prisma/client";
import "reflect-metadata";

@injectable()
export class NoteRepo implements INote {
  async getAll(): Promise<Note[]> {
    return await prisma.note.findMany();
  }

  async getById(id: string): Promise<Note | null> {
    const note = await prisma.note.findFirst({ where: { id } });
    return note;
  }
  async create(data: Omit<Note, "id">): Promise<Note> {
    const newNote = await prisma.note.create({
      data,
    });
    return newNote;
  }
  //   update: (id: string, data: Partial<Note>) => Promise<Note>;
  //   delete: (id: string) => void;
}
