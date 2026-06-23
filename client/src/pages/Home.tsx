/*
  Design reminder for SINACE Home:
  Futurismo assistencial de rede — hero panorâmico, autoridade institucional,
  profundidade visual clínica, assimetria editorial e narrativa de expansão nacional.
*/
import * as React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
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
import { SINACE_PUBLIC_NAV_ITEMS } from "@/lib/sinacePublicSite";
import "./Home.css";

const heroImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-hero-network_e5a6a3cb.png";
const operationsImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-operations-command-KAAb4DJdbZN8ZpYtTMfg8c.webp";
const appImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/99E8DFD1-E837-43E2-BF4E-6ACE65F714C0_aec8439f.png";
const expansionImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-national-expansion-4dJWasAhXkP8Cew3mjzKFi.webp";
const logoImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/2E282DFE-2672-4AC9-85E7-4F23C3D269BA_a5b594bf.png";
const institutionalImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/IMG_5204_corrigida_v4_434fe37c.png";

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
    title: "Governos estaduais e federal",
    text: "Estrutura para programas de ampliação do acesso cirúrgico com governança, previsibilidade, regulação assistencial e leitura executiva da produção.",
    icon: Landmark,
  },
  {
    title: "OSS, redes complementares e contratantes",
    text: "Integração operacional para acelerar produção, organizar filas reprimidas e sustentar metas pactuadas em ambiente hospitalar e ambulatorial.",
    icon: Layers3,
  },
  {
    title: "Santas Casas e hospitais",
    text: "Modelo para ativar infraestrutura, ampliar resolutividade por especialidade e transformar capacidade instalada em operação coordenada de escala regional.",
    icon: Building2,
  },
];

const pillars = [
  {
    title: "Redução de fila com método",
    text: "A fila deixa de ser apenas demanda reprimida e passa a ser tratada como fluxo gerenciável, com triagem, priorização e produtividade organizada.",
    icon: TimerReset,
  },
  {
    title: "Equipe em âmbito nacional",
    text: "Profissionais e coordenações por linha cirúrgica para sustentar expansão com padrão técnico, segurança assistencial e previsibilidade de entrega.",
    icon: Stethoscope,
  },
  {
    title: "Governança e rastreabilidade",
    text: "Indicadores, protocolos e leitura executiva contínua para dar confiança institucional ao contratante e previsibilidade à operação.",
    icon: ClipboardCheck,
  },
  {
    title: "Legado educacional e digital",
    text: "Além do volume cirúrgico, a proposta entrega taxonomia estruturada, trilhas de aprendizagem e base tecnológica própria para evolução contínua da rede.",
    icon: ShieldCheck,
  },
];

const operatingModel = [
  {
    step: "01",
    title: "Leitura da demanda reprimida",
    text: "Mapeamento da fila, perfil clínico, criticidade, infraestrutura disponível e pontos de estrangulamento assistencial.",
  },
  {
    step: "02",
    title: "Ativação de capacidade cirúrgica",
    text: "Composição de equipes, agendas, protocolos, especialidades e retaguarda para elevar volume com controle operacional.",
  },
  {
    step: "03",
    title: "Monitoramento em tempo real",
    text: "Painéis de desempenho, acompanhamento de produção, taxa de suspensão, giro assistencial e gestão orientada por indicadores.",
  },
  {
    step: "04",
    title: "Escala e consolidação institucional",
    text: "Transformação de pilotos em polos regionais e contratos estruturantes com redes públicas, OSS e parceiros executores.",
  },
];

const appCapabilities = [
  "Dashboard operacional conectado à taxonomia persistente das especialidades.",
  "Trilhas, biblioteca, instituições e módulos com vocabulário clínico-operacional consistente.",
  "Área administrativa para governança da taxonomia, status, ordenação e foco educacional/operacional.",
  "Workspace autenticado preparado para expansão do acervo clínico, analytics e módulos institucionais.",
];

const roadmap = [
  {
    phase: "Fase 1",
    title: "Pilotos regionais",
    text: "Implantar operações em redes parceiras para demonstrar capacidade de redução de fila com consistência clínica e gerencial.",
  },
  {
    phase: "Fase 2",
    title: "Consolidação estadual",
    text: "Expandir para unidades adicionais no mesmo território, padronizando protocolos, metas e inteligência de produção.",
  },
  {
    phase: "Fase 3",
    title: "Escala nacional e saúde digital",
    text: "Integrar contratos mais amplos, fortalecer o workspace próprio e posicionar a SINACE como plataforma institucional do ecossistema cirúrgico.",
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
  { label: "Endereço base", value: SINACE_INSTITUTIONAL_PROFILE.headquarters },
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
        className={`text-balance text-3xl font-semibold tracking-[-0.04em] md:text-5xl ${
          invert ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`text-base leading-7 md:text-lg ${
          centered ? "mx-auto" : ""
        } max-w-2xl ${
          invert ? "text-slate-300" : "text-slate-600"
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
  const workspaceHref = isAuthenticated ? "/app" : (import.meta.env.DEV ? "/app" : getLoginUrl());
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
            <div className="grid w-full items-end gap-16 lg:grid-cols-[minmax(0,1.15fr)_340px]">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-4xl"
              >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/50 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-700 backdrop-blur-md">
                  <HeartPulse className="h-3.5 w-3.5 text-cyan-600" />
                  Solução institucional para acesso cirúrgico
                </div>
                <h1 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 md:text-7xl lg:text-[5.65rem]">
                  Organizar capacidade cirúrgica para reduzir filas com escala.
                </h1>
                <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                  {SINACE_INSTITUTIONAL_PROFILE.tagline} A SINACE atua na organização da capacidade assistencial, na articulação da operação em rede e na consolidação de uma base institucional voltada à expansão cirúrgica com governança, inteligência e continuidade.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full bg-cyan-300 px-7 text-base font-semibold text-slate-950 hover:bg-cyan-200">
                    <a href="/contato">
                      Solicitar contato institucional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-slate-300 bg-white/80 px-7 text-base text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <a href={workspaceHref}>
                      {isAuthenticated ? "Abrir workspace SINACE" : "Explorar plataforma autenticada"}
                    </a>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="surface-panel network-glow noise-overlay relative hidden overflow-hidden rounded-[2rem] border border-slate-200 p-7 text-slate-900 lg:block"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-cyan-700">
                  <span className="font-semibold text-cyan-700">Visão executiva</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600">
                    <Gauge className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-8 space-y-5">
                  {[
                    ["Fila reprimida", "Transformada em fluxo operável"],
                    ["Especialidades", `${SINACE_SPECIALTY_CATALOG.length} linhas cirúrgicas no catálogo oficial`],
                    ["Objeto social", "Ambulatorial, hospitalar e alta complexidade"],
                    ["Workspace", isAuthenticated ? "Acesso autenticado pronto" : "Entrada protegida conectada à landing"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-t border-slate-200 pt-4 first:border-0 first:pt-0">
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500 font-semibold">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-950 leading-6">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl bg-cyan-50/50 border border-cyan-100 p-4">
                  <p className="text-xs leading-5 text-slate-600">{SINACE_INSTITUTIONAL_PROFILE.socialObject}</p>
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
                A solução da SINACE atende diferentes atores do ecossistema público de saúde cirúrgica, cada um com suas necessidades específicas de governança, capacidade e escala.
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

        {/* ─── Proposta de Valor ───────────────────────────────── */}
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
                kicker="Proposta de valor"
                title="A SINACE organiza capacidade cirúrgica com método e continuidade."
                description="A proposta combina inteligência assistencial, equipes especializadas, governança de fila, base persistente de dados e expansão tecnológica para apoiar instituições contratantes em ciclos de aumento de resolutividade e capacidade futura."
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
              {pillars.map((item, i) => {
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

            {/* Objeto Social Wide Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-8"
            >
              <div className="surface-panel rounded-[2.2rem] border border-slate-200 px-8 py-10 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
                  <div>
                    <p className="section-kicker text-cyan-700">Objeto social</p>
                    <p className="mt-4 text-xl leading-8 tracking-[-0.03em] text-slate-950">
                      {SINACE_INSTITUTIONAL_PROFILE.socialObject}
                    </p>
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {SINACE_OPERATION_MODALITIES.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-3 rounded-[1.4rem] border border-emerald-100 bg-emerald-50/50 px-5 py-4"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="text-sm leading-6 text-slate-600">{point}</p>
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
                  A operação integra leitura de demanda, ativação de agenda, coordenação por especialidade, desempenho contratual e expansão progressiva por polos regionais.
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
                  title="Fluxo, capacidade e escala assistencial com leitura executiva."
                  description="O modelo da SINACE parte do diagnóstico da fila e avança até a consolidação de polos regionais, combinando disciplina operacional, força clínica e visão contratual de longo prazo."
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
                Especialidades na frente de atuação da SINACE.
              </h2>
              <p className="mt-5 mx-auto max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                A atuação institucional da SINACE reúne algumas especialidades cirúrgicas já presentes em sua frente assistencial e outras em expansão.
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

        {/* ─── Aplicativo Próprio ──────────────────────────────── */}
        <section id="aplicativo" className="relative overflow-hidden bg-slate-50 py-28 text-slate-950 md:py-36 border-t border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_60%,rgba(52,211,153,0.03),transparent_40%)]" />
          <div className="container relative">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="order-2 lg:order-1"
              >
                <SectionHeader
                  kicker="Aplicativo próprio"
                  title="Workspace próprio para conhecimento, governança e inteligência cirúrgica."
                  description="O workspace da SINACE amplia a proposta institucional e projeta a operação como plataforma digital: um ambiente para taxonomia cirúrgica persistente, estudo de caso, enciclopédia, arquivos acadêmicos e governança administrativa."
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
                <div className="surface-panel overflow-hidden rounded-[2.2rem] p-4 border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <div className="relative overflow-hidden rounded-[1.6rem] bg-slate-50 p-3">
                    <img
                      src={appImage}
                      alt="Ecossistema digital da SINACE com módulos para estudo de caso, enciclopédia cirúrgica e arquivos acadêmicos"
                      className="h-[480px] w-full rounded-[1.2rem] object-cover"
                    />
                    <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-emerald-500/10 bg-white/90 px-5 py-4 backdrop-blur-xl shadow-lg">
                      <div className="flex items-center gap-3 text-emerald-700">
                        <Smartphone className="h-5 w-5" />
                        <span className="section-kicker text-cyan-700">Healthtech em evolução</span>
                      </div>
                      <p className="mt-3 max-w-lg text-xs leading-5 text-slate-700">
                        Um ativo digital concebido para ampliar formação, consolidar conhecimento, administrar a taxonomia das especialidades e apoiar o posicionamento futuro da SINACE no âmbito governamental e institucional.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Escala Estratégica / Roadmap ───────────────────── */}
        <section id="expansao" className="bg-white py-28 text-slate-950 md:py-36 border-t border-slate-100">
          <div className="container">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
              >
                <SectionHeader
                  kicker="Escala estratégica"
                  title="Escala nacional com polos regionais e contratos estruturantes."
                  description="A entrada institucional se fortalece quando a empresa demonstra capacidade operacional em redes locais, consolida governança, registra conhecimento em base persistente e transforma resultados em plataforma de maior alcance."
                />
                <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                  <img
                    src={expansionImage}
                    alt="Visualização de expansão nacional com rede hospitalar conectada no Brasil"
                    className="h-[400px] w-full rounded-[1.4rem] object-cover"
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
                  <p className="section-kicker text-cyan-700">Direção de longo prazo</p>
                  <p className="mt-4 text-base leading-7 text-slate-750 text-slate-700">
                    A visão é posicionar a SINACE como solução institucional capaz de conectar acesso cirúrgico, inteligência operacional, educação médico-cirúrgica e uma camada digital própria em âmbito estadual e federal.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Síntese Institucional ───────────────────────────── */}
        <section className="relative bg-slate-50 py-28 md:py-36 border-t border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(34,211,238,0.02),transparent_50%)]" />
          <div className="container relative">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="w-full"
              >
                <div className="surface-panel overflow-hidden rounded-[2rem] p-3 border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
                  <div className="relative w-full aspect-[1.15] overflow-hidden rounded-[1.4rem]">
                    <img
                      src={institutionalImage}
                      alt="Imagem institucional da SINACE simbolizando integração entre gestão, SUS e instituição de saúde"
                      className="absolute inset-0 h-full w-full object-cover scale-[1.08] object-center"
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="surface-panel relative overflow-hidden rounded-[2.2rem] p-8 pb-6 md:p-10 md:pb-8 border border-slate-200 text-slate-950 shadow-[0_16px_40px_rgba(15,23,42,0.04)]"
              >
                <span className="section-kicker text-cyan-700">Síntese institucional</span>
                <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">
                  Demanda reprimida convertida em capacidade cirúrgica organizada.
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  A força da proposta está na combinação entre execução clínica, governança de fluxo, inteligência contratual e um ativo digital próprio que amplia a longevidade da solução. Isso cria um caminho sólido para operar dentro do ecossistema público com consistência e visão de futuro.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    ["Capacidade", "Escala assistencial orientada por método e coordenação regional."],
                    ["Governança", "Indicadores, taxonomia persistente e rastreabilidade contratual."],
                    ["Tecnologia", "Workspace próprio com especialidades, trilhas, biblioteca e administração."],
                    ["Contato", `${SINACE_INSTITUTIONAL_PROFILE.phone} · ${SINACE_INSTITUTIONAL_PROFILE.email}`],
                  ].map(([label, text]) => (
                    <div key={label} className="surface-panel hover-glow-blue rounded-[1.6rem] border border-slate-200 p-5 flex flex-col min-h-[100px]">
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-800 font-bold">{label}</p>
                      <div className="mt-2 h-px w-8 bg-cyan-200" />
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
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
                    Diálogo institucional para enfrentar a fila cirúrgica com método.
                  </h2>
                  <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                    A SINACE foi concebida para apoiar contratantes que buscam mais do que redução de fila reprimida: uma solução organizada, inteligente e de escala nacional, com presença pública consistente e workspace autenticado conectado à base persistente.
                  </p>

                  <div className="mt-10 space-y-4">
                    <p className="text-xs uppercase tracking-[0.26em] text-cyan-700 font-bold">Próximos Passos</p>
                    {[
                      "Apresentar o cenário atual da fila e da infraestrutura disponível.",
                      "Definir especialidades prioritárias, metas institucionais e desenho operacional.",
                      "Estruturar um desenho inicial de implantação, acompanhamento e expansão.",
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
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950 tracking-[-0.03em]">Pronto para iniciar?</h3>
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
                    Atuando na articulação em rede, governança de fila e expansão do acesso cirúrgico com inteligência assistencial.
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
