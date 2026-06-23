import { describe, expect, it } from "vitest";
import {
  buildRelatedKnowledgeItems,
  buildSpecialtyDocumentRollup,
  formatInstitutionOrigin,
  summarizeQueueCoverage,
} from "./sinaceDomainTransforms";

describe("sinaceDomainTransforms", () => {
  it("agrega documentos por especialidade com fallback semântico consistente", () => {
    const rollup = buildSpecialtyDocumentRollup(
      [
        {
          id: "spec-1",
          name: "Cirurgia geral",
          shortLabel: "Cirurgia geral",
          coordinationModel: "Gestão matricial da fila.",
        },
        {
          id: "spec-2",
          name: "Urologia",
          shortLabel: null,
          description: null,
          coordinationModel: null,
        },
      ],
      [
        { title: "Protocolo A", specialtyName: "Cirurgia geral" },
        { title: "Protocolo B", specialtyName: "Cirurgia geral" },
        { title: "Manual C", specialtyName: "Urologia" },
      ],
      2,
    );

    expect(rollup).toEqual([
      {
        id: "spec-1",
        name: "Cirurgia geral",
        shortLabel: "Cirurgia geral",
        summary: "Gestão matricial da fila.",
        documentsCount: 2,
      },
      {
        id: "spec-2",
        name: "Urologia",
        shortLabel: "Urologia",
        summary: "Especialidade pronta para aprofundamento assistencial e educacional.",
        documentsCount: 1,
      },
    ]);
  });

  it("combina trilhas e documentos relacionados preservando ordem e fallback de resumo", () => {
    const items = buildRelatedKnowledgeItems(
      [
        { title: "Jornada ORL", summary: "Fluxo introdutório.", estimatedHours: 8 },
        { title: "Jornada Vascular", summary: null, estimatedHours: 10 },
      ],
      [
        { title: "Diretriz ORL", description: "Documento de apoio." },
        { title: "Checklist vascular", description: null },
      ],
      3,
    );

    expect(items).toEqual([
      {
        kind: "track",
        title: "Jornada ORL",
        summary: "Fluxo introdutório.",
      },
      {
        kind: "track",
        title: "Jornada Vascular",
        summary: "Percurso sem resumo expandido.",
      },
      {
        kind: "document",
        title: "Diretriz ORL",
        summary: "Documento de apoio.",
      },
    ]);
  });

  it("resume a cobertura da fila e formata origem institucional com fallback explícito", () => {
    expect(
      summarizeQueueCoverage([
        { specialtyName: "Cirurgia geral", priority: "urgent", institutionName: "Hospital A" },
        { specialtyName: "Cirurgia geral", priority: "priority", institutionName: "Hospital B" },
        { specialtyName: "Urologia", priority: "urgent", institutionName: null },
      ]),
    ).toEqual({
      urgentCases: 2,
      coveredSpecialties: 2,
    });

    expect(formatInstitutionOrigin("Hospital Regional")).toBe("Hospital Regional");
    expect(formatInstitutionOrigin("   ")).toBe("não informada");
    expect(formatInstitutionOrigin(null)).toBe("não informada");
  });
});
