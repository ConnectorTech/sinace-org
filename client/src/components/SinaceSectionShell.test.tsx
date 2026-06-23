import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Activity } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SINACE_INSTITUTIONAL_PROFILE } from "@shared/sinaceCatalog";
import { SinaceSectionShell } from "./SinaceSectionShell";

describe("SinaceSectionShell", () => {
  it("reutiliza o bloco institucional oficial da SINACE no painel lateral", () => {
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

    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.socialObject);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.cnpj);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.headquarters);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.phone);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.email);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.instagram);
  });
});
