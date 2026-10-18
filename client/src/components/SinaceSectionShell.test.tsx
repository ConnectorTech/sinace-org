import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Activity } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SINACE_INSTITUTIONAL_PROFILE } from "@shared/sinaceCatalog";
import AppInstitutionalProfile from "@/pages/AppInstitutionalProfile";
import { SinaceSectionShell, splitHighlightMetric } from "./SinaceSectionShell";

describe("SinaceSectionShell", () => {
  it("não repete os dados institucionais nas páginas de módulo", () => {
    const markup = renderToStaticMarkup(
      <SinaceSectionShell
        eyebrow="Workspace SINACE"
        title="Teste do shell institucional"
        description="Validação do contexto compartilhado"
        icon={Activity}
        highlights={[
          {
            title: "Indicador de teste",
            description: "Conteúdo auxiliar para validar o shell.",
            metric: "1 cenário",
          },
        ]}
        ctaLabel="Estrutura institucional sincronizada"
      />
    );

    expect(markup).toContain("Teste do shell institucional");
    expect(markup).not.toContain(SINACE_INSTITUTIONAL_PROFILE.socialObject);
    expect(markup).not.toContain(SINACE_INSTITUTIONAL_PROFILE.cnpj);
    expect(markup).not.toContain(SINACE_INSTITUTIONAL_PROFILE.email);
  });
});

describe("SinaceMetricChips", () => {
  it("separa o número em destaque do rótulo da métrica", () => {
    expect(splitHighlightMetric("19 especialidades ativas", "Especialidades")).toEqual({
      value: "19",
      label: "especialidades ativas",
    });
    expect(splitHighlightMetric("100% padronizadas", "Padronização")).toEqual({ value: "100%", label: "padronizadas" });
    expect(splitHighlightMetric("…", "Protocolos")).toEqual({ value: "…", label: "Protocolos" });
  });

  it("renderiza as métricas como chips horizontais em vez de cards", () => {
    const markup = renderToStaticMarkup(
      <SinaceSectionShell
        eyebrow="Especialidades"
        title="Catálogo"
        description="Teste"
        icon={Activity}
        highlights={[
          { title: "Ativas", description: "Especialidades ativas.", metric: "19 especialidades ativas" },
          { title: "Protocolos", description: "Com protocolos.", metric: "8 com protocolos" },
        ]}
      />
    );

    expect(markup).toContain('aria-label="Métricas rápidas"');
    expect(markup).toContain("overflow-x-auto");
    expect(markup).toContain(">19</span>");
    expect(markup).not.toContain("Vetor estrutural");
  });
});

describe("AppInstitutionalProfile", () => {
  it("centraliza os dados institucionais oficiais em Sobre a SINACE", () => {
    const markup = renderToStaticMarkup(<AppInstitutionalProfile />);

    expect(markup).toContain("Sobre a SINACE");
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.socialObject);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.cnpj);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.headquarters);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.phone);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.email);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.instagram);
  });
});
