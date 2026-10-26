import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type HighlightCard = {
  title: string;
  description: string;
  /** Ex.: "19 ativas" — o primeiro termo vira o número em destaque do chip. */
  metric?: string;
};

/** Separa "19 ativas" em { value: "19", label: "ativas" } para o chip de métrica. */
export function splitHighlightMetric(metric: string | undefined, fallbackLabel: string) {
  const match = metric?.trim().match(/^(\S+)\s+(.+)$/);
  if (match) return { value: match[1], label: match[2] };
  return { value: metric?.trim() || "—", label: fallbackLabel };
}

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
  return (
    <div className={cn("space-y-6", className)}>
      <SinaceModuleHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon={Icon}
        badges={[badge, ctaLabel]}
      />

      <SinaceMetricChips highlights={highlights} />

      {children ? <section className="space-y-4">{children}</section> : null}

    </div>
  );
}

/**
 * Métricas rápidas em chips horizontais com rolagem lateral no mobile.
 * O texto explicativo de cada métrica fica no tooltip nativo e no leitor de tela.
 */
export function SinaceMetricChips({ highlights }: { highlights: HighlightCard[] }) {
  if (highlights.length === 0) return null;

  return (
    <ul
      aria-label="Métricas rápidas"
      className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {highlights.map(highlight => {
        const { value, label } = splitHighlightMetric(highlight.metric, highlight.title);
        return (
          <li
            key={highlight.title}
            title={highlight.description}
            className="flex shrink-0 snap-start items-baseline gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2.5 shadow-soft"
          >
            <span className="text-lg font-semibold leading-6 tracking-[-0.03em] text-primary tabular-nums">{value}</span>
            <span className="whitespace-nowrap text-sm font-medium leading-6 text-slate-700 first-letter:uppercase">{label}</span>
            <span className="sr-only">: {highlight.title}. {highlight.description}</span>
          </li>
        );
      })}
    </ul>
  );
}

type SinaceModuleHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Badges discretos de status; valores vazios são ignorados. */
  badges?: Array<string | undefined>;
};

/**
 * Bloco de abertura compacto dos módulos: título conciso, badges discretos e descrição curta.
 * O h1 da página fica no cabeçalho do workspace, por isso aqui o título é h2.
 */
export function SinaceModuleHeader({ eyebrow, title, description, icon: Icon, badges = [] }: SinaceModuleHeaderProps) {
  const visibleBadges = Array.from(new Set(badges.filter((badge): badge is string => Boolean(badge))));

  return (
    <section className="overflow-hidden rounded-surface border border-white/10 bg-[linear-gradient(135deg,rgba(11,33,66,0.96),rgba(22,72,140,0.92)_58%,rgba(13,128,104,0.82))] px-4 py-4 text-primary-foreground shadow-raised md:px-6 md:py-5">
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip border border-white/14 bg-white/10 md:h-11 md:w-11">
          <Icon className="h-5 w-5 text-cyan-100" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="app-eyebrow text-cyan-100/80">
              {eyebrow}
            </span>
            {visibleBadges.map(badge => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-2 py-px text-[0.7rem] font-medium leading-5 text-cyan-100/85"
              >
                {badge}
              </span>
            ))}
          </div>
          <h2 className="mt-1 text-balance text-lg font-semibold leading-6 tracking-[-0.03em] text-white md:text-xl">
            {title}
          </h2>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-100/80">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
