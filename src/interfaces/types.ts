import { TagRepo } from "../infrastructure/database/tag.repo";

export const TYPES = {
  NoteRepo: Symbol.for("NoteRepo"),
  NoteService: Symbol.for("NoteService"),
  Logger: Symbol.for("Logger"),
  TagRepo: Symbol.for("TagRepo"),
};
