import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { sinaceNavigationGroups } from "@/lib/sinace-navigation";
import AppDashboard from "./AppDashboard";

vi.mock("wouter", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    sinace: {
      dashboard: {
        useQuery: () => ({
          data: {
            metrics: {
              specialties: 19,
              institutions: 4,
              queueEntries: 12,
              tracks: 7,
              documents: 9,
            },
          },
          isLoading: false,
        }),
      },
      institutions: {
        list: {
          useQuery: () => ({
            data: [],
            isLoading: false,
          }),
        },
      },
      queue: {
        recent: {
          useQuery: () => ({
            data: [],
            isLoading: false,
          }),
        },
      },
    },
  },
}));

describe("AppDashboard", () => {
  it("renderiza links internos válidos para os módulos-base do workspace", () => {
    const markup = renderToStaticMarkup(<AppDashboard />);
    const workspaceEntries = sinaceNavigationGroups.flatMap(group => group.items);

    expect(markup.match(/Abrir módulo/g)?.length ?? 0).toBe(workspaceEntries.length);

    for (const entry of workspaceEntries) {
      expect(markup).toContain(`href="${entry.path}"`);
      expect(markup).toContain(entry.label);
    }
  });
});
