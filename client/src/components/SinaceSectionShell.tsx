import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SINACE_INSTITUTIONAL_PROFILE } from "@shared/sinaceCatalog";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type HighlightCard = {
  title: string;
  description: string;
  metric?: string;
};

type SinaceSectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  highlights: HighlightCard[];
  children?: ReactNode;
  ctaLabel?: string;
  className?: string;
};

export function SinaceSectionShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  badge,
  highlights,
  children,
  ctaLabel = "Estruturar módulo",
  className,
}: SinaceSectionShellProps) {
  const institutionalProfileWithExtras = SINACE_INSTITUTIONAL_PROFILE as typeof SINACE_INSTITUTIONAL_PROFILE & {
    facebook?: string;
    cep?: string;
  };
  const footerEntries = [
    { label: "Contato", value: SINACE_INSTITUTIONAL_PROFILE.phone },
    { label: "E-mail", value: SINACE_INSTITUTIONAL_PROFILE.email },
    { label: "Instagram", value: SINACE_INSTITUTIONAL_PROFILE.instagram },
    ...(institutionalProfileWithExtras.facebook
      ? [{ label: "Facebook", value: institutionalProfileWithExtras.facebook }]
      : []),
    ...(institutionalProfileWithExtras.cep
      ? [{ label: "CEP", value: institutionalProfileWithExtras.cep }]
      : []),
    { label: "Sede administrativa", value: SINACE_INSTITUTIONAL_PROFILE.headquarters },
  ];

  return (
    <div className={cn("space-y-8", className)}>
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,rgba(11,33,66,0.96),rgba(17,58,105,0.88)_58%,rgba(21,117,122,0.72))] px-6 py-7 text-primary-foreground shadow-[0_30px_80px_rgba(7,21,46,0.18)] md:px-8 md:py-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-cyan-100/90">
                {eyebrow}
              </span>
              {badge ? (
                <Badge className="rounded-full border border-cyan-200/30 bg-cyan-100/12 px-3 py-1 text-cyan-100 hover:bg-cyan-100/12">
                  {badge}
                </Badge>
              ) : null}
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/14 bg-white/10">
                <Icon className="h-6 w-6 text-cyan-100" />
              </div>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-100/86 md:text-lg">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
              Direção institucional
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-100/86">
              {SINACE_INSTITUTIONAL_PROFILE.tagline}
            </p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-100/82">
              <p>{SINACE_INSTITUTIONAL_PROFILE.socialObject}</p>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100/78">
                {ctaLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {highlights.map(highlight => (
          <Card key={highlight.title} className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)] backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-3">
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
                Vetor estrutural
              </CardDescription>
              <CardTitle className="text-xl tracking-[-0.03em] text-slate-950">
                {highlight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-slate-600">{highlight.description}</p>
              {highlight.metric ? (
                <div className="inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {highlight.metric}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>

      {children ? <section className="space-y-4">{children}</section> : null}

      <section className="rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,248,255,0.92))] p-6 shadow-[0_20px_48px_rgba(15,54,104,0.08)] md:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
              Base institucional oficial
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Estrutura institucional consolidada ao final do módulo
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {SINACE_INSTITUTIONAL_PROFILE.socialObject}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">CNPJ</p>
            <p className="mt-2 text-base font-medium leading-7 text-slate-950">{SINACE_INSTITUTIONAL_PROFILE.cnpj}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {footerEntries.map(entry => (
            <div key={entry.label} className="rounded-[1.35rem] border border-border/70 bg-white/82 p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">{entry.label}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{entry.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
