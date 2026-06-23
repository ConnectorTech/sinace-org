import React, { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
Arquitetura da superfície
              </CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
Componentes já estruturados nesta superfície
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pillars.map(item => (
                <div key={item.title} className="rounded-[1.3rem] border border-border/70 bg-slate-50/85 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                    <span className="rounded-full bg-primary/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
                      Estruturado
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <Separator className="my-4" />
                  <p className="text-sm leading-7 text-slate-500">{item.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
Operação contínua
              </CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-white">
Desdobramentos operacionais já mapeados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-cyan-100">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-100/86">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </SinaceSectionShell>
  );
}
