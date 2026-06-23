import {
  BookOpen,
  BookText,
  BriefcaseMedical,
  Building2,
  ClipboardList,
  FileBarChart2,
  GitBranchPlus,
  LayoutDashboard,
  Library,
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
  items: SinaceNavigationItem[];
};

export const sinaceNavigationGroups: SinaceNavigationGroup[] = [
  {
    label: "Visão executiva",
    items: [
      {
        label: "Dashboard",
        path: "/app",
        description: "Síntese institucional da plataforma, com leitura executiva da rede, do acervo e da base cirúrgica.",
        icon: LayoutDashboard,
      },
      {
        label: "Publicações",
        path: "/app/publicacoes",
        description: "Comunicados institucionais, visão do CEO, resultados e narrativas estratégicas da SINACE.",
        icon: FileBarChart2,
      },
    ],
  },
  {
    label: "Rede cirúrgica",
    items: [
      {
        label: "Especialidades",
        path: "/app/especialidades",
        description: "Catálogo nacional de especialidades cirúrgicas e frentes em expansão da plataforma.",
        icon: Stethoscope,
      },
      {
        label: "Fluxogramas",
        path: "/app/fluxogramas",
        description: "Fluxos hospitalares, jornadas assistenciais e processos cirúrgicos organizados para consulta.",
        icon: GitBranchPlus,
      },
      {
        label: "Instituições",
        path: "/app/instituicoes",
        description: "Hospitais, Santas Casas, centros cirúrgicos e estruturas de atuação vinculadas à SINACE.",
        icon: Building2,
      },
      {
        label: "Parceiros",
        path: "/app/parceiros",
        description: "Relações institucionais em nível federal, estadual, municipal e regional.",
        icon: Network,
      },
    ],
  },
  {
    label: "Conhecimento cirúrgico",
    items: [
      {
        label: "Biblioteca",
        path: "/app/biblioteca",
        description: "Drive técnico com documentos, protocolos, materiais de estudo, imagens e vídeos por especialidade.",
        icon: Library,
      },
      {
        label: "Estudos de caso",
        path: "/app/casos",
        description: "Casos clínicos, publicações de referência e acervo técnico-científico estruturado.",
        icon: ClipboardList,
      },
      {
        label: "Enciclopédia",
        path: "/app/enciclopedia",
        description: "Base de consulta cirúrgica contínua, organizada por especialidade e temas correlatos.",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Comunidade médica",
    items: [
      {
        label: "Minha área",
        path: "/app/minha-area",
        description: "Workspace privado do especialista com currículo editável, credenciais, visibilidade e drive profissional por especialidade.",
        icon: BriefcaseMedical,
      },
      {
        label: "Perfis médicos",
        path: "/app/perfis",
        description: "Diretório profissional com currículo, credenciais, especialidade, região e identidade médica.",
        icon: Users,
      },
      {
        label: "Network médico",
        path: "/app/network",
        description: "Descoberta e conexão entre especialistas por nicho cirúrgico, território e afinidade institucional.",
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
        description: "Gestão da plataforma, taxonomias, cadastros, permissões e consistência operacional.",
        icon: Settings2,
        requiresAdmin: true,
      },
    ],
  },
];
