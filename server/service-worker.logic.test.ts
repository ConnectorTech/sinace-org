import { describe, expect, it } from "vitest";

import {
  getSinaceCacheKeys,
  shouldEnableSinaceServiceWorker,
} from "../client/src/lib/serviceWorker";

describe("SINACE service worker safeguards", () => {
  it("desabilita o service worker em localhost e no preview do Manus", () => {
    expect(shouldEnableSinaceServiceWorker("localhost")).toBe(false);
    expect(shouldEnableSinaceServiceWorker("127.0.0.1")).toBe(false);
    expect(shouldEnableSinaceServiceWorker("3000-idtoiaozoc44zrqw1wtxk-7e9775aa.us1.manus.computer")).toBe(false);
  });

  it("mantém o service worker ativo apenas em domínios publicados", () => {
    expect(shouldEnableSinaceServiceWorker("sinace.org")).toBe(true);
    expect(shouldEnableSinaceServiceWorker("www.sinace.org")).toBe(true);
    expect(shouldEnableSinaceServiceWorker("sinace.manus.space")).toBe(true);
  });

  it("seleciona somente caches versionados do PWA da SINACE", () => {
    expect(
      getSinaceCacheKeys([
        "sinace-pwa-v2",
        "sinace-pwa-v3",
        "workbox-precache",
        "other-app-cache",
      ])
    ).toEqual(["sinace-pwa-v2", "sinace-pwa-v3"]);
  });
});
