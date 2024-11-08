import { Elysia } from "elysia";
import {
  LoginSchema,
  RegisterSchema,
} from "../../application/auth/auth.schema";
import { authService } from "../../infrastructure/ioc/container";

export const authRouter = new Elysia()

  .post(
    "/register",
    async (context) => {
      return authService.register(context);
    },
    RegisterSchema
  )

  .post(
    "/login",
    async (context) => {
      return authService.login(context);
    },
    LoginSchema
  );
