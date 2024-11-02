import { NoteRepo } from "../database/note.repo";
import { NoteService } from "../../application/note.service";

const noteRepo = new NoteRepo();
export const noteService = new NoteService(noteRepo);
