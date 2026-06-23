import { describe, expect, it } from "vitest";
import { SINACE_INSTITUTIONAL_PROFILE, SINACE_OPERATION_MODALITIES, SINACE_SPECIALTY_CATALOG } from "./sinaceCatalog";

describe("sinaceCatalog", () => {
  it("expõe as 19 especialidades cirúrgicas oficiais com slugs únicos", () => {
    expect(SINACE_SPECIALTY_CATALOG).toHaveLength(19);

    const slugs = SINACE_SPECIALTY_CATALOG.map(item => item.slug);
    expect(new Set(slugs).size).toBe(19);

    for (const specialty of SINACE_SPECIALTY_CATALOG) {
      expect(specialty.name.trim().length).toBeGreaterThan(3);
      expect(specialty.shortLabel.trim().length).toBeGreaterThan(2);
      expect(specialty.description.trim().length).toBeGreaterThan(20);
      expect(specialty.educationalFocus.trim().length).toBeGreaterThan(10);
      expect(specialty.operationalFocus.trim().length).toBeGreaterThan(10);
      expect(specialty.coordinationModel.trim().length).toBeGreaterThan(10);
    }
  });

  it("mantém as modalidades operacionais oficiais que sustentam o objeto social", () => {
    expect(SINACE_OPERATION_MODALITIES).toEqual([
      "Regime ambulatorial e hospitalar",
      "Baixa, média e alta complexidade",
      "Cirurgia convencional",
      "Cirurgia laparoscópica",
      "Cirurgia endoscópica",
      "Cirurgia robótica",
      "Transplantes",
      "Procedimentos minimamente invasivos",
    ]);
  });

  it("centraliza o bloco institucional oficial reutilizado pela landing e pelo workspace", () => {
    expect(SINACE_INSTITUTIONAL_PROFILE).toMatchObject({
      legalName: "SINACE",
      extendedName: "Sistema Nacional Hospitalar de Cirurgias Especializadas",
      phone: "14 99808-1759",
      email: "sinace.cirurgias@gmail.com",
      instagram: "@sinace_cirurgias",
      cnpj: "65.897.867/0001-37",
      headquarters: "Ourinhos/SP",
    });

    expect(SINACE_INSTITUTIONAL_PROFILE.tagline).toContain("redução de filas cirúrgicas");
    expect(SINACE_INSTITUTIONAL_PROFILE.socialObject).toContain("regime ambulatorial e hospitalar");
    expect(SINACE_INSTITUTIONAL_PROFILE.socialObject).toContain("todas as cirurgias, convencionais e laparoscópicas");
    expect(SINACE_INSTITUTIONAL_PROFILE.socialObject).toContain("procedimentos minimamente invasivos");
    expect(SINACE_INSTITUTIONAL_PROFILE.socialObject).toContain("transplantes");
  });
});
