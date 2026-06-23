import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import {
  createSpecialty,
  createEducationalDriveDocument,
  ensureSinaceBaseSeed,
  getAuthenticatedMedicalWorkspace,
  getEducationalDriveSnapshot,
  getInstitutionalEcosystemSnapshot,
  getKnowledgeHubSnapshot,
  getMedicalNetworkSnapshot,
  getOperationalDashboardSnapshot,
  listDocuments,
  listInstitutionalPublications,
  listInstitutions,
  listMedicalDirectory,
  listMediaShowcaseItems,
  listPartners,
  listRecentQueueEntries,
  listSpecialties,
  listSpecialtyOperationalOverview,
  listTracks,
  reorderSpecialties,
  updateSpecialty,
  upsertAuthenticatedProfessionalProfile,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { notifyOwner } from "./_core/notification";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

const specialtyFilterSchema = z
  .object({
    status: z.enum(["draft", "active", "archived"]).optional(),
  })
  .optional();

const specialtyMutationSchema = z.object({
  name: z.string().min(2).max(160),
  shortLabel: z.string().max(80).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  category: z.enum(["cirurgica", "clinica", "apoio"]),
  status: z.enum(["draft", "active", "archived"]),
  displayOrder: z.number().int().min(0).optional().nullable(),
  coordinationModel: z.string().max(160).optional().nullable(),
});

const specialtyUpdateSchema = specialtyMutationSchema.extend({
  id: z.number().int().positive(),
  slug: z.string().max(120).optional().nullable(),
});

const professionalProfileSaveSchema = z.object({
  fullName: z.string().min(2).max(180),
  roleTitle: z.string().min(2).max(180),
  professionalType: z.enum([
    "surgeon",
    "anesthesiologist",
    "nurse",
    "coordinator",
    "faculty",
    "resident",
    "student",
    "manager",
  ]),
  institutionId: z.number().int().positive().optional().nullable(),
  specialtyId: z.number().int().positive().optional().nullable(),
  credentialNumber: z.string().max(120).optional().nullable(),
  credentialState: z.string().max(32).optional().nullable(),
  credentialAuthority: z.string().max(32).optional().nullable(),
  rqeNumber: z.string().max(80).optional().nullable(),
  publicEmail: z.string().email().max(255).optional().nullable(),
  privateAccessEmail: z.string().email().max(255).optional().nullable(),
  passwordAccessStatus: z.enum(["not_started", "ready", "recovery", "managed"]).optional(),
  passwordRecoveryChannel: z.string().max(160).optional().nullable(),
  phone: z.string().max(48).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  state: z.string().max(80).optional().nullable(),
  regionLabel: z.string().max(120).optional().nullable(),
  profileImageUrl: z.string().url().max(2048).optional().nullable(),
  miniBio: z.string().max(1200).optional().nullable(),
  curriculumSummary: z.string().max(5000).optional().nullable(),
  highlights: z.array(z.string().min(1).max(240)).max(12).optional().nullable(),
  practiceAreas: z.array(z.string().min(1).max(240)).max(12).optional().nullable(),
  collaborationInterest: z.enum(["low", "medium", "high"]).optional(),
  visibility: z.enum(["public", "restricted", "private"]).optional(),
});

const specialtyReorderSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      displayOrder: z.number().int().min(0),
    })
  )
  .min(1);

const educationalDriveUploadSchema = z
  .object({
    title: z.string().trim().min(3).max(180),
    description: z.string().trim().max(4000).optional().nullable(),
    specialtyId: z.number().int().positive(),
    folderLabel: z.string().trim().max(160).optional().nullable(),
    documentType: z.enum(["protocol", "guideline", "manual", "article", "checklist", "video", "other"]),
    visibility: z.enum(["public", "restricted", "private"]).optional(),
    contributorName: z.string().trim().max(180).optional().nullable(),
    contributorInstitution: z.string().trim().max(180).optional().nullable(),
    contributorCredential: z.string().trim().max(120).optional().nullable(),
    contributorType: z.enum(["internal", "external"]).optional(),
    fileName: z.string().trim().min(3).max(255).optional().nullable(),
    mimeType: z.string().trim().max(160).optional().nullable(),
    fileBase64: z.string().min(32).max(20_000_000).optional().nullable(),
    sourceUrl: z.string().trim().url().max(2048).optional().nullable(),
  })
  .superRefine((input, ctx) => {
    const hasFileName = Boolean(input.fileName?.trim());
    const hasFilePayload = Boolean(input.fileBase64?.trim());
    const hasSourceUrl = Boolean(input.sourceUrl?.trim());

    if (!hasSourceUrl && !hasFileName && !hasFilePayload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Envie um arquivo ou informe um link externo do material educativo.",
        path: ["fileBase64"],
      });
    }

    if (hasFileName !== hasFilePayload) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Para envio de arquivo, informe nome e conteúdo do anexo no mesmo envio.",
        path: hasFileName ? ["fileBase64"] : ["fileName"],
      });
    }
  });

const publicContactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(160),
  organization: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(48),
  interest: z.enum(["proposta", "parceria", "expansao", "governo", "outro"]),
  message: z.string().trim().min(20).max(4000),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  sinace: router({
    dashboard: protectedProcedure.query(async () => {
      await ensureSinaceBaseSeed();
      return getOperationalDashboardSnapshot();
    }),
    specialties: router({
      list: protectedProcedure
        .input(specialtyFilterSchema)
        .query(async ({ input }) => {
          const specialties = await listSpecialtyOperationalOverview();

          if (!input?.status) return specialties;
          return specialties.filter(specialty => specialty.status === input.status);
        }),
      adminList: adminProcedure.query(async () => listSpecialtyOperationalOverview()),
      bySlug: protectedProcedure
        .input(z.object({ slug: z.string().min(1) }))
        .query(async ({ input }) => {
          const specialties = await listSpecialties();
          return specialties.find(specialty => specialty.slug === input.slug) ?? null;
        }),
      create: adminProcedure
        .input(specialtyMutationSchema)
        .mutation(async ({ ctx, input }) => {
          return createSpecialty({
            ...input,
            createdByUserId: ctx.user.id,
          });
        }),
      update: adminProcedure
        .input(specialtyUpdateSchema)
        .mutation(async ({ input }) => {
          return updateSpecialty(input.id, input);
        }),
      reorder: adminProcedure
        .input(specialtyReorderSchema)
        .mutation(async ({ input }) => reorderSpecialties(input)),
    }),
    tracks: router({
      list: protectedProcedure.query(async () => listTracks()),
    }),
    documents: router({
      list: protectedProcedure.query(async () => listDocuments()),
    }),
    encyclopedia: router({
      snapshot: protectedProcedure.query(async () => getEducationalDriveSnapshot()),
      upload: protectedProcedure
        .input(educationalDriveUploadSchema)
        .mutation(async ({ ctx, input }) => {
          return createEducationalDriveDocument({
            ...input,
            createdByUserId: ctx.user.id,
          });
        }),
    }),
    partners: router({
      list: protectedProcedure.query(async () => listPartners()),
    }),
    institutions: router({
      list: protectedProcedure.query(async () => listInstitutions()),
    }),
    queue: router({
      recent: protectedProcedure.query(async () => listRecentQueueEntries()),
    }),
    directory: router({
      list: protectedProcedure
        .input(z.object({ limit: z.number().int().positive().max(100).optional() }).optional())
        .query(async ({ input }) => listMedicalDirectory(input?.limit)),
      snapshot: protectedProcedure.query(async () => getMedicalNetworkSnapshot()),
      mine: protectedProcedure.query(async ({ ctx }) => getAuthenticatedMedicalWorkspace(ctx.user.id)),
      saveMine: protectedProcedure
        .input(professionalProfileSaveSchema)
        .mutation(async ({ ctx, input }) => {
          return upsertAuthenticatedProfessionalProfile(ctx.user.id, {
            ...input,
            fullName: input.fullName.trim() || ctx.user.name || "Profissional SINACE",
            publicEmail: input.publicEmail ?? ctx.user.email ?? null,
            privateAccessEmail: input.privateAccessEmail ?? input.publicEmail ?? ctx.user.email ?? null,
            passwordAccessStatus: input.passwordAccessStatus ?? ((input.privateAccessEmail ?? input.publicEmail ?? ctx.user.email) ? "ready" : "not_started"),
          });
        }),
    }),
    publications: router({
      list: protectedProcedure
        .input(z.object({ limit: z.number().int().positive().max(24).optional() }).optional())
        .query(async ({ input }) => listInstitutionalPublications(input?.limit ?? 6)),
    }),
    knowledgeHub: router({
      snapshot: protectedProcedure.query(async () => getKnowledgeHubSnapshot()),
    }),
    ecosystem: router({
      snapshot: protectedProcedure.query(async () => getInstitutionalEcosystemSnapshot()),
    }),
    showcase: router({
      list: protectedProcedure
        .input(z.object({ limit: z.number().int().positive().max(24).optional() }).optional())
        .query(async ({ input }) => listMediaShowcaseItems(input?.limit ?? 8)),
    }),
    contact: router({
      submit: publicProcedure
        .input(publicContactSubmissionSchema)
        .mutation(async ({ input }) => {
          const subjectByInterest: Record<typeof input.interest, string> = {
            proposta: "Proposta institucional",
            parceria: "Parceria estratégica",
            expansao: "Expansão regional",
            governo: "Articulação governamental",
            outro: "Outro assunto institucional",
          };

          const delivered = await notifyOwner({
            title: `[SINACE] Novo contato institucional — ${subjectByInterest[input.interest]}`,
            content: [
              `Nome: ${input.name}`,
              `Organização: ${input.organization}`,
              `E-mail: ${input.email}`,
              `Telefone: ${input.phone}`,
              `Interesse: ${subjectByInterest[input.interest]}`,
              "",
              "Mensagem:",
              input.message,
            ].join("\n"),
          });

          return {
            success: true,
            delivered,
            acknowledgement:
              "Recebemos sua mensagem institucional. A equipe da SINACE poderá retornar pelos canais informados.",
          } as const;
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
