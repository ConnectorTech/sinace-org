import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("usuarios", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("identificador_aberto", { length: 64 }).unique(),
  passwordHash: varchar("senha_hash", { length: 255 }),
  name: text("nome"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("metodo_login", { length: 64 }),
  role: mysqlEnum("funcao", ["user", "admin"]).default("user").notNull(),
  cpf: varchar("cpf", { length: 14 }),
  cep: varchar("cep", { length: 9 }),
  addressLine1: varchar("endereco_linha1", { length: 255 }),
  city: varchar("cidade", { length: 120 }),
  state: varchar("estado", { length: 2 }),
  isDoctor: boolean("e_medico").default(false),
  crm: varchar("crm", { length: 20 }),
  crmUf: varchar("crmUf", { length: 2 }),
  createdAt: timestamp("criado_em").defaultNow().notNull(),
  updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("ultimo_login").defaultNow().notNull(),
});

export const specialties = mysqlTable("especialidades",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("nome", { length: 160 }).notNull(),
    shortLabel: varchar("rotulo_curto", { length: 80 }),
    description: text("descricao"),
    category: mysqlEnum("categoria", ["cirurgica", "clinica", "apoio"])
      .default("cirurgica")
      .notNull(),
    status: mysqlEnum("status", ["draft", "active", "archived"])
      .default("draft")
      .notNull(),
    displayOrder: int("ordem_exibicao").default(0).notNull(),
    coordinationModel: varchar("modelo_coordenacao", { length: 160 }),
    createdByUserId: int("criado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("especialidades_slug_idx").on(table.slug),
  })
);

export const partners = mysqlTable("parceiros",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("nome", { length: 180 }).notNull(),
    description: text("descricao"),
    partnerType: mysqlEnum("tipo_parceiro", [
      "government",
      "oss",
      "hospital_network",
      "supplier",
      "academic",
      "other",
    ])
      .default("other")
      .notNull(),
    websiteUrl: varchar("site_url", { length: 2048 }),
    city: varchar("cidade", { length: 120 }),
    state: varchar("estado", { length: 120 }),
    status: mysqlEnum("status", ["prospect", "active", "inactive"])
      .default("prospect")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("parceiros_slug_idx").on(table.slug),
  })
);

export const institutions = mysqlTable("instituicoes",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("nome", { length: 180 }).notNull(),
    description: text("descricao"),
    institutionType: mysqlEnum("tipo_instituicao", [
      "hospital",
      "santa_casa",
      "clinic",
      "surgical_center",
      "teaching_center",
      "other",
    ])
      .default("hospital")
      .notNull(),
    city: varchar("cidade", { length: 120 }),
    state: varchar("estado", { length: 120 }),
    capacityProfile: varchar("perfil_capacidade", { length: 160 }),
    teachingProfile: varchar("perfil_ensino", { length: 160 }),
    partnerId: int("parceiro_id").references(() => partners.id, {
      onDelete: "set null",
    }),
    status: mysqlEnum("status", ["planning", "active", "inactive"])
      .default("planning")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("instituicoes_slug_idx").on(table.slug),
  })
);

export const institutionSpecialties = mysqlTable("especialidades_instituicao",
  {
    id: int("id").autoincrement().primaryKey(),
    institutionId: int("instituicao_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    specialtyId: int("especialidade_id")
      .notNull()
      .references(() => specialties.id, { onDelete: "cascade" }),
    serviceModel: mysqlEnum("modelo_servico", [
      "elective",
      "high_complexity",
      "ambulatory",
      "training",
      "diagnostic",
    ])
      .default("elective")
      .notNull(),
    status: mysqlEnum("status", ["planned", "active", "paused"])
      .default("planned")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    institutionSpecialtyIdx: uniqueIndex("institution_specialty_idx").on(
      table.institutionId,
      table.specialtyId
    ),
  })
);

export const professionalProfiles = mysqlTable("perfis_profissionais",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    institutionId: int("instituicao_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    fullName: varchar("nome_completo", { length: 180 }).notNull(),
    roleTitle: varchar("titulo_cargo", { length: 120 }).notNull(),
    professionalType: mysqlEnum("tipo_profissional", [
      "surgeon",
      "anesthesiologist",
      "nurse",
      "coordinator",
      "faculty",
      "resident",
      "student",
      "manager",
    ])
      .default("surgeon")
      .notNull(),
    credentialNumber: varchar("numero_credencial", { length: 80 }),
    credentialState: varchar("estado_credencial", { length: 16 }),
    credentialAuthority: varchar("autoridade_credencial", { length: 120 }),
    rqeNumber: varchar("numero_rqe", { length: 80 }),
    publicEmail: varchar("email_publico", { length: 320 }),
    privateAccessEmail: varchar("email_acesso_privado", { length: 320 }),
    passwordAccessStatus: mysqlEnum("status_acesso_senha", [
      "not_started",
      "ready",
      "recovery",
      "managed",
    ])
      .default("not_started")
      .notNull(),
    passwordRecoveryChannel: varchar("canal_recuperacao_senha", { length: 160 }),
    passwordLastUpdatedAt: timestamp("senha_atualizada_em"),
    phone: varchar("telefone", { length: 40 }),
    city: varchar("cidade", { length: 120 }),
    state: varchar("estado", { length: 120 }),
    regionLabel: varchar("rotulo_regiao", { length: 120 }),
    profileImageUrl: varchar("url_imagem_perfil", { length: 2048 }),
    miniBio: text("mini_bio"),
    curriculumSummary: text("resumo_curriculo"),
    highlights: text("destaques"),
    practiceAreas: text("areas_atuacao"),
    collaborationInterest: mysqlEnum("interesse_colaboracao", ["low", "medium", "high"])
      .default("medium")
      .notNull(),
    verificationStatus: mysqlEnum("status_verificacao", ["pending", "verified", "rejected"])
      .default("pending")
      .notNull(),
    visibility: mysqlEnum("visibilidade", ["public", "restricted", "private"])
      .default("public")
      .notNull(),
    status: mysqlEnum("status", ["active", "inactive"])
      .default("active")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  }
);

export const publications = mysqlTable("publicacoes",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    excerpt: text("trecho"),
    body: text("corpo"),
    publicationType: mysqlEnum("tipo_publicacao", [
      "ceo_update",
      "institutional",
      "report",
      "article",
      "case_highlight",
      "news",
    ])
      .default("institutional")
      .notNull(),
    featured: mysqlEnum("em_destaque", ["no", "yes"]).default("no").notNull(),
    visibility: mysqlEnum("visibilidade", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    authorProfileId: int("perfil_autor_id").references(() => professionalProfiles.id, {
      onDelete: "set null",
    }),
    coverImageUrl: varchar("url_imagem_capa", { length: 2048 }),
    publishedAt: timestamp("publicado_em"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("publicacoes_slug_idx").on(table.slug),
  })
);

export const libraryAssets = mysqlTable("recursos_biblioteca",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    description: text("descricao"),
    assetType: mysqlEnum("tipo_recurso", [
      "document",
      "video",
      "image",
      "presentation",
      "dataset",
      "protocol",
      "checklist",
      "other",
    ])
      .default("document")
      .notNull(),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    publicationId: int("publicacao_id").references(() => publications.id, {
      onDelete: "set null",
    }),
    uploadedByUserId: int("enviado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sourceUrl: varchar("url_origem", { length: 2048 }),
    fileKey: varchar("chave_arquivo", { length: 255 }),
    fileUrl: varchar("url_arquivo", { length: 2048 }),
    visibility: mysqlEnum("visibilidade", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    featured: mysqlEnum("em_destaque", ["no", "yes"]).default("no").notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("library_assets_slug_idx").on(table.slug),
  })
);

export const caseStudies = mysqlTable("estudos_caso",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    summary: text("resumo"),
    clinicalFocus: varchar("foco_clinico", { length: 180 }),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    institutionId: int("instituicao_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    authorProfileId: int("perfil_autor_id").references(() => professionalProfiles.id, {
      onDelete: "set null",
    }),
    publicationId: int("publicacao_id").references(() => publications.id, {
      onDelete: "set null",
    }),
    complexity: mysqlEnum("complexidade", ["standard", "high", "advanced"])
      .default("standard")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    sourceUrl: varchar("url_origem", { length: 2048 }),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("case_studies_slug_idx").on(table.slug),
  })
);

export const flowcharts = mysqlTable("fluxogramas",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    summary: text("resumo"),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    institutionId: int("instituicao_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    diagramUrl: varchar("url_diagrama", { length: 2048 }),
    fileKey: varchar("chave_arquivo", { length: 255 }),
    visibility: mysqlEnum("visibilidade", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("fluxogramas_slug_idx").on(table.slug),
  })
);

export const profileConnections = mysqlTable("conexoes_perfis",
  {
    id: int("id").autoincrement().primaryKey(),
    requesterProfileId: int("perfil_solicitante_id")
      .notNull()
      .references(() => professionalProfiles.id, { onDelete: "cascade" }),
    targetProfileId: int("perfil_alvo_id")
      .notNull()
      .references(() => professionalProfiles.id, { onDelete: "cascade" }),
    connectionType: mysqlEnum("tipo_conexao", [
      "interest",
      "referral",
      "mentorship",
      "research",
      "institutional",
    ])
      .default("interest")
      .notNull(),
    status: mysqlEnum("status", ["pending", "accepted", "declined", "blocked"])
      .default("pending")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    requesterTargetIdx: uniqueIndex("profile_connections_pair_idx").on(
      table.requesterProfileId,
      table.targetProfileId
    ),
  })
);

export const mediaShowcaseItems = mysqlTable("itens_vitrine_midia",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    description: text("descricao"),
    mediaType: mysqlEnum("tipo_midia", ["image", "video", "document", "other"])
      .default("image")
      .notNull(),
    moduleKey: varchar("chave_modulo", { length: 120 }),
    sourceUrl: varchar("url_origem", { length: 2048 }),
    fileKey: varchar("chave_arquivo", { length: 255 }),
    fileUrl: varchar("url_arquivo", { length: 2048 }),
    visibility: mysqlEnum("visibilidade", ["public", "restricted", "private"])
      .default("public")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("media_showcase_items_slug_idx").on(table.slug),
  })
);

export const surgicalTeams = mysqlTable("equipes_cirurgicas",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("nome", { length: 180 }).notNull(),
    institutionId: int("instituicao_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    teamType: mysqlEnum("tipo_equipe", ["fixed", "mobile", "regional", "teaching"])
      .default("fixed")
      .notNull(),
    operationalProfile: varchar("perfil_operacional", { length: 180 }),
    membersCount: int("contagem_membros").default(0).notNull(),
    status: mysqlEnum("status", ["planning", "active", "inactive"])
      .default("planning")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("surgical_teams_slug_idx").on(table.slug),
  })
);

export const surgicalTeamMembers = mysqlTable("membros_equipe_cirurgica",
  {
    id: int("id").autoincrement().primaryKey(),
    surgicalTeamId: int("equipe_cirurgica_id")
      .notNull()
      .references(() => surgicalTeams.id, { onDelete: "cascade" }),
    professionalProfileId: int("perfil_profissional_id")
      .notNull()
      .references(() => professionalProfiles.id, { onDelete: "cascade" }),
    membershipRole: varchar("papel_membro", { length: 120 }).notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    teamProfessionalIdx: uniqueIndex("team_professional_idx").on(
      table.surgicalTeamId,
      table.professionalProfileId
    ),
  })
);

export const governmentContracts = mysqlTable("contratos_governamentais",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    partnerId: int("parceiro_id").references(() => partners.id, {
      onDelete: "set null",
    }),
    institutionId: int("instituicao_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    contractType: mysqlEnum("tipo_contrato", [
      "state_program",
      "municipal_program",
      "federal_program",
      "oss_agreement",
      "service_contract",
    ])
      .default("service_contract")
      .notNull(),
    scope: text("escopo"),
    estimatedProcedures: int("procedimentos_estimados").default(0).notNull(),
    status: mysqlEnum("status", ["pipeline", "active", "completed", "paused"])
      .default("pipeline")
      .notNull(),
    startDate: timestamp("data_inicio"),
    endDate: timestamp("data_fim"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("government_contracts_slug_idx").on(table.slug),
  })
);

export const patientQueueEntries = mysqlTable("fila_pacientes",
  {
    id: int("id").autoincrement().primaryKey(),
    patientCode: varchar("codigo_paciente", { length: 80 }).notNull(),
    specialtyId: int("especialidade_id")
      .notNull()
      .references(() => specialties.id, { onDelete: "cascade" }),
    institutionId: int("instituicao_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    contractId: int("contrato_id").references(() => governmentContracts.id, {
      onDelete: "set null",
    }),
    priority: mysqlEnum("prioridade", ["low", "moderate", "high", "urgent"])
      .default("moderate")
      .notNull(),
    pathway: mysqlEnum("caminho", ["ambulatory", "hospital", "high_complexity"])
      .default("hospital")
      .notNull(),
    status: mysqlEnum("status", ["waiting", "scheduled", "performed", "cancelled"])
      .default("waiting")
      .notNull(),
    waitingDays: int("dias_espera").default(0).notNull(),
    originCity: varchar("cidade_origem", { length: 120 }),
    originState: varchar("estado_origem", { length: 120 }),
    scheduledAt: timestamp("agendado_em"),
    performedAt: timestamp("realizado_em"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    patientCodeIdx: uniqueIndex("patient_queue_entries_code_idx").on(table.patientCode),
  })
);

export const tracks = mysqlTable("trilhas",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    summary: text("resumo"),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    difficulty: mysqlEnum("dificuldade", ["intro", "intermediate", "advanced"])
      .default("intro")
      .notNull(),
    estimatedHours: int("horas_estimadas").default(0).notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("criado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("trilhas_slug_idx").on(table.slug),
  })
);

export const learningModules = mysqlTable("modulos_aprendizado",
  {
    id: int("id").autoincrement().primaryKey(),
    trackId: int("trilha_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    summary: text("resumo"),
    position: int("posicao").default(0).notNull(),
    estimatedMinutes: int("minutos_estimados").default(0).notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    trackSlugIdx: uniqueIndex("modules_track_slug_idx").on(table.trackId, table.slug),
  })
);

export const documents = mysqlTable("documentos",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    description: text("descricao"),
    documentType: mysqlEnum("tipo_documento", [
      "protocol",
      "guideline",
      "manual",
      "article",
      "checklist",
      "video",
      "other",
    ])
      .default("protocol")
      .notNull(),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    trackId: int("trilha_id").references(() => tracks.id, {
      onDelete: "set null",
    }),
    sourceUrl: varchar("url_origem", { length: 2048 }),
    fileKey: varchar("chave_arquivo", { length: 255 }),
    fileUrl: varchar("url_arquivo", { length: 2048 }),
    fileName: varchar("nome_arquivo", { length: 255 }),
    mimeType: varchar("tipo_mime", { length: 160 }),
    fileSizeBytes: int("tamanho_arquivo_bytes"),
    folderLabel: varchar("rotulo_pasta", { length: 160 }).default("Geral").notNull(),
    contributorName: varchar("nome_contribuidor", { length: 180 }),
    contributorInstitution: varchar("instituicao_contribuidor", { length: 180 }),
    contributorCredential: varchar("credencial_contribuidor", { length: 120 }),
    contributorType: mysqlEnum("tipo_contribuidor", ["internal", "external"])
      .default("external")
      .notNull(),
    uploadSource: mysqlEnum("origem_envio", ["workspace", "submission"])
      .default("submission")
      .notNull(),
    visibility: mysqlEnum("visibilidade", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("criado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("publicado_em"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("documentos_slug_idx").on(table.slug),
  })
);

export const clinicalCases = mysqlTable("casos_clinicos",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    synopsis: text("sinopse"),
    learningObjectives: text("objetivos_aprendizado"),
    discussion: text("discussao"),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    difficulty: mysqlEnum("dificuldade", ["intro", "intermediate", "advanced"])
      .default("intermediate")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("criado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("publicado_em"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("clinical_cases_slug_idx").on(table.slug),
  })
);

export const encyclopediaEntries = mysqlTable("verbetes_enciclopedia",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("titulo", { length: 180 }).notNull(),
    summary: text("resumo"),
    body: text("corpo"),
    specialtyId: int("especialidade_id").references(() => specialties.id, {
      onDelete: "set null",
    }),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("criado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedByUserId: int("revisado_por_usuario_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("publicado_em"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("encyclopedia_entries_slug_idx").on(table.slug),
  })
);

export const trackEnrollments = mysqlTable("matriculas_trilha",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    trackId: int("trilha_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["not_started", "in_progress", "completed"])
      .default("not_started")
      .notNull(),
    progressPercent: int("percentual_progresso").default(0).notNull(),
    startedAt: timestamp("iniciado_em"),
    completedAt: timestamp("concluido_em"),
    lastAccessedAt: timestamp("ultimo_acesso_em"),
    createdAt: timestamp("criado_em").defaultNow().notNull(),
    updatedAt: timestamp("atualizado_em").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userTrackIdx: uniqueIndex("track_enrollments_user_track_idx").on(
      table.userId,
      table.trackId
    ),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Specialty = typeof specialties.$inferSelect;
export type InsertSpecialty = typeof specialties.$inferInsert;

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = typeof institutions.$inferInsert;

export type InstitutionSpecialty = typeof institutionSpecialties.$inferSelect;
export type InsertInstitutionSpecialty = typeof institutionSpecialties.$inferInsert;

export type ProfessionalProfile = typeof professionalProfiles.$inferSelect;
export type InsertProfessionalProfile = typeof professionalProfiles.$inferInsert;

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;

export type LibraryAsset = typeof libraryAssets.$inferSelect;
export type InsertLibraryAsset = typeof libraryAssets.$inferInsert;

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = typeof caseStudies.$inferInsert;

export type Flowchart = typeof flowcharts.$inferSelect;
export type InsertFlowchart = typeof flowcharts.$inferInsert;

export type ProfileConnection = typeof profileConnections.$inferSelect;
export type InsertProfileConnection = typeof profileConnections.$inferInsert;

export type MediaShowcaseItem = typeof mediaShowcaseItems.$inferSelect;
export type InsertMediaShowcaseItem = typeof mediaShowcaseItems.$inferInsert;

export type SurgicalTeam = typeof surgicalTeams.$inferSelect;
export type InsertSurgicalTeam = typeof surgicalTeams.$inferInsert;

export type SurgicalTeamMember = typeof surgicalTeamMembers.$inferSelect;
export type InsertSurgicalTeamMember = typeof surgicalTeamMembers.$inferInsert;

export type GovernmentContract = typeof governmentContracts.$inferSelect;
export type InsertGovernmentContract = typeof governmentContracts.$inferInsert;

export type PatientQueueEntry = typeof patientQueueEntries.$inferSelect;
export type InsertPatientQueueEntry = typeof patientQueueEntries.$inferInsert;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = typeof tracks.$inferInsert;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = typeof learningModules.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export type ClinicalCase = typeof clinicalCases.$inferSelect;
export type InsertClinicalCase = typeof clinicalCases.$inferInsert;

export type EncyclopediaEntry = typeof encyclopediaEntries.$inferSelect;
export type InsertEncyclopediaEntry = typeof encyclopediaEntries.$inferInsert;

export type TrackEnrollment = typeof trackEnrollments.$inferSelect;
export type InsertTrackEnrollment = typeof trackEnrollments.$inferInsert;
