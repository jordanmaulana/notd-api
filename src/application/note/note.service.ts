import { inject, injectable } from "inversify";
import { NoteRepo } from "../../infrastructure/database/note.repo";
import "reflect-metadata";
import { TYPES } from "../../interfaces/types";
import { LoggerDev } from "../../infrastructure/logger/logger.dev";
import { t } from "elysia";
import { Note, Tag } from "@prisma/client";
import { extractHashTags } from "./note.lib";
import { TagRepo } from "../../infrastructure/database/tag.repo";
import { CreateNoteProps, GetNotesProps } from "./note.props";

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
  private tagRepo: TagRepo;
  private logger: LoggerDev;

  constructor(
    @inject(TYPES.NoteRepo) noteRepo: NoteRepo,
    @inject(TYPES.Logger) logger: LoggerDev,
    @inject(TYPES.TagRepo) tagRepo: TagRepo
  ) {
    this.noteRepo = noteRepo;
    this.logger = logger;
    this.tagRepo = tagRepo;
  }

  getAll(props: GetNotesProps) {
    const { search } = props;
    if (search) {
      this.logger.info(`${props.userId} queried\n${search}`);
    }
    return this.noteRepo.getAll(props);
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
    tags.forEach(async (tag) => {
      const data: Omit<Tag, "id"> = {
        name: tag,
        noteId: newNote.id,
        userId: props.userId,
      };
      await this.tagRepo.create(data);
    });

    this.logger.info(`${props.userId} created a new note\n${newNote}`);

    set.status = 201;
    return newNote;
  }
}
