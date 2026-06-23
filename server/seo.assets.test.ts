import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "client", "public");
const indexHtmlPath = path.join(projectRoot, "client", "index.html");
const robotsPath = path.join(publicDir, "robots.txt");
const sitemapPath = path.join(publicDir, "sitemap.xml");
const manifestPath = path.join(publicDir, "manifest.webmanifest");

describe("SINACE SEO técnico", () => {
  it("expõe metadados essenciais de indexação e compartilhamento no HTML principal", () => {
    const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

    expect(indexHtml).toContain("<title>SINACE | Redução de Filas Cirúrgicas</title>");
    expect(indexHtml).toContain('name="description"');
    expect(indexHtml).toContain('name="keywords"');
    expect(indexHtml).toContain(
      'content="SINACE é o site oficial para redução de filas cirúrgicas com governança, operação em rede e capacidade hospitalar organizada."',
    );
    expect(indexHtml).toContain(
      'content="SINACE, site oficial SINACE, redução de filas cirúrgicas, gestão cirúrgica hospitalar, capacidade cirúrgica, cirurgias especializadas"',
    );
    expect(indexHtml).toContain('name="robots"');
    expect(indexHtml).toContain('rel="canonical" href="https://sinace.org/"');
    expect(indexHtml).toContain('property="og:title" content="SINACE | Redução de Filas Cirúrgicas"');
    expect(indexHtml).toContain('property="og:description"');
    expect(indexHtml).toContain('property="og:url" content="https://sinace.org/"');
    expect(indexHtml).toContain('name="twitter:card" content="summary_large_image"');
    expect(indexHtml).toContain('type="application/ld+json"');
    expect(indexHtml).toContain('Site oficial da SINACE');
    expect(indexHtml).toContain('"@type": "Organization"');
    expect(indexHtml).toContain('"alternateName": "Sistema Nacional Hospitalar de Cirurgias Especializadas"');
    expect(indexHtml).toContain('"propertyID": "CNPJ"');
    expect(indexHtml).toContain('"contactType": "institutional"');
    expect(indexHtml).toContain('"@type": "WebSite"');
  });

  it("publica robots.txt e sitemap.xml com o domínio canônico do SINACE", () => {
    const robots = fs.readFileSync(robotsPath, "utf8");
    const sitemap = fs.readFileSync(sitemapPath, "utf8");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://sinace.org/sitemap.xml");
    expect(sitemap).toContain("<loc>https://sinace.org/</loc>");
    expect(sitemap).toContain("<loc>https://sinace.org/proposta</loc>");
    expect(sitemap).toContain("<loc>https://sinace.org/operacao</loc>");
    expect(sitemap).toContain("<loc>https://sinace.org/cobertura</loc>");
    expect(sitemap).toContain("<loc>https://sinace.org/aplicativo</loc>");
    expect(sitemap).toContain("<loc>https://sinace.org/contato</loc>");
    expect(sitemap).toContain("<priority>1.0</priority>");
    expect(sitemap).toContain("<priority>0.9</priority>");
    expect(sitemap).toContain("<priority>0.8</priority>");
  });

  it("mantém o manifesto alinhado ao escopo institucional atualizado da SINACE", () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    expect(manifest.name).toContain("SINACE");
    expect(manifest.description).toContain("redução de filas cirúrgicas");
    expect(manifest.description).toContain("convencionais e laparoscópicas");
  });
});
