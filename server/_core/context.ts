import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Usuário local para desenvolvimento sem OAuth
const DEV_USER: User = {
  id: 1,
  openId: "dev-local-user",
  name: "Dev Local",
  email: "dev@sinace.local",
  role: "admin",
  loginMethod: "email",
  lastSignedIn: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Modo dev: bypass de autenticação em desenvolvimento local
  if (process.env.NODE_ENV === "development") {
    return {
      req: opts.req,
      res: opts.res,
      user: DEV_USER,
    };
  }

  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
