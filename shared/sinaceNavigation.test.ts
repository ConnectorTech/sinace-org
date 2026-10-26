import { describe, expect, it } from "vitest";
import {
  getActiveBottomNavAxis,
  getBottomNavMoreGroups,
  sinaceBottomNavAxes,
  sinaceNavigationGroups,
} from "@/lib/sinace-navigation";

describe("sinaceNavigationGroups", () => {
  it("expõe os grupos estratégicos da fundação multiárea do app", () => {
    expect(sinaceNavigationGroups.map(group => group.label)).toEqual([
      "Visão executiva",
      "Rede cirúrgica",
      "Conhecimento cirúrgico",
      "Comunidade médica",
      "Governança",
    ]);
  });

  it("inclui os caminhos essenciais para publicações, fluxogramas, perfis e network", () => {
    const items = sinaceNavigationGroups.flatMap(group => group.items);
    const paths = items.map(item => item.path);

    expect(paths).toContain("/app/publicacoes");
    expect(paths).toContain("/app/fluxogramas");
    expect(paths).toContain("/app/perfis");
    expect(paths).toContain("/app/network");
    expect(paths).toContain("/app/biblioteca");
    expect(paths).toContain("/app/casos");
  });

  it("mantém a administração como área restrita para governança", () => {
    const adminItem = sinaceNavigationGroups
      .flatMap(group => group.items)
      .find(item => item.path === "/app/admin");

    expect(adminItem).toBeDefined();
    expect(adminItem?.requiresAdmin).toBe(true);
  });

  it("centraliza os dados institucionais em uma única seção Sobre", () => {
    const items = sinaceNavigationGroups.flatMap(group => group.items);
    const aboutItems = items.filter(item => item.path === "/app/sobre");

    expect(aboutItems).toHaveLength(1);
    expect(aboutItems[0]?.label).toBe("Sobre a SINACE");
  });

  it("mantém descrições curtas para o cabeçalho compacto", () => {
    sinaceNavigationGroups
      .flatMap(group => group.items)
      .forEach(item => expect(item.description.length).toBeLessThanOrEqual(80));
  });
});

describe("sinaceBottomNavAxes", () => {
  it("expõe os quatro eixos principais da Bottom Navigation Bar", () => {
    expect(sinaceBottomNavAxes.map(axis => axis.label)).toEqual([
      "Início",
      "Rede",
      "Conhecimento",
      "Minha área",
    ]);
  });

  it("aponta cada eixo para uma rota existente do workspace", () => {
    const paths = sinaceNavigationGroups.flatMap(group => group.items.map(item => item.path));
    sinaceBottomNavAxes.forEach(axis => expect(paths).toContain(axis.path));
  });

  it("ativa o eixo correto para rotas relacionadas e deixa o restante em 'Mais'", () => {
    expect(getActiveBottomNavAxis("/app")?.key).toBe("inicio");
    expect(getActiveBottomNavAxis("/app/perfis")?.key).toBe("rede");
    expect(getActiveBottomNavAxis("/app/enciclopedia/")?.key).toBe("conhecimento");
    expect(getActiveBottomNavAxis("/app/minha-area")?.key).toBe("minha-area");
    expect(getActiveBottomNavAxis("/app/publicacoes")).toBeNull();
    expect(getActiveBottomNavAxis("/app/admin")).toBeNull();
  });

  it("agrupa em 'Mais' todos os módulos que não são destino direto de um eixo", () => {
    const morePaths = getBottomNavMoreGroups().flatMap(group => group.items.map(item => item.path));
    const axisPaths = sinaceBottomNavAxes.map(axis => axis.path);
    const allPaths = sinaceNavigationGroups.flatMap(group => group.items.map(item => item.path));

    expect(morePaths.some(path => axisPaths.includes(path))).toBe(false);
    expect([...morePaths, ...axisPaths].sort()).toEqual([...allPaths].sort());
  });
});
