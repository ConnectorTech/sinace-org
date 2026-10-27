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

describe("SINACE ícones nativos (Android e iOS)", () => {
  const resourcesDir = path.join(projectRoot, "resources");
  const androidRes = path.join(resourcesDir, "android", "app", "src", "main", "res");
  const iosAssets = path.join(resourcesDir, "ios", "App", "App", "Assets.xcassets");

  const pngInfo = (file: string) => {
    const buffer = fs.readFileSync(file);
    // Cabeçalho IHDR: largura (16), altura (20), tipo de cor (25): 2 = RGB, 6 = RGBA.
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), colorType: buffer[25] };
  };

  it("mantém os masters vetoriais em SVG", () => {
    for (const name of ["icon.svg", "icon-foreground.svg", "icon-background.svg", "icon-monochrome.svg"]) {
      const content = fs.readFileSync(path.join(resourcesDir, "icon", name), "utf8");
      expect(content).toContain('viewBox="0 0 1024 1024"');
    }
    expect(fs.existsSync(path.join(publicDir, "icons", "icon.svg"))).toBe(true);
  });

  it("declara o ícone adaptativo do Android com camadas de fundo, frente e monocromática", () => {
    for (const name of ["ic_launcher.xml", "ic_launcher_round.xml"]) {
      const xml = fs.readFileSync(path.join(androidRes, "mipmap-anydpi-v26", name), "utf8");
      expect(xml).toContain("<adaptive-icon");
      expect(xml).toContain("@mipmap/ic_launcher_background");
      expect(xml).toContain("@mipmap/ic_launcher_foreground");
      expect(xml).toContain("@mipmap/ic_launcher_monochrome");
    }

    const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
    for (const [density, scale] of Object.entries(densities)) {
      const folder = path.join(androidRes, `mipmap-${density}`);
      expect(pngInfo(path.join(folder, "ic_launcher.png")).width).toBe(48 * scale);
      expect(pngInfo(path.join(folder, "ic_launcher_round.png")).width).toBe(48 * scale);
      for (const layer of ["foreground", "background", "monochrome"]) {
        expect(pngInfo(path.join(folder, `ic_launcher_${layer}.png`)).width).toBe(108 * scale);
      }
    }
  });

  it("gera o asset catalog do iOS com todos os tamanhos e sem canal alfa", () => {
    const appIconDir = path.join(iosAssets, "AppIcon.appiconset");
    const contents = JSON.parse(fs.readFileSync(path.join(appIconDir, "Contents.json"), "utf8"));

    expect(fs.existsSync(path.join(iosAssets, "Contents.json"))).toBe(true);
    expect(contents.images.some((image: { idiom: string }) => image.idiom === "ios-marketing")).toBe(true);

    for (const image of contents.images as { filename: string; size: string; scale: string }[]) {
      const info = pngInfo(path.join(appIconDir, image.filename));
      const expected = Math.round(Number.parseFloat(image.size) * Number.parseInt(image.scale, 10));
      expect(info.width, image.filename).toBe(expected);
      expect(info.height, image.filename).toBe(expected);
      expect(info.colorType, `${image.filename} não pode ter alfa`).toBe(2);
    }
  });

  it("disponibiliza os ícones das lojas nos formatos exigidos", () => {
    const appStore = pngInfo(path.join(resourcesDir, "store", "app-store-icon-1024.png"));
    const googlePlay = pngInfo(path.join(resourcesDir, "store", "google-play-icon-512.png"));

    expect(appStore).toMatchObject({ width: 1024, height: 1024, colorType: 2 });
    expect(googlePlay).toMatchObject({ width: 512, height: 512 });
  });
});
