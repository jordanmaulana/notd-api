import { injectable } from "inversify";
import { prisma } from "../../utils/prisma";
import { User } from "@prisma/client";

@injectable()
export class UserRepo {
  async getByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<User, "id">): Promise<Omit<User, "password">> {
    return await prisma.user.create({
      data,
      select: { email: true, name: true, id: true },
    });
  }
}
