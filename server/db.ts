import { and, asc, count, desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  caseStudies,
  documents,
  flowcharts,
  governmentContracts,
  institutionSpecialties,
  institutions,
  libraryAssets,
  mediaShowcaseItems,
  partners,
  patientQueueEntries,
  profileConnections,
  professionalProfiles,
  publications,
  specialties,
  surgicalTeamMembers,
  surgicalTeams,
  tracks,
  type InsertDocument,
  type InsertGovernmentContract,
  type InsertInstitution,
  type InsertInstitutionSpecialty,
  type InsertPartner,
  type InsertPatientQueueEntry,
  type InsertProfessionalProfile,
  type InsertSpecialty,
  type InsertSurgicalTeam,
  type InsertSurgicalTeamMember,
  type InsertTrack,
  type InsertUser,
  users,
} from "../drizzle/schema";
import {
  SINACE_INSTITUTIONAL_PROFILE,
  SINACE_OPERATION_MODALITIES,
  SINACE_SPECIALTY_CATALOG,
} from "../shared/sinaceCatalog";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";

let _db: ReturnType<typeof drizzle> | null = null;
let sinaceSeedPromise: Promise<void> | null = null;

const trackSeedBase = [
  {
    slug: "governanca-fila-cirurgica",
    title: "Governança da fila cirúrgica",
    specialtySlug: "cirurgia-geral",
    summary:
      "Base para leitura da demanda reprimida, priorização regulatória e desenho operacional da capacidade cirúrgica por território.",
    difficulty: "intro" as const,
    estimatedHours: 14,
  },
  {
    slug: "operacao-regional-especialidades",
    title: "Operação regional de especialidades",
    specialtySlug: "ortopedia-e-traumatologia",
    summary:
      "Trilha para coordenação de polos regionais, agenda cirúrgica, produtividade, insumos e indicadores assistenciais.",
    difficulty: "intermediate" as const,
    estimatedHours: 18,
  },
  {
    slug: "linha-oncologica-cirurgica",
    title: "Linha oncológica cirúrgica em rede",
    specialtySlug: "cirurgia-oncologica",
    summary:
      "Jornada de decisão clínica, pactuação multiprofissional, regulação prioritária e segurança em cirurgia oncológica.",
    difficulty: "advanced" as const,
    estimatedHours: 20,
  },
  {
    slug: "educacao-medico-cirurgica-aplicada",
    title: "Educação médico-cirúrgica aplicada",
    specialtySlug: "neurocirurgia",
    summary:
      "Estrutura pedagógica para integrar casos clínicos, biblioteca, enciclopédia e curadoria científica por especialidade.",
    difficulty: "advanced" as const,
    estimatedHours: 22,
  },
] as const;

const documentSeedBase = [
  {
    slug: "diretriz-governanca-fila-cirurgica",
    title: "Diretriz de governança da fila cirúrgica",
    specialtySlug: "cirurgia-geral",
    trackSlug: "governanca-fila-cirurgica",
    description:
      "Documento-base para classificação da demanda, governança institucional e leitura executiva da produção cirúrgica.",
    documentType: "guideline" as const,
  },
  {
    slug: "checklist-estabilidade-centro-cirurgico",
    title: "Checklist de estabilidade do centro cirúrgico",
    specialtySlug: "ortopedia-e-traumatologia",
    trackSlug: "operacao-regional-especialidades",
    description:
      "Checklist operacional para ativação de agenda, giro assistencial, material consignado e mitigação de suspensão.",
    documentType: "checklist" as const,
  },
  {
    slug: "manual-curadoria-cientifica-sinace",
    title: "Manual de curadoria científica SINACE",
    specialtySlug: "neurocirurgia",
    trackSlug: "educacao-medico-cirurgica-aplicada",
    description:
      "Guia editorial e técnico para professores, coordenadores e autores da plataforma.",
    documentType: "manual" as const,
  },
  {
    slug: "protocolo-priorizacao-oncologica",
    title: "Protocolo de priorização cirúrgica oncológica",
    specialtySlug: "cirurgia-oncologica",
    trackSlug: "linha-oncologica-cirurgica",
    description:
      "Diretrizes para reduzir atrasos cirúrgicos em casos oncológicos com segurança e governança clínica.",
    documentType: "protocol" as const,
  },
] as const;

const partnerSeedBase = [
  {
    slug: "secretaria-estadual-piloto-sp",
    name: "Secretaria Estadual Piloto SP",
    partnerType: "government" as const,
    description:
      "Contratante público orientado à redução de filas cirúrgicas e implantação de polos regionais de produção assistencial.",
    state: "SP",
    city: "São Paulo",
  },
  {
    slug: "consorcio-oss-assistencial",
    name: "Consórcio OSS Assistencial",
    partnerType: "oss" as const,
    description:
      "Estrutura complementar para operação assistencial, metas cirúrgicas e governança compartilhada com a rede pública.",
    state: "MG",
    city: "Belo Horizonte",
  },
  {
    slug: "rede-hospitalar-centro-sul",
    name: "Rede Hospitalar Centro-Sul",
    partnerType: "hospital_network" as const,
    description:
      "Rede hospitalar articulada para expansão de capacidade cirúrgica, pactuação regional e integração de agenda.",
    state: "PR",
    city: "Curitiba",
  },
  {
    slug: "colegio-cientifico-sinace",
    name: "Colégio Científico SINACE",
    partnerType: "academic" as const,
    description:
      "Estrutura acadêmica voltada à curadoria de trilhas, casos clínicos, biblioteca e coordenações docentes da plataforma.",
    state: "DF",
    city: "Brasília",
  },
] as const;

const institutionSeedBase = [
  {
    slug: "hospital-regional-ourinhos",
    name: "Hospital Regional Ourinhos",
    description:
      "Unidade âncora para programas de acesso cirúrgico, linhas eletivas de alto volume e governança regional do SINACE.",
    institutionType: "hospital" as const,
    city: "Ourinhos",
    state: "SP",
    partnerSlug: "secretaria-estadual-piloto-sp",
    status: "active" as const,
    capacityProfile: "Baixa, média e alta complexidade",
    teachingProfile: "Campo de prática e educação médico-cirúrgica aplicada",
    specialties: [
      { specialtySlug: "cirurgia-geral", serviceModel: "elective" as const, status: "active" as const },
      { specialtySlug: "ortopedia-e-traumatologia", serviceModel: "elective" as const, status: "active" as const },
      { specialtySlug: "urologia", serviceModel: "ambulatory" as const, status: "active" as const },
      { specialtySlug: "oftalmologia", serviceModel: "elective" as const, status: "active" as const },
    ],
  },
  {
    slug: "santa-casa-marilia",
    name: "Santa Casa Marília",
    description:
      "Instituição com perfil filantrópico e capacidade para apoiar linhas cirúrgicas regionais, produção eletiva e qualificação assistencial.",
    institutionType: "santa_casa" as const,
    city: "Marília",
    state: "SP",
    partnerSlug: "consorcio-oss-assistencial",
    status: "active" as const,
    capacityProfile: "Média complexidade com agenda eletiva ampliável",
    teachingProfile: "Integração ensino-serviço em linhas cirúrgicas prioritárias",
    specialties: [
      { specialtySlug: "otorrinolaringologia", serviceModel: "ambulatory" as const, status: "active" as const },
      { specialtySlug: "ginecologia-e-obstetricia", serviceModel: "elective" as const, status: "active" as const },
      { specialtySlug: "mastologia", serviceModel: "diagnostic" as const, status: "planned" as const },
      { specialtySlug: "coloproctologia", serviceModel: "elective" as const, status: "active" as const },
    ],
  },
  {
    slug: "centro-avancado-cardiovascular-brasilia",
    name: "Centro Avançado Cardiovascular Brasília",
    description:
      "Centro de referência para linhas de alta complexidade, leitos críticos e pactuação regional de casos estratégicos.",
    institutionType: "surgical_center" as const,
    city: "Brasília",
    state: "DF",
    partnerSlug: "rede-hospitalar-centro-sul",
    status: "active" as const,
    capacityProfile: "Alta complexidade com suporte intensivo e integração diagnóstica",
    teachingProfile: "Treinamento avançado para equipes de alta complexidade",
    specialties: [
      { specialtySlug: "cirurgia-cardiovascular", serviceModel: "high_complexity" as const, status: "active" as const },
      { specialtySlug: "cirurgia-toracica", serviceModel: "high_complexity" as const, status: "active" as const },
      { specialtySlug: "cirurgia-vascular", serviceModel: "high_complexity" as const, status: "active" as const },
      { specialtySlug: "neurocirurgia", serviceModel: "high_complexity" as const, status: "planned" as const },
    ],
  },
  {
    slug: "instituto-docente-sinace",
    name: "Instituto Docente SINACE",
    description:
      "Polo voltado à coordenação educacional, produção científica, trilhas cirúrgicas e integração com o aplicativo próprio da SINACE.",
    institutionType: "teaching_center" as const,
    city: "São Paulo",
    state: "SP",
    partnerSlug: "colegio-cientifico-sinace",
    status: "active" as const,
    capacityProfile: "Centro de coordenação científica e apoio à rede assistencial",
    teachingProfile: "Curadoria científica, corpo docente e produção acadêmica estruturada",
    specialties: [
      { specialtySlug: "cirurgia-oncologica", serviceModel: "training" as const, status: "active" as const },
      { specialtySlug: "cirurgia-pediatrica", serviceModel: "training" as const, status: "active" as const },
      { specialtySlug: "cirurgia-de-cabeca-e-pescoco", serviceModel: "training" as const, status: "active" as const },
      { specialtySlug: "cirurgia-da-mao", serviceModel: "training" as const, status: "active" as const },
    ],
  },
] as const;

const professionalProfileSeedBase = [
  {
    fullName: "Dra. Helena Martins",
    roleTitle: "Coordenadora de fila cirúrgica",
    professionalType: "manager" as const,
    institutionSlug: "hospital-regional-ourinhos",
    specialtySlug: "cirurgia-geral",
    credentialNumber: "CRM-SP 102334",
  },
  {
    fullName: "Dr. Renato Azevedo",
    roleTitle: "Cirurgião ortopédico líder",
    professionalType: "surgeon" as const,
    institutionSlug: "hospital-regional-ourinhos",
    specialtySlug: "ortopedia-e-traumatologia",
    credentialNumber: "CRM-SP 88422",
  },
  {
    fullName: "Dra. Lívia Cunha",
    roleTitle: "Coordenadora de urologia",
    professionalType: "coordinator" as const,
    institutionSlug: "hospital-regional-ourinhos",
    specialtySlug: "urologia",
    credentialNumber: "CRM-SP 93015",
  },
  {
    fullName: "Dr. Augusto Teixeira",
    roleTitle: "Líder cardiovascular",
    professionalType: "surgeon" as const,
    institutionSlug: "centro-avancado-cardiovascular-brasilia",
    specialtySlug: "cirurgia-cardiovascular",
    credentialNumber: "CRM-DF 44321",
  },
  {
    fullName: "Dra. Marina Valverde",
    roleTitle: "Professora de curadoria científica",
    professionalType: "faculty" as const,
    institutionSlug: "instituto-docente-sinace",
    specialtySlug: "cirurgia-oncologica",
    credentialNumber: "CRM-SP 78110",
  },
  {
    fullName: "Enf. Carlos Menezes",
    roleTitle: "Coordenador perioperatório",
    professionalType: "nurse" as const,
    institutionSlug: "santa-casa-marilia",
    specialtySlug: "ginecologia-e-obstetricia",
    credentialNumber: "COREN-SP 552144",
  },
] as const;

const surgicalTeamSeedBase = [
  {
    slug: "time-regional-fila-geral",
    name: "Time Regional Fila Geral",
    institutionSlug: "hospital-regional-ourinhos",
    specialtySlug: "cirurgia-geral",
    teamType: "regional" as const,
    operationalProfile: "Gestão de mutirões qualificados e leitura territorial de demanda",
    status: "active" as const,
    memberNames: ["Dra. Helena Martins", "Dr. Renato Azevedo", "Dra. Lívia Cunha"],
  },
  {
    slug: "time-cardiovascular-alta-complexidade",
    name: "Time Cardiovascular Alta Complexidade",
    institutionSlug: "centro-avancado-cardiovascular-brasilia",
    specialtySlug: "cirurgia-cardiovascular",
    teamType: "fixed" as const,
    operationalProfile: "Planejamento de leitos críticos e linhas cirúrgicas estratégicas",
    status: "active" as const,
    memberNames: ["Dr. Augusto Teixeira"],
  },
  {
    slug: "nucleo-docente-oncologia",
    name: "Núcleo Docente de Oncologia Cirúrgica",
    institutionSlug: "instituto-docente-sinace",
    specialtySlug: "cirurgia-oncologica",
    teamType: "teaching" as const,
    operationalProfile: "Curadoria científica, produção de conteúdo e suporte à formação clínica",
    status: "active" as const,
    memberNames: ["Dra. Marina Valverde"],
  },
] as const;

const governmentContractSeedBase = [
  {
    slug: "programa-fila-zerada-medio-paranapanema",
    title: "Programa Fila Zerada Médio Paranapanema",
    partnerSlug: "secretaria-estadual-piloto-sp",
    institutionSlug: "hospital-regional-ourinhos",
    specialtySlug: "cirurgia-geral",
    contractType: "state_program" as const,
    scope:
      "Estruturação de linha regional para cirurgias eletivas, priorização clínica e ampliação de acesso com governança de indicadores.",
    estimatedProcedures: 2400,
    status: "active" as const,
  },
  {
    slug: "acordo-oss-ortopedia-marilia",
    title: "Acordo OSS Ortopedia Marília",
    partnerSlug: "consorcio-oss-assistencial",
    institutionSlug: "santa-casa-marilia",
    specialtySlug: "ortopedia-e-traumatologia",
    contractType: "oss_agreement" as const,
    scope:
      "Expansão de agenda ortopédica eletiva com controle de suspensão, materiais e tempo de permanência.",
    estimatedProcedures: 1200,
    status: "pipeline" as const,
  },
  {
    slug: "linha-cardiovascular-df",
    title: "Linha Cardiovascular DF",
    partnerSlug: "rede-hospitalar-centro-sul",
    institutionSlug: "centro-avancado-cardiovascular-brasilia",
    specialtySlug: "cirurgia-cardiovascular",
    contractType: "service_contract" as const,
    scope:
      "Pactuação de casos cardiovasculares de alta complexidade com rede crítica, UTI e coordenação regional.",
    estimatedProcedures: 480,
    status: "active" as const,
  },
] as const;

const patientQueueSeedBase = [
  {
    patientCode: "SINACE-CG-001",
    specialtySlug: "cirurgia-geral",
    institutionSlug: "hospital-regional-ourinhos",
    contractSlug: "programa-fila-zerada-medio-paranapanema",
    priority: "high" as const,
    pathway: "hospital" as const,
    status: "waiting" as const,
    waitingDays: 164,
    originCity: "Ourinhos",
    originState: "SP",
  },
  {
    patientCode: "SINACE-OFT-014",
    specialtySlug: "oftalmologia",
    institutionSlug: "hospital-regional-ourinhos",
    contractSlug: "programa-fila-zerada-medio-paranapanema",
    priority: "moderate" as const,
    pathway: "ambulatory" as const,
    status: "scheduled" as const,
    waitingDays: 88,
    originCity: "Avaré",
    originState: "SP",
  },
  {
    patientCode: "SINACE-ORT-022",
    specialtySlug: "ortopedia-e-traumatologia",
    institutionSlug: "santa-casa-marilia",
    contractSlug: "acordo-oss-ortopedia-marilia",
    priority: "high" as const,
    pathway: "hospital" as const,
    status: "waiting" as const,
    waitingDays: 142,
    originCity: "Marília",
    originState: "SP",
  },
  {
    patientCode: "SINACE-CV-007",
    specialtySlug: "cirurgia-cardiovascular",
    institutionSlug: "centro-avancado-cardiovascular-brasilia",
    contractSlug: "linha-cardiovascular-df",
    priority: "urgent" as const,
    pathway: "high_complexity" as const,
    status: "scheduled" as const,
    waitingDays: 37,
    originCity: "Brasília",
    originState: "DF",
  },
  {
    patientCode: "SINACE-ONC-004",
    specialtySlug: "cirurgia-oncologica",
    institutionSlug: "instituto-docente-sinace",
    contractSlug: null,
    priority: "urgent" as const,
    pathway: "high_complexity" as const,
    status: "waiting" as const,
    waitingDays: 29,
    originCity: "São Paulo",
    originState: "SP",
  },
  {
    patientCode: "SINACE-ORL-011",
    specialtySlug: "otorrinolaringologia",
    institutionSlug: "santa-casa-marilia",
    contractSlug: null,
    priority: "moderate" as const,
    pathway: "ambulatory" as const,
    status: "performed" as const,
    waitingDays: 54,
    originCity: "Marília",
    originState: "SP",
  },
] as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sanitizeOptionalText(value?: string | null, maxLength?: number) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return typeof maxLength === "number" ? trimmed.slice(0, maxLength) : trimmed;
}

function normalizeFileName(fileName: string) {
  const normalized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^[.-]+|[.-]+$)/g, "")
    .toLowerCase();

  return normalized || `anexo-${Date.now()}`;
}

function parseBase64FilePayload(input: string) {
  const trimmed = input.trim();
  const dataUrlMatch = trimmed.match(/^data:([^;]+);base64,(.+)$/);

  if (dataUrlMatch) {
    const [, mimeType, rawBase64] = dataUrlMatch;
    return {
      mimeType,
      buffer: Buffer.from(rawBase64, "base64"),
    };
  }

  return {
    mimeType: null,
    buffer: Buffer.from(trimmed, "base64"),
  };
}

function buildEducationalDocumentStorageKey(specialtySlug: string, fileName: string) {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `sinace/educational-drive/${specialtySlug}/${Date.now()}-${randomSuffix}-${fileName}`;
}

function specialtyFallbackRows() {
  return SINACE_SPECIALTY_CATALOG.map((specialty, index) => ({
    id: index + 1,
    slug: specialty.slug,
    name: specialty.name,
    shortLabel: specialty.shortLabel,
    description: specialty.description,
    category: "cirurgica" as const,
    status: "active" as const,
    displayOrder: index,
    coordinationModel: specialty.coordinationModel,
    createdByUserId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function getCatalogBySlug() {
  return new Map(SINACE_SPECIALTY_CATALOG.map(item => [item.slug, item]));
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }

  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

async function seedSpecialties() {
  const db = await requireDbConnection();

  for (let index = 0; index < SINACE_SPECIALTY_CATALOG.length; index += 1) {
    const specialty = SINACE_SPECIALTY_CATALOG[index];
    const values: InsertSpecialty = {
      slug: specialty.slug,
      name: specialty.name,
      shortLabel: specialty.shortLabel,
      description: specialty.description,
      category: "cirurgica",
      status: "active",
      displayOrder: index,
      coordinationModel: specialty.coordinationModel,
      createdByUserId: null,
    };

    await db.insert(specialties).values(values).onDuplicateKeyUpdate({
      set: {
        name: values.name,
        shortLabel: values.shortLabel,
        description: values.description,
        category: values.category,
        status: values.status,
        displayOrder: values.displayOrder,
        coordinationModel: values.coordinationModel,
      },
    });
  }

  return db.select().from(specialties).orderBy(asc(specialties.displayOrder), asc(specialties.name));
}

async function seedTracks(specialtyIdBySlug: Map<string, number>) {
  const db = await requireDbConnection();

  for (const track of trackSeedBase) {
    const values: InsertTrack = {
      slug: track.slug,
      title: track.title,
      summary: track.summary,
      specialtyId: specialtyIdBySlug.get(track.specialtySlug) ?? null,
      difficulty: track.difficulty,
      estimatedHours: track.estimatedHours,
      status: "published",
      createdByUserId: null,
    };

    await db.insert(tracks).values(values).onDuplicateKeyUpdate({
      set: {
        title: values.title,
        summary: values.summary,
        specialtyId: values.specialtyId,
        difficulty: values.difficulty,
        estimatedHours: values.estimatedHours,
        status: values.status,
      },
    });
  }

  return db.select().from(tracks).orderBy(asc(tracks.title));
}

async function seedDocuments(specialtyIdBySlug: Map<string, number>, trackIdBySlug: Map<string, number>) {
  const db = await requireDbConnection();

  for (const document of documentSeedBase) {
    const values: InsertDocument = {
      slug: document.slug,
      title: document.title,
      description: document.description,
      documentType: document.documentType,
      specialtyId: specialtyIdBySlug.get(document.specialtySlug) ?? null,
      trackId: trackIdBySlug.get(document.trackSlug) ?? null,
      visibility: "restricted",
      status: "published",
      createdByUserId: null,
    };

    await db.insert(documents).values(values).onDuplicateKeyUpdate({
      set: {
        title: values.title,
        description: values.description,
        documentType: values.documentType,
        specialtyId: values.specialtyId,
        trackId: values.trackId,
        visibility: values.visibility,
        status: values.status,
      },
    });
  }
}

async function seedPartners() {
  const db = await requireDbConnection();

  for (const partner of partnerSeedBase) {
    const values: InsertPartner = {
      slug: partner.slug,
      name: partner.name,
      description: partner.description,
      partnerType: partner.partnerType,
      city: partner.city,
      state: partner.state,
      status: "active",
    };

    await db.insert(partners).values(values).onDuplicateKeyUpdate({
      set: {
        name: values.name,
        description: values.description,
        partnerType: values.partnerType,
        city: values.city,
        state: values.state,
        status: values.status,
      },
    });
  }

  return db.select().from(partners).orderBy(asc(partners.name));
}

async function seedInstitutions(partnerIdBySlug: Map<string, number>) {
  const db = await requireDbConnection();

  for (const institution of institutionSeedBase) {
    const values: InsertInstitution = {
      slug: institution.slug,
      name: institution.name,
      description: institution.description,
      institutionType: institution.institutionType,
      city: institution.city,
      state: institution.state,
      partnerId: partnerIdBySlug.get(institution.partnerSlug) ?? null,
      status: institution.status,
      capacityProfile: institution.capacityProfile,
      teachingProfile: institution.teachingProfile,
    };

    await db.insert(institutions).values(values).onDuplicateKeyUpdate({
      set: {
        name: values.name,
        description: values.description,
        institutionType: values.institutionType,
        city: values.city,
        state: values.state,
        partnerId: values.partnerId,
        status: values.status,
        capacityProfile: values.capacityProfile,
        teachingProfile: values.teachingProfile,
      },
    });
  }

  return db.select().from(institutions).orderBy(asc(institutions.name));
}

async function seedInstitutionSpecialties(
  institutionIdBySlug: Map<string, number>,
  specialtyIdBySlug: Map<string, number>
) {
  const db = await requireDbConnection();

  for (const institution of institutionSeedBase) {
    const institutionId = institutionIdBySlug.get(institution.slug);
    if (!institutionId) continue;

    for (const relation of institution.specialties) {
      const specialtyId = specialtyIdBySlug.get(relation.specialtySlug);
      if (!specialtyId) continue;

      const values: InsertInstitutionSpecialty = {
        institutionId,
        specialtyId,
        serviceModel: relation.serviceModel,
        status: relation.status,
      };

      await db.insert(institutionSpecialties).values(values).onDuplicateKeyUpdate({
        set: {
          serviceModel: values.serviceModel,
          status: values.status,
        },
      });
    }
  }
}

async function seedProfessionalProfiles(
  institutionIdBySlug: Map<string, number>,
  specialtyIdBySlug: Map<string, number>
) {
  const db = await requireDbConnection();

  for (const profile of professionalProfileSeedBase) {
    const values: InsertProfessionalProfile = {
      fullName: profile.fullName,
      roleTitle: profile.roleTitle,
      professionalType: profile.professionalType,
      institutionId: institutionIdBySlug.get(profile.institutionSlug) ?? null,
      specialtyId: specialtyIdBySlug.get(profile.specialtySlug) ?? null,
      credentialNumber: profile.credentialNumber,
      status: "active",
      userId: null,
    };

    const existing = await db
      .select({ id: professionalProfiles.id })
      .from(professionalProfiles)
      .where(eq(professionalProfiles.fullName, profile.fullName))
      .limit(1);

    if (existing[0]) {
      await db
        .update(professionalProfiles)
        .set(values)
        .where(eq(professionalProfiles.id, existing[0].id));
      continue;
    }

    await db.insert(professionalProfiles).values(values);
  }

  return db.select().from(professionalProfiles).orderBy(asc(professionalProfiles.fullName));
}

async function seedSurgicalTeams(
  institutionIdBySlug: Map<string, number>,
  specialtyIdBySlug: Map<string, number>
) {
  const db = await requireDbConnection();

  for (const team of surgicalTeamSeedBase) {
    const values: InsertSurgicalTeam = {
      slug: team.slug,
      name: team.name,
      institutionId: institutionIdBySlug.get(team.institutionSlug) ?? null,
      specialtyId: specialtyIdBySlug.get(team.specialtySlug) ?? null,
      teamType: team.teamType,
      operationalProfile: team.operationalProfile,
      membersCount: team.memberNames.length,
      status: team.status,
    };

    await db.insert(surgicalTeams).values(values).onDuplicateKeyUpdate({
      set: {
        name: values.name,
        institutionId: values.institutionId,
        specialtyId: values.specialtyId,
        teamType: values.teamType,
        operationalProfile: values.operationalProfile,
        membersCount: values.membersCount,
        status: values.status,
      },
    });
  }

  return db.select().from(surgicalTeams).orderBy(asc(surgicalTeams.name));
}

async function seedSurgicalTeamMembers(
  teamIdBySlug: Map<string, number>,
  professionalIdByName: Map<string, number>
) {
  const db = await requireDbConnection();

  for (const team of surgicalTeamSeedBase) {
    const teamId = teamIdBySlug.get(team.slug);
    if (!teamId) continue;

    for (const memberName of team.memberNames) {
      const professionalId = professionalIdByName.get(memberName);
      if (!professionalId) continue;

      const values: InsertSurgicalTeamMember = {
        surgicalTeamId: teamId,
        professionalProfileId: professionalId,
        membershipRole: memberName.includes("Coordenadora") ? "Coordenação" : "Equipe principal",
      };

      await db.insert(surgicalTeamMembers).values(values).onDuplicateKeyUpdate({
        set: {
          membershipRole: values.membershipRole,
        },
      });
    }
  }
}

async function seedGovernmentContracts(
  partnerIdBySlug: Map<string, number>,
  institutionIdBySlug: Map<string, number>,
  specialtyIdBySlug: Map<string, number>
) {
  const db = await requireDbConnection();

  for (const contract of governmentContractSeedBase) {
    const values: InsertGovernmentContract = {
      slug: contract.slug,
      title: contract.title,
      partnerId: partnerIdBySlug.get(contract.partnerSlug) ?? null,
      institutionId: institutionIdBySlug.get(contract.institutionSlug) ?? null,
      specialtyId: specialtyIdBySlug.get(contract.specialtySlug) ?? null,
      contractType: contract.contractType,
      scope: contract.scope,
      estimatedProcedures: contract.estimatedProcedures,
      status: contract.status,
    };

    await db.insert(governmentContracts).values(values).onDuplicateKeyUpdate({
      set: {
        title: values.title,
        partnerId: values.partnerId,
        institutionId: values.institutionId,
        specialtyId: values.specialtyId,
        contractType: values.contractType,
        scope: values.scope,
        estimatedProcedures: values.estimatedProcedures,
        status: values.status,
      },
    });
  }

  return db.select().from(governmentContracts).orderBy(asc(governmentContracts.title));
}

async function seedPatientQueueEntries(
  specialtyIdBySlug: Map<string, number>,
  institutionIdBySlug: Map<string, number>,
  contractIdBySlug: Map<string, number>
) {
  const db = await requireDbConnection();

  for (const entry of patientQueueSeedBase) {
    const values: InsertPatientQueueEntry = {
      patientCode: entry.patientCode,
      specialtyId: specialtyIdBySlug.get(entry.specialtySlug) ?? 0,
      institutionId: institutionIdBySlug.get(entry.institutionSlug) ?? null,
      contractId: entry.contractSlug ? (contractIdBySlug.get(entry.contractSlug) ?? null) : null,
      priority: entry.priority,
      pathway: entry.pathway,
      status: entry.status,
      waitingDays: entry.waitingDays,
      originCity: entry.originCity,
      originState: entry.originState,
    };

    if (!values.specialtyId) continue;

    await db.insert(patientQueueEntries).values(values).onDuplicateKeyUpdate({
      set: {
        specialtyId: values.specialtyId,
        institutionId: values.institutionId,
        contractId: values.contractId,
        priority: values.priority,
        pathway: values.pathway,
        status: values.status,
        waitingDays: values.waitingDays,
        originCity: values.originCity,
        originState: values.originState,
      },
    });
  }
}

export async function ensureSinaceBaseSeed() {
  if (!sinaceSeedPromise) {
    sinaceSeedPromise = (async () => {
      const db = await getDb();
      if (!db) return;

      const specialtyRows = await seedSpecialties();
      const specialtyIdBySlug = new Map(specialtyRows.map(item => [item.slug, item.id]));

      const trackRows = await seedTracks(specialtyIdBySlug);
      const trackIdBySlug = new Map(trackRows.map(item => [item.slug, item.id]));

      await seedDocuments(specialtyIdBySlug, trackIdBySlug);

      const partnerRows = await seedPartners();
      const partnerIdBySlug = new Map(partnerRows.map(item => [item.slug, item.id]));

      const institutionRows = await seedInstitutions(partnerIdBySlug);
      const institutionIdBySlug = new Map(institutionRows.map(item => [item.slug, item.id]));

      await seedInstitutionSpecialties(institutionIdBySlug, specialtyIdBySlug);

      const professionalRows = await seedProfessionalProfiles(institutionIdBySlug, specialtyIdBySlug);
      const professionalIdByName = new Map(professionalRows.map(item => [item.fullName, item.id]));

      const teamRows = await seedSurgicalTeams(institutionIdBySlug, specialtyIdBySlug);
      const teamIdBySlug = new Map(teamRows.map(item => [item.slug, item.id]));

      await seedSurgicalTeamMembers(teamIdBySlug, professionalIdByName);

      const contractRows = await seedGovernmentContracts(
        partnerIdBySlug,
        institutionIdBySlug,
        specialtyIdBySlug
      );
      const contractIdBySlug = new Map(contractRows.map(item => [item.slug, item.id]));

      await seedPatientQueueEntries(specialtyIdBySlug, institutionIdBySlug, contractIdBySlug);
    })().catch(error => {
      sinaceSeedPromise = null;
      throw error;
    });
  }

  return sinaceSeedPromise;
}

export type SpecialtyMutationInput = {
  name: string;
  shortLabel?: string | null;
  description?: string | null;
  category: "cirurgica" | "clinica" | "apoio";
  status: "draft" | "active" | "archived";
  displayOrder?: number | null;
  coordinationModel?: string | null;
  createdByUserId?: number | null;
};

async function requireDbConnection() {
  const db = await getDb();

  if (!db) {
    throw new Error("Banco de dados indisponível para operações persistentes do SINACE.");
  }

  return db;
}

async function getNextSpecialtyDisplayOrder() {
  const currentSpecialties = await listSpecialties();
  if (currentSpecialties.length === 0) return 0;

  return Math.max(...currentSpecialties.map(specialty => specialty.displayOrder ?? 0)) + 1;
}

export async function listSpecialties() {
  const db = await getDb();
  if (!db) return specialtyFallbackRows();

  await ensureSinaceBaseSeed();

  return db
    .select()
    .from(specialties)
    .orderBy(asc(specialties.displayOrder), asc(specialties.name));
}

export async function listSpecialtyOperationalOverview() {
  const db = await getDb();
  if (!db) {
    const catalogMap = getCatalogBySlug();
    return specialtyFallbackRows().map(item => {
      const catalog = catalogMap.get(item.slug);
      return {
        ...item,
        educationalFocus: catalog?.educationalFocus ?? null,
        operationalFocus: catalog?.operationalFocus ?? null,
        tracksCount: 0,
        documentsCount: 0,
        institutionsCount: 0,
        contractsCount: 0,
        queueCount: 0,
      };
    });
  }

  await ensureSinaceBaseSeed();

  const [
    specialtyRows,
    trackCounts,
    documentCounts,
    institutionCounts,
    contractCounts,
    queueCounts,
  ] = await Promise.all([
    listSpecialties(),
    db
      .select({ specialtyId: tracks.specialtyId, total: count() })
      .from(tracks)
      .groupBy(tracks.specialtyId),
    db
      .select({ specialtyId: documents.specialtyId, total: count() })
      .from(documents)
      .groupBy(documents.specialtyId),
    db
      .select({ specialtyId: institutionSpecialties.specialtyId, total: count() })
      .from(institutionSpecialties)
      .groupBy(institutionSpecialties.specialtyId),
    db
      .select({ specialtyId: governmentContracts.specialtyId, total: count() })
      .from(governmentContracts)
      .groupBy(governmentContracts.specialtyId),
    db
      .select({ specialtyId: patientQueueEntries.specialtyId, total: count() })
      .from(patientQueueEntries)
      .groupBy(patientQueueEntries.specialtyId),
  ]);

  const catalogMap = getCatalogBySlug();
  const toCountMap = (rows: Array<{ specialtyId: number | null; total: number }>) =>
    new Map(rows.filter(row => row.specialtyId != null).map(row => [row.specialtyId as number, row.total]));

  const trackCountBySpecialty = toCountMap(trackCounts);
  const documentCountBySpecialty = toCountMap(documentCounts);
  const institutionCountBySpecialty = toCountMap(institutionCounts);
  const contractCountBySpecialty = toCountMap(contractCounts);
  const queueCountBySpecialty = toCountMap(queueCounts);

  return specialtyRows.map(item => {
    const catalog = catalogMap.get(item.slug);
    return {
      ...item,
      educationalFocus: catalog?.educationalFocus ?? null,
      operationalFocus: catalog?.operationalFocus ?? null,
      tracksCount: trackCountBySpecialty.get(item.id) ?? 0,
      documentsCount: documentCountBySpecialty.get(item.id) ?? 0,
      institutionsCount: institutionCountBySpecialty.get(item.id) ?? 0,
      contractsCount: contractCountBySpecialty.get(item.id) ?? 0,
      queueCount: queueCountBySpecialty.get(item.id) ?? 0,
    };
  });
}

export async function listTracks() {
  const db = await getDb();
  if (!db) return [];

  await ensureSinaceBaseSeed();

  return db
    .select({
      id: tracks.id,
      slug: tracks.slug,
      title: tracks.title,
      summary: tracks.summary,
      difficulty: tracks.difficulty,
      estimatedHours: tracks.estimatedHours,
      status: tracks.status,
      specialtyId: tracks.specialtyId,
      specialtyName: specialties.name,
    })
    .from(tracks)
    .leftJoin(specialties, eq(tracks.specialtyId, specialties.id))
    .orderBy(asc(tracks.title));
}

export async function listDocuments() {
  const db = await getDb();
  if (!db) return [];

  await ensureSinaceBaseSeed();

  return db
    .select({
      id: documents.id,
      slug: documents.slug,
      title: documents.title,
      description: documents.description,
      documentType: documents.documentType,
      visibility: documents.visibility,
      status: documents.status,
      specialtyId: documents.specialtyId,
      specialtyName: specialties.name,
      specialtySlug: specialties.slug,
      trackId: documents.trackId,
      trackTitle: tracks.title,
      fileUrl: documents.fileUrl,
      fileName: documents.fileName,
      mimeType: documents.mimeType,
      fileSizeBytes: documents.fileSizeBytes,
      folderLabel: documents.folderLabel,
      contributorName: documents.contributorName,
      contributorInstitution: documents.contributorInstitution,
      contributorCredential: documents.contributorCredential,
      contributorType: documents.contributorType,
      uploadSource: documents.uploadSource,
      sourceUrl: documents.sourceUrl,
      createdAt: documents.createdAt,
      publishedAt: documents.publishedAt,
    })
    .from(documents)
    .leftJoin(specialties, eq(documents.specialtyId, specialties.id))
    .leftJoin(tracks, eq(documents.trackId, tracks.id))
    .orderBy(asc(documents.title));
}

export async function getEducationalDriveSnapshot() {
  const db = await getDb();
  if (!db) {
    return {
      metrics: {
        totalDocuments: 0,
        totalSpecialties: 0,
        externalContributors: 0,
        downloadsReady: 0,
      },
      specialties: [],
      featuredDocuments: [],
      latestDocuments: [],
    };
  }

  await ensureSinaceBaseSeed();

  const [specialtyRows, documentRows] = await Promise.all([
    db
      .select({
        id: specialties.id,
        slug: specialties.slug,
        name: specialties.name,
        shortLabel: specialties.shortLabel,
        description: specialties.description,
        displayOrder: specialties.displayOrder,
      })
      .from(specialties)
      .orderBy(asc(specialties.displayOrder), asc(specialties.name)),
    db
      .select({
        id: documents.id,
        slug: documents.slug,
        title: documents.title,
        description: documents.description,
        documentType: documents.documentType,
        visibility: documents.visibility,
        specialtyId: documents.specialtyId,
        specialtyName: specialties.name,
        specialtySlug: specialties.slug,
        sourceUrl: documents.sourceUrl,
        fileUrl: documents.fileUrl,
        fileName: documents.fileName,
        mimeType: documents.mimeType,
        fileSizeBytes: documents.fileSizeBytes,
        folderLabel: documents.folderLabel,
        contributorName: documents.contributorName,
        contributorInstitution: documents.contributorInstitution,
        contributorCredential: documents.contributorCredential,
        contributorType: documents.contributorType,
        uploadSource: documents.uploadSource,
        createdAt: documents.createdAt,
        publishedAt: documents.publishedAt,
      })
      .from(documents)
      .leftJoin(specialties, eq(documents.specialtyId, specialties.id))
      .where(eq(documents.status, "published"))
      .orderBy(desc(documents.publishedAt), desc(documents.createdAt), asc(documents.title)),
  ]);

  const documentsBySpecialty = new Map<number, typeof documentRows>();
  for (const row of documentRows) {
    if (row.specialtyId == null) continue;
    const current = documentsBySpecialty.get(row.specialtyId) ?? [];
    current.push(row);
    documentsBySpecialty.set(row.specialtyId, current);
  }

  const specialtyCards = specialtyRows.map(specialty => {
    const specialtyDocuments = documentsBySpecialty.get(specialty.id) ?? [];
    const foldersMap = new Map<string, typeof specialtyDocuments>();

    for (const document of specialtyDocuments) {
      const folderName = document.folderLabel?.trim() || "Geral";
      const current = foldersMap.get(folderName) ?? [];
      current.push(document);
      foldersMap.set(folderName, current);
    }

    const folders = Array.from(foldersMap.entries())
      .map(([folderLabel, folderDocuments]) => ({
        folderLabel,
        totalDocuments: folderDocuments.length,
        latestUploadAt: folderDocuments[0]?.publishedAt ?? folderDocuments[0]?.createdAt ?? null,
        documents: folderDocuments,
      }))
      .sort((a, b) => a.folderLabel.localeCompare(b.folderLabel, "pt-BR"));

    return {
      ...specialty,
      documentsCount: specialtyDocuments.length,
      contributorsCount: new Set(
        specialtyDocuments.map(item => item.contributorName?.trim()).filter(Boolean)
      ).size,
      lastPublishedAt: specialtyDocuments[0]?.publishedAt ?? specialtyDocuments[0]?.createdAt ?? null,
      folders,
    };
  });

  return {
    metrics: {
      totalDocuments: documentRows.length,
      totalSpecialties: specialtyRows.length,
      externalContributors: new Set(
        documentRows
          .filter(item => item.contributorType === "external")
          .map(item => item.contributorName?.trim() || `externo-${item.id}`)
      ).size,
      downloadsReady: documentRows.filter(item => Boolean(item.fileUrl)).length,
    },
    specialties: specialtyCards,
    featuredDocuments: documentRows.slice(0, 6),
    latestDocuments: documentRows.slice(0, 12),
  };
}

export async function createEducationalDriveDocument(
  input: {
    title: string;
    description?: string | null;
    specialtyId: number;
    folderLabel?: string | null;
    documentType: "protocol" | "guideline" | "manual" | "article" | "checklist" | "video" | "other";
    visibility?: "public" | "restricted" | "private";
    contributorName?: string | null;
    contributorInstitution?: string | null;
    contributorCredential?: string | null;
    contributorType?: "internal" | "external";
    fileName?: string | null;
    mimeType?: string | null;
    fileBase64?: string | null;
    sourceUrl?: string | null;
    createdByUserId: number;
  }
) {
  const db = await requireDbConnection();
  await ensureSinaceBaseSeed();

  const specialty = await db.select().from(specialties).where(eq(specialties.id, input.specialtyId)).limit(1);
  const specialtyRow = specialty[0];

  if (!specialtyRow) {
    throw new Error("Especialidade não encontrada para anexar o material educativo.");
  }

  const title = input.title.trim();
  if (!title) {
    throw new Error("O título do material educativo é obrigatório.");
  }

  const sourceUrl = sanitizeOptionalText(input.sourceUrl, 2048);
  const hasFilePayload = Boolean(input.fileBase64 && input.fileName);

  if (!hasFilePayload && !sourceUrl) {
    throw new Error("Envie um arquivo ou informe o link externo do material educativo.");
  }

  let normalizedFileName: string | null = null;
  let mimeType: string | null = sanitizeOptionalText(input.mimeType, 160);
  let fileSizeBytes: number | null = null;
  let uploadedFile: { key: string; url: string } | null = null;

  if (hasFilePayload) {
    const parsedFile = parseBase64FilePayload(input.fileBase64!);
    if (!parsedFile.buffer.byteLength) {
      throw new Error("O arquivo enviado está vazio.");
    }

    normalizedFileName = normalizeFileName(input.fileName!);
    mimeType = mimeType ?? parsedFile.mimeType ?? "application/octet-stream";
    fileSizeBytes = parsedFile.buffer.byteLength;
    const storageKey = buildEducationalDocumentStorageKey(specialtyRow.slug, normalizedFileName);
    uploadedFile = await storagePut(storageKey, parsedFile.buffer, mimeType);
  }

  const slugBase = slugify(title) || `material-${Date.now()}`;
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const values: InsertDocument = {
    slug,
    title,
    description: sanitizeOptionalText(input.description, 4000),
    documentType: input.documentType,
    specialtyId: specialtyRow.id,
    trackId: null,
    sourceUrl,
    fileKey: uploadedFile?.key ?? null,
    fileUrl: uploadedFile?.url ?? null,
    fileName: normalizedFileName,
    mimeType,
    fileSizeBytes,
    folderLabel: sanitizeOptionalText(input.folderLabel, 160) ?? specialtyRow.shortLabel ?? specialtyRow.name,
    contributorName: sanitizeOptionalText(input.contributorName, 180),
    contributorInstitution: sanitizeOptionalText(input.contributorInstitution, 180),
    contributorCredential: sanitizeOptionalText(input.contributorCredential, 120),
    contributorType: input.contributorType ?? "external",
    uploadSource: "submission",
    visibility: input.visibility ?? "restricted",
    status: "published",
    createdByUserId: input.createdByUserId,
    publishedAt: new Date(),
  };

  await db.insert(documents).values(values);

  const created = await db
    .select({
      id: documents.id,
      slug: documents.slug,
      title: documents.title,
      description: documents.description,
      documentType: documents.documentType,
      specialtyId: documents.specialtyId,
      specialtyName: specialties.name,
      specialtySlug: specialties.slug,
      sourceUrl: documents.sourceUrl,
      fileUrl: documents.fileUrl,
      fileName: documents.fileName,
      mimeType: documents.mimeType,
      fileSizeBytes: documents.fileSizeBytes,
      folderLabel: documents.folderLabel,
      contributorName: documents.contributorName,
      contributorInstitution: documents.contributorInstitution,
      contributorCredential: documents.contributorCredential,
      contributorType: documents.contributorType,
      uploadSource: documents.uploadSource,
      visibility: documents.visibility,
      status: documents.status,
      createdAt: documents.createdAt,
      publishedAt: documents.publishedAt,
    })
    .from(documents)
    .leftJoin(specialties, eq(documents.specialtyId, specialties.id))
    .where(eq(documents.slug, slug))
    .limit(1);

  return created[0] ?? null;
}

export async function listPartners() {
  const db = await getDb();
  if (!db) return [];

  await ensureSinaceBaseSeed();

  const [partnerRows, institutionCounts, contractCounts] = await Promise.all([
    db.select().from(partners).orderBy(asc(partners.name)),
    db.select({ partnerId: institutions.partnerId, total: count() }).from(institutions).groupBy(institutions.partnerId),
    db
      .select({ partnerId: governmentContracts.partnerId, total: count() })
      .from(governmentContracts)
      .groupBy(governmentContracts.partnerId),
  ]);

  const institutionCountByPartner = new Map(
    institutionCounts.filter(row => row.partnerId != null).map(row => [row.partnerId as number, row.total])
  );
  const contractCountByPartner = new Map(
    contractCounts.filter(row => row.partnerId != null).map(row => [row.partnerId as number, row.total])
  );

  return partnerRows.map(partner => ({
    ...partner,
    institutionsCount: institutionCountByPartner.get(partner.id) ?? 0,
    contractsCount: contractCountByPartner.get(partner.id) ?? 0,
  }));
}

export async function listInstitutions() {
  const db = await getDb();
  if (!db) return [];

  await ensureSinaceBaseSeed();

  const [institutionRows, specialtyRows, teamCounts] = await Promise.all([
    db
      .select({
        id: institutions.id,
        slug: institutions.slug,
        name: institutions.name,
        description: institutions.description,
        institutionType: institutions.institutionType,
        city: institutions.city,
        state: institutions.state,
        capacityProfile: institutions.capacityProfile,
        teachingProfile: institutions.teachingProfile,
        status: institutions.status,
        partnerId: institutions.partnerId,
        partnerName: partners.name,
      })
      .from(institutions)
      .leftJoin(partners, eq(institutions.partnerId, partners.id))
      .orderBy(asc(institutions.name)),
    db
      .select({
        institutionId: institutionSpecialties.institutionId,
        specialtyName: specialties.name,
        serviceModel: institutionSpecialties.serviceModel,
        relationStatus: institutionSpecialties.status,
      })
      .from(institutionSpecialties)
      .innerJoin(specialties, eq(institutionSpecialties.specialtyId, specialties.id))
      .orderBy(asc(specialties.displayOrder), asc(specialties.name)),
    db
      .select({ institutionId: surgicalTeams.institutionId, total: count() })
      .from(surgicalTeams)
      .groupBy(surgicalTeams.institutionId),
  ]);

  const specialtiesByInstitution = new Map<
    number,
    Array<{ name: string; serviceModel: string; relationStatus: string }>
  >();

  for (const row of specialtyRows) {
    const list = specialtiesByInstitution.get(row.institutionId) ?? [];
    list.push({
      name: row.specialtyName,
      serviceModel: row.serviceModel,
      relationStatus: row.relationStatus,
    });
    specialtiesByInstitution.set(row.institutionId, list);
  }

  const teamCountByInstitution = new Map(
    teamCounts.filter(row => row.institutionId != null).map(row => [row.institutionId as number, row.total])
  );

  return institutionRows.map(institution => ({
    ...institution,
    specialties: specialtiesByInstitution.get(institution.id) ?? [],
    specialtiesCount: (specialtiesByInstitution.get(institution.id) ?? []).length,
    teamsCount: teamCountByInstitution.get(institution.id) ?? 0,
  }));
}

export async function getOperationalDashboardSnapshot() {
  const db = await getDb();
  if (!db) {
    return {
      institutionalProfile: SINACE_INSTITUTIONAL_PROFILE,
      operationModalities: [...SINACE_OPERATION_MODALITIES],
      metrics: {
        specialties: SINACE_SPECIALTY_CATALOG.length,
        tracks: trackSeedBase.length,
        documents: documentSeedBase.length,
        partners: partnerSeedBase.length,
        institutions: institutionSeedBase.length,
        contracts: governmentContractSeedBase.length,
        queueEntries: patientQueueSeedBase.length,
        teams: surgicalTeamSeedBase.length,
      },
      latestSpecialties: specialtyFallbackRows().slice(0, 6),
      latestTracks: [],
      latestDocuments: [],
      latestInstitutions: [],
    };
  }

  await ensureSinaceBaseSeed();

  const [
    specialtyTotal,
    trackTotal,
    documentTotal,
    partnerTotal,
    institutionTotal,
    contractTotal,
    queueTotal,
    teamTotal,
    specialtiesList,
    tracksList,
    documentsList,
    institutionsList,
  ] = await Promise.all([
    db.select({ total: count() }).from(specialties),
    db.select({ total: count() }).from(tracks),
    db.select({ total: count() }).from(documents),
    db.select({ total: count() }).from(partners),
    db.select({ total: count() }).from(institutions),
    db.select({ total: count() }).from(governmentContracts),
    db.select({ total: count() }).from(patientQueueEntries),
    db.select({ total: count() }).from(surgicalTeams),
    listSpecialtyOperationalOverview(),
    listTracks(),
    listDocuments(),
    listInstitutions(),
  ]);

  return {
    institutionalProfile: SINACE_INSTITUTIONAL_PROFILE,
    operationModalities: [...SINACE_OPERATION_MODALITIES],
    metrics: {
      specialties: specialtyTotal[0]?.total ?? 0,
      tracks: trackTotal[0]?.total ?? 0,
      documents: documentTotal[0]?.total ?? 0,
      partners: partnerTotal[0]?.total ?? 0,
      institutions: institutionTotal[0]?.total ?? 0,
      contracts: contractTotal[0]?.total ?? 0,
      queueEntries: queueTotal[0]?.total ?? 0,
      teams: teamTotal[0]?.total ?? 0,
    },
    latestSpecialties: specialtiesList.slice(0, 6),
    latestTracks: tracksList.slice(0, 4),
    latestDocuments: documentsList.slice(0, 4),
    latestInstitutions: institutionsList.slice(0, 4),
  };
}

export async function getSpecialtyById(id: number) {
  const db = await getDb();
  if (!db) {
    return specialtyFallbackRows().find(specialty => specialty.id === id) ?? null;
  }

  await ensureSinaceBaseSeed();

  const result = await db.select().from(specialties).where(eq(specialties.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createSpecialty(input: SpecialtyMutationInput) {
  const db = await requireDbConnection();
  await ensureSinaceBaseSeed();

  const slug = slugify(input.name);
  const displayOrder = input.displayOrder ?? (await getNextSpecialtyDisplayOrder());

  await db.insert(specialties).values({
    slug,
    name: input.name,
    shortLabel: input.shortLabel ?? input.name,
    description: input.description ?? null,
    category: input.category,
    status: input.status,
    displayOrder,
    coordinationModel: input.coordinationModel ?? null,
    createdByUserId: input.createdByUserId ?? null,
  });

  const created = await db.select().from(specialties).where(eq(specialties.slug, slug)).limit(1);
  return created[0] ?? null;
}

export async function updateSpecialty(
  id: number,
  input: Partial<SpecialtyMutationInput> & { slug?: string | null }
) {
  const db = await requireDbConnection();
  await ensureSinaceBaseSeed();

  const current = await getSpecialtyById(id);
  if (!current) {
    return null;
  }

  const nextName = input.name ?? current.name;
  const nextSlug = input.slug?.trim() ? slugify(input.slug) : slugify(nextName);

  await db
    .update(specialties)
    .set({
      slug: nextSlug,
      name: nextName,
      shortLabel: input.shortLabel ?? current.shortLabel ?? nextName,
      description: input.description ?? current.description ?? null,
      category: input.category ?? current.category,
      status: input.status ?? current.status,
      displayOrder: input.displayOrder ?? current.displayOrder,
      coordinationModel: input.coordinationModel ?? current.coordinationModel ?? null,
    })
    .where(eq(specialties.id, id));

  return getSpecialtyById(id);
}

export async function reorderSpecialties(input: Array<{ id: number; displayOrder: number }>) {
  const db = await requireDbConnection();
  await ensureSinaceBaseSeed();

  for (const item of input) {
    await db
      .update(specialties)
      .set({ displayOrder: item.displayOrder })
      .where(eq(specialties.id, item.id));
  }

  return listSpecialties();
}

export async function listRecentQueueEntries(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  await ensureSinaceBaseSeed();
  return db
    .select({
      patientCode: patientQueueEntries.patientCode,
      priority: patientQueueEntries.priority,
      pathway: patientQueueEntries.pathway,
      status: patientQueueEntries.status,
      waitingDays: patientQueueEntries.waitingDays,
      originCity: patientQueueEntries.originCity,
      originState: patientQueueEntries.originState,
      specialtyName: specialties.name,
      institutionName: institutions.name,
    })
    .from(patientQueueEntries)
    .innerJoin(specialties, eq(patientQueueEntries.specialtyId, specialties.id))
    .leftJoin(institutions, eq(patientQueueEntries.institutionId, institutions.id))
    .orderBy(desc(patientQueueEntries.waitingDays), asc(patientQueueEntries.patientCode))
    .limit(limit);
}

const publicationFallbackRows = [
  {
    id: 0,
    slug: "ceo-reducao-filas-zero-cirurgicas",
    title: "Direção executiva para programas de redução de filas cirúrgicas",
    excerpt:
      "Atualização institucional orientada a demonstrar governança, previsibilidade operacional e integração entre rede pública, parceiros regionais e inteligência assistencial.",
    publicationType: "ceo_update",
    featured: "yes",
    visibility: "public",
    status: "published",
    specialtyId: null,
    specialtyName: null,
    authorProfileId: null,
    authorName: SINACE_INSTITUTIONAL_PROFILE.extendedName,
    publishedAt: new Date(),
    coverImageUrl: null,
  },
  {
    id: -1,
    slug: "relatorio-fluxogramas-e-expansao-institucional",
    title: "Fluxogramas hospitalares e expansão coordenada da capacidade cirúrgica",
    excerpt:
      "Relatório institucional para acompanhar desenho assistencial, jornada cirúrgica e leitura executiva dos gargalos por especialidade e território.",
    publicationType: "report",
    featured: "yes",
    visibility: "restricted",
    status: "published",
    specialtyId: null,
    specialtyName: null,
    authorProfileId: null,
    authorName: SINACE_INSTITUTIONAL_PROFILE.extendedName,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    coverImageUrl: null,
  },
  {
    id: -2,
    slug: "rede-sus-parceiros-e-operacao-cirurgica",
    title: "Rede SUS, parceiros institucionais e operação cirúrgica integrada",
    excerpt:
      "Panorama institucional para organizar a comunicação com esferas federal, estadual, municipal e regional dentro da plataforma SINACE.",
    publicationType: "institutional",
    featured: "no",
    visibility: "public",
    status: "published",
    specialtyId: null,
    specialtyName: null,
    authorProfileId: null,
    authorName: SINACE_INSTITUTIONAL_PROFILE.extendedName,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    coverImageUrl: null,
  },
] as const;

const mediaShowcaseFallbackRows = [
  {
    id: 0,
    slug: "midia-institucional-sinace",
    title: "Mostra institucional da operação SINACE",
    description:
      "Espaço para concentrar campanhas, fotos, vídeos, apresentações e materiais institucionais de expansão nacional.",
    mediaType: "document",
    moduleKey: "institutional-showcase",
    sourceUrl: null,
    fileUrl: null,
    visibility: "public",
    status: "published",
  },
] as const;

export async function listMedicalDirectory(limit?: number) {
  const db = await getDb();
  if (!db) return [];

  await ensureSinaceBaseSeed();

  const baseQuery = db
    .select({
      id: professionalProfiles.id,
      fullName: professionalProfiles.fullName,
      roleTitle: professionalProfiles.roleTitle,
      professionalType: professionalProfiles.professionalType,
      credentialNumber: professionalProfiles.credentialNumber,
      credentialState: professionalProfiles.credentialState,
      credentialAuthority: professionalProfiles.credentialAuthority,
      rqeNumber: professionalProfiles.rqeNumber,
      publicEmail: professionalProfiles.publicEmail,
      privateAccessEmail: professionalProfiles.privateAccessEmail,
      passwordAccessStatus: professionalProfiles.passwordAccessStatus,
      passwordRecoveryChannel: professionalProfiles.passwordRecoveryChannel,
      passwordLastUpdatedAt: professionalProfiles.passwordLastUpdatedAt,
      phone: professionalProfiles.phone,
      city: professionalProfiles.city,
      state: professionalProfiles.state,
      regionLabel: professionalProfiles.regionLabel,
      profileImageUrl: professionalProfiles.profileImageUrl,
      miniBio: professionalProfiles.miniBio,
      curriculumSummary: professionalProfiles.curriculumSummary,
      highlights: professionalProfiles.highlights,
      practiceAreas: professionalProfiles.practiceAreas,
      collaborationInterest: professionalProfiles.collaborationInterest,
      verificationStatus: professionalProfiles.verificationStatus,
      visibility: professionalProfiles.visibility,
      status: professionalProfiles.status,
      specialtyId: professionalProfiles.specialtyId,
      specialtyName: specialties.name,
      institutionId: professionalProfiles.institutionId,
      institutionName: institutions.name,
    })
    .from(professionalProfiles)
    .leftJoin(specialties, eq(professionalProfiles.specialtyId, specialties.id))
    .leftJoin(institutions, eq(professionalProfiles.institutionId, institutions.id))
    .where(eq(professionalProfiles.status, "active"))
    .orderBy(asc(specialties.name), asc(professionalProfiles.fullName));

  const [profileRows, connectionCounts, teamCounts] = await Promise.all([
    typeof limit === "number" ? baseQuery.limit(limit) : baseQuery,
    db
      .select({ profileId: profileConnections.targetProfileId, total: count() })
      .from(profileConnections)
      .where(eq(profileConnections.status, "accepted"))
      .groupBy(profileConnections.targetProfileId),
    db
      .select({ profileId: surgicalTeamMembers.professionalProfileId, total: count() })
      .from(surgicalTeamMembers)
      .groupBy(surgicalTeamMembers.professionalProfileId),
  ]);

  const connectionCountByProfile = new Map(
    connectionCounts.filter(row => row.profileId != null).map(row => [row.profileId as number, row.total])
  );
  const teamCountByProfile = new Map(
    teamCounts.filter(row => row.profileId != null).map(row => [row.profileId as number, row.total])
  );

  return profileRows.map(profile => ({
    ...profile,
    connectionsCount: connectionCountByProfile.get(profile.id) ?? 0,
    teamsCount: teamCountByProfile.get(profile.id) ?? 0,
  }));
}

function splitMultilineField(value: string | null | undefined) {
  return (value ?? "")
    .split(/\r?\n+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function serializeMultilineField(values: string[] | null | undefined) {
  if (!values || values.length === 0) return null;
  const normalized = values.map(item => item.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized.join("\n") : null;
}

async function getProfessionalProfileByUserId(userId: number) {
  const db = await requireDbConnection();

  const rows = await db
    .select({
      id: professionalProfiles.id,
      userId: professionalProfiles.userId,
      institutionId: professionalProfiles.institutionId,
      institutionName: institutions.name,
      specialtyId: professionalProfiles.specialtyId,
      specialtyName: specialties.name,
      fullName: professionalProfiles.fullName,
      roleTitle: professionalProfiles.roleTitle,
      professionalType: professionalProfiles.professionalType,
      credentialNumber: professionalProfiles.credentialNumber,
      credentialState: professionalProfiles.credentialState,
      credentialAuthority: professionalProfiles.credentialAuthority,
      rqeNumber: professionalProfiles.rqeNumber,
      publicEmail: professionalProfiles.publicEmail,
      privateAccessEmail: professionalProfiles.privateAccessEmail,
      passwordAccessStatus: professionalProfiles.passwordAccessStatus,
      passwordRecoveryChannel: professionalProfiles.passwordRecoveryChannel,
      passwordLastUpdatedAt: professionalProfiles.passwordLastUpdatedAt,
      phone: professionalProfiles.phone,
      city: professionalProfiles.city,
      state: professionalProfiles.state,
      regionLabel: professionalProfiles.regionLabel,
      profileImageUrl: professionalProfiles.profileImageUrl,
      miniBio: professionalProfiles.miniBio,
      curriculumSummary: professionalProfiles.curriculumSummary,
      highlights: professionalProfiles.highlights,
      practiceAreas: professionalProfiles.practiceAreas,
      collaborationInterest: professionalProfiles.collaborationInterest,
      verificationStatus: professionalProfiles.verificationStatus,
      visibility: professionalProfiles.visibility,
      status: professionalProfiles.status,
      createdAt: professionalProfiles.createdAt,
      updatedAt: professionalProfiles.updatedAt,
    })
    .from(professionalProfiles)
    .leftJoin(specialties, eq(professionalProfiles.specialtyId, specialties.id))
    .leftJoin(institutions, eq(professionalProfiles.institutionId, institutions.id))
    .where(eq(professionalProfiles.userId, userId))
    .limit(1);

  const profile = rows[0];
  if (!profile) return null;

  const [connections, teams] = await Promise.all([
    db
      .select({ total: count() })
      .from(profileConnections)
      .where(
        and(
          or(
            eq(profileConnections.requesterProfileId, profile.id),
            eq(profileConnections.targetProfileId, profile.id)
          ),
          eq(profileConnections.status, "accepted")
        )
      ),
    db
      .select({ total: count() })
      .from(surgicalTeamMembers)
      .where(eq(surgicalTeamMembers.professionalProfileId, profile.id)),
  ]);

  return {
    ...profile,
    highlightsList: splitMultilineField(profile.highlights),
    practiceAreasList: splitMultilineField(profile.practiceAreas),
    completionScore: [
      profile.fullName,
      profile.roleTitle,
      profile.specialtyId,
      profile.institutionId,
      profile.credentialNumber,
      profile.rqeNumber,
      profile.publicEmail,
      profile.privateAccessEmail,
      profile.passwordAccessStatus !== "not_started" ? profile.passwordAccessStatus : null,
      profile.passwordRecoveryChannel,
      profile.phone,
      profile.city,
      profile.state,
      profile.miniBio,
      profile.curriculumSummary,
      profile.highlights,
      profile.practiceAreas,
      profile.profileImageUrl,
    ].filter(Boolean).length * 100 / 18,
    connectionsCount: connections[0]?.total ?? 0,
    teamsCount: teams[0]?.total ?? 0,
  };
}

export async function getAuthenticatedMedicalWorkspace(userId: number) {
  const db = await requireDbConnection();
  await ensureSinaceBaseSeed();

  const profile = await getProfessionalProfileByUserId(userId);
  const specialtyId = profile?.specialtyId ?? null;

  const [specialtyAssets, specialtyTracks, specialtyDocuments, authoredPublications, specialtyCaseStudies, specialtyFlowcharts, networkHighlights, acceptedConnections] = await Promise.all([
    db
      .select({
        id: libraryAssets.id,
        slug: libraryAssets.slug,
        title: libraryAssets.title,
        description: libraryAssets.description,
        assetType: libraryAssets.assetType,
        visibility: libraryAssets.visibility,
        specialtyId: libraryAssets.specialtyId,
        specialtyName: specialties.name,
        sourceUrl: libraryAssets.sourceUrl,
        fileUrl: libraryAssets.fileUrl,
      })
      .from(libraryAssets)
      .leftJoin(specialties, eq(libraryAssets.specialtyId, specialties.id))
      .where(
        specialtyId
          ? and(eq(libraryAssets.status, "published"), eq(libraryAssets.specialtyId, specialtyId))
          : eq(libraryAssets.status, "published")
      )
      .orderBy(desc(libraryAssets.featured), desc(libraryAssets.createdAt))
      .limit(6),
    db
      .select({
        id: tracks.id,
        slug: tracks.slug,
        title: tracks.title,
        summary: tracks.summary,
        difficulty: tracks.difficulty,
        estimatedHours: tracks.estimatedHours,
        specialtyId: tracks.specialtyId,
        specialtyName: specialties.name,
      })
      .from(tracks)
      .leftJoin(specialties, eq(tracks.specialtyId, specialties.id))
      .where(
        specialtyId
          ? and(eq(tracks.status, "published"), eq(tracks.specialtyId, specialtyId))
          : eq(tracks.status, "published")
      )
      .orderBy(desc(tracks.createdAt))
      .limit(6),
    db
      .select({
        id: documents.id,
        slug: documents.slug,
        title: documents.title,
        description: documents.description,
        documentType: documents.documentType,
        specialtyId: documents.specialtyId,
        specialtyName: specialties.name,
        sourceUrl: documents.sourceUrl,
        fileUrl: documents.fileUrl,
      })
      .from(documents)
      .leftJoin(specialties, eq(documents.specialtyId, specialties.id))
      .where(
        specialtyId
          ? and(eq(documents.status, "published"), eq(documents.specialtyId, specialtyId))
          : eq(documents.status, "published")
      )
      .orderBy(desc(documents.createdAt))
      .limit(6),
    profile
      ? db
          .select({
            id: publications.id,
            slug: publications.slug,
            title: publications.title,
            excerpt: publications.excerpt,
            publicationType: publications.publicationType,
            publishedAt: publications.publishedAt,
            specialtyId: publications.specialtyId,
            specialtyName: specialties.name,
            coverImageUrl: publications.coverImageUrl,
          })
          .from(publications)
          .leftJoin(specialties, eq(publications.specialtyId, specialties.id))
          .where(
            and(
              eq(publications.status, "published"),
              or(
                eq(publications.authorProfileId, profile.id),
                specialtyId ? eq(publications.specialtyId, specialtyId) : undefined
              )
            )
          )
          .orderBy(desc(publications.publishedAt), desc(publications.createdAt))
          .limit(6)
      : [],
    db
      .select({
        id: caseStudies.id,
        slug: caseStudies.slug,
        title: caseStudies.title,
        summary: caseStudies.summary,
        clinicalFocus: caseStudies.clinicalFocus,
        complexity: caseStudies.complexity,
        specialtyName: specialties.name,
        institutionName: institutions.name,
      })
      .from(caseStudies)
      .leftJoin(specialties, eq(caseStudies.specialtyId, specialties.id))
      .leftJoin(institutions, eq(caseStudies.institutionId, institutions.id))
      .where(
        specialtyId
          ? and(eq(caseStudies.status, "published"), eq(caseStudies.specialtyId, specialtyId))
          : eq(caseStudies.status, "published")
      )
      .orderBy(desc(caseStudies.createdAt))
      .limit(6),
    db
      .select({
        id: flowcharts.id,
        slug: flowcharts.slug,
        title: flowcharts.title,
        summary: flowcharts.summary,
        diagramUrl: flowcharts.diagramUrl,
        specialtyName: specialties.name,
        institutionName: institutions.name,
      })
      .from(flowcharts)
      .leftJoin(specialties, eq(flowcharts.specialtyId, specialties.id))
      .leftJoin(institutions, eq(flowcharts.institutionId, institutions.id))
      .where(
        specialtyId
          ? and(eq(flowcharts.status, "published"), eq(flowcharts.specialtyId, specialtyId))
          : eq(flowcharts.status, "published")
      )
      .orderBy(desc(flowcharts.createdAt))
      .limit(6),
    db
      .select({
        id: professionalProfiles.id,
        fullName: professionalProfiles.fullName,
        roleTitle: professionalProfiles.roleTitle,
        professionalType: professionalProfiles.professionalType,
        specialtyName: specialties.name,
        institutionName: institutions.name,
        city: professionalProfiles.city,
        state: professionalProfiles.state,
        visibility: professionalProfiles.visibility,
        collaborationInterest: professionalProfiles.collaborationInterest,
      })
      .from(professionalProfiles)
      .leftJoin(specialties, eq(professionalProfiles.specialtyId, specialties.id))
      .leftJoin(institutions, eq(professionalProfiles.institutionId, institutions.id))
      .where(
        specialtyId
          ? and(
              eq(professionalProfiles.status, "active"),
              eq(professionalProfiles.visibility, "public"),
              eq(professionalProfiles.specialtyId, specialtyId)
            )
          : and(
              eq(professionalProfiles.status, "active"),
              eq(professionalProfiles.visibility, "public")
            )
      )
      .orderBy(asc(professionalProfiles.fullName))
      .limit(8),
    profile
      ? db
          .select({
            id: profileConnections.id,
            requesterProfileId: profileConnections.requesterProfileId,
            targetProfileId: profileConnections.targetProfileId,
            connectionType: profileConnections.connectionType,
            createdAt: profileConnections.createdAt,
          })
          .from(profileConnections)
          .where(
            and(
              or(
                eq(profileConnections.requesterProfileId, profile.id),
                eq(profileConnections.targetProfileId, profile.id)
              ),
              eq(profileConnections.status, "accepted")
            )
          )
          .orderBy(desc(profileConnections.createdAt))
          .limit(8)
      : [],
  ]);

  const connectionCounterpartIds = profile
    ? Array.from(
        new Set(
          acceptedConnections.map(connection =>
            connection.requesterProfileId === profile.id
              ? connection.targetProfileId
              : connection.requesterProfileId
          )
        )
      )
    : [];

  const connectionCounterparts =
    connectionCounterpartIds.length > 0
      ? await db
          .select({
            id: professionalProfiles.id,
            fullName: professionalProfiles.fullName,
            roleTitle: professionalProfiles.roleTitle,
            professionalType: professionalProfiles.professionalType,
            specialtyName: specialties.name,
            institutionName: institutions.name,
            city: professionalProfiles.city,
            state: professionalProfiles.state,
            collaborationInterest: professionalProfiles.collaborationInterest,
          })
          .from(professionalProfiles)
          .leftJoin(specialties, eq(professionalProfiles.specialtyId, specialties.id))
          .leftJoin(institutions, eq(professionalProfiles.institutionId, institutions.id))
          .where(or(...connectionCounterpartIds.map(id => eq(professionalProfiles.id, id))))
      : [];

  const counterpartById = new Map(connectionCounterparts.map(item => [item.id, item]));

  const connections = profile
    ? acceptedConnections
        .map(connection => {
          const counterpartId =
            connection.requesterProfileId === profile.id
              ? connection.targetProfileId
              : connection.requesterProfileId;
          const counterpart = counterpartById.get(counterpartId);

          if (!counterpart) return null;

          return {
            id: connection.id,
            connectionType: connection.connectionType,
            createdAt: connection.createdAt,
            profileId: counterpart.id,
            fullName: counterpart.fullName,
            roleTitle: counterpart.roleTitle,
            professionalType: counterpart.professionalType,
            specialtyName: counterpart.specialtyName,
            institutionName: counterpart.institutionName,
            city: counterpart.city,
            state: counterpart.state,
            collaborationInterest: counterpart.collaborationInterest,
          };
        })
        .filter(Boolean)
    : [];

  const completionChecklist = [
    {
      key: "identidade",
      title: "Identidade profissional definida",
      done: Boolean(profile?.fullName && profile?.roleTitle && profile?.professionalType),
    },
    {
      key: "credenciais",
      title: "Credenciais e conselho preenchidos",
      done: Boolean(profile?.credentialNumber && profile?.credentialState),
    },
    {
      key: "especialidade",
      title: "Especialidade e instituição associadas",
      done: Boolean(profile?.specialtyId && profile?.institutionId),
    },
    {
      key: "biografia",
      title: "Mini bio e resumo curricular publicados",
      done: Boolean(profile?.miniBio && profile?.curriculumSummary),
    },
    {
      key: "areas",
      title: "Áreas de atuação e destaques definidos",
      done: Boolean(profile?.practiceAreasList?.length && profile?.highlightsList?.length),
    },
    {
      key: "contato",
      title: "Contato profissional disponível",
      done: Boolean(profile?.publicEmail && profile?.phone),
    },
    {
      key: "acesso",
      title: "Acesso privado por senha preparado",
      done: Boolean(
        profile?.privateAccessEmail
          && profile?.passwordAccessStatus
          && profile.passwordAccessStatus !== "not_started"
      ),
    },
    {
      key: "visibilidade",
      title: "Perfil apto para descoberta na rede",
      done: Boolean(profile?.visibility && profile.visibility !== "private"),
    },
  ];

  const completedSteps = completionChecklist.filter(item => item.done).length;
  const completionScore = completionChecklist.length
    ? Math.round((completedSteps / completionChecklist.length) * 100)
    : 0;

  const onboardingStage = !profile
    ? "start"
    : completionScore < 40
      ? "profile"
      : completionScore < 75
        ? "credentials"
        : "network";

  const nextAction = !profile
    ? "Crie seu perfil profissional para desbloquear o drive por especialidade e a descoberta na rede SINACE."
    : completionScore < 40
      ? "Complete identidade, especialidade e conselho profissional para ativar seu onboarding médico."
      : completionScore < 75
        ? "Publique bio, currículo, acesso privado e áreas de atuação para elevar sua prontidão institucional."
        : "Seu perfil já está maduro para networking, publicações e colaboração assistencial.";

  return {
    profile,
    completionScore,
    onboarding: {
      stage: onboardingStage,
      completedSteps,
      totalSteps: completionChecklist.length,
      nextAction,
      checklist: completionChecklist,
    },
    quickStats: {
      curatedAssets: specialtyAssets.length,
      learningTracks: specialtyTracks.length,
      documents: specialtyDocuments.length,
      publications: authoredPublications.length,
      caseStudies: specialtyCaseStudies.length,
      flowcharts: specialtyFlowcharts.length,
      connections: connections.length,
    },
    featureFlags: {
      hasProfile: Boolean(profile),
      needsOnboarding: !profile || completionScore < 75,
      driveReady: Boolean(specialtyId),
      canPublish: completionScore >= 55,
      canConnect: Boolean(profile && profile.visibility !== "private"),
    },
    libraryAssets: specialtyAssets,
    tracks: specialtyTracks,
    documents: specialtyDocuments,
    publications: authoredPublications,
    caseStudies: specialtyCaseStudies,
    flowcharts: specialtyFlowcharts,
    connections,
    networkHighlights: networkHighlights.filter(candidate => candidate.id !== profile?.id),
    drive: {
      specialtyLabel: profile?.specialtyName ?? null,
      assets: specialtyAssets,
      tracks: specialtyTracks,
      documents: specialtyDocuments,
      publications: authoredPublications,
      caseStudies: specialtyCaseStudies,
      flowcharts: specialtyFlowcharts,
    },
  };
}

export async function upsertAuthenticatedProfessionalProfile(
  userId: number,
  input: {
    fullName: string;
    roleTitle: string;
    professionalType: "surgeon" | "anesthesiologist" | "nurse" | "coordinator" | "faculty" | "resident" | "student" | "manager";
    institutionId?: number | null;
    specialtyId?: number | null;
    credentialNumber?: string | null;
    credentialState?: string | null;
    credentialAuthority?: string | null;
    rqeNumber?: string | null;
    publicEmail?: string | null;
    privateAccessEmail?: string | null;
    passwordAccessStatus?: "not_started" | "ready" | "recovery" | "managed";
    passwordRecoveryChannel?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    regionLabel?: string | null;
    profileImageUrl?: string | null;
    miniBio?: string | null;
    curriculumSummary?: string | null;
    highlights?: string[] | null;
    practiceAreas?: string[] | null;
    collaborationInterest?: "low" | "medium" | "high";
    visibility?: "public" | "restricted" | "private";
  }
) {
  const db = await requireDbConnection();
  await ensureSinaceBaseSeed();

  const trimmedPublicEmail = input.publicEmail?.trim() || null;
  const trimmedPrivateAccessEmail = input.privateAccessEmail?.trim() || trimmedPublicEmail;
  const trimmedPasswordRecoveryChannel = input.passwordRecoveryChannel?.trim() || null;
  const resolvedPasswordAccessStatus = input.passwordAccessStatus
    ?? (trimmedPrivateAccessEmail ? "ready" : "not_started");

  const payload: InsertProfessionalProfile = {
    userId,
    institutionId: input.institutionId ?? null,
    specialtyId: input.specialtyId ?? null,
    fullName: input.fullName.trim(),
    roleTitle: input.roleTitle.trim(),
    professionalType: input.professionalType,
    credentialNumber: input.credentialNumber?.trim() || null,
    credentialState: input.credentialState?.trim() || null,
    credentialAuthority: input.credentialAuthority?.trim() || null,
    rqeNumber: input.rqeNumber?.trim() || null,
    publicEmail: trimmedPublicEmail,
    privateAccessEmail: trimmedPrivateAccessEmail,
    passwordAccessStatus: resolvedPasswordAccessStatus,
    passwordRecoveryChannel: trimmedPasswordRecoveryChannel,
    passwordLastUpdatedAt: resolvedPasswordAccessStatus === "not_started" ? null : new Date(),
    phone: input.phone?.trim() || null,
    city: input.city?.trim() || null,
    state: input.state?.trim() || null,
    regionLabel: input.regionLabel?.trim() || null,
    profileImageUrl: input.profileImageUrl?.trim() || null,
    miniBio: input.miniBio?.trim() || null,
    curriculumSummary: input.curriculumSummary?.trim() || null,
    highlights: serializeMultilineField(input.highlights),
    practiceAreas: serializeMultilineField(input.practiceAreas),
    collaborationInterest: input.collaborationInterest ?? "medium",
    visibility: input.visibility ?? "private",
    verificationStatus: "pending",
    status: "active",
  };

  const existing = await db
    .select({ id: professionalProfiles.id })
    .from(professionalProfiles)
    .where(eq(professionalProfiles.userId, userId))
    .limit(1);

  if (existing[0]) {
    await db
      .update(professionalProfiles)
      .set(payload)
      .where(eq(professionalProfiles.id, existing[0].id));
  } else {
    await db.insert(professionalProfiles).values(payload);
  }

  return getAuthenticatedMedicalWorkspace(userId);
}

export async function getMedicalNetworkSnapshot() {
  const db = await getDb();
  if (!db) {
    return {
      metrics: {
        professionals: 0,
        verifiedProfiles: 0,
        specialties: SINACE_SPECIALTY_CATALOG.length,
        institutions: institutionSeedBase.length,
        acceptedConnections: 0,
      },
      featuredProfiles: [],
    };
  }

  await ensureSinaceBaseSeed();

  const [directory, profileTotal, verifiedTotal, connectionTotal, institutionTotal] = await Promise.all([
    listMedicalDirectory(8),
    db.select({ total: count() }).from(professionalProfiles),
    db
      .select({ total: count() })
      .from(professionalProfiles)
      .where(eq(professionalProfiles.verificationStatus, "verified")),
    db.select({ total: count() }).from(profileConnections).where(eq(profileConnections.status, "accepted")),
    db.select({ total: count() }).from(institutions),
  ]);

  return {
    metrics: {
      professionals: profileTotal[0]?.total ?? 0,
      verifiedProfiles: verifiedTotal[0]?.total ?? 0,
      specialties: SINACE_SPECIALTY_CATALOG.length,
      institutions: institutionTotal[0]?.total ?? 0,
      acceptedConnections: connectionTotal[0]?.total ?? 0,
    },
    featuredProfiles: directory,
  };
}

export async function listInstitutionalPublications(limit = 6) {
  const db = await getDb();
  if (!db) return publicationFallbackRows.slice(0, limit);

  await ensureSinaceBaseSeed();

  const rows = await db
    .select({
      id: publications.id,
      slug: publications.slug,
      title: publications.title,
      excerpt: publications.excerpt,
      publicationType: publications.publicationType,
      featured: publications.featured,
      visibility: publications.visibility,
      status: publications.status,
      specialtyId: publications.specialtyId,
      specialtyName: specialties.name,
      authorProfileId: publications.authorProfileId,
      authorName: professionalProfiles.fullName,
      publishedAt: publications.publishedAt,
      coverImageUrl: publications.coverImageUrl,
    })
    .from(publications)
    .leftJoin(specialties, eq(publications.specialtyId, specialties.id))
    .leftJoin(professionalProfiles, eq(publications.authorProfileId, professionalProfiles.id))
    .where(eq(publications.status, "published"))
    .orderBy(desc(publications.publishedAt), desc(publications.createdAt))
    .limit(limit);

  return rows.length > 0 ? rows : publicationFallbackRows.slice(0, limit);
}

export async function listMediaShowcaseItems(limit = 8) {
  const db = await getDb();
  if (!db) return mediaShowcaseFallbackRows.slice(0, limit);

  await ensureSinaceBaseSeed();

  const rows = await db
    .select({
      id: mediaShowcaseItems.id,
      slug: mediaShowcaseItems.slug,
      title: mediaShowcaseItems.title,
      description: mediaShowcaseItems.description,
      mediaType: mediaShowcaseItems.mediaType,
      moduleKey: mediaShowcaseItems.moduleKey,
      sourceUrl: mediaShowcaseItems.sourceUrl,
      fileUrl: mediaShowcaseItems.fileUrl,
      visibility: mediaShowcaseItems.visibility,
      status: mediaShowcaseItems.status,
    })
    .from(mediaShowcaseItems)
    .where(eq(mediaShowcaseItems.status, "published"))
    .orderBy(desc(mediaShowcaseItems.createdAt))
    .limit(limit);

  return rows.length > 0 ? rows : mediaShowcaseFallbackRows.slice(0, limit);
}

export async function getKnowledgeHubSnapshot() {
  const db = await getDb();
  if (!db) {
    return {
      metrics: {
        tracks: trackSeedBase.length,
        documents: documentSeedBase.length,
        libraryAssets: 0,
        caseStudies: 0,
        flowcharts: 0,
      },
      latestTracks: [],
      latestDocuments: [],
      featuredAssets: [],
      featuredCaseStudies: [],
      featuredFlowcharts: [],
    };
  }

  await ensureSinaceBaseSeed();

  const [
    trackTotal,
    documentTotal,
    assetTotal,
    caseStudyTotal,
    flowchartTotal,
    tracksList,
    documentsList,
    assetsList,
    caseStudiesList,
    flowchartsList,
  ] = await Promise.all([
    db.select({ total: count() }).from(tracks),
    db.select({ total: count() }).from(documents),
    db.select({ total: count() }).from(libraryAssets),
    db.select({ total: count() }).from(caseStudies),
    db.select({ total: count() }).from(flowcharts),
    listTracks(),
    listDocuments(),
    db
      .select({
        id: libraryAssets.id,
        slug: libraryAssets.slug,
        title: libraryAssets.title,
        description: libraryAssets.description,
        assetType: libraryAssets.assetType,
        visibility: libraryAssets.visibility,
        status: libraryAssets.status,
        featured: libraryAssets.featured,
        specialtyId: libraryAssets.specialtyId,
        specialtyName: specialties.name,
        publicationId: libraryAssets.publicationId,
      })
      .from(libraryAssets)
      .leftJoin(specialties, eq(libraryAssets.specialtyId, specialties.id))
      .where(eq(libraryAssets.status, "published"))
      .orderBy(desc(libraryAssets.createdAt))
      .limit(6),
    db
      .select({
        id: caseStudies.id,
        slug: caseStudies.slug,
        title: caseStudies.title,
        summary: caseStudies.summary,
        clinicalFocus: caseStudies.clinicalFocus,
        complexity: caseStudies.complexity,
        status: caseStudies.status,
        specialtyId: caseStudies.specialtyId,
        specialtyName: specialties.name,
        institutionId: caseStudies.institutionId,
        institutionName: institutions.name,
        authorProfileId: caseStudies.authorProfileId,
        authorName: professionalProfiles.fullName,
      })
      .from(caseStudies)
      .leftJoin(specialties, eq(caseStudies.specialtyId, specialties.id))
      .leftJoin(institutions, eq(caseStudies.institutionId, institutions.id))
      .leftJoin(professionalProfiles, eq(caseStudies.authorProfileId, professionalProfiles.id))
      .where(eq(caseStudies.status, "published"))
      .orderBy(desc(caseStudies.createdAt))
      .limit(6),
    db
      .select({
        id: flowcharts.id,
        slug: flowcharts.slug,
        title: flowcharts.title,
        summary: flowcharts.summary,
        diagramUrl: flowcharts.diagramUrl,
        visibility: flowcharts.visibility,
        status: flowcharts.status,
        specialtyId: flowcharts.specialtyId,
        specialtyName: specialties.name,
        institutionId: flowcharts.institutionId,
        institutionName: institutions.name,
      })
      .from(flowcharts)
      .leftJoin(specialties, eq(flowcharts.specialtyId, specialties.id))
      .leftJoin(institutions, eq(flowcharts.institutionId, institutions.id))
      .where(eq(flowcharts.status, "published"))
      .orderBy(desc(flowcharts.createdAt))
      .limit(6),
  ]);

  return {
    metrics: {
      tracks: trackTotal[0]?.total ?? 0,
      documents: documentTotal[0]?.total ?? 0,
      libraryAssets: assetTotal[0]?.total ?? 0,
      caseStudies: caseStudyTotal[0]?.total ?? 0,
      flowcharts: flowchartTotal[0]?.total ?? 0,
    },
    latestTracks: tracksList.slice(0, 6),
    latestDocuments: documentsList.slice(0, 6),
    featuredAssets: assetsList,
    featuredCaseStudies: caseStudiesList,
    featuredFlowcharts: flowchartsList,
  };
}

export async function getInstitutionalEcosystemSnapshot() {
  const db = await getDb();
  if (!db) {
    return {
      metrics: {
        partners: partnerSeedBase.length,
        institutions: institutionSeedBase.length,
        contracts: governmentContractSeedBase.length,
      },
      latestPartners: [],
      latestInstitutions: [],
    };
  }

  await ensureSinaceBaseSeed();

  const [partnerTotal, institutionTotal, contractTotal, partnerRows, institutionRows] = await Promise.all([
    db.select({ total: count() }).from(partners),
    db.select({ total: count() }).from(institutions),
    db.select({ total: count() }).from(governmentContracts),
    listPartners(),
    listInstitutions(),
  ]);

  return {
    metrics: {
      partners: partnerTotal[0]?.total ?? 0,
      institutions: institutionTotal[0]?.total ?? 0,
      contracts: contractTotal[0]?.total ?? 0,
    },
    latestPartners: partnerRows.slice(0, 8),
    latestInstitutions: institutionRows.slice(0, 6),
  };
}

