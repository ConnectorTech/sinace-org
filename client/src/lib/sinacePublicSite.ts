import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  BriefcaseMedical,
  Building2,
  ClipboardCheck,
  ContactRound,
  HeartPulse,
  Layers3,
  Mail,
  MapPinned,
  Network,
  Phone,
  Smartphone,
  Stethoscope,
  TimerReset,
} from "lucide-react";
import {
  SINACE_INSTITUTIONAL_PROFILE,
  SINACE_OPERATION_MODALITIES,
  SINACE_SPECIALTY_CATALOG,
} from "@shared/sinaceCatalog";

export const SINACE_PUBLIC_SITE_URL = "https://sinace.org";

export const SINACE_PUBLIC_IMAGES = {
  hero:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-hero-network_e5a6a3cb.png",
  operations:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-operations-command-KAAb4DJdbZN8ZpYtTMfg8c.webp",
  application:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/99E8DFD1-E837-43E2-BF4E-6ACE65F714C0_aec8439f.png",
  expansion:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/sinace-national-expansion-4dJWasAhXkP8Cew3mjzKFi.webp",
  logo:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/2E282DFE-2672-4AC9-85E7-4F23C3D269BA_a5b594bf.png",
  institutional:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663534677050/n5uwcWAoUUWXyEtV2nUN8o/0FC61F1A-D6EB-4E6E-AA34-BC9F3BE65F20_f085c238.png",
} as const;

export const SINACE_PUBLIC_OG_IMAGE = SINACE_PUBLIC_IMAGES.application;

export type SinacePublicNavItem = {
  label: string;
  path: string;
  homeAnchor: string;
};

export const SINACE_PUBLIC_NAV_ITEMS: SinacePublicNavItem[] = [
  { label: "Proposta", path: "/proposta", homeAnchor: "#proposta" },
  { label: "Operação", path: "/operacao", homeAnchor: "#operacao" },
  { label: "Cobertura", path: "/cobertura", homeAnchor: "#cobertura" },
  { label: "Aplicativo", path: "/aplicativo", homeAnchor: "#aplicativo" },
  { label: "Contato", path: "/contato", homeAnchor: "#contato" },
];

export type SinacePublicPageKey = "home" | "proposta" | "operacao" | "cobertura" | "aplicativo" | "contato";

export type SinacePublicMetadata = {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  ogType: "website";
};

const SINACE_BRAND_SIGNATURE = `${SINACE_INSTITUTIONAL_PROFILE.legalName} | ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`;
const SINACE_OFFICIAL_SITE_REFERENCE = `Site oficial da ${SINACE_INSTITUTIONAL_PROFILE.legalName}, ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`;
const SINACE_BRAND_KEYWORDS = [
  "SINACE",
  "Sistema Nacional Hospitalar de Cirurgias Especializadas",
  "site oficial SINACE",
  "sinace.org",
  "redução de filas cirúrgicas",
  "cirurgias especializadas no Brasil",
].join(", ");

export const SINACE_PUBLIC_METADATA_BY_PATH: Record<string, SinacePublicMetadata> = {
  "/": {
    title: "SINACE | Redução de Filas Cirúrgicas",
    description:
      "SINACE é o site oficial para redução de filas cirúrgicas com governança, operação em rede e capacidade hospitalar organizada.",
    keywords:
      "SINACE, site oficial SINACE, redução de filas cirúrgicas, gestão cirúrgica hospitalar, capacidade cirúrgica, cirurgias especializadas",
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
  },
  "/proposta": {
    title: `Proposta institucional | ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`,
    description:
      `Conheça a proposta institucional no ${SINACE_OFFICIAL_SITE_REFERENCE.toLowerCase()} para organizar filas cirúrgicas, ativar capacidade assistencial e ampliar a resolutividade da rede hospitalar.`,
    keywords:
      `${SINACE_BRAND_KEYWORDS}, proposta institucional SINACE, gestão de filas cirúrgicas, capacidade assistencial, planejamento cirúrgico, governança hospitalar`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
  },
  "/operacao": {
    title: `Operação em rede | ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`,
    description:
      `Veja como a ${SINACE_INSTITUTIONAL_PROFILE.extendedName} estrutura leitura de demanda, ativação cirúrgica, monitoramento em tempo real e expansão regional com governança de produção no site oficial da marca.`,
    keywords:
      `${SINACE_BRAND_KEYWORDS}, operação cirúrgica em rede, produção hospitalar, gestão da demanda reprimida, monitoramento cirúrgico, SINACE operação`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
  },
  "/cobertura": {
    title: `Cobertura cirúrgica e especialidades | ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`,
    description:
      `Explore a cobertura do ${SINACE_OFFICIAL_SITE_REFERENCE.toLowerCase()} em especialidades cirúrgicas, modalidades operatórias e frentes de expansão para redes públicas e privadas.`,
    keywords:
      `${SINACE_BRAND_KEYWORDS}, especialidades cirúrgicas, cobertura hospitalar, cirurgia laparoscópica, cirurgia convencional, transplantes, SINACE cobertura`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
  },
  "/aplicativo": {
    title: `Aplicativo e workspace | ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`,
    description:
      `Entenda como o aplicativo da SINACE conecta taxonomia cirúrgica, trilhas, biblioteca, instituições e governança digital da operação dentro do site oficial do Sistema Nacional Hospitalar de Cirurgias Especializadas.`,
    keywords:
      `${SINACE_BRAND_KEYWORDS}, aplicativo SINACE, workspace cirúrgico, taxonomia médica, plataforma hospitalar, educação cirúrgica, gestão digital em saúde`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
  },
  "/contato": {
    title: `Contato institucional | ${SINACE_INSTITUTIONAL_PROFILE.extendedName}`,
    description:
      `Fale com a SINACE pelo site oficial para apresentar demandas de expansão cirúrgica, parcerias institucionais, articulação hospitalar e projetos em rede do Sistema Nacional Hospitalar de Cirurgias Especializadas.`,
    keywords:
      `${SINACE_BRAND_KEYWORDS}, contato SINACE, proposta hospitalar, parceria institucional, contato hospitalar`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
  },
};

export type SinaceStakeholder = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export const SINACE_STAKEHOLDERS: SinaceStakeholder[] = [
  {
    title: "Governos estaduais e federal",
    text: "Estrutura para programas de ampliação do acesso cirúrgico com governança, previsibilidade, regulação assistencial e leitura executiva da produção.",
    icon: Network,
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

export type SinacePillar = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export const SINACE_PILLARS: SinacePillar[] = [
  {
    title: "Redução de fila com método",
    text: "A fila deixa de ser apenas demanda reprimida e passa a ser tratada como fluxo gerenciável, com triagem, priorização e produtividade organizada.",
    icon: TimerReset,
  },
  {
    title: "Equipe nacional especializada",
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
    icon: BriefcaseMedical,
  },
];

export const SINACE_OPERATING_MODEL = [
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
] as const;

export const SINACE_APPLICATION_CAPABILITIES = [
  "Dashboard operacional conectado à taxonomia persistente das especialidades.",
  "Trilhas, biblioteca, instituições e módulos com vocabulário clínico-operacional consistente.",
  "Área administrativa para governança da taxonomia, status, ordenação e foco educacional ou operacional.",
  "Workspace autenticado preparado para expansão do acervo clínico, analytics e módulos institucionais.",
] as const;

export const SINACE_EXPANSION_ROADMAP = [
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
] as const;

export const SINACE_HIGHLIGHT_METRICS = [
  {
    label: "Especialidades catalogadas",
    value: `${SINACE_SPECIALTY_CATALOG.length}`,
    helper: "Linhas cirúrgicas com taxonomia própria e leitura institucional da operação.",
  },
  {
    label: "Modalidades operatórias",
    value: `${SINACE_OPERATION_MODALITIES.length}`,
    helper: "Abrangendo regime ambulatorial, hospitalar e procedimentos minimamente invasivos.",
  },
  {
    label: "Foco institucional",
    value: "Rede pública e complementar",
    helper: "Articulação com governos, OSS, Santas Casas, hospitais e parceiros executores.",
  },
] as const;

export const SINACE_PUBLIC_PAGE_INTROS: Record<Exclude<SinacePublicPageKey, "home">, {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = {
  proposta: {
    eyebrow: "Proposta institucional",
    title: "A SINACE transforma demanda reprimida em programa estruturado de produção cirúrgica.",
    description:
      "A proposta combina governança assistencial, coordenação operacional, especialidades distribuídas em rede e tecnologia própria para ampliar resolutividade sem perder rastreabilidade.",
    icon: HeartPulse,
  },
  operacao: {
    eyebrow: "Operação em rede",
    title: "Modelo operacional orientado por leitura da fila, ativação de capacidade e monitoramento contínuo.",
    description:
      "A SINACE opera com visão executiva, priorização clínica, organização territorial da demanda e expansão progressiva do volume cirúrgico com indicadores.",
    icon: Blocks,
  },
  cobertura: {
    eyebrow: "Cobertura assistencial",
    title: "Cobertura cirúrgica desenhada para ampliar acesso, produtividade e previsibilidade institucional.",
    description:
      "A atuação considera especialidades, modalidades operatórias, capacidade instalada e desenho regional para atender redes hospitalares e programas públicos de escala.",
    icon: Building2,
  },
  aplicativo: {
    eyebrow: "Aplicativo e workspace",
    title: "A camada digital da SINACE conecta conhecimento clínico, governança e operação em um único ambiente.",
    description:
      "O workspace próprio organiza taxonomias, biblioteca, trilhas e módulos estratégicos para apoiar equipes, parceiros e expansão institucional.",
    icon: Smartphone,
  },
  contato: {
    eyebrow: "Contato institucional",
    title: "Canal dedicado para propostas, parcerias, articulação hospitalar e expansão regional.",
    description:
      "A página de contato reúne formulário, dados institucionais, localização-base e caminhos para iniciar conversas sobre projetos cirúrgicos em rede.",
    icon: ContactRound,
  },
};

export const SINACE_PUBLIC_CONTACT_CHANNELS = [
  {
    label: "Telefone institucional",
    value: SINACE_INSTITUTIONAL_PROFILE.phone,
    href: `tel:+55${SINACE_INSTITUTIONAL_PROFILE.phone.replace(/\D/g, "")}`,
    icon: Phone,
  },
  {
    label: "E-mail institucional",
    value: SINACE_INSTITUTIONAL_PROFILE.email,
    href: `mailto:${SINACE_INSTITUTIONAL_PROFILE.email}`,
    icon: Mail,
  },
  {
    label: "Sede base",
    value: SINACE_INSTITUTIONAL_PROFILE.headquarters,
    href: undefined,
    icon: MapPinned,
  },
] as const;

export const SINACE_PUBLIC_SPECIALTY_PREVIEW = SINACE_SPECIALTY_CATALOG.slice(0, 8);

export const SINACE_PUBLIC_MAP_CENTER = {
  lat: -22.9792,
  lng: -49.8701,
} as const;

export const SINACE_PUBLIC_GOOGLE_MAPS_QUERY = encodeURIComponent(
  `${SINACE_INSTITUTIONAL_PROFILE.headquarters}, Brasil`
);
