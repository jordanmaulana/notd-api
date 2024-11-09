import { Context } from "elysia";

export interface CreateNoteProps {
  context: Context;
  userId: string;
}

export interface GetNotesProps {
  /**
   * @param search is a hashtag search. Example: #cozy #design
   * Can be more than 1 hashtag at once. Should only return notes that
   * contains all hashtags.
   *
   * @param userId is selected user id.
   */
  search?: string | undefined;
  userId: string;
  isPrivate?: boolean;
}
