import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { users } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const JWT_SECRET = process.env.JWT_SECRET || "default_local_secret";

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookies = cookie.parse(opts.req.headers.cookie || "");
    const token = cookies.auth_token;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const db = await getDb();
      if (db) {
        const [foundUser] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);
        if (foundUser) {
          user = foundUser;
        }
      }
    }
  } catch (error) {
    // Falha silenciosa se o token expirar ou for inválido, o usuário fica deslogado (null)
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
