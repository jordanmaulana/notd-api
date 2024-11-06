import { Container } from "inversify";
import { TYPES } from "../../interfaces/types";
import { NoteRepo } from "../database/note.repo";
import { NoteService } from "../../application/note/note.service";
import { LoggerDev } from "../logger/logger.dev";
import { TagRepo } from "../database/tag.repo";
import { UserRepo } from "../database/user.repo";
import { AuthService } from "../../application/auth/auth.service";

const container = new Container();

// binding repo
container.bind<NoteRepo>(TYPES.NoteRepo).to(NoteRepo);
container.bind<LoggerDev>(TYPES.Logger).to(LoggerDev);
container.bind<TagRepo>(TYPES.TagRepo).to(TagRepo);
container.bind<UserRepo>(TYPES.UserRepo).to(UserRepo);

// binding services
container.bind<NoteService>(NoteService).toSelf();
container.bind<AuthService>(AuthService).toSelf();

// instance
export const noteService = container.get<NoteService>(NoteService);
export const authService = container.get<AuthService>(AuthService);
