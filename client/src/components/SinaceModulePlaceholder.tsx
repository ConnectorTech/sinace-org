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

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-primary/80">
Arquitetura da superfície
              </CardDescription>
              <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
Componentes já estruturados nesta superfície
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {pillars.map(item => (
                <div key={item.title} className="rounded-[1.3rem] border border-border/70 bg-slate-50/85 p-4">
                  <span className="inline-flex rounded-full bg-primary/8 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase leading-5 tracking-[0.12em] text-primary">
                    Estruturado
                  </span>
                  <h3 className="mt-2 text-base font-semibold leading-6 tracking-[-0.02em] text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <Separator className="my-3" />
                  <p className="text-sm leading-6 text-slate-500">{item.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-primary/80">
Operação contínua
              </CardDescription>
              <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
Desdobramentos operacionais já mapeados
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-[1.2rem] border border-border/70 bg-slate-50/90 px-4 py-3">
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
