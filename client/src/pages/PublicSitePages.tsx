import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import PublicPageLayout from "@/components/PublicPageLayout";
import { trpc } from "@/lib/trpc";
import {
  SINACE_APPLICATION_CAPABILITIES,
  SINACE_EXPANSION_ROADMAP,
  SINACE_HIGHLIGHT_METRICS,
  SINACE_OPERATING_MODEL,
  SINACE_PUBLIC_CONTACT_CHANNELS,
  SINACE_PUBLIC_GOOGLE_MAPS_QUERY,
  SINACE_PUBLIC_IMAGES,
  SINACE_PUBLIC_MAP_CENTER,
  SINACE_PUBLIC_PAGE_INTROS,
  SINACE_PUBLIC_SPECIALTY_PREVIEW,
  SINACE_PILLARS,
  SINACE_STAKEHOLDERS,
} from "@/lib/sinacePublicSite";
import {
  SINACE_INSTITUTIONAL_PROFILE,
  SINACE_OPERATION_MODALITIES,
  SINACE_SPECIALTY_CATALOG,
} from "@shared/sinaceCatalog";
import {
  ArrowRight,
  Blocks,
  Building2,
  CheckCircle2,
  ChevronRight,
  ContactRound,
  HeartPulse,
  Mail,
  MapPinned,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

function PublicSectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-cyan-700">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-slate-600 md:text-lg">{description}</p>
    </div>
  );
}

function PublicPrimaryActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800">
        <Link href="/contato">
          Falar com a SINACE
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" className="rounded-full border-slate-300 bg-white px-6 text-slate-700 hover:bg-slate-50">
        <Link href="/app">Entrar no workspace</Link>
      </Button>
    </div>
  );
}

function RouteSummaryCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof HeartPulse;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </article>
  );
}

export function PropostaPage() {
  const intro = SINACE_PUBLIC_PAGE_INTROS.proposta;

  return (
    <PublicPageLayout pageTitle={intro.title} pageDescription={intro.description}>
      {/* Hero Premium */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28 text-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.04),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.03),transparent_40%)]" />
        <div className="container relative">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-700 backdrop-blur-md mb-8">
                <HeartPulse className="h-3.5 w-3.5 text-cyan-600" />
                {intro.eyebrow}
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl lg:text-6xl leading-[1.05]">
                Estrutura institucional para transformar filas em programa cirúrgico rastreável.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                A proposta institucional da SINACE combina coordenação clínica, desenho de capacidade, governança executiva e tecnologia própria para apoiar contratantes públicos, filantrópicos e complementares em ciclos de ampliação da produção cirúrgica.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full bg-cyan-300 px-7 text-slate-950 font-semibold hover:bg-cyan-200">
                  <Link href="/contato">
                    Falar com a SINACE
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  <Link href="/app">Entrar no workspace</Link>
                </Button>
              </div>
            </div>

            <div className="surface-panel rounded-[2.2rem] border border-slate-200 p-8 shadow-[0_24px_64px_rgba(15,23,42,0.05)]">
              <p className="section-kicker text-cyan-700">Objeto social</p>
              <div className="mt-3 h-px w-8 bg-cyan-200" />
              <p className="mt-5 text-lg leading-8 text-slate-700">
                {SINACE_INSTITUTIONAL_PROFILE.socialObject}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {SINACE_OPERATION_MODALITIES.map(item => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.3rem] border border-cyan-100 bg-cyan-50/50 px-4 py-3.5">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                    <p className="text-xs leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares Estrategicos */}
      <section className="relative bg-slate-50 py-20 md:py-28 border-t border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(52,211,153,0.03),transparent_50%)]" />
        <div className="container relative">
          <div className="mb-14 text-center">
            <p className="section-kicker text-cyan-700">Pilares estratégicos</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl mx-auto">
              A estrutura que sustenta a proposta da SINACE.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 mx-auto">
              Cada pilar representa uma dimensão operacional integrada, desde a execução assistencial até o ativo digital e a governança de longo prazo.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SINACE_PILLARS.map(item => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface-panel hover-lift relative overflow-hidden rounded-[2.2rem] border-t-2 border-t-emerald-500 p-7 flex flex-col shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="section-kicker text-cyan-700 text-[0.65rem]">Pilar</span>
                  </div>
                  <h3 className="mt-6 text-base font-semibold tracking-[-0.03em] text-slate-950 leading-6">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metricas */}
      <section className="relative bg-white py-20 md:py-28 border-t border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.03),transparent_60%)]" />
        <div className="container relative">
          <div className="mb-12 text-center">
            <p className="section-kicker text-cyan-700">Indicadores institucionais</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">
              Dimensões que sustentam a credibilidade da proposta.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {SINACE_HIGHLIGHT_METRICS.map(metric => (
              <article key={metric.label} className="surface-panel hover-glow-blue relative overflow-hidden rounded-[2.2rem] border-t-2 border-t-cyan-600 p-8 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                <p className="section-kicker text-cyan-700">{metric.label}</p>
                <div className="mt-3 h-px w-10 bg-cyan-200" />
                <p className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-slate-950">{metric.value}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{metric.helper}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
export function OperacaoPage() {
  const intro = SINACE_PUBLIC_PAGE_INTROS.operacao;

  return (
    <PublicPageLayout pageTitle={intro.title} pageDescription={intro.description}>
      <section className="py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <PublicSectionHeading
              eyebrow={intro.eyebrow}
              title="Leitura da fila, ativação cirúrgica e monitoramento contínuo em uma mesma arquitetura operacional."
              description="A SINACE organiza o fluxo assistencial desde a análise da demanda reprimida até a consolidação regional da produção, com protocolos, escalonamento de equipes e leitura executiva da operação em tempo real."
            />
            <div className="mt-8">
              <PublicPrimaryActions />
            </div>
            <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
              <img
                src={SINACE_PUBLIC_IMAGES.operations}
                alt="Centro operacional hospitalar da SINACE"
                className="h-[340px] w-full object-cover"
              />
              <div className="border-t border-slate-200 p-6">
                <p className="text-sm leading-7 text-slate-600">
                  A operação foi desenhada para contratos institucionais com visão territorial, integração hospitalar, pactuação de metas e sustentação técnica em todas as fases do ciclo cirúrgico.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {SINACE_OPERATING_MODEL.map(item => (
              <article key={item.step} className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">Etapa {item.step}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{item.title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <Blocks className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/85 py-16">
        <div className="container">
          <PublicSectionHeading
            eyebrow="Ecossistema contratante"
            title="Modelo preparado para operar com governo, OSS, Santas Casas e redes hospitalares."
            description="A implantação institucional considera contratualização, coordenação multiponto e adaptação à infraestrutura existente de cada rede parceira."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {SINACE_STAKEHOLDERS.map(item => (
              <RouteSummaryCard key={item.title} icon={item.icon} title={item.title} text={item.text} />
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

export function CoberturaPage() {
  const intro = SINACE_PUBLIC_PAGE_INTROS.cobertura;

  return (
    <PublicPageLayout pageTitle={intro.title} pageDescription={intro.description}>
      <section className="py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div>
            <PublicSectionHeading
              eyebrow={intro.eyebrow}
              title="Cobertura assistencial com especialidades, modalidades e desenho de escala nacional."
              description="A SINACE apresenta cobertura cirúrgica orientada por capacidade instalada, linhas assistenciais e articulação institucional, preservando previsibilidade para expansão regional e nacional."
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SINACE_SPECIALTY_CATALOG.map(specialty => (
                <div key={specialty.slug} className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                  {specialty.name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">Modalidades operatórias</p>
              <div className="mt-5 space-y-3">
                {SINACE_OPERATION_MODALITIES.map(item => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
              <img
                src={SINACE_PUBLIC_IMAGES.institutional}
                alt="Equipe institucional e ambiente clínico da SINACE"
                className="h-[240px] w-full object-cover"
              />
              <div className="p-6">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Leitura institucional</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  A cobertura combina linhas de cirurgia eletiva, desenho hospitalar, apoio à contratualização e capacidade de expansão progressiva em parceria com redes públicas e complementares.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/85 py-16">
        <div className="container">
          <PublicSectionHeading
            eyebrow="Expansão nacional"
            title="Roadmap institucional orientado por pilotos, consolidação estadual e escala nacional."
            description="A expansão da SINACE foi desenhada para amadurecer contratos, reforçar a base digital e criar continuidade operacional em múltiplos territórios."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {SINACE_EXPANSION_ROADMAP.map(item => (
              <article key={item.phase} className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">{item.phase}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

export function AplicativoPage() {
  const intro = SINACE_PUBLIC_PAGE_INTROS.aplicativo;

  return (
    <PublicPageLayout pageTitle={intro.title} pageDescription={intro.description}>
      <section className="py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
            <img
              src={SINACE_PUBLIC_IMAGES.application}
              alt="Workspace e aplicativo institucional da SINACE"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div>
            <PublicSectionHeading
              eyebrow={intro.eyebrow}
              title="A camada digital do SINACE organiza conhecimento, operação e governança em um mesmo workspace."
              description="O aplicativo próprio do SINACE conecta taxonomia cirúrgica, trilhas, biblioteca, publicações e áreas privadas em uma base preparada para expansão assistencial, educacional e institucional."
            />
            <div className="mt-8">
              <PublicPrimaryActions />
            </div>
            <div className="mt-10 space-y-4">
              {SINACE_APPLICATION_CAPABILITIES.map(item => (
                <div key={item} className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-600 shadow-sm">
                  <Smartphone className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/85 py-16">
        <div className="container grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <RouteSummaryCard
            icon={Blocks}
            title="Taxonomia persistente"
            text="Catálogo cirúrgico próprio, com organização por especialidade, status, ordenação e vocabulário institucional coerente."
          />
          <RouteSummaryCard
            icon={ShieldCheck}
            title="Governança digital"
            text="Base preparada para módulos administrativos, analytics, supervisão institucional e leitura estruturada da operação."
          />
          <RouteSummaryCard
            icon={Building2}
            title="Instituições e rede"
            text="Espaços dedicados a parceiros, instituições, ecossistema SUS e articulação entre contratantes e equipes."
          />
          <RouteSummaryCard
            icon={HeartPulse}
            title="Escala educacional"
            text="Trilhas, biblioteca, estudos de caso e áreas privadas voltadas à qualificação continuada e expansão do acervo clínico."
          />
        </div>
        <div className="container mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">Prévia do catálogo</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {SINACE_PUBLIC_SPECIALTY_PREVIEW.map(item => (
              <span key={item.slug} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

const defaultContactForm = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  interest: "proposta" as const,
  message: "",
};

export function ContatoPage() {
  const intro = SINACE_PUBLIC_PAGE_INTROS.contato;
  const [formState, setFormState] = useState(defaultContactForm);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const contactMutation = trpc.sinace.contact.submit.useMutation({
    onSuccess: result => {
      setFeedbackMessage(result.acknowledgement);
      setFormState(defaultContactForm);
    },
    onError: error => {
      setFeedbackMessage(error.message || "Não foi possível enviar a mensagem institucional neste momento.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(null);
    contactMutation.mutate(formState);
  };

  return (
    <PublicPageLayout pageTitle={intro.title} pageDescription={intro.description}>
      <section className="py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
          <div className="space-y-6">
            <PublicSectionHeading
              eyebrow={intro.eyebrow}
              title="Abra um canal institucional para propostas, parcerias e expansão da operação cirúrgica."
              description="O formulário abaixo direciona a mensagem para a base operacional do projeto. A sede informada permanece como referência institucional até a consolidação final do endereço completo com CEP oficial."
            />

            <div className="grid gap-4">
              {SINACE_PUBLIC_CONTACT_CHANNELS.map(channel => {
                const Icon = channel.icon;
                const content = (
                  <div className="flex items-start gap-4 rounded-[1.6rem] border border-slate-200 bg-white px-5 py-5 shadow-sm transition-colors hover:border-slate-300">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">{channel.label}</p>
                      <p className="mt-2 text-base font-medium text-slate-900">{channel.value}</p>
                    </div>
                  </div>
                );

                return channel.href ? (
                  <a key={channel.label} href={channel.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={channel.label}>{content}</div>
                );
              })}
            </div>

            <article className="rounded-[1.9rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_30px_80px_rgba(8,27,54,0.24)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200">Base institucional</p>
              <p className="mt-4 text-sm leading-7 text-slate-200">{SINACE_INSTITUTIONAL_PROFILE.socialObject}</p>
              <div className="mt-6 grid gap-3 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                  <span>{SINACE_INSTITUTIONAL_PROFILE.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                  <span>{SINACE_INSTITUTIONAL_PROFILE.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinned className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                  <span>{SINACE_INSTITUTIONAL_PROFILE.headquarters}</span>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nome
                  <input
                    type="text"
                    value={formState.name}
                    onChange={event => setFormState(current => ({ ...current, name: event.target.value }))}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-cyan-600"
                    placeholder="Seu nome completo"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Organização
                  <input
                    type="text"
                    value={formState.organization}
                    onChange={event => setFormState(current => ({ ...current, organization: event.target.value }))}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-cyan-600"
                    placeholder="Hospital, OSS, governo ou instituição"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  E-mail
                  <input
                    type="email"
                    value={formState.email}
                    onChange={event => setFormState(current => ({ ...current, email: event.target.value }))}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-cyan-600"
                    placeholder="contato@instituicao.br"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Telefone
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={event => setFormState(current => ({ ...current, phone: event.target.value }))}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-cyan-600"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Assunto principal
                  <select
                    value={formState.interest}
                    onChange={event => setFormState(current => ({ ...current, interest: event.target.value as typeof defaultContactForm.interest }))}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-cyan-600"
                  >
                    <option value="proposta">Proposta institucional</option>
                    <option value="parceria">Parceria estratégica</option>
                    <option value="expansao">Expansão regional</option>
                    <option value="governo">Articulação governamental</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Mensagem
                  <textarea
                    value={formState.message}
                    onChange={event => setFormState(current => ({ ...current, message: event.target.value }))}
                    className="min-h-[180px] rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-950 outline-none transition-colors focus:border-cyan-600"
                    placeholder="Descreva a necessidade institucional, a rede envolvida e o objetivo da conversa."
                    required
                  />
                </label>
              </div>

              {feedbackMessage ? (
                <p className={`mt-5 text-sm leading-6 ${contactMutation.error ? "text-rose-700" : "text-emerald-700"}`}>
                  {feedbackMessage}
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-500">
                  Ao enviar, a mensagem é encaminhada para o canal institucional do projeto SINACE.
                </p>
                <Button type="submit" className="rounded-full bg-cyan-300 px-6 text-slate-950 hover:bg-cyan-200" disabled={contactMutation.isPending}>
                  {contactMutation.isPending ? "Enviando mensagem" : "Enviar mensagem"}
                </Button>
              </div>
            </form>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-200 px-7 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <ContactRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Mapa da sede</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Referência institucional da base SINACE</h3>
                  </div>
                </div>
              </div>
              <MapView
                className="h-[360px]"
                initialCenter={SINACE_PUBLIC_MAP_CENTER}
                initialZoom={12}
                onMapReady={map => {
                  new window.google.maps.Marker({
                    map,
                    position: SINACE_PUBLIC_MAP_CENTER,
                    title: SINACE_INSTITUTIONAL_PROFILE.extendedName,
                  });
                }}
              />
              <div className="grid gap-4 px-7 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <p className="text-sm leading-7 text-slate-600">
                  Localização-base informada para contato institucional e articulação operacional. Caso prefira, abra a referência diretamente no mapa externo.
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${SINACE_PUBLIC_GOOGLE_MAPS_QUERY}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
