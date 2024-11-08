import { Context, error } from "elysia";
import { prisma } from "../../utils/prisma";
import { User } from "@prisma/client";

interface Session {
  user: User;
}

export async function validateSession({ headers }: Context): Promise<Session> {
  if (!("session-id" in headers)) {
    throw error(401);
  }

  const session = await prisma.session.findUnique({
    where: { id: headers["session-id"] },
    include: { user: true },
  });

  // Check if the session exists
  if (!session) {
    throw error(401);
  }

  /**
   * Session is marked as non nullable because it's already
   * handled by @function .onBeforeHandle
   */
  const { user } = session!;

  return { user };
}
