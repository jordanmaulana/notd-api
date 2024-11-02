export interface Note {
  id: string;
  content: string;
  isPrivate: boolean;
}

export interface INote {
  getAll: () => Promise<Note[]>;
  getById: (id: string) => Promise<Note>;
  //   create: (data: Omit<Note, "id">) => Promise<Note>;
  //   update: (id: string, data: Partial<Note>) => Promise<Note>;
  //   delete: (id: string) => void;
}
