import { Context } from "elysia";

export interface CreateNoteProps {
  context: Context;
  userId: string;
}

export interface GetNotesProps {
  search?: string | undefined;
  userId: string;
}
