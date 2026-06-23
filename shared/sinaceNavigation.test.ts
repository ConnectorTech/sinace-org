import { describe, expect, it } from "vitest";
import { sinaceNavigationGroups } from "@/lib/sinace-navigation";

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
});
