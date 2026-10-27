import { describe, expect, it } from "vitest";
import { computeKeyboardInset, isTextEntryElement, KEYBOARD_MIN_HEIGHT } from "./keyboardAvoidance";

const fakeElement = (tagName: string, props: Record<string, unknown> = {}) =>
  ({ tagName, isContentEditable: false, readOnly: false, ...props }) as unknown as Element;

describe("computeKeyboardInset", () => {
  it("retorna 0 com o teclado fechado", () => {
    expect(computeKeyboardInset({ layoutHeight: 844, visualHeight: 844, visualOffsetTop: 0 })).toBe(0);
  });

  it("ignora variações pequenas da barra de endereço", () => {
    expect(
      computeKeyboardInset({ layoutHeight: 844, visualHeight: 844 - (KEYBOARD_MIN_HEIGHT - 1), visualOffsetTop: 0 })
    ).toBe(0);
  });

  it("mede a área coberta pelo teclado no iOS, descontando o scroll do visual viewport", () => {
    expect(computeKeyboardInset({ layoutHeight: 844, visualHeight: 508, visualOffsetTop: 0 })).toBe(336);
    expect(computeKeyboardInset({ layoutHeight: 844, visualHeight: 508, visualOffsetTop: 120 })).toBe(216);
  });
});

describe("isTextEntryElement", () => {
  it("reconhece campos que abrem o teclado virtual", () => {
    expect(isTextEntryElement(fakeElement("INPUT", { type: "text" }))).toBe(true);
    expect(isTextEntryElement(fakeElement("INPUT", { type: "email" }))).toBe(true);
    expect(isTextEntryElement(fakeElement("TEXTAREA"))).toBe(true);
    expect(isTextEntryElement(fakeElement("DIV", { isContentEditable: true }))).toBe(true);
  });

  it("ignora controles sem teclado e campos somente leitura", () => {
    expect(isTextEntryElement(fakeElement("INPUT", { type: "checkbox" }))).toBe(false);
    expect(isTextEntryElement(fakeElement("INPUT", { type: "submit" }))).toBe(false);
    expect(isTextEntryElement(fakeElement("INPUT", { type: "text", readOnly: true }))).toBe(false);
    expect(isTextEntryElement(fakeElement("BUTTON"))).toBe(false);
    expect(isTextEntryElement(null)).toBe(false);
  });
});
