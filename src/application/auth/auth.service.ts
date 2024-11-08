import { inject, injectable } from "inversify";

import { LoggerDev } from "../../infrastructure/logger/logger.dev";
import { TYPES } from "../../interfaces/types";
import { Context, error } from "elysia";
import { UserRepo } from "../../infrastructure/database/user.repo";
import { prisma } from "../../utils/prisma";

@injectable()
export class AuthService {
  private userRepo: UserRepo;
  private logger: LoggerDev;

  constructor(
    @inject(TYPES.UserRepo) authRepo: UserRepo,
    @inject(TYPES.Logger) logger: LoggerDev
  ) {
    this.userRepo = authRepo;
    this.logger = logger;
  }

  async register(context: Context) {
    const { body, set } = context;
    const { email, password, name } = body as {
      email: string;
      password: string;
      name: string;
    };

    const user = await this.userRepo.getByEmail(email);
    if (user) {
      throw error(400, "User already registered");
    }

    const hashedPassword = await Bun.password.hash(password, "argon2d");

    const newUser = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
    });

    set.status = 201;
    return newUser;
  }
  async login(context: Context) {
    const { body, set } = context;
    const { email, password } = body as {
      email: string;
      password: string;
    };
    const user = await this.userRepo.getByEmail(email);
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
  }
}
