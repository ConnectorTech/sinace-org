import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buttonVariants } from "./button";

describe("área de toque mínima de 44×44", () => {
  it("todos os tamanhos de botão chegam a 44px em telas de toque", () => {
    for (const size of ["default", "sm", "lg"] as const) {
      expect(buttonVariants({ size })).toContain("pointer-coarse:h-11");
    }
    for (const size of ["icon", "icon-sm", "icon-lg"] as const) {
      expect(buttonVariants({ size })).toContain("pointer-coarse:size-11");
    }
  });

  it("o CSS global garante altura mínima e expansão invisível para controles pequenos", () => {
    const css = fs.readFileSync(path.resolve(import.meta.dirname, "../../index.css"), "utf8");
    expect(css).toContain("@utility touch-target");
    expect(css).toMatch(/@media \(pointer: coarse\)[\s\S]*min-height: 44px/);
  });
});
