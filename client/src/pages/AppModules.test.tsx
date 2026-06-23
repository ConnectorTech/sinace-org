import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AppCases,
  AppEncyclopedia,
  AppFaculty,
  AppInstitutions,
  AppPartners,
  AppStudents,
} from "./AppModules";

type QueryState<T> = {
  data: T;
  isLoading: boolean;
  isRefetching: boolean;
  error: { message: string } | null;
  refetch: () => Promise<unknown>;
};

function createQueryState<T>(data: T): QueryState<T> {
  return {
    data,
    isLoading: false,
    isRefetching: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
}

const invalidateDocumentsList = vi.fn().mockResolvedValue(undefined);
const uploadMutationMock = {
  mutateAsync: vi.fn().mockResolvedValue({
    id: 999,
    title: "Material educativo",
  }),
  isPending: false,
};

const queryState = {
  specialties: createQueryState<Array<Record<string, unknown>>>([]),
  tracks: createQueryState<Array<Record<string, unknown>>>([]),
  documents: createQueryState<Array<Record<string, unknown>>>([]),
  encyclopedia: createQueryState<Record<string, unknown> | null>({
    metrics: {
      totalDocuments: 0,
      totalSpecialties: 0,
      externalContributors: 0,
      downloadsReady: 0,
    },
    specialties: [],
    featuredDocuments: [],
    latestDocuments: [],
  }),
  queue: createQueryState<Array<Record<string, unknown>>>([]),
  partners: createQueryState<Array<Record<string, unknown>>>([]),
  institutions: createQueryState<Array<Record<string, unknown>>>([]),
};

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      sinace: {
        documents: {
          list: {
            invalidate: invalidateDocumentsList,
          },
        },
      },
    }),
    sinace: {
      specialties: {
        list: {
          useQuery: () => queryState.specialties,
        },
      },
      tracks: {
        list: {
          useQuery: () => queryState.tracks,
        },
      },
      documents: {
        list: {
          useQuery: () => queryState.documents,
        },
      },
      encyclopedia: {
        snapshot: {
          useQuery: () => queryState.encyclopedia,
        },
        upload: {
          useMutation: () => uploadMutationMock,
        },
      },
      queue: {
        list: {
          useQuery: () => queryState.queue,
        },
        recent: {
          useQuery: () => queryState.queue,
        },
      },
      partners: {
        list: {
          useQuery: () => queryState.partners,
        },
      },
      institutions: {
        list: {
          useQuery: () => queryState.institutions,
        },
      },
    },
  },
}));

function resetQueryState() {
  invalidateDocumentsList.mockClear();
  uploadMutationMock.mutateAsync.mockClear();
  queryState.specialties = createQueryState([]);
  queryState.tracks = createQueryState([]);
  queryState.documents = createQueryState([]);
  queryState.encyclopedia = createQueryState({
    metrics: {
      totalDocuments: 0,
      totalSpecialties: 0,
      externalContributors: 0,
      downloadsReady: 0,
    },
    specialties: [],
    featuredDocuments: [],
    latestDocuments: [],
  });
  queryState.queue = createQueryState([]);
  queryState.partners = createQueryState([]);
  queryState.institutions = createQueryState([]);
}

describe("AppModules", () => {
  beforeEach(() => {
    resetQueryState();
  });

  it("mostra estado de erro e retry em casos clínicos quando a fila falha", () => {
    queryState.queue.error = { message: "Fila indisponível" };

    const markup = renderToStaticMarkup(<AppCases />);

    expect(markup).toContain("Não foi possível consultar as observações clínicas agora");
    expect(markup).toContain("Fila indisponível");
    expect(markup).toContain("Tentar novamente");
  });

  it("mostra estados vazios coerentes na enciclopédia sem especialidades nem ativos relacionados", () => {
    const markup = renderToStaticMarkup(<AppEncyclopedia />);

    expect(markup).toContain("Ainda não existem especialidades publicadas");
    expect(markup).toContain("Publique o catálogo de especialidades para abrir as primeiras abas da enciclopédia cirúrgica e receber anexos de estudo.");
    expect(markup).toContain("Downloads mais recentes da enciclopédia cirúrgica");
    expect(markup).toContain("Ainda não existem materiais publicados");
  });

  it("expõe ação adequada para material externo e avisa quando um item ainda não tem anexo liberado", () => {
    queryState.encyclopedia = createQueryState({
      metrics: {
        totalDocuments: 2,
        totalSpecialties: 1,
        externalContributors: 1,
        downloadsReady: 1,
      },
      specialties: [
        {
          id: 1,
          slug: "cirurgia-geral",
          name: "Cirurgia geral",
          shortLabel: "CG",
          description: "Especialidade-base para o drive educativo.",
          documentsCount: 2,
          lastPublishedAt: new Date("2026-04-14T00:00:00.000Z"),
          folders: [
            {
              folderLabel: "Estudos de caso",
              totalDocuments: 2,
              documents: [
                {
                  id: 10,
                  title: "Vídeo de técnica laparoscópica",
                  description: "Hospedado externamente.",
                  documentType: "video",
                  fileName: null,
                  fileSizeBytes: null,
                  fileUrl: null,
                  sourceUrl: "https://videos.sinace.org/laparoscopia",
                  contributorName: "Dr. Paulo Lima",
                  contributorInstitution: "Hospital Escola",
                  publishedAt: new Date("2026-04-14T00:00:00.000Z"),
                  createdAt: new Date("2026-04-14T00:00:00.000Z"),
                },
                {
                  id: 11,
                  title: "Resumo institucional sem anexo",
                  description: "Registro criado sem arquivo final.",
                  documentType: "article",
                  fileName: null,
                  fileSizeBytes: null,
                  fileUrl: null,
                  sourceUrl: null,
                  contributorName: null,
                  contributorInstitution: null,
                  publishedAt: new Date("2026-04-14T00:00:00.000Z"),
                  createdAt: new Date("2026-04-14T00:00:00.000Z"),
                },
              ],
            },
          ],
        },
      ],
      featuredDocuments: [],
      latestDocuments: [
        {
          id: 10,
          title: "Vídeo de técnica laparoscópica",
          description: "Hospedado externamente.",
          documentType: "video",
          specialtyName: "Cirurgia geral",
          fileSizeBytes: null,
          fileUrl: null,
          sourceUrl: "https://videos.sinace.org/laparoscopia",
          publishedAt: new Date("2026-04-14T00:00:00.000Z"),
          createdAt: new Date("2026-04-14T00:00:00.000Z"),
        },
        {
          id: 11,
          title: "Resumo institucional sem anexo",
          description: "Registro criado sem arquivo final.",
          documentType: "article",
          specialtyName: "Cirurgia geral",
          fileSizeBytes: null,
          fileUrl: null,
          sourceUrl: null,
          publishedAt: new Date("2026-04-14T00:00:00.000Z"),
          createdAt: new Date("2026-04-14T00:00:00.000Z"),
        },
      ],
    });

    const markup = renderToStaticMarkup(<AppEncyclopedia />);

    expect(markup).toContain("Link externo do material");
    expect(markup).toContain("Abrir vídeo");
    expect(markup).toContain("Anexo indisponível");
    expect(markup).toContain("Este registro ainda não possui anexo ou link liberado para download.");
    expect(markup).toContain("Material cadastrado sem anexo liberado.");
  });

  it("mostra estado vazio para parceiros e instituições quando a rede ainda não foi cadastrada", () => {
    const partnersMarkup = renderToStaticMarkup(<AppPartners />);
    const institutionsMarkup = renderToStaticMarkup(<AppInstitutions />);

    expect(partnersMarkup).toContain("Ainda não há parceiros persistidos nesta rede");
    expect(partnersMarkup).toContain("Ainda não há instituições associadas à rede de parceiros");
    expect(institutionsMarkup).toContain("Ainda não há instituições persistidas");
    expect(institutionsMarkup).toContain("Ainda não há instituições para projetar cobertura cirúrgica");
  });

  it("renderiza subtítulos H2 reais na página de instituições", () => {
    const markup = renderToStaticMarkup(<AppInstitutions />);

    expect(markup).toContain("<h2 class=\"text-2xl font-semibold tracking-[-0.03em] text-slate-950\">Instituições já prontas para leitura operacional</h2>");
    expect(markup).toContain("<h2 class=\"text-2xl font-semibold tracking-[-0.03em] text-white\">Leitura temática derivada da taxonomia oficial do SINACE</h2>");
  });

  it("mostra estado vazio docente quando não existem instituições com perfil de ensino", () => {
    queryState.specialties.data = [
      {
        id: "spec-1",
        name: "Cirurgia geral",
        shortLabel: "CG",
      },
    ];

    const markup = renderToStaticMarkup(<AppFaculty />);

    expect(markup).toContain("Ainda não há instituições com perfil de ensino vinculado");
  });

  it("mostra estado de erro discente quando a consulta de documentos falha", () => {
    queryState.documents.error = { message: "Acervo indisponível" };

    const markup = renderToStaticMarkup(<AppStudents />);

    expect(markup).toContain("Não foi possível consultar a oferta formativa agora");
    expect(markup).toContain("Acervo indisponível");
    expect(markup).toContain("Tentar novamente");
  });
});
