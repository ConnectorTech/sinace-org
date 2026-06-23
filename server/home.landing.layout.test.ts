import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SINACE landing institutional block layout", () => {
  const homeSource = readFileSync(
    path.resolve(process.cwd(), "client/src/pages/Home.tsx"),
    "utf8"
  );

  it("remove a mensagem de sessão reconhecida da abertura da landing", () => {
    expect(homeSource).not.toContain("Sessão reconhecida");
  });

  it("mantém os dados institucionais no bloco final da seção de contato", () => {
    const footerBlockStart = homeSource.indexOf('className="relative mt-10 border-t border-white/10 pt-8"');

    expect(footerBlockStart).toBeGreaterThan(0);
    expect(homeSource.indexOf("SINACE_INSTITUTIONAL_PROFILE.headquarters} · CNPJ", footerBlockStart)).toBeGreaterThan(footerBlockStart);
    expect(homeSource.indexOf("SINACE_INSTITUTIONAL_PROFILE.phone} · {SINACE_INSTITUTIONAL_PROFILE.email}", footerBlockStart)).toBeGreaterThan(footerBlockStart);
  });

  it("não duplica o bloco resumido de cidade, CNPJ, telefone e e-mail na hero", () => {
    const headquartersOccurrences = homeSource.match(/SINACE_INSTITUTIONAL_PROFILE\.headquarters\} · CNPJ/g) ?? [];
    const phoneOccurrences = homeSource.match(/SINACE_INSTITUTIONAL_PROFILE\.phone\} · \{SINACE_INSTITUTIONAL_PROFILE\.email\}/g) ?? [];

    expect(headquartersOccurrences).toHaveLength(1);
    expect(phoneOccurrences).toHaveLength(1);
  });
});
