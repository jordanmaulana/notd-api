import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";
import { RegisterSchema } from "../../application/auth/auth.schema";
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
    async ({ body, set }) => {
      const { email, password } = body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        set.status = 404;
        return { message: "User not found" };
      }

      const isPassMatch = await Bun.password.verify(
        password,
        user.password,
        "argon2d"
      );

      if (!isPassMatch) {
        set.status = 401;
        return { message: "Invalid Password" };
      }

      const session = await prisma.session.create({
        data: { user: { connect: { email } } },
      });

      return { sessionId: session.id };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );
