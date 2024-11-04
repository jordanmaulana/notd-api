import { Elysia, t } from "elysia";
import { prisma } from "../../utils/prisma";

export const authRouter = new Elysia()

  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password } = body;

      let user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        set.status = 400;
        return { message: "User already registered" };
      }

      const hashedPassword = await Bun.password.hash(password, "argon2d");
      user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      set.status = 201;
      return { message: "User Registered Successfully" };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
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
