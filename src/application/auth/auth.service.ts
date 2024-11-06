import { inject, injectable } from "inversify";

import { LoggerDev } from "../../infrastructure/logger/logger.dev";
import { TYPES } from "../../interfaces/types";
import { Context, error } from "elysia";
import { UserRepo } from "../../infrastructure/database/user.repo";

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
}
