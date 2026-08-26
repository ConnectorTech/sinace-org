/*
  Design reminder for SINACE Home:
  Futurismo assistencial de rede — hero panorâmico, autoridade institucional,
  profundidade visual clínica, assimetria editorial e narrativa de expansão nacional.
*/
import * as React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Gauge,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers3,
  Mail,
  MapPinned,
  Menu,
  Phone,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  TimerReset,
  X,
} from "lucide-react";
import {
  SINACE_INSTITUTIONAL_PROFILE,
  SINACE_OPERATION_MODALITIES,
  SINACE_SPECIALTY_CATALOG,
} from "@shared/sinaceCatalog";
import { SINACE_PUBLIC_NAV_ITEMS, SINACE_PUBLIC_IMAGES } from "@/lib/sinacePublicSite";
import "./Home.css";

const heroImage = SINACE_PUBLIC_IMAGES.hero;
const operationsImage = SINACE_PUBLIC_IMAGES.operations;
const appImage = SINACE_PUBLIC_IMAGES.application;
const expansionImage = SINACE_PUBLIC_IMAGES.expansion;
const logoImage = SINACE_PUBLIC_IMAGES.logo;
const institutionalImage = SINACE_PUBLIC_IMAGES.institutional;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 65,
      damping: 14,
      mass: 0.85,
    },
  },
};

const landingNavItems = SINACE_PUBLIC_NAV_ITEMS;

const stakeholders = [
  {
    title: "Governos estaduais, federais e municipais",
    text: "Estrutura para prestação de serviços cirúrgicos com governança, previsibilidade, regulação assistencial e leitura executiva da produção.",
    icon: Landmark,
  },
  {
    title: "OSS, redes complementares e contratantes",
    text: "Integração operacional a partir do diagnóstico da fila reprimida para acelerar a produção assistencial em ambiente hospitalar e ambulatorial.",
    icon: Layers3,
  },
  {
    title: "Santas Casas e hospitais",
    text: "Modelo para ativar infraestrutura, ampliar resolutividade por especialidade e consolidar polos estaduais, regionais e municipais.",
    icon: Building2,
  },
];

const pillars = [
  {
    title: "Prestação de Serviços Assistenciais",
    text: "Atuação ambulatorial e hospitalar de média e alta complexidade, estruturando a capacidade cirúrgica com qualidade e eficiência.",
    icon: Building2,
  },
  {
    title: "Diagnóstico da Fila Reprimida",
    text: "O modelo da SINACE parte do diagnóstico da fila reprimida para converter demandas represadas em fluxo assistencial gerenciável.",
    icon: TimerReset,
  },
  {
    title: "Inteligência Cirúrgica & Network",
    text: "Metodologia clínica aplicada e network profissional especializado para dar suporte técnico, segurança e previsibilidade em âmbito nacional.",
    icon: Stethoscope,
  },
  {
    title: "Sistema Educacional e Digital",
    text: "Plataforma tecnológica própria com taxonomia cirúrgica persistente, trilhas de aprendizagem, enciclopédia clínica e acervo acadêmico.",
    icon: ShieldCheck,
  },
];

const operatingModel = [
  {
    step: "01",
    title: "Diagnóstico da fila reprimida",
    text: "O modelo da SINACE parte do diagnóstico da fila reprimida, mapeando perfil clínico, criticidade e infraestrutura disponível.",
  },
  {
    step: "02",
    title: "Ativação da prestação de serviços",
    text: "Composição de equipes e agendas para prestação de serviços ambulatoriais e hospitalares de média e alta complexidade.",
  },
  {
    step: "03",
    title: "Inteligência cirúrgica em tempo real",
    text: "Painéis de desempenho, acompanhamento de produção assistencial, taxa de suspensão e inteligência cirúrgica orientada a indicadores.",
  },
  {
    step: "04",
    title: "Polos estaduais, regionais e municipais",
    text: "Progressão estruturada com implantação de polos estaduais, regionais e municipais de expansão cirúrgica em âmbito nacional.",
  },
];

const appCapabilities = [
  "Inteligência Cirúrgica e Network profissional para governança assistencial e tomada de decisão.",
  "Sistema Educacional e Digital com taxonomia persistente das especialidades e biblioteca clínica.",
  "Painéis operacionais para gestão da prestação de serviços ambulatoriais e hospitalares de média e alta complexidade.",
  "Workspace autenticado estruturado para progressão de polos estaduais, regionais e municipais em âmbito nacional.",
];

const roadmap = [
  {
    phase: "Fase 1",
    title: "Diagnóstico e polos municipais/regionais",
    text: "O modelo da SINACE parte do diagnóstico da fila reprimida para implantar a prestação de serviços assistenciais em unidades municipais e regionais.",
  },
  {
    phase: "Fase 2",
    title: "Consolidação e polos estaduais",
    text: "Expandir a inteligência cirúrgica e a governança para polos estaduais, alinhando redes públicas, OSS e hospitais contratantes.",
  },
  {
    phase: "Fase 3",
    title: "Atuação nacional e sistema digital",
    text: "Consolidar a atuação em âmbito nacional, integrando o Sistema Educacional e Digital com workspace próprio e network cirúrgico em escala.",
  },
];

const specialtyNames = SINACE_SPECIALTY_CATALOG.map(item => item.name);
const instagramHref = `https://instagram.com/${SINACE_INSTITUTIONAL_PROFILE.instagram.replace("@", "")}`;
const phoneHref = `tel:+55${SINACE_INSTITUTIONAL_PROFILE.phone.replace(/\D/g, "")}`;
const emailHref = `mailto:${SINACE_INSTITUTIONAL_PROFILE.email}`;
const institutionalProfileWithExtras = SINACE_INSTITUTIONAL_PROFILE as typeof SINACE_INSTITUTIONAL_PROFILE & {
  facebook?: string;
  cep?: string;
};
type InstitutionalFooterEntry = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};
const institutionalFooterEntries: InstitutionalFooterEntry[] = [
  { label: "Telefone institucional", value: SINACE_INSTITUTIONAL_PROFILE.phone, href: phoneHref },
  { label: "E-mail institucional", value: SINACE_INSTITUTIONAL_PROFILE.email, href: emailHref },
  {
    label: "Instagram",
    value: SINACE_INSTITUTIONAL_PROFILE.instagram,
    href: instagramHref,
    external: true,
  },
  ...(institutionalProfileWithExtras.facebook
    ? [
      {
        label: "Facebook",
        value: institutionalProfileWithExtras.facebook,
        href: institutionalProfileWithExtras.facebook,
        external: true,
      },
    ]
    : []),
  ...(institutionalProfileWithExtras.cep
    ? [{ label: "CEP", value: institutionalProfileWithExtras.cep }]
    : []),
  { label: "Abrangência", value: SINACE_INSTITUTIONAL_PROFILE.headquarters },
  { label: "CNPJ", value: SINACE_INSTITUTIONAL_PROFILE.cnpj },
];

function SectionHeader({
  kicker,
  title,
  description,
  invert = false,
  centered = false,
}: {
  kicker: string;
  title: string;
  description: string;
  invert?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={`max-w-3xl space-y-4 ${centered ? "mx-auto text-center" : ""}`}>
      <span className={invert ? "section-kicker text-cyan-300" : "section-kicker text-cyan-600"}>{kicker}</span>
      <h2
        className={`text-balance text-3xl font-semibold tracking-[-0.04em] md:text-5xl ${invert ? "text-white" : "text-slate-950"
          }`}
      >
        {title}
      </h2>
      <p
        className={`text-base leading-7 md:text-lg ${centered ? "mx-auto" : ""
          } max-w-2xl ${invert ? "text-slate-300" : "text-slate-600"
          }`}
      >
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const workspaceHref = "/app";
  const workspaceLabel = loading
    ? "Preparando acesso"
    : isAuthenticated
      ? "Entrar no workspace"
      : "Acessar plataforma";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* ─── Header fixo ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-4 py-3.5">
          <a href="/" className="flex min-w-0 items-center gap-3 group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_28px_rgba(15,23,42,0.1)]">
              <img src={logoImage} alt="Marca SINACE" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold tracking-[0.24em] text-slate-900 uppercase">
                SINACE
              </p>
              <p className="truncate text-[0.68rem] text-slate-500">{SINACE_INSTITUTIONAL_PROFILE.extendedName}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
            <a
              href="/"
              className="anchor-link font-semibold text-cyan-600 transition-colors"
            >
              Home
            </a>
            {landingNavItems.map(item => (
              <a
                key={item.path}
                href={item.path}
                className="anchor-link font-medium transition-colors hover:text-cyan-600 text-slate-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 bg-transparent px-5 text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              <a href={workspaceHref}>{workspaceLabel}</a>
            </Button>
            <Button asChild className="rounded-full bg-cyan-300 px-6 text-slate-950 font-semibold hover:bg-cyan-200">
              <a href="/contato">Apresentar proposta</a>
            </Button>
          </div>

          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Fechar navegação" : "Abrir navegação"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={() => setMobileNavOpen(open => !open)}
          >
            {mobileNavOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>

        {mobileNavOpen ? (
          <div className="border-t border-slate-200 bg-white/96 backdrop-blur-xl lg:hidden">
            <div className="container space-y-4 py-4">
              <nav className="grid gap-2">
                {landingNavItems.map(item => (
                  <a
                    key={item.path}
                    href={item.path}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-300 bg-transparent px-5 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <a href={workspaceHref} onClick={() => setMobileNavOpen(false)}>
                    {workspaceLabel}
                  </a>
                </Button>
                <Button asChild className="rounded-full bg-cyan-300 px-6 text-slate-950 font-semibold hover:bg-cyan-200">
                  <a href="/contato" onClick={() => setMobileNavOpen(false)}>
                    Apresentar proposta
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        {/* ─── Hero ──────────────────────────────────────────────── */}
        <section id="inicio" className="relative isolate min-h-[860px] overflow-hidden bg-white text-slate-900">
          <img
            src={heroImage}
            alt="Corredor hospitalar com interfaces tecnológicas e sensação de rede cirúrgica nacional"
            className="absolute inset-0 h-full w-full object-cover scale-[1.25] origin-center"
          />
          <div className="hero-mask absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(84,255,222,0.08),transparent_18%),radial-gradient(circle_at_80%_50%,rgba(78,121,255,0.05),transparent_20%)]" />
          <div className="container relative flex min-h-[860px] items-center py-28">
            <div className="grid w-full items-end gap-16 lg:grid-cols-[minmax(0,1.15fr)_360px]">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-4xl"
              >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50/80 px-4 py-2 text-xs uppercase tracking-[0.28em] font-bold text-cyan-800 backdrop-blur-md shadow-sm">
                  <HeartPulse className="h-3.5 w-3.5 text-cyan-600" />
                  Prestação de Serviços Assistenciais · Atuação em Âmbito Nacional
                </div>
                <h1 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 md:text-7xl lg:text-[5.5rem]">
                  Organizar capacidade cirúrgica para reduzir filas com escala.
                </h1>
                <div className="mt-8 max-w-3xl rounded-2xl border border-cyan-100 bg-white/95 p-6 shadow-sm backdrop-blur-sm">
                  <p className="text-lg leading-8 text-slate-800 md:text-xl font-medium">
                    Plataforma institucional para redução de filas cirúrgicas, coordenação operacional e educação médico-cirúrgica. A SINACE atua na organização da capacidade assistencial, na articulação da operação em rede e na consolidação de uma base institucional voltada à expansão cirúrgica com governança, inteligência e continuidade.
                  </p>
                </div>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full bg-cyan-300 px-7 text-base font-semibold text-slate-950 hover:bg-cyan-200">
                    <a href="/contato">
                      Solicitar contato institucional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="surface-panel network-glow noise-overlay relative hidden overflow-hidden rounded-[2rem] border border-cyan-200/80 p-7 text-slate-900 lg:block shadow-md"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-cyan-700">
                  <span className="font-semibold text-cyan-700">Visão executiva</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600">
                    <Gauge className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-8 space-y-5">
                  {[
                    ["Ponto de partida", "Diagnóstico estruturado da fila reprimida"],
                    ["Atuação assistencial", "Atuação ambulatorial e hospitalar de média e alta complexidade"],
                    ["Abrangência", "Atuação em âmbito nacional com polos estaduais, regionais e municipais"],
                    ["Diferencial", "Inteligência Cirúrgica, Network e Sistema Educacional e Digital"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-t border-slate-200 pt-4 first:border-0 first:pt-0">
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500 font-semibold">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-950 leading-6">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl border border-cyan-400 bg-cyan-300 p-5 text-slate-950 shadow-md transition-all hover:scale-[1.01]">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-slate-800 mb-1.5">Objeto Social Oficial</p>
                  <p className="text-xs leading-5 text-slate-950 font-bold">{SINACE_INSTITUTIONAL_PROFILE.socialObject}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Ecossistema-alvo ────────────────────────────────── */}
        <section className="relative bg-slate-50 py-24 md:py-32 border-t border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03),transparent_55%)]" />
          <div className="container relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-14 mx-auto max-w-2xl text-center"
            >
              <span className="section-kicker text-cyan-700">Ecossistema-alvo</span>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">
                Para quem a SINACE foi concebida
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                A solução da SINACE atende diferentes atores do ecossistema público de saúde cirúrgica, com foco em prestação de serviços e diagnósticos precisos da demanda reprimida.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {stakeholders.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ delay: index * 0.08 }}
                    className="surface-panel hover-glow-emerald relative overflow-hidden rounded-[2rem] border-t-2 border-t-emerald-500 p-8 flex flex-col shadow-[0_16px_42px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="icon-badge-emerald shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="section-kicker text-cyan-700 text-right">Ecossistema-alvo</span>
                    </div>
                    <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-slate-950 leading-7">{item.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
                    <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 cursor-pointer hover:text-emerald-500 transition-colors group">
                      <span>Explorar soluções institucionais</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Base da Proposta / Proposta de Valor ─────────────── */}
        <section id="proposta" className="relative bg-white py-28 md:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.03),transparent_45%)]" />
          <div className="container relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.55 }}
            >
              <SectionHeader
                kicker="Base da proposta"
                title="Prestação de serviços cirúrgicos orientada pelo diagnóstico da fila reprimida."
                description="A proposta da SINACE parte do diagnóstico preciso da fila reprimida para estruturar a prestação de serviços em regime ambulatorial e hospitalar de média e alta complexidade, impulsionada por Inteligência Cirúrgica, Network e Sistema Educacional e Digital com atuação em âmbito nacional."
                centered
              />
            </motion.div>

            {/* Pilares Estratégicos */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="surface-panel hover-lift relative overflow-hidden rounded-[2rem] border-t-2 border-t-emerald-500 p-7 flex flex-col shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-between">
                      <span className="section-kicker text-cyan-700">Pilar estratégico</span>
                      <div className="icon-badge-emerald">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-7 text-lg font-semibold tracking-[-0.03em] text-slate-950 leading-7">{item.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{item.text}</p>
                  </article>
                );
              })}
            </motion.div>

            {/* Objeto Social Wide Card em Destaque para Prestação de Serviços (Cor Padrão bg-cyan-300) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-10"
            >
              <div className="surface-panel rounded-[2.2rem] border-2 border-cyan-400 bg-cyan-300 px-8 py-10 text-slate-950 shadow-xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-900/20 bg-white/90 px-4 py-1.5 text-xs uppercase tracking-[0.26em] text-slate-950 font-extrabold shadow-sm">
                  <Building2 className="h-4 w-4 text-cyan-700" />
                  Destaque Principal: Prestação de Serviços Assistenciais
                </div>
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-800">Objeto Social Oficial</p>
                    <p className="mt-4 text-xl md:text-2xl leading-9 tracking-[-0.03em] font-extrabold text-slate-950">
                      {SINACE_INSTITUTIONAL_PROFILE.socialObject}
                    </p>
                    <p className="mt-5 text-base leading-7 text-slate-900 font-medium bg-white/70 p-4 rounded-xl border border-white/40">
                      Atuação ambulatorial e hospitalar de média e alta complexidade estruturada para atender governos, OSS, Santas Casas e redes parceiras em âmbito nacional.
                    </p>
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {SINACE_OPERATION_MODALITIES.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-3 rounded-[1.4rem] border border-cyan-200 bg-white px-5 py-4 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                        <p className="text-sm font-bold leading-6 text-slate-900">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Modelo Operacional ─────────────────────────────── */}
        <section id="operacao" className="grid-shell relative overflow-hidden bg-slate-50 py-28 text-slate-950 md:py-36 border-t border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(104,201,215,0.04),transparent_18%),radial-gradient(circle_at_85%_15%,rgba(68,111,255,0.04),transparent_18%)]" />
          <div className="container relative">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
              >
                <div className="surface-panel overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <img
                    src={operationsImage}
                    alt="Ambiente de coordenação clínica e operacional com painéis de rede cirúrgica nacional"
                    className="h-[460px] w-full rounded-[1.4rem] object-cover"
                  />
                </div>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  O modelo da SINACE parte do diagnóstico da fila reprimida para coordenar a prestação de serviços ambulatoriais e hospitalares de média e alta complexidade por polos estaduais, regionais e municipais.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.06 }}
              >
                <SectionHeader
                  kicker="Modelo operacional"
                  title="Fluxo assistencial e inteligência de dados a partir do diagnóstico da fila."
                  description="O modelo da SINACE parte do diagnóstico da fila reprimida e avança na prestação de serviços cirúrgicos com progressão continuada por polos estaduais, regionais e municipais em âmbito nacional."
                />
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {operatingModel.map((item, index) => (
                    <article key={item.step} className="surface-panel hover-lift rounded-[1.8rem] p-7 flex flex-col border-t-2 border-t-cyan-600 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-100 text-sm font-bold text-cyan-700">
                          {item.step}
                        </span>
                        <span className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500 font-semibold">
                          Etapa {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 text-base font-semibold tracking-[-0.03em] text-slate-950 leading-6">{item.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </article>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Especialidades ─────────────────────────────────── */}
        <section id="cobertura" className="relative bg-white py-28 md:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(52,211,153,0.03),transparent_50%)]" />
          <div className="container relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="text-center"
            >
              <span className="section-kicker text-cyan-700">Especialidades</span>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
                Catálogo de Especialidades Cirúrgicas SINACE.
              </h2>
              <p className="mt-5 mx-auto max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                A atuação da SINACE abrange especialidades cirúrgicas estruturantes para prestação de serviços ambulatoriais e hospitalares de média e alta complexidade.
              </p>
              <div className="mt-12 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {specialtyNames.map((item) => (
                  <div key={item} className="specialty-tag">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Escala Estratégica (Posicionada antes do Aplicativo Próprio) ── */}
        <section id="expansao" className="bg-slate-50 py-28 text-slate-950 md:py-36 border-t border-slate-100">
          <div className="container">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
              >
                <SectionHeader
                  kicker="Escala estratégica"
                  title="Atuação em âmbito nacional com polos estaduais, regionais e municipais."
                  description="A expansão da SINACE se consolida ao partir do diagnóstico da fila reprimida e estruturar polos estaduais, regionais e municipais de produção assistencial, unindo prestação de serviços de média e alta complexidade a uma governança contínua."
                />
                <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <img
                    src={expansionImage}
                    alt="Visualização de expansão nacional com rede hospitalar conectada no Brasil"
                    className="w-full h-auto max-h-[460px] rounded-[1.4rem] object-contain bg-white"
                  />
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="relative border-l border-cyan-200 pl-8 ml-4 md:ml-6 md:pl-10 space-y-6 pt-2"
              >
                {roadmap.map((item) => (
                  <article key={item.phase} className="surface-panel relative rounded-[1.8rem] p-7 hover-lift shadow-[0_16px_42px_rgba(15,23,42,0.04)] border border-slate-200">
                    <div className="absolute -left-[35px] md:-left-[43px] top-8 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-cyan-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-700 font-semibold">{item.phase}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </article>
                ))}
                <div className="surface-panel relative rounded-[1.8rem] border border-slate-200 p-7 hover-lift shadow-[0_16px_42px_rgba(15,23,42,0.04)]">
                  <div className="absolute -left-[35px] md:-left-[43px] top-8 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-emerald-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="section-kicker text-cyan-700">Direção em Âmbito Nacional</p>
                  <p className="mt-4 text-base leading-7 text-slate-700">
                    A visão é posicionar a SINACE como solução institucional em âmbito nacional capaz de conectar prestação de serviços assistenciais de média e alta complexidade, Inteligência Cirúrgica, Network e o Sistema Educacional e Digital em polos estaduais, regionais e municipais.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Aplicativo Próprio / Workspace (Posicionado antes da Síntese) ── */}
        <section id="aplicativo" className="relative overflow-hidden bg-white py-28 text-slate-950 md:py-36 border-t border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_60%,rgba(52,211,153,0.03),transparent_40%)]" />
          <div className="container relative">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="order-2 lg:order-1"
              >
                <SectionHeader
                  kicker="Sistema Educacional e Digital"
                  title="Workspace próprio com Inteligência Cirúrgica e Network."
                  description="O workspace da SINACE projeta a operação como plataforma digital: Inteligência Cirúrgica, taxonomia cirúrgica persistente, estudo de casos clínicos, enciclopédia operatória, acervo acadêmico e expansão do Network cirúrgico profissional."
                />
                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                  {appCapabilities.map((item) => (
                    <div key={item} className="surface-panel hover-lift rounded-[1.8rem] border-t-2 border-t-emerald-500 p-6 flex flex-col shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                      <div className="flex items-center justify-between">
                        <div className="icon-badge-emerald">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500 font-semibold">
                          Recurso
                        </span>
                      </div>
                      <p className="mt-5 flex-1 text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="order-1 lg:order-2"
              >
                <a
                  href={workspaceHref}
                  className="block group cursor-pointer transition-all duration-300 hover:scale-[1.015]"
                  aria-label="Acessar o Aplicativo SINACE diretamente"
                >
                  <div className="surface-panel overflow-hidden rounded-[2.2rem] p-4 border border-cyan-200 shadow-[0_16px_40px_rgba(15,23,42,0.08)] group-hover:border-cyan-400 group-hover:shadow-[0_24px_50px_rgba(34,211,238,0.15)]">
                    <div className="overflow-hidden rounded-[1.6rem] bg-white p-2 flex items-center justify-center">
                      <img
                        src={appImage}
                        alt="Ecossistema digital da SINACE com módulos para estudo de caso, enciclopédia cirúrgica e arquivos acadêmicos - Clique para acessar o App"
                        className="w-full h-auto max-h-[480px] rounded-[1.2rem] object-contain bg-white transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                    </div>
                    <div className="mt-3 rounded-[1.5rem] border border-cyan-200 bg-white/95 px-5 py-4 backdrop-blur-xl shadow-sm transition-colors group-hover:bg-cyan-50/95">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-emerald-700">
                          <Smartphone className="h-5 w-5" />
                          <span className="section-kicker text-cyan-700">Clique para Acessar o App SINACE</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-cyan-600 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-700 font-medium">
                        Módulos para Inteligência Cirúrgica, Network, enciclopédia operatória, gestão de filas e Sistema Educacional e Digital em âmbito nacional.
                      </p>
                    </div>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Síntese Institucional ───────────────────────────── */}
        <section className="relative bg-slate-100 py-28 md:py-36 border-t border-slate-200 overflow-hidden">
          <div className="container relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[2.5rem] border-2 border-cyan-400 shadow-[0_24px_64px_rgba(15,23,42,0.15)] bg-slate-900 text-slate-900"
            >
              {/* Imagem de Fundo Clara, Nítida e Visível */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={institutionalImage}
                  alt="Imagem institucional da SINACE simbolizando integração entre gestão, SUS e instituição de saúde"
                  className="h-full w-full object-cover object-[center_65%] opacity-100 transition-transform duration-700 hover:scale-105"
                />
                {/* Degradê Suave para Manter Nítidos os Detalhes da Imagem (Aperto de Mãos, Gestão, SUS) */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-970/60 to-slate-900/60 backdrop-blur-[2px]" />
              </div>

              {/* Conteúdo sobreposto em Containers Sólidos com Alta Legibilidade */}
              <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-20 md:px-16 md:py-28 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-500 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.26em] text-white shadow-md mx-auto">
                  Síntese institucional
                </div>

                <div className="mt-6 max-w-4xl mx-auto p-6 md:p-8 text-center">
                  <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl mx-auto [text-shadow:0_4px_16px_rgba(0,0,0,0.9)]">
                    Demanda reprimida convertida em prestação de serviços cirúrgicos organizada.
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-white md:text-lg font-semibold mx-auto text-center [text-shadow:0_4px_12px_rgba(0,0,0,0.9)]">
                    A proposta da SINACE se consolida na união entre a prestação de serviços ambulatoriais e hospitalares de média e alta complexidade, Inteligência Cirúrgica, Network e o Sistema Educacional e Digital. O modelo parte do diagnóstico da fila reprimida e progride continuamente por polos estaduais, regionais e municipais em âmbito nacional.
                  </p>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Prestação de Serviços", "Atuação ambulatorial e hospitalar de média e alta complexidade."],
                    ["Diagnóstico da Fila", "Identificação precisa da demanda reprimida para organizar fluxos."],
                    ["Inteligência e Network", "Sistema Educacional e Digital com apoio técnico em âmbito nacional."],
                    ["Contato Oficial", `${SINACE_INSTITUTIONAL_PROFILE.phone} · ${SINACE_INSTITUTIONAL_PROFILE.email}`],
                  ].map(([label, text]) => (
                    <div key={label} className="surface-panel rounded-[1.6rem] border-2 border-cyan-400 bg-white p-6 shadow-xl flex flex-col min-h-[120px] transition-all hover:scale-[1.02] hover:shadow-2xl">
                      <p className="text-[0.72rem] uppercase tracking-[0.25em] text-cyan-700 font-extrabold">{label}</p>
                      <div className="mt-2.5 h-1 w-10 bg-cyan-400 rounded-full" />
                      <p className="mt-3.5 flex-1 text-sm font-semibold leading-6 text-slate-900">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Contato ────────────────────────────────────────── */}
        <section id="contato" className="relative bg-white py-28 md:py-36 border-t border-slate-100">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(102,216,203,0.06),transparent_22%),radial-gradient(circle_at_88%_18%,rgba(85,127,255,0.05),transparent_20%)] px-8 py-14 text-slate-950 md:px-16 md:py-20 shadow-[0_24px_64px_rgba(15,23,42,0.04)]"
              style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(245,250,255,0.95) 100%)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(102,216,203,0.04),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(85,127,255,0.04),transparent_28%)] rounded-[2.4rem]" />
              <div className="relative grid gap-14 lg:grid-cols-2 lg:items-start">
                <div>
                  <p className="section-kicker text-cyan-700">Contato institucional</p>
                  <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">
                    Diálogo institucional para prestação de serviços cirúrgicos com método.
                  </h2>
                  <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                    A SINACE foi concebida para apoiar contratantes que buscam o enfrentamento estruturado da fila reprimida através da prestação de serviços de média e alta complexidade, Inteligência Cirúrgica e suporte tecnológico com atuação em âmbito nacional.
                  </p>

                  <div className="mt-10 space-y-4">
                    <p className="text-xs uppercase tracking-[0.26em] text-cyan-700 font-bold">Próximos Passos</p>
                    {[
                      "Diagnóstico inicial da fila reprimida e infraestrutura disponível.",
                      "Planejamento da prestação de serviços ambulatoriais e hospitalares de média e alta complexidade.",
                      "Estruturação de polos estaduais, regionais e municipais com governança contínua.",
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/50 px-5 py-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-50 border border-cyan-100 text-xs font-bold text-cyan-700">
                          {idx + 1}
                        </span>
                        <p className="text-sm leading-6 text-slate-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-panel rounded-[2.2rem] border border-slate-200 p-8 text-slate-950 flex flex-col gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-700 font-bold">Canais oficiais</p>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950 tracking-[-0.03em]">Como iniciar o diálogo institucional?</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Entre em contato diretamente com a nossa equipe de governança institucional ou explore as opções de atendimento.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button asChild className="w-full rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 py-6 text-sm font-bold">
                      <a href={emailHref}>
                        Iniciar conversa institucional
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <a href={phoneHref}>Falar por telefone</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <a href={instagramHref} target="_blank" rel="noreferrer">
                        Abrir Instagram institucional
                      </a>
                    </Button>
                  </div>

                  {/* Informações de contato direto no card */}
                  <div className="border-t border-slate-200 pt-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 shrink-0 text-cyan-600" />
                      <a href={phoneHref} className="text-slate-600 hover:text-cyan-600 transition-colors">{SINACE_INSTITUTIONAL_PROFILE.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 shrink-0 text-cyan-600" />
                      <a href={emailHref} className="text-slate-600 hover:text-cyan-600 transition-colors break-all">{SINACE_INSTITUTIONAL_PROFILE.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPinned className="h-4 w-4 shrink-0 text-cyan-600" />
                      <span className="text-slate-600">{SINACE_INSTITUTIONAL_PROFILE.headquarters}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="mt-24 border-t border-slate-200 pt-16">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-10 md:pb-14">
                {/* Coluna 1: Branding */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3.5 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_6px_20px_rgba(15,23,42,0.05)] border border-slate-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                      <img src={logoImage} alt="Marca SINACE" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <span className="font-display text-lg font-bold tracking-[0.24em] text-slate-900">SINACE</span>
                    </div>
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-medium">{SINACE_INSTITUTIONAL_PROFILE.extendedName}</p>
                  <p className="text-xs leading-6 text-slate-500">
                    Prestação de serviços ambulatoriais e hospitalares de média e alta complexidade, Inteligência Cirúrgica e Sistema Educacional e Digital em âmbito nacional.
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
                    <a href={instagramHref} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-cyan-100 hover:text-slate-900 transition-all">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    <a href={emailHref} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-cyan-100 hover:text-slate-900 transition-all">
                      <Mail className="h-4 w-4" />
                    </a>
                    <a href={phoneHref} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-cyan-100 hover:text-slate-900 transition-all">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Coluna 2: Navegação */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 font-bold">Navegação</p>
                  <ul className="space-y-2.5 text-xs text-slate-500">
                    {landingNavItems.map(item => (
                      <li key={item.path}>
                        <a href={item.path} className="hover:text-cyan-600 transition-colors">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coluna 3: Especialidades */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 font-bold">Especialidades</p>
                  <ul className="space-y-2.5 text-xs text-slate-500">
                    {specialtyNames.slice(0, 5).map(spec => (
                      <li key={spec}>
                        <span className="hover:text-cyan-600 cursor-default transition-colors">{spec}</span>
                      </li>
                    ))}
                    <li>
                      <a href="#cobertura" className="text-cyan-600 hover:underline">Ver catálogo ({specialtyNames.length})</a>
                    </li>
                  </ul>
                </div>

                {/* Coluna 4: Contato */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 font-bold">Contato Direto</p>
                  <ul className="space-y-3.5 text-xs text-slate-500">
                    <li>
                      <span className="block text-[0.65rem] uppercase tracking-wider text-slate-550 font-semibold mb-1">Telefone</span>
                      <a href={phoneHref} className="text-slate-800 hover:text-cyan-600 transition-colors text-sm font-medium">{SINACE_INSTITUTIONAL_PROFILE.phone}</a>
                    </li>
                    <li>
                      <span className="block text-[0.65rem] uppercase tracking-wider text-slate-550 font-semibold mb-1">E-mail</span>
                      <a href={emailHref} className="text-slate-800 hover:text-cyan-600 transition-colors text-sm font-medium break-all">{SINACE_INSTITUTIONAL_PROFILE.email}</a>
                    </li>
                    <li>
                      <span className="block text-[0.65rem] uppercase tracking-wider text-slate-550 font-semibold mb-1">Instagram</span>
                      <a href={instagramHref} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-cyan-600 transition-colors text-sm font-medium">{SINACE_INSTITUTIONAL_PROFILE.instagram}</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sub-footer Copyright */}
              <div className="relative mt-10 border-t border-white/10 pt-8">
                <div className="text-center text-[0.68rem] tracking-wider text-slate-500 uppercase font-semibold">
                  <p>© 2026 SINACE. Todos os direitos reservados.</p>

                  {/* Elementos exigidos pelos testes de layout */}
                  <div className="mt-4 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-[0.7rem] text-slate-500 normal-case">
                    <span className="sr-only">Identificação institucional de base</span>
                    <span>{SINACE_INSTITUTIONAL_PROFILE.headquarters} · CNPJ {SINACE_INSTITUTIONAL_PROFILE.cnpj}</span>
                    <span className="hidden md:inline text-slate-300">·</span>
                    <span className="lowercase text-slate-500">{SINACE_INSTITUTIONAL_PROFILE.phone} · {SINACE_INSTITUTIONAL_PROFILE.email}</span>
                  </div>

                  <div className="mt-4 flex justify-center gap-6">
                    <a href="#" className="hover:text-cyan-600 transition-colors">Termos de Uso</a>
                    <a href="#" className="hover:text-cyan-600 transition-colors">Políticas de Privacidade</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── WhatsApp Float ──────────────────────────────────── */}
      <a
        href="https://wa.me/5514998081759"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float group"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg className="h-7 w-7 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.048L2 22l5.12-1.341a9.923 9.923 0 004.891 1.285h.004c5.507 0 9.99-4.474 9.99-9.986 0-2.67-1.04-5.18-2.93-7.071A9.907 9.907 0 0012.012 2zm5.79 14.153c-.318.895-1.579 1.624-2.18 1.688-.543.058-1.25.1-3.644-.89-3.065-1.267-5.038-4.39-5.191-4.593-.153-.203-1.24-1.656-1.24-3.158 0-1.502.768-2.242 1.043-2.544.275-.302.6-.378.8-.378.2 0 .4 0 .573.009.183.009.43.009.673.593.25.602.85 2.073.923 2.22.073.148.12.319.02.519-.1.2-.15.32-.3.496-.15.176-.312.394-.447.53-.15.15-.307.315-.133.614.173.3.768 1.27 1.644 2.05.176.155.327.315.534.422.3.158.472.13.65-.074.177-.204.766-.893.97-1.198.204-.305.409-.253.69-.15.28.102 1.78.84 2.087.994.307.153.513.23.587.358.074.128.074.743-.244 1.638z" />
        </svg>
        <span className="absolute right-16 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
          Fale Conosco
        </span>
      </a>
    </div>
  );
}
