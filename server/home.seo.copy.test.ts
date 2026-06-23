import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("SINACE home SEO copy", () => {
  it("mantém o H1 principal da home com até 80 caracteres", () => {
    const heroHeading = "Organizar capacidade cirúrgica para reduzir filas com escala.";

    expect(homeSource).toContain(heroHeading);
    expect(heroHeading.length).toBeLessThanOrEqual(80);
  });

  it("mantém os H2s institucionais principais da home com até 80 caracteres", () => {
    const headings = [
      "A SINACE organiza capacidade cirúrgica com método e continuidade.",
      "Fluxo, capacidade e escala assistencial com leitura executiva.",
      "Workspace próprio para conhecimento, governança e inteligência cirúrgica.",
      "Escala nacional com polos regionais e contratos estruturantes.",
      "Demanda reprimida convertida em capacidade cirúrgica organizada.",
      "Diálogo institucional para enfrentar a fila cirúrgica com método.",
    ];

    for (const heading of headings) {
      expect(homeSource).toContain(heading);
      expect(heading.length).toBeLessThanOrEqual(80);
    }
  });
});
