import { Container } from "inversify";
import { TYPES } from "../../interfaces/types";
import { NoteRepo } from "../database/note.repo";
import { NoteService } from "../../application/note/note.service";
import { LoggerDev } from "../logger/logger.dev";
import { TagRepo } from "../database/tag.repo";

const container = new Container();

// binding repo
container.bind<NoteRepo>(TYPES.NoteRepo).to(NoteRepo);
container.bind<LoggerDev>(TYPES.Logger).to(LoggerDev);
container.bind<TagRepo>(TYPES.TagRepo).to(TagRepo);

// binding services
container.bind<NoteService>(NoteService).toSelf();

// instance
export const noteService = container.get<NoteService>(NoteService);
