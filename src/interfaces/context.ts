import { Context } from "elysia";

export interface ContextWithUser extends Context {
  userId: string;
}
