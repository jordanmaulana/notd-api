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

  async getTagCounts({userId}:{userId:string}) {
    const tagCounts = await prisma.tag.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });

    return tagCounts.map((tag) => ({
      name: tag.name,
      count: tag._count.name,
    }));
  }
}
