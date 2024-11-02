import { INote, Note } from "../../interfaces/entities";

export class NoteRepo implements INote {
  async getAll(): Promise<Note[]> {
    return [];
  }

  async getById(id: string): Promise<Note> {
    return { id: "tes", content: "tes", isPrivate: true };
  }
  //   create: (data: Omit<Note, "id">) => Promise<Note>;
  //   update: (id: string, data: Partial<Note>) => Promise<Note>;
  //   delete: (id: string) => void;
}
