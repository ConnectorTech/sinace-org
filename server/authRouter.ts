import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "default_local_secret";

// Formato brasileiro de CPF sem pontuação (11 dígitos)
const cpfRegex = /^\d{11}$/;
const cepRegex = /^\d{8}$/;

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      cpf: z.string().regex(cpfRegex).optional(),
      cep: z.string().regex(cepRegex).optional(),
      addressLine1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().max(2).optional(),
      isDoctor: z.boolean().default(false),
      crm: z.string().optional(),
      crmUf: z.string().max(2).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      // Validar se email ou CPF já existe
      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existingUser.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "E-mail já está em uso" });
      }

      if (input.cpf) {
        const existingCpf = await db.select().from(users).where(eq(users.cpf, input.cpf)).limit(1);
        if (existingCpf.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "CPF já cadastrado" });
        }
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(input.password, salt);

      const [insertResult] = await db.insert(users).values({
        name: input.name,
        email: input.email,
        passwordHash,
        loginMethod: "local",
        cpf: input.cpf,
        cep: input.cep,
        addressLine1: input.addressLine1,
        city: input.city,
        state: input.state,
        isDoctor: input.isDoctor,
        crm: input.crm,
        crmUf: input.crmUf,
        role: "user",
      });

      const userId = insertResult.insertId;
      
      const token = jwt.sign({ id: userId, email: input.email, role: "user" }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie
      ctx.res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return { success: true, userId };
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      
      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais inválidas" });
      }

      const isValid = bcrypt.compareSync(input.password, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      ctx.res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return { success: true, user: { id: user.id, name: user.name, role: user.role } };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("auth_token", { path: "/" });
    return { success: true };
  }),

  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
