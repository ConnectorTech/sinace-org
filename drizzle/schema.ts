import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const specialties = mysqlTable(
  "specialties",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    shortLabel: varchar("shortLabel", { length: 80 }),
    description: text("description"),
    category: mysqlEnum("category", ["cirurgica", "clinica", "apoio"])
      .default("cirurgica")
      .notNull(),
    status: mysqlEnum("status", ["draft", "active", "archived"])
      .default("draft")
      .notNull(),
    displayOrder: int("displayOrder").default(0).notNull(),
    coordinationModel: varchar("coordinationModel", { length: 160 }),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("specialties_slug_idx").on(table.slug),
  })
);

export const partners = mysqlTable(
  "partners",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    description: text("description"),
    partnerType: mysqlEnum("partnerType", [
      "government",
      "oss",
      "hospital_network",
      "supplier",
      "academic",
      "other",
    ])
      .default("other")
      .notNull(),
    websiteUrl: varchar("websiteUrl", { length: 2048 }),
    city: varchar("city", { length: 120 }),
    state: varchar("state", { length: 120 }),
    status: mysqlEnum("status", ["prospect", "active", "inactive"])
      .default("prospect")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("partners_slug_idx").on(table.slug),
  })
);

export const institutions = mysqlTable(
  "institutions",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    description: text("description"),
    institutionType: mysqlEnum("institutionType", [
      "hospital",
      "santa_casa",
      "clinic",
      "surgical_center",
      "teaching_center",
      "other",
    ])
      .default("hospital")
      .notNull(),
    city: varchar("city", { length: 120 }),
    state: varchar("state", { length: 120 }),
    capacityProfile: varchar("capacityProfile", { length: 160 }),
    teachingProfile: varchar("teachingProfile", { length: 160 }),
    partnerId: int("partnerId").references(() => partners.id, {
      onDelete: "set null",
    }),
    status: mysqlEnum("status", ["planning", "active", "inactive"])
      .default("planning")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("institutions_slug_idx").on(table.slug),
  })
);

export const institutionSpecialties = mysqlTable(
  "institutionSpecialties",
  {
    id: int("id").autoincrement().primaryKey(),
    institutionId: int("institutionId")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    specialtyId: int("specialtyId")
      .notNull()
      .references(() => specialties.id, { onDelete: "cascade" }),
    serviceModel: mysqlEnum("serviceModel", [
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
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    institutionSpecialtyIdx: uniqueIndex("institution_specialty_idx").on(
      table.institutionId,
      table.specialtyId
    ),
  })
);

export const professionalProfiles = mysqlTable(
  "professionalProfiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").references(() => users.id, {
      onDelete: "set null",
    }),
    institutionId: int("institutionId").references(() => institutions.id, {
      onDelete: "set null",
    }),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    fullName: varchar("fullName", { length: 180 }).notNull(),
    roleTitle: varchar("roleTitle", { length: 120 }).notNull(),
    professionalType: mysqlEnum("professionalType", [
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
    credentialNumber: varchar("credentialNumber", { length: 80 }),
    credentialState: varchar("credentialState", { length: 16 }),
    credentialAuthority: varchar("credentialAuthority", { length: 120 }),
    rqeNumber: varchar("rqeNumber", { length: 80 }),
    publicEmail: varchar("publicEmail", { length: 320 }),
    privateAccessEmail: varchar("privateAccessEmail", { length: 320 }),
    passwordAccessStatus: mysqlEnum("passwordAccessStatus", [
      "not_started",
      "ready",
      "recovery",
      "managed",
    ])
      .default("not_started")
      .notNull(),
    passwordRecoveryChannel: varchar("passwordRecoveryChannel", { length: 160 }),
    passwordLastUpdatedAt: timestamp("passwordLastUpdatedAt"),
    phone: varchar("phone", { length: 40 }),
    city: varchar("city", { length: 120 }),
    state: varchar("state", { length: 120 }),
    regionLabel: varchar("regionLabel", { length: 120 }),
    profileImageUrl: varchar("profileImageUrl", { length: 2048 }),
    miniBio: text("miniBio"),
    curriculumSummary: text("curriculumSummary"),
    highlights: text("highlights"),
    practiceAreas: text("practiceAreas"),
    collaborationInterest: mysqlEnum("collaborationInterest", ["low", "medium", "high"])
      .default("medium")
      .notNull(),
    verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "rejected"])
      .default("pending")
      .notNull(),
    visibility: mysqlEnum("visibility", ["public", "restricted", "private"])
      .default("public")
      .notNull(),
    status: mysqlEnum("status", ["active", "inactive"])
      .default("active")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export const publications = mysqlTable(
  "publications",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    excerpt: text("excerpt"),
    body: text("body"),
    publicationType: mysqlEnum("publicationType", [
      "ceo_update",
      "institutional",
      "report",
      "article",
      "case_highlight",
      "news",
    ])
      .default("institutional")
      .notNull(),
    featured: mysqlEnum("featured", ["no", "yes"]).default("no").notNull(),
    visibility: mysqlEnum("visibility", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    authorProfileId: int("authorProfileId").references(() => professionalProfiles.id, {
      onDelete: "set null",
    }),
    coverImageUrl: varchar("coverImageUrl", { length: 2048 }),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("publications_slug_idx").on(table.slug),
  })
);

export const libraryAssets = mysqlTable(
  "libraryAssets",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    assetType: mysqlEnum("assetType", [
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
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    publicationId: int("publicationId").references(() => publications.id, {
      onDelete: "set null",
    }),
    uploadedByUserId: int("uploadedByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    fileKey: varchar("fileKey", { length: 255 }),
    fileUrl: varchar("fileUrl", { length: 2048 }),
    visibility: mysqlEnum("visibility", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    featured: mysqlEnum("featured", ["no", "yes"]).default("no").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("library_assets_slug_idx").on(table.slug),
  })
);

export const caseStudies = mysqlTable(
  "caseStudies",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary"),
    clinicalFocus: varchar("clinicalFocus", { length: 180 }),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    institutionId: int("institutionId").references(() => institutions.id, {
      onDelete: "set null",
    }),
    authorProfileId: int("authorProfileId").references(() => professionalProfiles.id, {
      onDelete: "set null",
    }),
    publicationId: int("publicationId").references(() => publications.id, {
      onDelete: "set null",
    }),
    complexity: mysqlEnum("complexity", ["standard", "high", "advanced"])
      .default("standard")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("case_studies_slug_idx").on(table.slug),
  })
);

export const flowcharts = mysqlTable(
  "flowcharts",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary"),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    institutionId: int("institutionId").references(() => institutions.id, {
      onDelete: "set null",
    }),
    diagramUrl: varchar("diagramUrl", { length: 2048 }),
    fileKey: varchar("fileKey", { length: 255 }),
    visibility: mysqlEnum("visibility", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("flowcharts_slug_idx").on(table.slug),
  })
);

export const profileConnections = mysqlTable(
  "profileConnections",
  {
    id: int("id").autoincrement().primaryKey(),
    requesterProfileId: int("requesterProfileId")
      .notNull()
      .references(() => professionalProfiles.id, { onDelete: "cascade" }),
    targetProfileId: int("targetProfileId")
      .notNull()
      .references(() => professionalProfiles.id, { onDelete: "cascade" }),
    connectionType: mysqlEnum("connectionType", [
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
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    requesterTargetIdx: uniqueIndex("profile_connections_pair_idx").on(
      table.requesterProfileId,
      table.targetProfileId
    ),
  })
);

export const mediaShowcaseItems = mysqlTable(
  "mediaShowcaseItems",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    mediaType: mysqlEnum("mediaType", ["image", "video", "document", "other"])
      .default("image")
      .notNull(),
    moduleKey: varchar("moduleKey", { length: 120 }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    fileKey: varchar("fileKey", { length: 255 }),
    fileUrl: varchar("fileUrl", { length: 2048 }),
    visibility: mysqlEnum("visibility", ["public", "restricted", "private"])
      .default("public")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("media_showcase_items_slug_idx").on(table.slug),
  })
);

export const surgicalTeams = mysqlTable(
  "surgicalTeams",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    institutionId: int("institutionId").references(() => institutions.id, {
      onDelete: "set null",
    }),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    teamType: mysqlEnum("teamType", ["fixed", "mobile", "regional", "teaching"])
      .default("fixed")
      .notNull(),
    operationalProfile: varchar("operationalProfile", { length: 180 }),
    membersCount: int("membersCount").default(0).notNull(),
    status: mysqlEnum("status", ["planning", "active", "inactive"])
      .default("planning")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("surgical_teams_slug_idx").on(table.slug),
  })
);

export const surgicalTeamMembers = mysqlTable(
  "surgicalTeamMembers",
  {
    id: int("id").autoincrement().primaryKey(),
    surgicalTeamId: int("surgicalTeamId")
      .notNull()
      .references(() => surgicalTeams.id, { onDelete: "cascade" }),
    professionalProfileId: int("professionalProfileId")
      .notNull()
      .references(() => professionalProfiles.id, { onDelete: "cascade" }),
    membershipRole: varchar("membershipRole", { length: 120 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    teamProfessionalIdx: uniqueIndex("team_professional_idx").on(
      table.surgicalTeamId,
      table.professionalProfileId
    ),
  })
);

export const governmentContracts = mysqlTable(
  "governmentContracts",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    partnerId: int("partnerId").references(() => partners.id, {
      onDelete: "set null",
    }),
    institutionId: int("institutionId").references(() => institutions.id, {
      onDelete: "set null",
    }),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    contractType: mysqlEnum("contractType", [
      "state_program",
      "municipal_program",
      "federal_program",
      "oss_agreement",
      "service_contract",
    ])
      .default("service_contract")
      .notNull(),
    scope: text("scope"),
    estimatedProcedures: int("estimatedProcedures").default(0).notNull(),
    status: mysqlEnum("status", ["pipeline", "active", "completed", "paused"])
      .default("pipeline")
      .notNull(),
    startDate: timestamp("startDate"),
    endDate: timestamp("endDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("government_contracts_slug_idx").on(table.slug),
  })
);

export const patientQueueEntries = mysqlTable(
  "patientQueueEntries",
  {
    id: int("id").autoincrement().primaryKey(),
    patientCode: varchar("patientCode", { length: 80 }).notNull(),
    specialtyId: int("specialtyId")
      .notNull()
      .references(() => specialties.id, { onDelete: "cascade" }),
    institutionId: int("institutionId").references(() => institutions.id, {
      onDelete: "set null",
    }),
    contractId: int("contractId").references(() => governmentContracts.id, {
      onDelete: "set null",
    }),
    priority: mysqlEnum("priority", ["low", "moderate", "high", "urgent"])
      .default("moderate")
      .notNull(),
    pathway: mysqlEnum("pathway", ["ambulatory", "hospital", "high_complexity"])
      .default("hospital")
      .notNull(),
    status: mysqlEnum("status", ["waiting", "scheduled", "performed", "cancelled"])
      .default("waiting")
      .notNull(),
    waitingDays: int("waitingDays").default(0).notNull(),
    originCity: varchar("originCity", { length: 120 }),
    originState: varchar("originState", { length: 120 }),
    scheduledAt: timestamp("scheduledAt"),
    performedAt: timestamp("performedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    patientCodeIdx: uniqueIndex("patient_queue_entries_code_idx").on(table.patientCode),
  })
);

export const tracks = mysqlTable(
  "tracks",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary"),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    difficulty: mysqlEnum("difficulty", ["intro", "intermediate", "advanced"])
      .default("intro")
      .notNull(),
    estimatedHours: int("estimatedHours").default(0).notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("tracks_slug_idx").on(table.slug),
  })
);

export const learningModules = mysqlTable(
  "learningModules",
  {
    id: int("id").autoincrement().primaryKey(),
    trackId: int("trackId")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary"),
    position: int("position").default(0).notNull(),
    estimatedMinutes: int("estimatedMinutes").default(0).notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    trackSlugIdx: uniqueIndex("modules_track_slug_idx").on(table.trackId, table.slug),
  })
);

export const documents = mysqlTable(
  "documents",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    documentType: mysqlEnum("documentType", [
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
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    trackId: int("trackId").references(() => tracks.id, {
      onDelete: "set null",
    }),
    sourceUrl: varchar("sourceUrl", { length: 2048 }),
    fileKey: varchar("fileKey", { length: 255 }),
    fileUrl: varchar("fileUrl", { length: 2048 }),
    fileName: varchar("fileName", { length: 255 }),
    mimeType: varchar("mimeType", { length: 160 }),
    fileSizeBytes: int("fileSizeBytes"),
    folderLabel: varchar("folderLabel", { length: 160 }).default("Geral").notNull(),
    contributorName: varchar("contributorName", { length: 180 }),
    contributorInstitution: varchar("contributorInstitution", { length: 180 }),
    contributorCredential: varchar("contributorCredential", { length: 120 }),
    contributorType: mysqlEnum("contributorType", ["internal", "external"])
      .default("external")
      .notNull(),
    uploadSource: mysqlEnum("uploadSource", ["workspace", "submission"])
      .default("submission")
      .notNull(),
    visibility: mysqlEnum("visibility", ["public", "restricted", "private"])
      .default("restricted")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("documents_slug_idx").on(table.slug),
  })
);

export const clinicalCases = mysqlTable(
  "clinicalCases",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    synopsis: text("synopsis"),
    learningObjectives: text("learningObjectives"),
    discussion: text("discussion"),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    difficulty: mysqlEnum("difficulty", ["intro", "intermediate", "advanced"])
      .default("intermediate")
      .notNull(),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("clinical_cases_slug_idx").on(table.slug),
  })
);

export const encyclopediaEntries = mysqlTable(
  "encyclopediaEntries",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary"),
    body: text("body"),
    specialtyId: int("specialtyId").references(() => specialties.id, {
      onDelete: "set null",
    }),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedByUserId: int("reviewedByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("encyclopedia_entries_slug_idx").on(table.slug),
  })
);

export const trackEnrollments = mysqlTable(
  "trackEnrollments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    trackId: int("trackId")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["not_started", "in_progress", "completed"])
      .default("not_started")
      .notNull(),
    progressPercent: int("progressPercent").default(0).notNull(),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    lastAccessedAt: timestamp("lastAccessedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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
