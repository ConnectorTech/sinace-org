import React, { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExpandableText } from "@/components/ExpandableText";
import { SinaceSectionShell } from "@/components/SinaceSectionShell";
import { LucideIcon } from "lucide-react";

type ModuleItem = {
  title: string;
  description: string;
  note: string;
};

type SinaceModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  highlights: Array<{
    title: string;
    description: string;
    metric?: string;
  }>;
  pillars: ModuleItem[];
  nextSteps: string[];
  children?: ReactNode;
};

export function SinaceModulePlaceholder({
  eyebrow,
  title,
  description,
  icon,
  badge,
  highlights,
  pillars,
  nextSteps,
  children,
}: SinaceModulePlaceholderProps) {
  return (
    <SinaceSectionShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      icon={icon}
      badge={badge}
      highlights={highlights}
    >
      <div className="space-y-4">
        {children}

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardDescription className="app-label text-primary">
Arquitetura da superfície
              </CardDescription>
              <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
Componentes já estruturados nesta superfície
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {pillars.map(item => (
                <div key={item.title} className="rounded-tile border border-border/70 bg-tile p-4">
                  <span className="app-eyebrow inline-flex rounded-full bg-primary/8 px-2.5 py-0.5 leading-5 text-primary">
                    Estruturado
                  </span>
                  <h3 className="mt-2 text-base font-semibold leading-6 tracking-[-0.02em] text-slate-950">{item.title}</h3>
                  <div className="mt-2">
                    <ExpandableText
                      title={item.title}
                      subtitle={eyebrow}
                      text={item.description}
                      details={
                        <>
                          <Separator />
                          <p className="text-sm leading-6 text-slate-500">{item.note}</p>
                        </>
                      }
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription className="app-label text-primary">
Operação contínua
              </CardDescription>
              <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
Desdobramentos operacionais já mapeados
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-tile border border-border/70 bg-tile px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-sm font-semibold text-primary">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </SinaceSectionShell>
  );
}
