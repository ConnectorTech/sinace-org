import { sinaceNavigationGroups } from "../client/src/lib/sinace-navigation";
import { SINACE_SPECIALTY_CATALOG } from "../shared/sinaceCatalog";
import { describe, expect, it } from "vitest";

describe("sinaceNavigationGroups", () => {
  it("expõe os grupos esperados do workspace autenticado", () => {
    expect(sinaceNavigationGroups.map(group => group.label)).toEqual([
      "Visão executiva",
      "Rede cirúrgica",
      "Conhecimento cirúrgico",
      "Comunidade médica",
      "Governança",
    ]);
  });

  it("mantém caminhos únicos e todos iniciando em /app", () => {
    const paths = sinaceNavigationGroups.flatMap(group =>
      group.items.map(item => item.path)
    );

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every(path => path.startsWith("/app"))).toBe(true);
  });

  it("reserva o módulo de administração para governança", () => {
    const adminEntry = sinaceNavigationGroups
      .flatMap(group => group.items)
      .find(item => item.path === "/app/admin");

    expect(adminEntry).toMatchObject({
      label: "Administração",
      requiresAdmin: true,
    });
  });

  it("mantém a taxonomia cirúrgica acessível como item central da rede cirúrgica", () => {
    const specialtyEntry = sinaceNavigationGroups
      .find(group => group.label === "Rede cirúrgica")
      ?.items.find(item => item.path === "/app/especialidades");

    expect(specialtyEntry).toMatchObject({
      label: "Especialidades",
      description: expect.stringContaining("Catálogo nacional"),
    });
    expect(SINACE_SPECIALTY_CATALOG).toHaveLength(19);
  });
});
