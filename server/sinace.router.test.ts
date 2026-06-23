import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  ensureSinaceBaseSeed: vi.fn(async () => undefined),
  getOperationalDashboardSnapshot: vi.fn(async () => ({
    institutionalProfile: {
      mission: "Reduzir filas cirúrgicas com estrutura e governança.",
    },
    operationModalities: ["Mutirões estruturados", "Linhas eletivas regionais"],
    metrics: {
      specialties: 19,
      tracks: 8,
      documents: 14,
      partners: 3,
      institutions: 5,
      contracts: 4,
      queueEntries: 12,
      teams: 6,
    },
    latestSpecialties: [
      {
        id: 1,
        slug: "cirurgia-geral",
        name: "Cirurgia geral",
      },
    ],
    latestTracks: [
      {
        id: 10,
        title: "Governança da fila cirúrgica",
      },
    ],
    latestDocuments: [
      {
        id: 20,
        title: "Diretriz de acesso cirúrgico",
      },
    ],
    latestInstitutions: [
      {
        id: 30,
        name: "Hospital Estadual Piloto",
      },
    ],
  })),
  listSpecialties: vi.fn(async () => [
    {
      id: 1,
      slug: "cirurgia-geral",
      name: "Cirurgia geral",
      shortLabel: "Cirurgia geral",
      description: "Base de governança da fila cirúrgica.",
      category: "cirurgica" as const,
      status: "active" as const,
      displayOrder: 0,
      coordinationModel: null,
      createdByUserId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    {
      id: 2,
      slug: "neurocirurgia",
      name: "Neurocirurgia",
      shortLabel: "Neurocirurgia",
      description: "Linha de alta complexidade.",
      category: "cirurgica" as const,
      status: "active" as const,
      displayOrder: 1,
      coordinationModel: null,
      createdByUserId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  ]),
  listSpecialtyOperationalOverview: vi.fn(async () => [
    {
      id: 1,
      slug: "cirurgia-geral",
      name: "Cirurgia geral",
      shortLabel: "Cirurgia geral",
      description: "Base de governança da fila cirúrgica.",
      category: "cirurgica" as const,
      status: "active" as const,
      displayOrder: 0,
      coordinationModel: "Coordenação de acesso cirúrgico",
      createdByUserId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      educationalFocus: "Trilhas introdutórias de acesso cirúrgico.",
      operationalFocus: "Leitura da fila reprimida e mutirões organizados.",
      tracksCount: 3,
      documentsCount: 5,
      institutionsCount: 2,
      contractsCount: 1,
      queueCount: 4,
    },
    {
      id: 2,
      slug: "neurocirurgia",
      name: "Neurocirurgia",
      shortLabel: "Neurocirurgia",
      description: "Linha de alta complexidade.",
      category: "cirurgica" as const,
      status: "draft" as const,
      displayOrder: 1,
      coordinationModel: "Coordenação de alta complexidade",
      createdByUserId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      educationalFocus: "Curadoria de protocolos avançados.",
      operationalFocus: "Organização de referência regional.",
      tracksCount: 1,
      documentsCount: 2,
      institutionsCount: 1,
      contractsCount: 1,
      queueCount: 2,
    },
  ]),
  listTracks: vi.fn(async () => [
    {
      id: 10,
      slug: "governanca-da-fila-cirurgica",
      title: "Governança da fila cirúrgica",
      summary: "Leitura da demanda reprimida.",
      difficulty: "intro" as const,
      estimatedHours: 12,
      status: "published" as const,
      specialtyId: 1,
      specialtyName: "Cirurgia geral",
    },
  ]),
  listDocuments: vi.fn(async () => [
    {
      id: 20,
      slug: "diretriz-inicial-de-organizacao-da-fila-cirurgica",
      title: "Diretriz inicial de organização da fila cirúrgica",
      description: "Documento-base da operação.",
      documentType: "guideline" as const,
      visibility: "restricted" as const,
      status: "published" as const,
      specialtyId: 1,
      specialtyName: "Cirurgia geral",
      trackId: 10,
      trackTitle: "Governança da fila cirúrgica",
    },
  ]),
  getEducationalDriveSnapshot: vi.fn(async () => ({
    metrics: {
      totalDocuments: 3,
      totalSpecialties: 2,
      externalContributors: 2,
      downloadsReady: 3,
    },
    specialties: [
      {
        id: 1,
        slug: "cirurgia-geral",
        name: "Cirurgia geral",
        shortLabel: "Cirurgia geral",
        description: "Acervo-base da governança cirúrgica.",
        documentsCount: 2,
        lastPublishedAt: new Date("2026-04-01T00:00:00.000Z"),
        folders: [
          {
            folderLabel: "Estudos clínicos",
            totalDocuments: 1,
            documents: [
              {
                id: 901,
                title: "Guia de preparo pré-operatório",
                description: "Material para conduta educativa da equipe.",
                documentType: "guideline" as const,
                specialtyName: "Cirurgia geral",
                fileName: "preparo-pre-operatorio.pdf",
                fileSizeBytes: 345678,
                fileUrl: "https://cdn.sinace.app/preparo-pre-operatorio.pdf",
                contributorName: "Dra. Helena Martins",
                contributorInstitution: "Hospital Estadual Piloto",
                publishedAt: new Date("2026-04-01T00:00:00.000Z"),
                createdAt: new Date("2026-04-01T00:00:00.000Z"),
              },
            ],
          },
        ],
      },
      {
        id: 2,
        slug: "neurocirurgia",
        name: "Neurocirurgia",
        shortLabel: "Neurocirurgia",
        description: "Documentação de alta complexidade.",
        documentsCount: 1,
        lastPublishedAt: new Date("2026-04-02T00:00:00.000Z"),
        folders: [
          {
            folderLabel: "Protocolos avançados",
            totalDocuments: 1,
            documents: [
              {
                id: 902,
                title: "Checklist de neuroanestesia",
                description: "Checklist compartilhado para casos complexos.",
                documentType: "checklist" as const,
                specialtyName: "Neurocirurgia",
                fileName: "checklist-neuroanestesia.pdf",
                fileSizeBytes: 221000,
                fileUrl: "https://cdn.sinace.app/checklist-neuroanestesia.pdf",
                contributorName: "Dr. Rafael Souza",
                contributorInstitution: "Rede Estadual Piloto",
                publishedAt: new Date("2026-04-02T00:00:00.000Z"),
                createdAt: new Date("2026-04-02T00:00:00.000Z"),
              },
            ],
          },
        ],
      },
    ],
    featuredDocuments: [
      {
        id: 901,
        title: "Guia de preparo pré-operatório",
        description: "Material para conduta educativa da equipe.",
        documentType: "guideline" as const,
        specialtyName: "Cirurgia geral",
        contributorName: "Dra. Helena Martins",
        fileSizeBytes: 345678,
        fileUrl: "https://cdn.sinace.app/preparo-pre-operatorio.pdf",
        publishedAt: new Date("2026-04-01T00:00:00.000Z"),
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
      },
    ],
    latestDocuments: [
      {
        id: 902,
        title: "Checklist de neuroanestesia",
        description: "Checklist compartilhado para casos complexos.",
        documentType: "checklist" as const,
        specialtyName: "Neurocirurgia",
        contributorName: "Dr. Rafael Souza",
        fileSizeBytes: 221000,
        fileUrl: "https://cdn.sinace.app/checklist-neuroanestesia.pdf",
        publishedAt: new Date("2026-04-02T00:00:00.000Z"),
        createdAt: new Date("2026-04-02T00:00:00.000Z"),
      },
    ],
  })),
  createEducationalDriveDocument: vi.fn(async input => ({
    id: 999,
    slug: "estudo-enviado-externamente",
    title: input.title,
    description: input.description ?? null,
    documentType: input.documentType,
    visibility: input.visibility ?? "restricted",
    status: "published" as const,
    specialtyId: input.specialtyId,
    specialtyName: "Cirurgia geral",
    fileName: input.fileName,
    mimeType: input.mimeType ?? "application/pdf",
    fileUrl: "https://cdn.sinace.app/estudo-enviado-externamente.pdf",
    fileSizeBytes: 409600,
    contributorName: input.contributorName ?? null,
    contributorInstitution: input.contributorInstitution ?? null,
    contributorCredential: input.contributorCredential ?? null,
    contributorType: input.contributorType ?? "external",
    folderLabel: input.folderLabel ?? "Estudos clínicos",
    createdByUserId: input.createdByUserId,
    publishedAt: new Date("2026-04-03T00:00:00.000Z"),
    createdAt: new Date("2026-04-03T00:00:00.000Z"),
  })),
  listPartners: vi.fn(async () => [
    {
      id: 30,
      slug: "rede-estadual-piloto",
      name: "Rede Estadual Piloto",
      description: "Contratante público inicial.",
      partnerType: "government" as const,
      websiteUrl: null,
      city: null,
      state: "SP",
      status: "active" as const,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  ]),
  listInstitutions: vi.fn(async () => [
    {
      id: 40,
      slug: "hospital-estadual-piloto",
      name: "Hospital Estadual Piloto",
      description: "Unidade de referência regional.",
      institutionType: "hospital_publico",
      city: "São Paulo",
      state: "SP",
      capacityProfile: "Centro cirúrgico com expansão eletiva.",
      teachingProfile: "Integra ensino e preceptoria.",
      status: "active",
      partnerId: 30,
      partnerName: "Rede Estadual Piloto",
      specialtiesCount: 4,
      teamsCount: 2,
    },
  ]),
  listRecentQueueEntries: vi.fn(async () => [
    {
      patientCode: "SIN-001",
      priority: "priority",
      pathway: "Mutirão estadual",
      status: "waiting",
      waitingDays: 126,
      originCity: "Campinas",
      originState: "SP",
      specialtyName: "Cirurgia geral",
      institutionName: "Hospital Estadual Piloto",
    },
  ]),
  listMedicalDirectory: vi.fn(async (limit?: number) => [
    {
      id: 101,
      fullName: "Dra. Helena Martins",
      roleTitle: "Cirurgiã geral",
      credentialHeadline: "CRM-SP 123456 · RQE 98765",
      city: "São Paulo",
      state: "SP",
      verificationStatus: "verified",
      profileVisibility: "public",
      specialtyName: "Cirurgia geral",
      institutionName: "Hospital Estadual Piloto",
      networkStrength: "Rede cirúrgica estadual",
      profileCompletion: 94,
    },
  ].slice(0, limit ?? 100)),
  getMedicalNetworkSnapshot: vi.fn(async () => ({
    stats: {
      totalProfessionals: 128,
      verifiedProfiles: 74,
      representedSpecialties: 19,
      activeRegions: 12,
    },
    featuredProfessionals: [
      {
        id: 101,
        fullName: "Dra. Helena Martins",
        specialtyName: "Cirurgia geral",
        city: "São Paulo",
        state: "SP",
      },
    ],
    spotlightSpecialties: ["Cirurgia geral", "Neurocirurgia", "Ortopedia"],
    recentConnections: [
      {
        sourceName: "Equipe SINACE SP",
        targetName: "Rede Estadual Piloto",
        connectionType: "institutional",
      },
    ],
  })),
  getAuthenticatedMedicalWorkspace: vi.fn(async (userId: number) => ({
    profile: {
      id: 101,
      userId,
      fullName: "Dra. Helena Martins",
      roleTitle: "Cirurgiã geral",
      professionalType: "surgeon" as const,
      specialtyId: 1,
      specialtyName: "Cirurgia geral",
      institutionId: 40,
      institutionName: "Hospital Estadual Piloto",
      visibility: "private" as const,
      privateAccessEmail: "dra.helena@sinace.app",
      passwordAccessStatus: "managed" as const,
      passwordRecoveryChannel: "Coordenação médica SINACE",
      completionScore: 93,
      connectionsCount: 12,
      teamsCount: 3,
      highlights: ["Coordenação de mutirões", "Governança de acesso"],
      practiceAreas: ["Fila eletiva", "Linha regional"],
      highlightsList: ["Coordenação de mutirões", "Governança de acesso"],
      practiceAreasList: ["Fila eletiva", "Linha regional"],
    },
    quickStats: {
      curatedAssets: 4,
      learningTracks: 3,
      documents: 5,
      publications: 2,
      flowcharts: 2,
      caseStudies: 2,
    },
    connections: [
      {
        id: 990,
        fullName: "Dr. Rafael Souza",
        roleTitle: "Anestesiologista",
        specialtyName: "Anestesiologia",
        institutionName: "Hospital Estadual Piloto",
        connectionType: "institutional",
      },
    ],
    networkHighlights: [
      {
        id: 991,
        fullName: "Dra. Camila Rocha",
        roleTitle: "Cirurgiã do aparelho digestivo",
        specialtyName: "Cirurgia geral",
        institutionName: "Hospital Estadual Piloto",
        state: "SP",
        collaborationInterest: "high",
      },
    ],
    caseStudies: [{ id: 904, title: "Caso regional de regulação cirúrgica" }],
    flowcharts: [{ id: 905, title: "Fluxo de elegibilidade eletiva" }],
    drive: {
      assets: [{ id: 900, title: "Checklist operatório" }],
      tracks: [{ id: 901, title: "Governança da fila cirúrgica" }],
      documents: [{ id: 902, title: "Diretriz de acesso" }],
      publications: [{ id: 903, title: "Atualização institucional" }],
    },
  })),
  upsertAuthenticatedProfessionalProfile: vi.fn(async (userId: number, input) => ({
    profile: {
      id: 101,
      userId,
      fullName: input.fullName,
      roleTitle: input.roleTitle,
      professionalType: input.professionalType,
      specialtyId: input.specialtyId ?? null,
      institutionId: input.institutionId ?? null,
      visibility: input.visibility ?? "private",
      privateAccessEmail: input.privateAccessEmail ?? null,
      passwordAccessStatus: input.passwordAccessStatus ?? "not_started",
      passwordRecoveryChannel: input.passwordRecoveryChannel ?? null,
    },
    quickStats: {
      curatedAssets: 0,
      learningTracks: 0,
      documents: 0,
      publications: 0,
    },
    drive: {
      assets: [],
      tracks: [],
      documents: [],
      publications: [],
    },
  })),
  listInstitutionalPublications: vi.fn(async (limit: number) => [
    {
      id: 301,
      slug: "balanco-operacional-primeiro-trimestre",
      title: "Balanço operacional do primeiro trimestre",
      excerpt: "Atualização institucional sobre ampliação do acesso cirúrgico.",
      authorRole: "CEO",
      publicationType: "institutional_update",
      publishedAt: new Date("2026-03-20T00:00:00.000Z"),
      highlightedMetric: "Redução sustentada do tempo de espera em polos prioritários.",
    },
  ].slice(0, limit)),
  getKnowledgeHubSnapshot: vi.fn(async () => ({
    metrics: {
      documents: 42,
      caseStudies: 16,
      flowcharts: 9,
      mediaAssets: 18,
    },
    featuredDocuments: [
      {
        id: 20,
        title: "Diretriz de acesso cirúrgico",
        specialtyName: "Cirurgia geral",
      },
    ],
    featuredCaseStudies: [
      {
        id: 401,
        title: "Caso de fila reprimida com reorganização regional",
        specialtyName: "Cirurgia geral",
      },
    ],
    featuredFlowcharts: [
      {
        id: 501,
        title: "Fluxo de elegibilidade cirúrgica eletiva",
        scope: "estadual",
      },
    ],
  })),
  getInstitutionalEcosystemSnapshot: vi.fn(async () => ({
    metrics: {
      partners: 8,
      institutions: 14,
      susSpheres: 4,
      activeRegions: 9,
    },
    sphereCoverage: ["federal", "estadual", "municipal", "regional"],
    featuredPartners: [
      {
        id: 30,
        name: "Rede Estadual Piloto",
        sphere: "estadual",
      },
    ],
    featuredInstitutions: [
      {
        id: 40,
        name: "Hospital Estadual Piloto",
        state: "SP",
      },
    ],
  })),
  listMediaShowcaseItems: vi.fn(async (limit: number) => [
    {
      id: 601,
      title: "Painel de expansão cirúrgica",
      mediaType: "image",
      audience: "institutional",
      placement: "hero",
    },
  ].slice(0, limit)),
  createSpecialty: vi.fn(async input => ({ id: 99, slug: "nova-especialidade", ...input })),
  updateSpecialty: vi.fn(async (id, input) => ({ id, ...input })),
  reorderSpecialties: vi.fn(async input => input),
}));

const notificationMocks = vi.hoisted(() => ({
  notifyOwner: vi.fn(async () => true),
}));

vi.mock("./db", () => ({
  ensureSinaceBaseSeed: dbMocks.ensureSinaceBaseSeed,
  getOperationalDashboardSnapshot: dbMocks.getOperationalDashboardSnapshot,
  listSpecialties: dbMocks.listSpecialties,
  listSpecialtyOperationalOverview: dbMocks.listSpecialtyOperationalOverview,
  listTracks: dbMocks.listTracks,
  listDocuments: dbMocks.listDocuments,
  getEducationalDriveSnapshot: dbMocks.getEducationalDriveSnapshot,
  createEducationalDriveDocument: dbMocks.createEducationalDriveDocument,
  listPartners: dbMocks.listPartners,
  listInstitutions: dbMocks.listInstitutions,
  listRecentQueueEntries: dbMocks.listRecentQueueEntries,
  listMedicalDirectory: dbMocks.listMedicalDirectory,
  getMedicalNetworkSnapshot: dbMocks.getMedicalNetworkSnapshot,
  getAuthenticatedMedicalWorkspace: dbMocks.getAuthenticatedMedicalWorkspace,
  upsertAuthenticatedProfessionalProfile: dbMocks.upsertAuthenticatedProfessionalProfile,
  listInstitutionalPublications: dbMocks.listInstitutionalPublications,
  getKnowledgeHubSnapshot: dbMocks.getKnowledgeHubSnapshot,
  getInstitutionalEcosystemSnapshot: dbMocks.getInstitutionalEcosystemSnapshot,
  listMediaShowcaseItems: dbMocks.listMediaShowcaseItems,
  createSpecialty: dbMocks.createSpecialty,
  updateSpecialty: dbMocks.updateSpecialty,
  reorderSpecialties: dbMocks.reorderSpecialties,
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: notificationMocks.notifyOwner,
}));

import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../shared/const";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

function createUser(role: AuthenticatedUser["role"] = "user"): AuthenticatedUser {
  return {
    id: 1,
    openId: "sinace-user",
    email: "user@sinace.com.br",
    name: "Usuário SINACE",
    loginMethod: "manus",
    role,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    lastSignedIn: new Date("2026-01-01T00:00:00.000Z"),
  };
}

describe("sinace router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bloqueia acesso não autenticado às consultas protegidas", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.sinace.specialties.list()).rejects.toThrow(UNAUTHED_ERR_MSG);
  });

  it("retorna o snapshot persistente do dashboard autenticado", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const result = await caller.sinace.dashboard();

    expect(dbMocks.ensureSinaceBaseSeed).toHaveBeenCalledTimes(1);
    expect(dbMocks.getOperationalDashboardSnapshot).toHaveBeenCalledTimes(1);
    expect(result.metrics).toEqual({
      specialties: 19,
      tracks: 8,
      documents: 14,
      partners: 3,
      institutions: 5,
      contracts: 4,
      queueEntries: 12,
      teams: 6,
    });
    expect(result.latestSpecialties[0]?.slug).toBe("cirurgia-geral");
    expect(result.operationModalities).toContain("Mutirões estruturados");
  });

  it("lista a visão operacional enriquecida das especialidades", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const result = await caller.sinace.specialties.list();
    const filtered = await caller.sinace.specialties.list({ status: "draft" });

    expect(dbMocks.listSpecialtyOperationalOverview).toHaveBeenCalledTimes(2);
    expect(result[0]).toMatchObject({
      slug: "cirurgia-geral",
      tracksCount: 3,
      documentsCount: 5,
      institutionsCount: 2,
      queueCount: 4,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.slug).toBe("neurocirurgia");
  });

  it("consulta especialidade por slug e retorna nulo quando não encontra", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const specialty = await caller.sinace.specialties.bySlug({
      slug: "neurocirurgia",
    });
    const missing = await caller.sinace.specialties.bySlug({
      slug: "especialidade-inexistente",
    });

    expect(specialty?.name).toBe("Neurocirurgia");
    expect(missing).toBeNull();
  });

  it("expõe instituições e fila recente do banco autenticado", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const institutions = await caller.sinace.institutions.list();
    const queue = await caller.sinace.queue.recent();

    expect(dbMocks.listInstitutions).toHaveBeenCalledTimes(1);
    expect(dbMocks.listRecentQueueEntries).toHaveBeenCalledTimes(1);
    expect(institutions[0]).toMatchObject({
      slug: "hospital-estadual-piloto",
      specialtiesCount: 4,
      teamsCount: 2,
    });
    expect(queue[0]).toMatchObject({
      patientCode: "SIN-001",
      specialtyName: "Cirurgia geral",
      waitingDays: 126,
    });
  });

  it("permite que administradores consultem a lista administrativa da taxonomia", async () => {
    const caller = appRouter.createCaller(createContext(createUser("admin")));

    const result = await caller.sinace.specialties.adminList();

    expect(dbMocks.listSpecialtyOperationalOverview).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      slug: "cirurgia-geral",
      operationalFocus: "Leitura da fila reprimida e mutirões organizados.",
    });
  });

  it("bloqueia a área administrativa para usuários sem papel admin", async () => {
    const caller = appRouter.createCaller(createContext(createUser("user")));

    await expect(caller.sinace.specialties.adminList()).rejects.toThrow(NOT_ADMIN_ERR_MSG);
    await expect(
      caller.sinace.specialties.create({
        name: "Cirurgia torácica",
        shortLabel: "Torácica",
        description: "Linha cirúrgica torácica.",
        category: "cirurgica",
        status: "draft",
        displayOrder: 19,
        coordinationModel: "Coordenação regional torácica",
      })
    ).rejects.toThrow(NOT_ADMIN_ERR_MSG);
  });

  it("cria especialidades com createdByUserId derivado do contexto administrativo", async () => {
    const caller = appRouter.createCaller(createContext(createUser("admin")));

    await caller.sinace.specialties.create({
      name: "Cirurgia torácica",
      shortLabel: "Torácica",
      description: "Linha cirúrgica torácica.",
      category: "cirurgica",
      status: "active",
      displayOrder: 19,
      coordinationModel: "Coordenação regional torácica",
    });

    expect(dbMocks.createSpecialty).toHaveBeenCalledWith({
      name: "Cirurgia torácica",
      shortLabel: "Torácica",
      description: "Linha cirúrgica torácica.",
      category: "cirurgica",
      status: "active",
      displayOrder: 19,
      coordinationModel: "Coordenação regional torácica",
      createdByUserId: 1,
    });
  });

  it("atualiza especialidades pelo contrato administrativo persistente", async () => {
    const caller = appRouter.createCaller(createContext(createUser("admin")));

    await caller.sinace.specialties.update({
      id: 2,
      name: "Neurocirurgia avançada",
      shortLabel: "Neuro avançada",
      description: "Linha de alta complexidade com coordenação regional.",
      category: "cirurgica",
      status: "active",
      displayOrder: 5,
      coordinationModel: "Coordenação macrorregional",
      slug: "neuro-avancada",
    });

    expect(dbMocks.updateSpecialty).toHaveBeenCalledWith(2, {
      id: 2,
      name: "Neurocirurgia avançada",
      shortLabel: "Neuro avançada",
      description: "Linha de alta complexidade com coordenação regional.",
      category: "cirurgica",
      status: "active",
      displayOrder: 5,
      coordinationModel: "Coordenação macrorregional",
      slug: "neuro-avancada",
    });
  });

  it("reordena especialidades com a sequência enviada pelo módulo administrativo", async () => {
    const caller = appRouter.createCaller(createContext(createUser("admin")));

    const payload = [
      { id: 2, displayOrder: 0 },
      { id: 1, displayOrder: 1 },
    ];

    await caller.sinace.specialties.reorder(payload);

    expect(dbMocks.reorderSpecialties).toHaveBeenCalledWith(payload);
  });

  it("expõe o diretório médico e o snapshot agregado da rede profissional", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const directory = await caller.sinace.directory.list({ limit: 1 });
    const snapshot = await caller.sinace.directory.snapshot();

    expect(dbMocks.listMedicalDirectory).toHaveBeenCalledWith(1);
    expect(dbMocks.getMedicalNetworkSnapshot).toHaveBeenCalledTimes(1);
    expect(directory[0]).toMatchObject({
      fullName: "Dra. Helena Martins",
      specialtyName: "Cirurgia geral",
      verificationStatus: "verified",
    });
    expect(snapshot.stats).toMatchObject({
      totalProfessionals: 128,
      representedSpecialties: 19,
    });
    expect(snapshot.spotlightSpecialties).toContain("Neurocirurgia");
  });

  it("expõe o workspace autenticado do especialista com base no usuário da sessão", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const workspace = await caller.sinace.directory.mine();

    expect(dbMocks.getAuthenticatedMedicalWorkspace).toHaveBeenCalledWith(1);
    expect(workspace.profile).toMatchObject({
      userId: 1,
      fullName: "Dra. Helena Martins",
      professionalType: "surgeon",
      specialtyName: "Cirurgia geral",
      institutionName: "Hospital Estadual Piloto",
      visibility: "private",
      privateAccessEmail: "dra.helena@sinace.app",
      passwordAccessStatus: "managed",
      passwordRecoveryChannel: "Coordenação médica SINACE",
      completionScore: 93,
    });
    expect(workspace.profile.practiceAreas).toEqual(["Fila eletiva", "Linha regional"]);
    expect(workspace.profile.highlights).toEqual(["Coordenação de mutirões", "Governança de acesso"]);
    expect(workspace.quickStats).toMatchObject({
      curatedAssets: 4,
      learningTracks: 3,
      documents: 5,
      publications: 2,
      flowcharts: 2,
      caseStudies: 2,
    });
    expect(workspace.drive.assets[0]).toMatchObject({
      title: "Checklist operatório",
    });
    expect(workspace.drive.tracks[0]).toMatchObject({
      title: "Governança da fila cirúrgica",
    });
    expect(workspace.drive.publications[0]).toMatchObject({
      title: "Atualização institucional",
    });
    expect(workspace.caseStudies[0]).toMatchObject({
      title: "Caso regional de regulação cirúrgica",
    });
    expect(workspace.flowcharts[0]).toMatchObject({
      title: "Fluxo de elegibilidade eletiva",
    });
    expect(workspace.networkHighlights[0]).toMatchObject({
      fullName: "Dra. Camila Rocha",
      collaborationInterest: "high",
    });
    expect(workspace.connections[0]).toMatchObject({
      fullName: "Dr. Rafael Souza",
      connectionType: "institutional",
    });
  });

  it("salva o perfil privado do especialista aplicando fallback do contexto autenticado", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    await caller.sinace.directory.saveMine({
      fullName: "   ",
      roleTitle: "Cirurgiã geral líder",
      professionalType: "surgeon",
      institutionId: 40,
      specialtyId: 1,
      credentialNumber: "123456",
      credentialState: "SP",
      credentialAuthority: "CRM",
      rqeNumber: "98765",
      publicEmail: null,
      privateAccessEmail: "acesso.helena@sinace.app",
      passwordAccessStatus: "managed",
      passwordRecoveryChannel: "Suporte clínico SINACE",
      phone: "+55 11 99999-0000",
      city: "São Paulo",
      state: "SP",
      regionLabel: "Sudeste",
      profileImageUrl: "https://cdn.sinace/imagem.png",
      miniBio: "Atua em governança cirúrgica regional.",
      curriculumSummary: "Experiência em mutirões e regulação assistencial.",
      highlights: ["Coordenação estadual", "Implantação de linha eletiva"],
      practiceAreas: ["Cirurgia geral", "Gestão de fila"],
      collaborationInterest: "high",
      visibility: "private",
    });

    expect(dbMocks.upsertAuthenticatedProfessionalProfile).toHaveBeenCalledWith(1, {
      fullName: "Usuário SINACE",
      roleTitle: "Cirurgiã geral líder",
      professionalType: "surgeon",
      institutionId: 40,
      specialtyId: 1,
      credentialNumber: "123456",
      credentialState: "SP",
      credentialAuthority: "CRM",
      rqeNumber: "98765",
      publicEmail: "user@sinace.com.br",
      privateAccessEmail: "acesso.helena@sinace.app",
      passwordAccessStatus: "managed",
      passwordRecoveryChannel: "Suporte clínico SINACE",
      phone: "+55 11 99999-0000",
      city: "São Paulo",
      state: "SP",
      regionLabel: "Sudeste",
      profileImageUrl: "https://cdn.sinace/imagem.png",
      miniBio: "Atua em governança cirúrgica regional.",
      curriculumSummary: "Experiência em mutirões e regulação assistencial.",
      highlights: ["Coordenação estadual", "Implantação de linha eletiva"],
      practiceAreas: ["Cirurgia geral", "Gestão de fila"],
      collaborationInterest: "high",
      visibility: "private",
    });
  });

  it("expõe o snapshot agregado da enciclopédia cirúrgica com especialidades, pastas e downloads", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const snapshot = await caller.sinace.encyclopedia.snapshot();

    expect(dbMocks.getEducationalDriveSnapshot).toHaveBeenCalledTimes(1);
    expect(snapshot.metrics).toEqual({
      totalDocuments: 3,
      totalSpecialties: 2,
      externalContributors: 2,
      downloadsReady: 3,
    });
    expect(snapshot.specialties[0]).toMatchObject({
      slug: "cirurgia-geral",
      documentsCount: 2,
    });
    expect(snapshot.specialties[0]?.folders[0]).toMatchObject({
      folderLabel: "Estudos clínicos",
      totalDocuments: 1,
    });
    expect(snapshot.latestDocuments[0]).toMatchObject({
      title: "Checklist de neuroanestesia",
      specialtyName: "Neurocirurgia",
    });
  });

  it("publica um novo material educativo vinculando o upload ao usuário autenticado", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const created = await caller.sinace.encyclopedia.upload({
      title: "Estudo observacional em fila eletiva",
      description: "Material externo para a pasta de artigos clínicos.",
      specialtyId: 1,
      folderLabel: "Artigos clínicos",
      documentType: "article",
      visibility: "restricted",
      contributorName: "Dr. Pedro Almeida",
      contributorInstitution: "Hospital Regional do Leste",
      contributorCredential: "CRM-SP 456789",
      contributorType: "external",
      fileName: "estudo-fila-eletiva.pdf",
      mimeType: "application/pdf",
      fileBase64: "data:application/pdf;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=",
    });

    expect(dbMocks.createEducationalDriveDocument).toHaveBeenCalledWith({
      title: "Estudo observacional em fila eletiva",
      description: "Material externo para a pasta de artigos clínicos.",
      specialtyId: 1,
      folderLabel: "Artigos clínicos",
      documentType: "article",
      visibility: "restricted",
      contributorName: "Dr. Pedro Almeida",
      contributorInstitution: "Hospital Regional do Leste",
      contributorCredential: "CRM-SP 456789",
      contributorType: "external",
      fileName: "estudo-fila-eletiva.pdf",
      mimeType: "application/pdf",
      fileBase64: "data:application/pdf;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=",
      createdByUserId: 1,
    });
    expect(created).toMatchObject({
      title: "Estudo observacional em fila eletiva",
      contributorName: "Dr. Pedro Almeida",
      contributorType: "external",
      createdByUserId: 1,
    });
  });

  it("lista publicações institucionais e aplica o limite informado", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const publications = await caller.sinace.publications.list({ limit: 1 });

    expect(dbMocks.listInstitutionalPublications).toHaveBeenCalledWith(1);
    expect(publications[0]).toMatchObject({
      title: "Balanço operacional do primeiro trimestre",
      authorRole: "CEO",
    });
  });

  it("expõe o snapshot do hub de conhecimento com documentos, casos e fluxogramas", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const snapshot = await caller.sinace.knowledgeHub.snapshot();

    expect(dbMocks.getKnowledgeHubSnapshot).toHaveBeenCalledTimes(1);
    expect(snapshot.metrics).toEqual({
      documents: 42,
      caseStudies: 16,
      flowcharts: 9,
      mediaAssets: 18,
    });
    expect(snapshot.featuredFlowcharts[0]).toMatchObject({
      title: "Fluxo de elegibilidade cirúrgica eletiva",
      scope: "estadual",
    });
  });

  it("expõe o snapshot do ecossistema institucional com cobertura das esferas do SUS", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const snapshot = await caller.sinace.ecosystem.snapshot();

    expect(dbMocks.getInstitutionalEcosystemSnapshot).toHaveBeenCalledTimes(1);
    expect(snapshot.metrics).toMatchObject({
      partners: 8,
      susSpheres: 4,
    });
    expect(snapshot.sphereCoverage).toEqual(["federal", "estadual", "municipal", "regional"]);
  });

  it("lista a vitrine de mídia institucional usando o limite padrão do contrato", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const items = await caller.sinace.showcase.list();

    expect(dbMocks.listMediaShowcaseItems).toHaveBeenCalledWith(8);
    expect(items[0]).toMatchObject({
      title: "Painel de expansão cirúrgica",
      mediaType: "image",
    });
  });

  it("recebe contato institucional público e encaminha a notificação ao responsável", async () => {
    const caller = appRouter.createCaller(createContext());

    const result = await caller.sinace.contact.submit({
      name: "Mariana Souza",
      organization: "Secretaria Estadual de Saúde",
      email: "mariana.souza@saude.sp.gov.br",
      phone: "(11) 99999-0000",
      interest: "governo",
      message: "Gostaria de avaliar um projeto de redução de fila cirúrgica em rede estadual.",
    });

    expect(notificationMocks.notifyOwner).toHaveBeenCalledTimes(1);
    expect(notificationMocks.notifyOwner).toHaveBeenCalledWith({
      title: "[SINACE] Novo contato institucional — Articulação governamental",
      content: [
        "Nome: Mariana Souza",
        "Organização: Secretaria Estadual de Saúde",
        "E-mail: mariana.souza@saude.sp.gov.br",
        "Telefone: (11) 99999-0000",
        "Interesse: Articulação governamental",
        "",
        "Mensagem:",
        "Gostaria de avaliar um projeto de redução de fila cirúrgica em rede estadual.",
      ].join("\n"),
    });
    expect(result).toEqual({
      success: true,
      delivered: true,
      acknowledgement:
        "Recebemos sua mensagem institucional. A equipe da SINACE poderá retornar pelos canais informados.",
    });
  });

  it("mantém confirmação positiva mesmo quando a entrega da notificação fica pendente", async () => {
    notificationMocks.notifyOwner.mockResolvedValueOnce(false);
    const caller = appRouter.createCaller(createContext());

    const result = await caller.sinace.contact.submit({
      name: "Carlos Lima",
      organization: "Santa Casa Regional",
      email: "carlos.lima@santacasa.org.br",
      phone: "(14) 98888-7777",
      interest: "parceria",
      message: "Temos interesse em estruturar uma frente regional de cirurgias eletivas.",
    });

    expect(notificationMocks.notifyOwner).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      success: true,
      delivered: false,
    });
  });
});
