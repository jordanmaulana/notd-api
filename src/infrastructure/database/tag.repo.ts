import { injectable } from "inversify";

import { prisma } from "../../utils/prisma";
import { Tag } from "@prisma/client";
import "reflect-metadata";

@injectable()
export class TagRepo {
  async getAll(): Promise<Tag[]> {
    return await prisma.tag.findMany();
  }

  async getById(id: string): Promise<Tag | null> {
    const data = await prisma.tag.findFirst({ where: { id } });
    return data;
  }
  async create(data: Omit<Tag, "id">): Promise<Tag> {
    const newData = await prisma.tag.create({
      data,
    });
    return newData;
  }
  //   update: (id: string, data: Partial<Note>) => Promise<Note>;
  //   delete: (id: string) => void;
}
