import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Home app cover", () => {
  const homePath = join(process.cwd(), "client/src/pages/Home.tsx");
  const homeSource = readFileSync(homePath, "utf8");
  const expectedCoverUrl =
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/99E8DFD1-E837-43E2-BF4E-6ACE65F714C0_aec8439f.png";

  it("uses the uploaded SINACE cover image in the app section", () => {
    expect(homeSource).toContain(expectedCoverUrl);
  });

  it("binds the uploaded image to the Aplicativo próprio mockup surface", () => {
    expect(homeSource).toContain('kicker="Aplicativo próprio"');
    expect(homeSource).toContain("src={appImage}");
    expect(homeSource).toContain("Healthtech em evolução");
  });

  it("no longer references the previous app cover image", () => {
    expect(homeSource).not.toContain(
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-app-intelligence-nQB22DiR8nQoP3YBc99foR.webp",
    );
  });
});
