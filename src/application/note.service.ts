import { inject, injectable } from "inversify";
import { NoteRepo } from "../infrastructure/database/note.repo";
import "reflect-metadata";
import { TYPES } from "../interfaces/types";
import { LoggerDev } from "../infrastructure/logger/logger.dev";
import { Context, t } from "elysia";
import { Note } from "@prisma/client";
import { extractHashTags } from "./note.lib";

interface CreateNoteProps {
  context: Context;
  userId: string;
}

export const CreateNoteSchema = {
  // Schema Guard
  body: t.Object({
    content: t.String(),
    isPrivate: t.Boolean(),
  }),
};

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

  async create(props: CreateNoteProps) {
    const { body, set } = props.context;
    const { content, isPrivate } = body as {
      content: string;
      isPrivate: boolean;
    };

    const data: Omit<Note, "id"> = {
      content,
      userId: props.userId,
      isPrivate,
    };
    const newNote = await this.noteRepo.create(data);
    const tags = extractHashTags(content);

    set.status = 201;
    return newNote;
  }
}
