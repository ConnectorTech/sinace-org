import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SINACE_INSTITUTIONAL_PROFILE, SINACE_SPECIALTY_CATALOG } from "@shared/sinaceCatalog";
import Home from "./Home";

vi.mock("@/const", () => ({
  getLoginUrl: () => "/login",
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        return ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
          React.createElement(tag, props, children);
      },
    }
  ),
}));

describe("Home landing pública do SINACE", () => {
  it("renderiza as 19 especialidades oficiais do catálogo compartilhado", () => {
    const markup = renderToStaticMarkup(<Home />);

    const renderedSpecialties = SINACE_SPECIALTY_CATALOG.filter(specialty =>
      markup.includes(specialty.name)
    );

    expect(renderedSpecialties).toHaveLength(19);
  });

  it("reaproveita o bloco institucional oficial no conteúdo público", () => {
    const markup = renderToStaticMarkup(<Home />);

    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.phone);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.email);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.cnpj);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.instagram);
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.headquarters);
    expect(markup).toContain("Identificação institucional de base");
    expect(markup).toContain(SINACE_INSTITUTIONAL_PROFILE.extendedName);
  });

  it("usa a arte institucional corrigida na seção pública da home", () => {
    const markup = renderToStaticMarkup(<Home />);

    expect(markup).toMatch(
      /<img[^>]+src="https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/310519663534677050\/n5uwcWAoUUWXyEtV2nUN8o\/IMG_5204_corrigida_v4_434fe37c\.png"[^>]+alt="Imagem institucional da SINACE simbolizando integração entre gestão, SUS e instituição de saúde"/
    );
  });
});
