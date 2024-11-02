import { NoteRepo } from "../infrastructure/database/note.repo";

export class NoteService {
  private noteRepo: NoteRepo;

  constructor(noteRepo: NoteRepo) {
    this.noteRepo = noteRepo;
  }

  getAll() {
    return this.noteRepo.getAll();
  }

  getById(id: string) {
    return this.noteRepo.getById(id);
  }
}
