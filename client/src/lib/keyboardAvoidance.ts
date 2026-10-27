/**
 * Keyboard avoiding para o SINACE em WebView/PWA (iOS e Android).
 *
 * O teclado virtual encolhe o visual viewport, mas no iOS o layout viewport não muda: elementos
 * `fixed`/`sticky` ficam atrás do teclado. Aqui medimos a área coberta pelo teclado e a publicamos
 * em `--keyboard-inset` (consumida por `.form-actions-sticky` e por `scroll-padding-bottom`),
 * marcamos `<html data-keyboard-open>` e trazemos o campo ativo para a área visível.
 */

/** Variações menores que isso vêm da barra de endereço/zoom, não do teclado. */
export const KEYBOARD_MIN_HEIGHT = 120;

/** Tempo para o teclado terminar a animação de abertura antes de rolar até o campo. */
export const FOCUS_SCROLL_DELAY_MS = 280;

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

export type ViewportMetrics = {
  layoutHeight: number;
  visualHeight: number;
  visualOffsetTop: number;
};

/** Altura, em px, da parte do layout viewport coberta pelo teclado (0 quando fechado). */
export function computeKeyboardInset({ layoutHeight, visualHeight, visualOffsetTop }: ViewportMetrics): number {
  const covered = Math.round(layoutHeight - visualHeight - visualOffsetTop);
  return covered >= KEYBOARD_MIN_HEIGHT ? covered : 0;
}

/** Elementos que abrem o teclado virtual ao receber foco. */
export function isTextEntryElement(element: Element | null): element is HTMLElement {
  if (!element || !(element as HTMLElement).tagName) return false;
  const html = element as HTMLElement;
  const tag = html.tagName.toLowerCase();

  if (tag === "textarea") return !(html as HTMLTextAreaElement).readOnly;
  if (tag === "input") {
    const input = html as HTMLInputElement;
    return !input.readOnly && !NON_TEXT_INPUT_TYPES.has((input.type || "text").toLowerCase());
  }
  return html.isContentEditable;
}

/**
 * Instala os listeners globais. Retorna a função de limpeza.
 * Sem `visualViewport` (navegadores antigos) apenas o scroll do campo focado é aplicado.
 */
export function installKeyboardAvoidance(win: Window = window): () => void {
  const doc = win.document;
  const root = doc.documentElement;
  const viewport = win.visualViewport;
  let focusTimer: number | undefined;
  let frame: number | undefined;

  const applyInset = () => {
    frame = undefined;
    if (!viewport) return;

    const inset = computeKeyboardInset({
      layoutHeight: win.innerHeight,
      visualHeight: viewport.height,
      visualOffsetTop: viewport.offsetTop,
    });
    // Android com `interactive-widget=resizes-content` encolhe o layout (inset = 0); então
    // também consideramos o foco em campo de texto para esconder a navegação inferior.
    const keyboardOpen = inset > 0 || (isTextEntryElement(doc.activeElement) && win.matchMedia?.("(pointer: coarse)").matches);

    root.style.setProperty("--keyboard-inset", `${inset}px`);
    if (keyboardOpen) root.setAttribute("data-keyboard-open", "");
    else root.removeAttribute("data-keyboard-open");
  };

  const scheduleInset = () => {
    if (frame !== undefined) return;
    frame = win.requestAnimationFrame(applyInset);
  };

  const revealActiveField = () => {
    const active = doc.activeElement;
    if (!isTextEntryElement(active)) return;
    // `scroll-padding` no <html> já desconta o teclado e a barra de ações fixa.
    active.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onFocusIn = (event: FocusEvent) => {
    if (!isTextEntryElement(event.target as Element)) return;
    scheduleInset();
    win.clearTimeout(focusTimer);
    focusTimer = win.setTimeout(() => {
      applyInset();
      revealActiveField();
    }, FOCUS_SCROLL_DELAY_MS);
  };

  const onFocusOut = () => {
    // Aguarda o próximo foco: trocar de campo não deve piscar a navegação inferior.
    win.setTimeout(scheduleInset, 0);
  };

  const onViewportResize = () => {
    scheduleInset();
    if (isTextEntryElement(doc.activeElement)) {
      win.clearTimeout(focusTimer);
      focusTimer = win.setTimeout(revealActiveField, 60);
    }
  };

  doc.addEventListener("focusin", onFocusIn);
  doc.addEventListener("focusout", onFocusOut);
  viewport?.addEventListener("resize", onViewportResize);
  viewport?.addEventListener("scroll", scheduleInset);
  applyInset();

  return () => {
    doc.removeEventListener("focusin", onFocusIn);
    doc.removeEventListener("focusout", onFocusOut);
    viewport?.removeEventListener("resize", onViewportResize);
    viewport?.removeEventListener("scroll", scheduleInset);
    win.clearTimeout(focusTimer);
    if (frame !== undefined) win.cancelAnimationFrame(frame);
    root.style.removeProperty("--keyboard-inset");
    root.removeAttribute("data-keyboard-open");
  };
}
