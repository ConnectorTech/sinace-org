import { describe, expect, it } from "vitest";
import {
  detectIosDevice,
  detectStandaloneMode,
  shouldRenderInstallPrompt,
} from "../client/src/lib/pwa";

describe("SINACE PWA prompt logic", () => {
  it("detecta corretamente iPhone e iPad a partir do user agent", () => {
    expect(detectIosDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)")).toBe(true);
    expect(detectIosDevice("Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X)")).toBe(true);
    expect(detectIosDevice("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe(false);
  });

  it("considera o app em modo standalone quando display-mode ou navigator.standalone estiverem ativos", () => {
    expect(detectStandaloneMode(true, false)).toBe(true);
    expect(detectStandaloneMode(false, true)).toBe(true);
    expect(detectStandaloneMode(false, false)).toBe(false);
  });

  it("exibe o banner no iPhone mesmo sem beforeinstallprompt, desde que não tenha sido dispensado", () => {
    expect(
      shouldRenderInstallPrompt({
        standalone: false,
        dismissed: false,
        ios: true,
        hasDeferredPrompt: false,
      })
    ).toBe(true);
  });

  it("exibe o banner em navegadores compatíveis quando o evento de instalação estiver disponível", () => {
    expect(
      shouldRenderInstallPrompt({
        standalone: false,
        dismissed: false,
        ios: false,
        hasDeferredPrompt: true,
      })
    ).toBe(true);
  });

  it("oculta o banner quando o app já está instalado ou quando o usuário já dispensou a sugestão", () => {
    expect(
      shouldRenderInstallPrompt({
        standalone: true,
        dismissed: false,
        ios: true,
        hasDeferredPrompt: true,
      })
    ).toBe(false);

    expect(
      shouldRenderInstallPrompt({
        standalone: false,
        dismissed: true,
        ios: true,
        hasDeferredPrompt: true,
      })
    ).toBe(false);
  });
});
