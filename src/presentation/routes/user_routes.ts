import { Elysia } from "elysia";
import { validateSession } from "../controllers/auth_controller";

export const userRouter = new Elysia({ prefix: "/users" })
  .derive(async (context) => {
    const { user } = await validateSession(context);
    return { user };
  })

  .get("/profile", ({ user }) => {
    delete (user as { password?: string }).password;
    return user;
  });
