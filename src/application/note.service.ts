import { inject, injectable } from "inversify";
import { NoteRepo } from "../infrastructure/database/note.repo";
import "reflect-metadata";
import { TYPES } from "../interfaces/types";
import { LoggerDev } from "../infrastructure/logger/logger.dev";

@injectable()
export class NoteService {
  private noteRepo: NoteRepo;
  private logger: LoggerDev;

  constructor(
    @inject(TYPES.NoteRepo) noteRepo: NoteRepo,
    @inject(TYPES.Logger) logger: LoggerDev
  ) {
    this.noteRepo = noteRepo;
    this.logger = logger;
  }

  getAll() {
    return this.noteRepo.getAll();
  }

  getById(id: string) {
    return this.noteRepo.getById(id);
  }
}
