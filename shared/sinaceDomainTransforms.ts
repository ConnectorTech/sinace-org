export type SpecialtySummaryInput = {
  id: string;
  name: string;
  shortLabel?: string | null;
  description?: string | null;
  coordinationModel?: string | null;
};

export type DocumentSummaryInput = {
  title: string;
  specialtyName?: string | null;
  description?: string | null;
};

export type TrackSummaryInput = {
  title: string;
  specialtyName?: string | null;
  summary?: string | null;
  estimatedHours: number;
};

export type QueueEntrySummaryInput = {
  specialtyName: string;
  priority: string;
  institutionName?: string | null;
};

export type RelatedKnowledgeItem = {
  kind: "track" | "document";
  title: string;
  summary: string;
};

export function buildSpecialtyDocumentRollup(
  specialties: SpecialtySummaryInput[],
  documents: DocumentSummaryInput[],
  limit = 4,
) {
  return specialties.slice(0, limit).map(item => ({
    id: item.id,
    name: item.name,
    shortLabel: item.shortLabel ?? item.name,
    summary:
      item.coordinationModel ??
      item.description ??
      "Especialidade pronta para aprofundamento assistencial e educacional.",
    documentsCount: documents.filter(document => document.specialtyName === item.name).length,
  }));
}

export function buildRelatedKnowledgeItems(
  tracks: TrackSummaryInput[],
  documents: DocumentSummaryInput[],
  limit = 4,
): RelatedKnowledgeItem[] {
  const trackItems: RelatedKnowledgeItem[] = tracks.map(track => ({
    kind: "track",
    title: track.title,
    summary: track.summary ?? "Percurso sem resumo expandido.",
  }));

  const documentItems: RelatedKnowledgeItem[] = documents.map(document => ({
    kind: "document",
    title: document.title,
    summary: document.description ?? "Documento sem descrição expandida.",
  }));

  return [...trackItems, ...documentItems].slice(0, limit);
}

export function summarizeQueueCoverage(queueEntries: QueueEntrySummaryInput[]) {
  return {
    urgentCases: queueEntries.filter(item => item.priority === "urgent").length,
    coveredSpecialties: new Set(queueEntries.map(item => item.specialtyName)).size,
  };
}

export function formatInstitutionOrigin(institutionName?: string | null) {
  return institutionName?.trim() || "não informada";
}
