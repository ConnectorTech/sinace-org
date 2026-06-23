import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "client", "public");
const indexHtmlPath = path.join(projectRoot, "client", "index.html");
const manifestPath = path.join(publicDir, "manifest.webmanifest");
const offlinePath = path.join(publicDir, "offline.html");
const serviceWorkerPath = path.join(publicDir, "sw.js");

describe("SINACE PWA assets", () => {
  it("expõe um manifesto instalável com rota inicial do app e ícones obrigatórios", () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    expect(manifest.name).toContain("SINACE");
    expect(manifest.start_url).toBe("/app");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/icons/icon-192.png", sizes: "192x192" }),
        expect.objectContaining({ src: "/icons/icon-512.png", sizes: "512x512" }),
        expect.objectContaining({ src: "/icons/maskable-icon-512.png", sizes: "512x512", purpose: "maskable" }),
        expect.objectContaining({ src: "/icons/apple-touch-icon-180.png", sizes: "180x180" }),
      ])
    );
  });

  it("expõe referências explícitas de favicon e apple touch icon no HTML principal", () => {
    const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

    expect(indexHtml).toContain('href="/favicon-32x32.png"');
    expect(indexHtml).toContain('href="/favicon-16x16.png"');
    expect(indexHtml).toContain('href="/favicon.ico"');
    expect(indexHtml).toContain('href="/icons/apple-touch-icon-180.png"');
  });

  it("inclui tela offline e service worker com ativos centrais do app", () => {
    const offlineHtml = fs.readFileSync(offlinePath, "utf8");
    const serviceWorker = fs.readFileSync(serviceWorkerPath, "utf8");

    expect(offlineHtml).toContain("SINACE offline");
    expect(serviceWorker).toContain("/manifest.webmanifest");
    expect(serviceWorker).toContain("/offline.html");
    expect(serviceWorker).toContain("/app");
  });

  it("mantém os arquivos gráficos de instalação do iPhone e favicons disponíveis em client/public", () => {
    const expectedFiles = [
      path.join(publicDir, "icons", "icon-192.png"),
      path.join(publicDir, "icons", "icon-512.png"),
      path.join(publicDir, "icons", "maskable-icon-512.png"),
      path.join(publicDir, "icons", "apple-touch-icon-180.png"),
      path.join(publicDir, "favicon-32x32.png"),
      path.join(publicDir, "favicon-16x16.png"),
      path.join(publicDir, "favicon.ico"),
      path.join(publicDir, "splash", "apple-splash-1179-2556.png"),
      path.join(publicDir, "splash", "apple-splash-1290-2796.png"),
    ];

    for (const file of expectedFiles) {
      expect(fs.existsSync(file), `${file} deveria existir`).toBe(true);
    }
  });
});
