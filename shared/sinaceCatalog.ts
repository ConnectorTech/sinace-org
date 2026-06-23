export type SinaceSpecialtyCatalogItem = {
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  coordinationModel: string;
  educationalFocus: string;
  operationalFocus: string;
};

export const SINACE_SPECIALTY_CATALOG: SinaceSpecialtyCatalogItem[] = [
  {
    slug: "cirurgia-geral",
    name: "Cirurgia geral",
    shortLabel: "Cirurgia geral",
    description:
      "Linha estruturante para programas de redução de filas, triagem, ambulatório cirúrgico e coordenação hospitalar de baixa, média e alta complexidade.",
    coordinationModel: "Gestão matricial da fila cirúrgica com ativação regional de produção.",
    educationalFocus: "Protocolos operatórios, preparo perioperatório e segurança do paciente.",
    operationalFocus: "Priorizar demanda reprimida e organizar capacidade instalada por macrorregião.",
  },
  {
    slug: "cirurgia-do-aparelho-digestivo",
    name: "Cirurgia do aparelho digestivo",
    shortLabel: "Aparelho digestivo",
    description:
      "Especialidade voltada ao tratamento cirúrgico do trato digestivo, com integração entre ambulatório, centro cirúrgico, endoscopia e retaguarda hospitalar.",
    coordinationModel: "Coordenação por linha digestiva com apoio endoscópico e ambulatorial.",
    educationalFocus: "Técnicas digestivas, linhas de cuidado gastrointestinais e tomada de decisão operatória.",
    operationalFocus: "Organizar filas eletivas digestivas e ampliar resolutividade com suporte endoscópico.",
  },
  {
    slug: "cirurgia-bariatrica",
    name: "Cirurgia bariátrica",
    shortLabel: "Bariátrica",
    description:
      "Linha cirúrgica voltada ao tratamento da obesidade com protocolos multiprofissionais, critérios regulatórios e seguimento longitudinal.",
    coordinationModel: "Gestão multiprofissional com elegibilidade regulada e acompanhamento longitudinal.",
    educationalFocus: "Critérios de indicação, fluxos perioperatórios e seguimento metabólico.",
    operationalFocus: "Estruturar jornadas seguras para alta complexidade eletiva e ampliar previsibilidade assistencial.",
  },
  {
    slug: "cirurgia-cardiovascular",
    name: "Cirurgia cardiovascular",
    shortLabel: "Cardiovascular",
    description:
      "Especialidade de alta complexidade para procedimentos cardiovasculares, com planejamento de leitos, UTI, equipe avançada e governança de risco.",
    coordinationModel: "Coordenação em rede de alta complexidade com pactuação de leitos críticos.",
    educationalFocus: "Fluxos cardiovasculares, cuidados críticos e integração multiprofissional.",
    operationalFocus: "Qualificar filas de alta complexidade e sustentar rede cirúrgica com segurança assistencial.",
  },
  {
    slug: "cirurgia-toracica",
    name: "Cirurgia torácica",
    shortLabel: "Torácica",
    description:
      "Área dedicada a procedimentos torácicos, com articulação entre diagnóstico, centro cirúrgico, broncoscopia e retaguarda respiratória.",
    coordinationModel: "Linha torácica integrada a diagnóstico, broncoscopia e regulação de casos complexos.",
    educationalFocus: "Abordagens torácicas, vias minimamente invasivas e cuidados pós-operatórios respiratórios.",
    operationalFocus: "Reduzir tempo de espera em casos torácicos e elevar previsibilidade do giro assistencial.",
  },
  {
    slug: "neurocirurgia",
    name: "Neurocirurgia",
    shortLabel: "Neurocirurgia",
    description:
      "Especialidade de alta criticidade clínica para procedimentos cranianos, espinhais e funcionais, com forte necessidade de coordenação regional.",
    coordinationModel: "Coordenação de alta complexidade com referência regional e critérios clínicos priorizados.",
    educationalFocus: "Casos neurológicos cirúrgicos, decisão baseada em imagem e raciocínio de alta complexidade.",
    operationalFocus: "Organizar acesso, referência e contra-referência para neurocirurgia eletiva e estratégica.",
  },
  {
    slug: "cirurgia-vascular",
    name: "Cirurgia vascular",
    shortLabel: "Vascular",
    description:
      "Linha cirúrgica vascular focada em acesso oportuno, manejo de cronicidade e articulação com ambulatórios, imagem e centro cirúrgico.",
    coordinationModel: "Gestão vascular com estratificação de risco e integração ambulatorial.",
    educationalFocus: "Doença arterial e venosa, técnicas abertas e endovasculares, e seguimento pós-operatório.",
    operationalFocus: "Tratar demanda eletiva com priorização clínica e racionalização de eventos evitáveis.",
  },
  {
    slug: "cirurgia-plastica",
    name: "Cirurgia plástica",
    shortLabel: "Plástica",
    description:
      "Especialidade aplicada à reconstrução, reparação funcional e procedimentos eletivos estratégicos em ambiente hospitalar e ambulatorial.",
    coordinationModel: "Coordenação reconstrutiva com articulação entre trauma, oncologia e cuidado ambulatorial.",
    educationalFocus: "Reconstrução, retalhos, manejo de feridas e planejamento reparador.",
    operationalFocus: "Ampliar acesso a procedimentos reparadores e organizar linhas cirúrgicas de suporte funcional.",
  },
  {
    slug: "cirurgia-oncologica",
    name: "Cirurgia oncológica",
    shortLabel: "Oncológica",
    description:
      "Especialidade dedicada ao tratamento cirúrgico oncológico, com integração multiprofissional, staging, ambulatório e retaguarda hospitalar.",
    coordinationModel: "Linha oncológica com pactuação multidisciplinar e governança de prioridade clínica.",
    educationalFocus: "Planejamento oncológico cirúrgico, multimodalidade terapêutica e segurança em casos complexos.",
    operationalFocus: "Reduzir atrasos cirúrgicos em oncologia e fortalecer fluxos de acesso em rede.",
  },
  {
    slug: "cirurgia-pediatrica",
    name: "Cirurgia pediátrica",
    shortLabel: "Pediátrica",
    description:
      "Área dedicada ao cuidado cirúrgico de crianças e adolescentes, com protocolos específicos, segurança perioperatória e suporte familiar.",
    coordinationModel: "Coordenação pediátrica com protocolos assistenciais específicos por faixa etária.",
    educationalFocus: "Abordagem cirúrgica pediátrica, segurança do paciente e comunicação com famílias.",
    operationalFocus: "Organizar fluxos pediátricos regionais com critérios assistenciais e menor tempo de espera.",
  },
  {
    slug: "ortopedia-e-traumatologia",
    name: "Ortopedia e traumatologia",
    shortLabel: "Ortopedia",
    description:
      "Especialidade central na demanda reprimida do sistema, combinando alto volume eletivo, trauma, implantes e forte dependência logística.",
    coordinationModel: "Gestão de filas ortopédicas com agenda dedicada, protocolos e previsibilidade de insumos.",
    educationalFocus: "Casos ortopédicos, planejamento de implantes e raciocínio clínico-cirúrgico aplicado.",
    operationalFocus: "Acelerar produção de alto volume com controle de suspensão, materiais e tempo de permanência.",
  },
  {
    slug: "urologia",
    name: "Urologia",
    shortLabel: "Urologia",
    description:
      "Linha estratégica para programas eletivos e procedimentos de média e alta complexidade, com interface entre ambulatório, endoscopia e cirurgia.",
    coordinationModel: "Coordenação urológica com apoio endoscópico e regulação assistencial escalável.",
    educationalFocus: "Técnicas urológicas, casos clínicos por subárea e decisão terapêutica orientada por evidência.",
    operationalFocus: "Estruturar filas urológicas e ampliar resolutividade com desenho regional de capacidade.",
  },
  {
    slug: "ginecologia-e-obstetricia",
    name: "Ginecologia e obstetrícia",
    shortLabel: "Ginecologia e obstetrícia",
    description:
      "Especialidade voltada a cirurgias ginecológicas, cuidado da saúde da mulher e integração com ambulatórios, centro cirúrgico e maternidades.",
    coordinationModel: "Linha da saúde da mulher com agenda eletiva, ambulatório e suporte hospitalar.",
    educationalFocus: "Casos ginecológicos cirúrgicos, segurança obstétrica e técnicas minimamente invasivas.",
    operationalFocus: "Reduzir filas de cirurgias ginecológicas e organizar produção em rede assistencial integrada.",
  },
  {
    slug: "otorrinolaringologia",
    name: "Otorrinolaringologia",
    shortLabel: "Otorrinolaringologia",
    description:
      "Cobertura cirúrgica associada a alto volume eletivo, integração ambulatorial e forte impacto em qualidade de vida e funcionalidade.",
    coordinationModel: "Coordenação ORL com triagem ambulatorial, apoio diagnóstico e centro cirúrgico dedicado.",
    educationalFocus: "Otologia, rinologia, laringologia e técnicas cirúrgicas por subárea.",
    operationalFocus: "Estruturar linhas de alto volume com leitura territorial da demanda reprimida.",
  },
  {
    slug: "oftalmologia",
    name: "Oftalmologia",
    shortLabel: "Oftalmologia",
    description:
      "Especialidade de alto volume com grande potencial de ganho assistencial em programas públicos de ampliação de acesso cirúrgico.",
    coordinationModel: "Operação seriada de alto volume com protocolos, mutirões qualificados e rastreabilidade.",
    educationalFocus: "Procedimentos oftalmológicos, protocolos de triagem e segurança em linhas de produção intensiva.",
    operationalFocus: "Ampliar acesso com eficiência, produtividade e menor tempo de fila em escala regional.",
  },
  {
    slug: "mastologia",
    name: "Mastologia",
    shortLabel: "Mastologia",
    description:
      "Linha cirúrgica especializada no cuidado das doenças mamárias, com articulação diagnóstica, oncológica e reconstrutiva.",
    coordinationModel: "Coordenação mastológica com integração oncológica, diagnóstica e reconstrutiva.",
    educationalFocus: "Doenças mamárias, conduta cirúrgica e integração com oncologia e imagem.",
    operationalFocus: "Qualificar acesso a procedimentos mamários e reduzir atrasos em linhas sensíveis de cuidado.",
  },
  {
    slug: "coloproctologia",
    name: "Coloproctologia",
    shortLabel: "Coloproctologia",
    description:
      "Especialidade dedicada ao cuidado colorretal, com interface entre ambulatório, endoscopia, oncologia e centro cirúrgico.",
    coordinationModel: "Linha colorretal integrada a ambulatório, endoscopia e cirurgia hospitalar.",
    educationalFocus: "Doenças colorretais, raciocínio diagnóstico-terapêutico e técnicas abertas e minimamente invasivas.",
    operationalFocus: "Organizar acesso a procedimentos colorretais e fortalecer continuidade assistencial.",
  },
  {
    slug: "cirurgia-de-cabeca-e-pescoco",
    name: "Cirurgia de cabeça e pescoço",
    shortLabel: "Cabeça e pescoço",
    description:
      "Área estratégica para casos oncológicos, reconstrutivos e funcionais, com alta dependência de integração multiprofissional.",
    coordinationModel: "Coordenação multidisciplinar com integração oncológica, diagnóstica e reconstrutiva.",
    educationalFocus: "Casos complexos de cabeça e pescoço, planejamento terapêutico e seguimento especializado.",
    operationalFocus: "Reduzir tempo de espera em casos prioritários e organizar fluxos de alta complexidade.",
  },
  {
    slug: "cirurgia-da-mao",
    name: "Cirurgia da mão",
    shortLabel: "Cirurgia da mão",
    description:
      "Subárea cirúrgica especializada em reparo funcional, trauma e reabilitação, relevante para produtividade e retorno funcional do paciente.",
    coordinationModel: "Linha funcional com integração entre ortopedia, reabilitação e cirurgia ambulatorial/hospitalar.",
    educationalFocus: "Técnicas de reparo, trauma da mão e recuperação funcional.",
    operationalFocus: "Ampliar resolutividade em casos eletivos e funcionais com menor tempo de afastamento e fila.",
  },
];

export const SINACE_OPERATION_MODALITIES = [
  "Regime ambulatorial e hospitalar",
  "Baixa, média e alta complexidade",
  "Cirurgia convencional",
  "Cirurgia laparoscópica",
  "Cirurgia endoscópica",
  "Cirurgia robótica",
  "Transplantes",
  "Procedimentos minimamente invasivos",
] as const;

export const SINACE_INSTITUTIONAL_PROFILE = {
  legalName: "SINACE",
  extendedName: "Sistema Nacional Hospitalar de Cirurgias Especializadas",
  phone: "14 99808-1759",
  email: "sinace.cirurgias@gmail.com",
  instagram: "@sinace_cirurgias",
  cnpj: "65.897.867/0001-37",
  headquarters: "Ourinhos/SP",
  tagline:
    "Plataforma institucional para redução de filas cirúrgicas, coordenação operacional e educação médico-cirúrgica.",
  socialObject:
    "Prestação de serviços em regime ambulatorial e hospitalar, de baixa, média e alta complexidade, com atuação em todas as cirurgias, convencionais e laparoscópicas, incluindo abordagens endoscópicas, robóticas, transplantes e demais procedimentos minimamente invasivos.",
} as const;
