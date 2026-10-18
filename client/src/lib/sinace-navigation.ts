import {
  BookOpen,
  BookText,
  BriefcaseMedical,
  Building2,
  ClipboardList,
  FileBarChart2,
  GitBranchPlus,
  House,
  Info,
  LayoutDashboard,
  Library,
  LayoutGrid,
  Network,
  Settings2,
  Stethoscope,
  Users,
} from "lucide-react";

export type SinaceNavigationItem = {
  label: string;
  path: string;
  description: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  requiresAdmin?: boolean;
};

export type SinaceNavigationGroup = {
  label: string;
  coverImage?: string;
  items: SinaceNavigationItem[];
};

export const sinaceNavigationGroups: SinaceNavigationGroup[] = [
  {
    label: "Visão executiva",
    coverImage: "/images/menu-visao-executiva.svg",
    items: [
      {
        label: "Dashboard",
        path: "/app",
        description: "Visão executiva da rede, do acervo e da fila cirúrgica.",
        icon: LayoutDashboard,
      },
      {
        label: "Publicações",
        path: "/app/publicacoes",
        description: "Comunicados, relatórios e resultados publicados.",
        icon: FileBarChart2,
      },
    ],
  },
  {
    label: "Rede cirúrgica",
    coverImage: "/images/menu-rede-cirurgica.svg",
    items: [
      {
        label: "Especialidades",
        path: "/app/especialidades",
        description: "Catálogo nacional de especialidades cirúrgicas.",
        icon: Stethoscope,
      },
      {
        label: "Fluxogramas",
        path: "/app/fluxogramas",
        description: "Fluxos hospitalares e jornadas assistenciais.",
        icon: GitBranchPlus,
      },
      {
        label: "Instituições",
        path: "/app/instituicoes",
        description: "Hospitais, Santas Casas e centros cirúrgicos da rede.",
        icon: Building2,
      },
      {
        label: "Parceiros",
        path: "/app/parceiros",
        description: "Parceiros nas esferas federal, estadual e municipal.",
        icon: Network,
      },
    ],
  },
  {
    label: "Conhecimento cirúrgico",
    coverImage: "/images/menu-conhecimento.svg",
    items: [
      {
        label: "Biblioteca",
        path: "/app/biblioteca",
        description: "Protocolos, materiais de estudo e mídias por especialidade.",
        icon: Library,
      },
      {
        label: "Estudos de caso",
        path: "/app/casos",
        description: "Casos clínicos e publicações de referência.",
        icon: ClipboardList,
      },
      {
        label: "Enciclopédia",
        path: "/app/enciclopedia",
        description: "Consulta cirúrgica organizada por especialidade.",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Comunidade médica",
    coverImage: "/images/menu-comunidade.svg",
    items: [
      {
        label: "Minha área",
        path: "/app/minha-area",
        description: "Seu currículo, credenciais e drive profissional.",
        icon: BriefcaseMedical,
      },
      {
        label: "Perfis médicos",
        path: "/app/perfis",
        description: "Diretório de especialistas por área e região.",
        icon: Users,
      },
      {
        label: "Network médico",
        path: "/app/network",
        description: "Conexões entre especialistas por nicho e território.",
        icon: BookText,
      },
    ],
  },
  {
    label: "Governança",
    items: [
      {
        label: "Administração",
        path: "/app/admin",
        description: "Taxonomias, cadastros e permissões da plataforma.",
        icon: Settings2,
        requiresAdmin: true,
      },
      {
        label: "Sobre a SINACE",
        path: "/app/sobre",
        description: "Dados institucionais, contatos oficiais e objeto social.",
        icon: Info,
      },
    ],
  },
];

export type SinaceBottomNavAxis = {
  key: "inicio" | "rede" | "conhecimento" | "minha-area";
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  /** Rotas que mantêm o eixo ativo (além do próprio path). */
  matchPaths: string[];
};

/**
 * Eixos principais da Bottom Navigation Bar do workspace.
 * Os módulos que não pertencem a nenhum eixo ficam agrupados em "Mais".
 */
export const sinaceBottomNavAxes: SinaceBottomNavAxis[] = [
  {
    key: "inicio",
    label: "Início",
    path: "/app",
    icon: House,
    matchPaths: ["/app"],
  },
  {
    key: "rede",
    label: "Rede",
    path: "/app/network",
    icon: Network,
    matchPaths: ["/app/network", "/app/perfis", "/app/alunos", "/app/professores"],
  },
  {
    key: "conhecimento",
    label: "Conhecimento",
    path: "/app/biblioteca",
    icon: Library,
    matchPaths: ["/app/biblioteca", "/app/casos", "/app/enciclopedia"],
  },
  {
    key: "minha-area",
    label: "Minha Área",
    path: "/app/minha-area",
    icon: BriefcaseMedical,
    matchPaths: ["/app/minha-area"],
  },
];

export const SINACE_BOTTOM_NAV_MORE_ICON = LayoutGrid;

function normalizeAppPath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/$/, "");
}

export function getActiveBottomNavAxis(pathname: string) {
  const path = normalizeAppPath(pathname);
  return sinaceBottomNavAxes.find(axis => axis.matchPaths.includes(path)) ?? null;
}

/** Módulos exibidos em "Mais": tudo que não é destino direto de um eixo principal. */
export function getBottomNavMoreGroups(): SinaceNavigationGroup[] {
  const primaryPaths = new Set(sinaceBottomNavAxes.map(axis => axis.path));

  return sinaceNavigationGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !primaryPaths.has(item.path)),
    }))
    .filter(group => group.items.length > 0);
}
