const fs = require("fs");

const dictionary = {
  // Tables
  users: "usuarios",
  specialties: "especialidades",
  partners: "parceiros",
  institutions: "instituicoes",
  surgicalTeams: "equipes_cirurgicas",
  professionalProfiles: "perfis_profissionais",
  surgicalTeamMembers: "membros_equipe_cirurgica",
  profileConnections: "conexoes_perfis",
  institutionSpecialties: "especialidades_instituicao",
  governmentContracts: "contratos_governamentais",
  patientQueueEntries: "fila_pacientes",
  tracks: "trilhas",
  learningModules: "modulos_aprendizado",
  trackEnrollments: "matriculas_trilha",
  clinicalCases: "casos_clinicos",
  caseStudies: "estudos_caso",
  encyclopediaEntries: "verbetes_enciclopedia",
  flowcharts: "fluxogramas",
  libraryAssets: "recursos_biblioteca",
  mediaShowcaseItems: "itens_vitrine_midia",
  documents: "documentos",
  publications: "publicacoes",

  // Columns
  openId: "identificador_aberto",
  passwordHash: "senha_hash",
  loginMethod: "metodo_login",
  role: "funcao",
  addressLine1: "endereco_linha1",
  city: "cidade",
  state: "estado",
  isDoctor: "e_medico",
  createdAt: "criado_em",
  updatedAt: "atualizado_em",
  lastSignedIn: "ultimo_login",
  name: "nome",
  shortLabel: "rotulo_curto",
  description: "descricao",
  category: "categoria",
  displayOrder: "ordem_exibicao",
  coordinationModel: "modelo_coordenacao",
  createdByUserId: "criado_por_usuario_id",
  partnerType: "tipo_parceiro",
  websiteUrl: "site_url",
  institutionType: "tipo_instituicao",
  capacityProfile: "perfil_capacidade",
  teachingProfile: "perfil_ensino",
  partnerId: "parceiro_id",
  teamType: "tipo_equipe",
  operationalProfile: "perfil_operacional",
  membersCount: "contagem_membros",
  institutionId: "instituicao_id",
  specialtyId: "especialidade_id",
  userId: "usuario_id",
  fullName: "nome_completo",
  roleTitle: "titulo_cargo",
  professionalType: "tipo_profissional",
  credentialNumber: "numero_credencial",
  credentialState: "estado_credencial",
  credentialAuthority: "autoridade_credencial",
  rqeNumber: "numero_rqe",
  publicEmail: "email_publico",
  privateAccessEmail: "email_acesso_privado",
  passwordAccessStatus: "status_acesso_senha",
  passwordRecoveryChannel: "canal_recuperacao_senha",
  passwordLastUpdatedAt: "senha_atualizada_em",
  phone: "telefone",
  regionLabel: "rotulo_regiao",
  profileImageUrl: "url_imagem_perfil",
  miniBio: "mini_bio",
  curriculumSummary: "resumo_curriculo",
  highlights: "destaques",
  practiceAreas: "areas_atuacao",
  collaborationInterest: "interesse_colaboracao",
  verificationStatus: "status_verificacao",
  visibility: "visibilidade",
  surgicalTeamId: "equipe_cirurgica_id",
  professionalProfileId: "perfil_profissional_id",
  membershipRole: "papel_membro",
  requesterProfileId: "perfil_solicitante_id",
  targetProfileId: "perfil_alvo_id",
  connectionType: "tipo_conexao",
  serviceModel: "modelo_servico",
  title: "titulo",
  contractType: "tipo_contrato",
  scope: "escopo",
  estimatedProcedures: "procedimentos_estimados",
  startDate: "data_inicio",
  endDate: "data_fim",
  patientCode: "codigo_paciente",
  contractId: "contrato_id",
  priority: "prioridade",
  pathway: "caminho",
  waitingDays: "dias_espera",
  originCity: "cidade_origem",
  originState: "estado_origem",
  scheduledAt: "agendado_em",
  performedAt: "realizado_em",
  summary: "resumo",
  difficulty: "dificuldade",
  estimatedHours: "horas_estimadas",
  trackId: "trilha_id",
  position: "posicao",
  estimatedMinutes: "minutos_estimados",
  progressPercent: "percentual_progresso",
  startedAt: "iniciado_em",
  completedAt: "concluido_em",
  lastAccessedAt: "ultimo_acesso_em",
  synopsis: "sinopse",
  learningObjectives: "objetivos_aprendizado",
  discussion: "discussao",
  publishedAt: "publicado_em",
  clinicalFocus: "foco_clinico",
  authorProfileId: "perfil_autor_id",
  publicationId: "publicacao_id",
  complexity: "complexidade",
  sourceUrl: "url_origem",
  body: "corpo",
  reviewedByUserId: "revisado_por_usuario_id",
  diagramUrl: "url_diagrama",
  fileKey: "chave_arquivo",
  assetType: "tipo_recurso",
  uploadedByUserId: "enviado_por_usuario_id",
  fileUrl: "url_arquivo",
  featured: "em_destaque",
  mediaType: "tipo_midia",
  moduleKey: "chave_modulo",
  documentType: "tipo_documento",
  fileName: "nome_arquivo",
  mimeType: "tipo_mime",
  fileSizeBytes: "tamanho_arquivo_bytes",
  folderLabel: "rotulo_pasta",
  contributorName: "nome_contribuidor",
  contributorInstitution: "instituicao_contribuidor",
  contributorCredential: "credencial_contribuidor",
  contributorType: "tipo_contribuidor",
  uploadSource: "origem_envio",
  excerpt: "trecho",
  publicationType: "tipo_publicacao",
  coverImageUrl: "url_imagem_capa",
  
  // Enums and constraint strings we don't strictly *need* to change, but if they are matched they will be.
};

let content = fs.readFileSync("drizzle/schema.ts", "utf-8");

// Regex to replace mysqlTable("something", ...) with mysqlTable("translated_something", ...)
content = content.replace(/mysqlTable\(\s*"([^"]+)"/g, (match, p1) => {
  if (dictionary[p1]) {
    return `mysqlTable("${dictionary[p1]}"`;
  }
  return match;
});

// Regex to replace column definitions like varchar("something") with varchar("translated_something")
// The column types are: boolean, int, mysqlEnum, text, timestamp, varchar
const colTypes = ["boolean", "int", "mysqlEnum", "text", "timestamp", "varchar"];
colTypes.forEach(type => {
  const regex = new RegExp(`${type}\\(\\s*"([^"]+)"`, 'g');
  content = content.replace(regex, (match, p1) => {
    if (dictionary[p1]) {
      return `${type}("${dictionary[p1]}"`;
    }
    return match;
  });
});

// Also replace unique indexes strings (optional but nice)
content = content.replace(/uniqueIndex\(\s*"([^"]+)"\)/g, (match, p1) => {
  // Let's just do a naive replace of the word parts if we want, or leave it.
  let newName = p1;
  Object.keys(dictionary).forEach(key => {
    newName = newName.replace(key, dictionary[key]);
  });
  return `uniqueIndex("${newName}")`;
});

fs.writeFileSync("drizzle/schema.ts", content, "utf-8");
console.log("Translation applied successfully!");
