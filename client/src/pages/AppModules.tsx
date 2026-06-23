import { useAuth } from "@/_core/hooks/useAuth";
import React from "react";
import { SinaceModulePlaceholder } from "@/components/SinaceModulePlaceholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Library,
  Loader2,
  Microscope,
  Network,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type SpecialtyFormState = {
  name: string;
  shortLabel: string;
  description: string;
  category: "cirurgica" | "clinica" | "apoio";
  status: "draft" | "active" | "archived";
  displayOrder: string;
  coordinationModel: string;
};

const specialtyCategoryLabel: Record<SpecialtyFormState["category"], string> = {
  cirurgica: "Cirúrgica",
  clinica: "Clínica",
  apoio: "Apoio",
};

const specialtyStatusLabel: Record<SpecialtyFormState["status"], string> = {
  draft: "Rascunho",
  active: "Ativa",
  archived: "Arquivada",
};

const specialtyStatusClassName: Record<SpecialtyFormState["status"], string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

const defaultSpecialtyFormState: SpecialtyFormState = {
  name: "",
  shortLabel: "",
  description: "",
  category: "cirurgica",
  status: "draft",
  displayOrder: "",
  coordinationModel: "",
};

function normalizeDisplayOrder(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
}

const trackDifficultyLabel: Record<string, string> = {
  intro: "Entrada",
  intermediate: "Intermediária",
  advanced: "Avançada",
};

const publicationStatusLabel: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const documentTypeLabel: Record<string, string> = {
  protocol: "Protocolo",
  guideline: "Diretriz",
  manual: "Manual",
  article: "Artigo",
  checklist: "Checklist",
  video: "Vídeo",
  other: "Outro",
};

const visibilityLabel: Record<string, string> = {
  public: "Público",
  restricted: "Restrito",
  private: "Privado",
};

const partnerTypeLabel: Record<string, string> = {
  government: "Governo",
  oss: "OSS",
  hospital_network: "Rede hospitalar",
  supplier: "Fornecedor",
  academic: "Acadêmico",
  other: "Outro",
};

const partnerStatusLabel: Record<string, string> = {
  prospect: "Prospect",
  active: "Ativo",
  inactive: "Inativo",
};

const institutionTypeLabel: Record<string, string> = {
  hospital: "Hospital",
  santa_casa: "Santa Casa",
  clinic: "Clínica",
  surgical_center: "Centro cirúrgico",
  teaching_center: "Centro de ensino",
  other: "Outro",
};

const institutionStatusLabel: Record<string, string> = {
  planning: "Planejamento",
  active: "Ativa",
  inactive: "Inativa",
};

const queuePriorityLabel: Record<string, string> = {
  elective: "Eletiva",
  priority: "Prioritária",
  urgent: "Urgente",
};

const queueStatusLabel: Record<string, string> = {
  waiting: "Em espera",
  scheduled: "Agendada",
  completed: "Concluída",
  redirected: "Redirecionada",
};

function resolveModuleError(errors: Array<{ message: string } | null | undefined>) {
  return errors.find((error): error is { message: string } => Boolean(error)) ?? null;
}

function ModuleStateNotice({
  title,
  description,
  inverse = false,
  onRetry,
  retrying = false,
}: {
  title: string;
  description: string;
  inverse?: boolean;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  const containerClassName = inverse
    ? "border-white/10 bg-white/6 text-slate-100/88"
    : "border-dashed border-border/80 bg-slate-50/80 text-slate-600";

  const actionClassName = inverse
    ? "border-white/15 bg-white/8 text-white hover:bg-white/12 hover:text-white"
    : "border-border/70 bg-white text-slate-700 hover:bg-slate-100";

  return (
    <div className={`rounded-[1.25rem] border p-5 ${containerClassName}`}>
      <p className={`text-sm font-semibold tracking-[-0.01em] ${inverse ? "text-white" : "text-slate-950"}`}>{title}</p>
      <p className={`mt-3 text-sm leading-7 ${inverse ? "text-slate-100/86" : "text-slate-600"}`}>{description}</p>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry} className={`mt-4 ${actionClassName}`}>
          {retrying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

function refetchModuleQueries(...queries: Array<{ refetch: () => Promise<unknown> }>) {
  return Promise.all(queries.map(query => query.refetch()));
}


export function AppTracks() {
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();
  const tracksQuery = trpc.sinace.tracks.list.useQuery();

  const specialties = specialtiesQuery.data ?? [];
  const tracks = tracksQuery.data ?? [];
  const loading = specialtiesQuery.isLoading || tracksQuery.isLoading;
  const retrying = specialtiesQuery.isRefetching || tracksQuery.isRefetching;
  const moduleError = resolveModuleError([specialtiesQuery.error, tracksQuery.error]);

  const leadingSpecialties = specialties.slice(0, 4);
  const publishedTracks = tracks.filter(item => item.status === "published").length;
  const handleRetry = () => {
    void refetchModuleQueries(specialtiesQuery, tracksQuery);
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Trilhas"
      title="As trilhas agora se conectam à taxonomia persistente e aos percursos formativos já registrados no banco do SINACE."
      description="Esta superfície deixa de depender de descrições isoladas e passa a refletir a malha real entre especialidades, trilhas e dificuldade pedagógica, mantendo a evolução do produto ancorada na base relacional compartilhada."
      icon={GraduationCap}
      badge={loading ? "Sincronizando trilhas" : `${tracks.length} trilhas persistidas`}
      highlights={[
        {
          title: "Percursos ligados ao catálogo oficial",
          description: "Cada trilha publicada pode nascer da mesma taxonomia cirúrgica que sustenta a landing, o dashboard e a administração.",
          metric: loading ? "…" : `${specialties.length} especialidades`,
        },
        {
          title: "Níveis de progressão já tipificados",
          description: "A base diferencia trilhas introdutórias, intermediárias e avançadas, permitindo expansão futura sem refatorar a estrutura central.",
          metric: loading ? "…" : `${publishedTracks} publicadas`,
        },
        {
          title: "Integração direta com o acervo",
          description: "Os percursos podem ser ligados a biblioteca, documentos e futuros casos clínicos sem reconstruir a taxonomia em cada módulo.",
          metric: loading ? "…" : `${tracks.length} percursos`,
        },
      ]}
      pillars={[
        {
          title: "Especialidade como origem do currículo",
          description: "A navegação de trilhas já herda o vocabulário persistente do catálogo cirúrgico, reduzindo divergências entre produto, conteúdo e operação.",
          note: "Com isso, o crescimento do app deixa de depender de arrays locais ou rótulos duplicados no frontend.",
        },
        {
          title: "Progressão tipificada",
          description: "Dificuldade, carga horária e status editorial já existem como atributos estruturados e prontos para alimentar filtros futuros.",
          note: "Essa base acelera a evolução para jornadas personalizadas de alunos, professores e gestores.",
        },
        {
          title: "Reuso transversal do catálogo",
          description: "O mesmo conjunto de especialidades pode orientar módulos, biblioteca, enciclopédia e métricas executivas com consistência semântica.",
          note: "Isso elimina hardcodes remanescentes e consolida a taxonomia como fonte única do workspace.",
        },
      ]}
      nextSteps={[
        "Adicionar módulos e checkpoints às trilhas já persistidas.",
        "Conectar progressão individual e conclusão por usuário aos percursos existentes.",
        "Habilitar filtros por dificuldade, especialidade e status editorial.",
        "Expandir recomendações automáticas usando a mesma espinha dorsal relacional.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Percursos persistidos
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Trilhas já disponíveis para leitura por especialidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando trilhas persistidas...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar as trilhas agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : tracks.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há trilhas persistidas"
                description="Cadastre os primeiros percursos formativos para que esta superfície reflita a malha educacional vinculada às especialidades do SINACE."
              />
            ) : (
              tracks.slice(0, 4).map(track => (
                <div key={track.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{track.title}</h3>
                    <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                      {trackDifficultyLabel[track.difficulty] ?? track.difficulty}
                    </Badge>
                    <Badge className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-white">
                      {publicationStatusLabel[track.status] ?? track.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{track.summary ?? "Resumo editorial em consolidação."}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Especialidade</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{track.specialtyName ?? "Transversal"}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Carga estimada</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{track.estimatedHours} h</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Cobertura do catálogo
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              Especialidades que já servem de âncora para formação e conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consolidando cobertura pedagógica...
              </div>
            ) : moduleError ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="A cobertura pedagógica não pôde ser consolidada agora"
                  description={moduleError.message}
                  inverse
                  onRetry={handleRetry}
                  retrying={retrying}
                />
              </div>
            ) : leadingSpecialties.length === 0 ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="Ainda não há especialidades vinculadas às trilhas"
                  description="Ative a taxonomia persistente para que esta seção destaque as áreas cirúrgicas que ancoram os percursos formativos do workspace."
                  inverse
                />
              </div>
            ) : (
              leadingSpecialties.map(item => (
                <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.shortLabel ?? item.name}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100/88">{item.coordinationModel ?? item.description ?? "Especialidade pronta para receber percursos estruturados."}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppLibrary() {
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();
  const documentsQuery = trpc.sinace.documents.list.useQuery();

  const specialties = specialtiesQuery.data ?? [];
  const documents = documentsQuery.data ?? [];
  const loading = specialtiesQuery.isLoading || documentsQuery.isLoading;
  const retrying = specialtiesQuery.isRefetching || documentsQuery.isRefetching;
  const moduleError = resolveModuleError([specialtiesQuery.error, documentsQuery.error]);
  const publishedDocuments = documents.filter(item => item.status === "published").length;
  const restrictedDocuments = documents.filter(item => item.visibility === "restricted").length;
  const handleRetry = () => {
    void refetchModuleQueries(specialtiesQuery, documentsQuery);
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Biblioteca"
      title="A biblioteca passa a exibir um acervo persistente vinculado à taxonomia cirúrgica e às trilhas do SINACE."
      description="O módulo documental deixa de ser apenas conceitual e passa a refletir tipos, visibilidade, vínculos com especialidades e estados editoriais já modelados no banco relacional."
      icon={Library}
      badge={loading ? "Sincronizando acervo" : `${documents.length} documentos persistidos`}
      highlights={[
        {
          title: "Tipologia documental real",
          description: "Protocolos, diretrizes, manuais, checklists e vídeos já podem coexistir como objetos diferenciados no catálogo do workspace.",
          metric: loading ? "…" : `${publishedDocuments} publicados`,
        },
        {
          title: "Contexto temático consistente",
          description: "Cada material pode herdar especialidade e trilha, reforçando leitura por contexto de uso em vez de listas isoladas.",
          metric: loading ? "…" : `${specialties.length} áreas`,
        },
        {
          title: "Governança de acesso pronta",
          description: "A base já registra visibilidade pública, restrita e privada, criando a fundação para políticas de acesso por perfil.",
          metric: loading ? "…" : `${restrictedDocuments} restritos`,
        },
      ]}
      pillars={[
        {
          title: "Biblioteca orientada por taxonomia",
          description: "O acervo passa a reutilizar o mesmo catálogo persistente de especialidades que guia o restante do produto e da presença institucional.",
          note: "Isso reduz retrabalho e evita inconsistência entre conteúdo, navegação e administração.",
        },
        {
          title: "Estados editoriais explícitos",
          description: "Rascunho, publicado e arquivado já existem como estados do documento, permitindo evolução controlada da biblioteca.",
          note: "A política editorial futura pode crescer sobre essa base sem remodelar o frontend.",
        },
        {
          title: "Vínculo com jornadas",
          description: "Os documentos podem servir tanto como referência assistencial quanto como insumo direto para trilhas e enciclopédia.",
          note: "Esse reuso favorece uma plataforma menos fragmentada e mais governável.",
        },
      ]}
      nextSteps={[
        "Adicionar busca facetada por tipo documental, visibilidade e especialidade.",
        "Criar fluxo de publicação editorial com autoria e revisão científica.",
        "Permitir upload governado de arquivos e materiais multimídia.",
        "Conectar documentos a casos clínicos e verbetes correlatos.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Acervo persistido
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Materiais já estruturados para consulta e governança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando biblioteca persistida...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar o acervo agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : documents.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há documentos persistidos"
                description="Publique protocolos, diretrizes ou manuais para que esta área reflita o acervo documental conectado à taxonomia do SINACE."
              />
            ) : (
              documents.slice(0, 5).map(document => (
                <div key={document.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{document.title}</h3>
                    <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                      {documentTypeLabel[document.documentType] ?? document.documentType}
                    </Badge>
                    <Badge className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-white">
                      {visibilityLabel[document.visibility] ?? document.visibility}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{document.description ?? "Material editorial ainda sem descrição longa."}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Especialidade</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{document.specialtyName ?? "Transversal"}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Trilha</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{document.trackTitle ?? "Acervo livre"}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{publicationStatusLabel[document.status] ?? document.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Especialidades em foco
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              O acervo já pode ser lido como extensão do catálogo cirúrgico oficial
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cruzando acervo com especialidades...
              </div>
            ) : moduleError ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="O cruzamento entre acervo e especialidades falhou nesta consulta"
                  description={moduleError.message}
                  inverse
                  onRetry={handleRetry}
                  retrying={retrying}
                />
              </div>
            ) : specialties.length === 0 ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="Ainda não há especialidades para contextualizar o acervo"
                  description="Ative o catálogo persistente para que a biblioteca destaque o vínculo entre cada documento e sua área de atuação."
                  inverse
                />
              </div>
            ) : (
              specialties.slice(0, 4).map(item => {
                const matchingDocuments = documents.filter(document => document.specialtyName === item.name).length;
                return (
                  <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.shortLabel ?? item.name}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-100/88">{item.description ?? "Especialidade pronta para receber materiais assistenciais e educacionais."}</p>
                    <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
                      {matchingDocuments} documentos associados
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppCases() {
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();
  const queueQuery = trpc.sinace.queue.recent.useQuery();
  const documentsQuery = trpc.sinace.documents.list.useQuery();

  const specialties = specialtiesQuery.data ?? [];
  const queueEntries = queueQuery.data ?? [];
  const documents = documentsQuery.data ?? [];
  const loading = specialtiesQuery.isLoading || queueQuery.isLoading || documentsQuery.isLoading;
  const retrying = specialtiesQuery.isRefetching || queueQuery.isRefetching || documentsQuery.isRefetching;
  const moduleError = resolveModuleError([specialtiesQuery.error, queueQuery.error, documentsQuery.error]);
  const handleRetry = () => {
    void refetchModuleQueries(specialtiesQuery, queueQuery, documentsQuery);
  };

  const urgentCases = queueEntries.filter(item => item.priority === "urgent").length;
  const coveredSpecialties = new Set(queueEntries.map(item => item.specialtyName)).size;

  return (
    <SinaceModulePlaceholder
      eyebrow="Casos clínicos"
      title="O módulo de casos passa a se apoiar na fila persistente e no catálogo oficial para orientar raciocínio e priorização clínica."
      description="Mesmo antes do cadastro editorial completo de casos, esta superfície já deixa de ser genérica ao se ancorar nas especialidades persistidas, nas entradas recentes de fila e nos materiais clínicos relacionados disponíveis na base."
      icon={ClipboardList}
      badge={loading ? "Sincronizando casos observados" : `${queueEntries.length} entradas recentes`}
      highlights={[
        {
          title: "Fila como insumo clínico real",
          description: "A plataforma já consegue observar pressão assistencial recente por especialidade, prioridade e status de atendimento.",
          metric: loading ? "…" : `${urgentCases} urgentes`,
        },
        {
          title: "Curadoria apoiada por taxonomia",
          description: "A leitura de casos potenciais deixa de depender de descrições livres e passa a ser agrupada pelo mesmo catálogo cirúrgico usado no restante do workspace.",
          metric: loading ? "…" : `${coveredSpecialties} áreas cobertas`,
        },
        {
          title: "Apoio documental disponível",
          description: "Protocolos e materiais correlatos já podem ser usados como camada complementar para discussão de conduta e preparo editorial dos casos.",
          metric: loading ? "…" : `${documents.length} materiais`,
        },
      ]}
      pillars={[
        {
          title: "Observação assistencial estruturada",
          description: "A fila recente já fornece um primeiro panorama persistente de demanda, prioridade e andamento, útil para orientar a construção do acervo de casos.",
          note: "Isso aproxima o módulo da operação real em vez de mantê-lo como promessa isolada de roadmap.",
        },
        {
          title: "Especialidade como indexador clínico",
          description: "O mesmo catálogo cirúrgico oficial organiza tanto a leitura assistencial quanto a futura curadoria pedagógica dos casos publicados.",
          note: "Essa escolha reduz divergências entre visão executiva, ensino e prática institucional.",
        },
        {
          title: "Integração com biblioteca",
          description: "Documentos, protocolos e trilhas já existentes podem servir de suporte para análise, revisão e aprofundamento dos cenários clínicos observados.",
          note: "Assim, casos clínicos deixam de ser um silo desconectado do restante do produto.",
        },
      ]}
      nextSteps={[
        "Criar o cadastro editorial completo de casos com narrativa, exames, conduta e desfecho.",
        "Relacionar casos a professores, documentos e trilhas específicas.",
        "Permitir revisão científica e publicação por status editorial.",
        "Evoluir da observação da fila para um acervo clínico estruturado e pesquisável.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Observação assistencial
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Entradas recentes que já podem orientar a curadoria clínica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando observações clínicas...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar as observações clínicas agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : queueEntries.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há entradas recentes suficientes para sugerir casos"
                description="Assim que a fila persistente receber novos registros assistenciais, esta área poderá destacar cenários clínicos observáveis para curadoria editorial."
              />
            ) : (
              queueEntries.slice(0, 5).map(entry => (
                <div key={`${entry.patientCode}-${entry.specialtyName}`} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{entry.specialtyName}</h3>
                    <Badge className="rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50">
                      {queuePriorityLabel[entry.priority] ?? entry.priority}
                    </Badge>
                    <Badge className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-white">
                      {queueStatusLabel[entry.status] ?? entry.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Paciente {entry.patientCode} · Origem {entry.institutionName ?? "não informada"}.
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Base de especialidades
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              Áreas cirúrgicas prontas para receber curadoria de casos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consolidando catálogo clínico...
              </div>
            ) : moduleError ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="A leitura do catálogo clínico falhou nesta consulta"
                  description={moduleError.message}
                  inverse
                  onRetry={handleRetry}
                  retrying={retrying}
                />
              </div>
            ) : specialties.length === 0 ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="Ainda não há especialidades disponíveis para curadoria de casos"
                  description="Ative o catálogo persistente para que esta coluna destaque as áreas cirúrgicas prontas para receber casos clínicos relacionados."
                  inverse
                />
              </div>
            ) : (
              specialties.slice(0, 4).map(item => {
                const matchingDocuments = documents.filter(document => document.specialtyName === item.name).length;
                return (
                  <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.shortLabel ?? item.name}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-100/88">{item.coordinationModel ?? item.description ?? "Especialidade pronta para curadoria de cenários clínicos."}</p>
                    <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
                      {matchingDocuments} materiais de apoio
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppEncyclopedia() {
  const utils = trpc.useUtils();
  const snapshotQuery = trpc.sinace.encyclopedia.snapshot.useQuery();
  const uploadMutation = trpc.sinace.encyclopedia.upload.useMutation({
    onSuccess: async createdDocument => {
      setFormState(current => ({
        ...current,
        title: "",
        description: "",
        folderLabel: activeSpecialty?.shortLabel ?? activeSpecialty?.name ?? "",
        documentType: "article",
        visibility: "restricted",
        contributorName: current.contributorName,
        contributorInstitution: current.contributorInstitution,
        contributorCredential: current.contributorCredential,
        sourceUrl: "",
      }));
      setSelectedFile(null);
      setUploadFeedback(`Material \"${createdDocument?.title ?? "educacional"}\" publicado com sucesso no drive da especialidade.`);
      await Promise.all([
        snapshotQuery.refetch(),
        utils.sinace.documents.list.invalidate(),
      ]);
    },
    onError: error => {
      setUploadFeedback(error.message || "Não foi possível publicar o arquivo agora.");
    },
  });

  const snapshot = snapshotQuery.data;
  const specialties = snapshot?.specialties ?? [];
  const metrics = snapshot?.metrics;
  const loading = snapshotQuery.isLoading;
  const retrying = snapshotQuery.isRefetching;
  const moduleError = snapshotQuery.error ?? null;
  const totalFolders = specialties.reduce((total, item) => total + item.folders.length, 0);

  const [activeSpecialtySlug, setActiveSpecialtySlug] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    folderLabel: "",
    documentType: "article",
    visibility: "restricted",
    contributorName: "",
    contributorInstitution: "",
    contributorCredential: "",
    sourceUrl: "",
  });

  React.useEffect(() => {
    if (!specialties.length) return;

    if (!activeSpecialtySlug || !specialties.some(item => item.slug === activeSpecialtySlug)) {
      const firstSpecialty = specialties[0];
      setActiveSpecialtySlug(firstSpecialty.slug);
      setFormState(current => ({
        ...current,
        folderLabel: current.folderLabel || firstSpecialty.shortLabel || firstSpecialty.name,
      }));
    }
  }, [activeSpecialtySlug, specialties]);

  const activeSpecialty = specialties.find(item => item.slug === activeSpecialtySlug) ?? specialties[0] ?? null;
  const featuredDocuments = snapshot?.featuredDocuments ?? [];
  const latestDocuments = snapshot?.latestDocuments ?? [];

  const handleRetry = () => {
    setUploadFeedback(null);
    void snapshotQuery.refetch();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setUploadFeedback(null);

    if (!nextFile) {
      setSelectedFile(null);
      return;
    }

    if (nextFile.size > 15 * 1024 * 1024) {
      setSelectedFile(null);
      setUploadFeedback("O arquivo excede o limite operacional de 15 MB para anexos educacionais.");
      event.target.value = "";
      return;
    }

    setSelectedFile(nextFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadFeedback(null);

    if (!activeSpecialty) {
      setUploadFeedback("Selecione uma especialidade antes de enviar o material educativo.");
      return;
    }

    const normalizedSourceUrl = formState.sourceUrl.trim();

    if (!selectedFile && !normalizedSourceUrl) {
      setUploadFeedback("Anexe um arquivo ou informe um link externo para publicar o material educativo.");
      return;
    }

    let fileBase64: string | null = null;

    if (selectedFile) {
      fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(new Error("Falha ao preparar o arquivo para envio."));
        reader.readAsDataURL(selectedFile);
      }).catch(error => {
        setUploadFeedback(error instanceof Error ? error.message : "Falha ao preparar o arquivo para envio.");
        return null;
      });

      if (!fileBase64) return;
    }

    await uploadMutation.mutateAsync({
      title: formState.title,
      description: formState.description || null,
      specialtyId: activeSpecialty.id,
      folderLabel: formState.folderLabel || activeSpecialty.shortLabel || activeSpecialty.name,
      documentType: formState.documentType as "protocol" | "guideline" | "manual" | "article" | "checklist" | "video" | "other",
      visibility: formState.visibility as "public" | "restricted" | "private",
      contributorName: formState.contributorName || null,
      contributorInstitution: formState.contributorInstitution || null,
      contributorCredential: formState.contributorCredential || null,
      contributorType: "external",
      fileName: selectedFile?.name ?? null,
      mimeType: selectedFile?.type || null,
      fileBase64,
      sourceUrl: normalizedSourceUrl || null,
    });
  };

  const formatBytes = (value?: number | null) => {
    if (!value) return "Arquivo sem tamanho informado";
    if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (value?: string | number | Date | null) => {
    if (!value) return "Sem data";
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Enciclopédia"
      title="A enciclopédia do SINACE agora funciona como um drive educativo por especialidade, com pasta de anexos, upload médico e download imediato dentro do aplicativo."
      description="Cada especialidade passa a ter sua própria aba de materiais, permitindo que médicos externos publiquem estudos, protocolos, artigos e documentos de apoio em um acervo navegável que amadurece como enciclopédia cirúrgica viva."
      icon={BookOpen}
      badge={loading ? "Sincronizando drive educativo" : `${metrics?.totalDocuments ?? 0} materiais prontos para consulta`}
      highlights={[
        {
          title: "Porta de entrada por especialidade",
          description: "O acervo deixa de ser genérico e passa a abrir diretamente na área cirúrgica de interesse do profissional.",
          metric: loading ? "…" : `${metrics?.totalSpecialties ?? specialties.length} especialidades`,
        },
        {
          title: "Drive com download imediato",
          description: "Cada material publicado entra em uma pasta temática e pode ser baixado dentro do próprio ambiente autenticado do aplicativo.",
          metric: loading ? "…" : `${metrics?.downloadsReady ?? 0} downloads`,
        },
        {
          title: "Contribuição externa estruturada",
          description: "Médicos externos podem anexar estudos e arquivos educativos com identificação da autoria e da instituição de origem.",
          metric: loading ? "…" : `${metrics?.externalContributors ?? 0} autores`,
        },
      ]}
      pillars={[
        {
          title: "Organização por pasta clínica",
          description: "A especialidade passa a conter subpastas lógicas, separando protocolos, artigos, manuais e acervos locais sem perder a visão geral do conhecimento disponível.",
          note: `Atualmente o drive consolida ${totalFolders} pastas temáticas distribuídas pelas especialidades sincronizadas.`,
        },
        {
          title: "Submissão com rastreabilidade",
          description: "Cada upload preserva nome do arquivo, tipo documental, autor, instituição e data de publicação para fortalecer governança do conhecimento.",
          note: "Isso permite crescer a enciclopédia sem transformar o repositório em um diretório opaco.",
        },
        {
          title: "Base pronta para enciclopédia viva",
          description: "Os anexos publicados já podem ser a matéria-prima de verbetes, recomendações, curadoria editorial e jornadas de estudo futuras.",
          note: "A experiência educativa começa como drive e evolui naturalmente para uma enciclopédia conectada ao restante do ecossistema SINACE.",
        },
      ]}
      nextSteps={[
        "Adicionar curadoria editorial com revisão e destaque institucional por documento.",
        "Criar filtros por tipo de material, palavra-chave e autor clínico.",
        "Relacionar cada anexo a trilhas e verbetes da área correspondente.",
        "Permitir moderação administrativa e histórico de versões dos arquivos enviados.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Drive por especialidade
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Pastas educativas e anexos disponíveis para consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando drive educativo...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível carregar a enciclopédia agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : specialties.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não existem especialidades publicadas"
                description="Publique o catálogo de especialidades para abrir as primeiras abas da enciclopédia cirúrgica e receber anexos de estudo."
              />
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {specialties.map(item => {
                    const isActive = item.slug === activeSpecialty?.slug;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveSpecialtySlug(item.slug);
                          setFormState(current => ({
                            ...current,
                            folderLabel: current.folderLabel || item.shortLabel || item.name,
                          }));
                        }}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                            : "border-border/70 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {item.shortLabel ?? item.name}
                      </button>
                    );
                  })}
                </div>

                {activeSpecialty ? (
                  <div className="rounded-[1.5rem] border border-border/70 bg-slate-50/90 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{activeSpecialty.name}</h3>
                          <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                            {activeSpecialty.documentsCount} anexos
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {activeSpecialty.description || "Especialidade pronta para centralizar estudos, protocolos, manuais e arquivos enviados pela rede médica externa."}
                        </p>
                      </div>
                      <div className="grid min-w-[220px] gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Pastas</p>
                          <p className="mt-2 text-base font-semibold text-slate-950">{activeSpecialty.folders.length}</p>
                        </div>
                        <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Última atualização</p>
                          <p className="mt-2 text-base font-semibold text-slate-950">{formatDate(activeSpecialty.lastPublishedAt)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      {activeSpecialty.folders.length === 0 ? (
                        <div className="lg:col-span-2">
                          <ModuleStateNotice
                            title="Esta especialidade ainda não recebeu anexos"
                            description="Use o painel de envio ao lado para publicar o primeiro estudo, artigo ou protocolo desta pasta educativa."
                          />
                        </div>
                      ) : (
                        activeSpecialty.folders.map(folder => (
                          <div key={`${activeSpecialty.slug}-${folder.folderLabel}`} className="rounded-[1.2rem] border border-border/70 bg-white p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/75">Pasta educativa</p>
                                <h4 className="mt-2 text-base font-semibold tracking-[-0.02em] text-slate-950">{folder.folderLabel}</h4>
                              </div>
                              <Badge className="rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-50">
                                {folder.totalDocuments} itens
                              </Badge>
                            </div>
                            <div className="mt-4 space-y-3">
                              {folder.documents.map(document => (
                                <div key={document.id} className="rounded-[1rem] border border-border/70 bg-slate-50/90 p-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-950">{document.title}</p>
                                    <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                                      {documentTypeLabel[document.documentType] ?? document.documentType}
                                    </Badge>
                                  </div>
                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {document.description || "Material sem resumo expandido, disponível para consulta e download na biblioteca da especialidade."}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                                    <span>{document.fileName || "Arquivo anexado"}</span>
                                    <span>{formatBytes(document.fileSizeBytes)}</span>
                                    <span>{formatDate(document.publishedAt || document.createdAt)}</span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                    <div className="space-y-1 text-xs text-slate-500">
                                      <div>
                                        {document.contributorName ? `Enviado por ${document.contributorName}` : "Envio institucional SINACE"}
                                        {document.contributorInstitution ? ` • ${document.contributorInstitution}` : ""}
                                      </div>
                                      {!document.fileUrl && !document.sourceUrl ? (
                                        <div className="font-medium text-amber-700">Este registro ainda não possui anexo ou link liberado para download.</div>
                                      ) : null}
                                    </div>
                                    {document.fileUrl || document.sourceUrl ? (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="border-border/70 bg-white text-slate-700 hover:bg-slate-100"
                                        onClick={() => window.open(document.fileUrl ?? document.sourceUrl ?? undefined, "_blank", "noopener,noreferrer")}
                                      >
                                        {document.fileUrl ? "Baixar arquivo" : document.documentType === "video" ? "Abrir vídeo" : "Abrir material"}
                                      </Button>
                                    ) : (
                                      <Button type="button" variant="outline" disabled className="border-border/70 bg-slate-100 text-slate-400">
                                        Anexo indisponível
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
                Envio por médico externo
              </CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-white">
                Publicar novo estudo ou arquivo educativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div>
                    <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Especialidade</label>
                    <select
                      value={activeSpecialty?.slug ?? ""}
                      onChange={event => {
                        const nextSpecialty = specialties.find(item => item.slug === event.target.value);
                        setActiveSpecialtySlug(event.target.value);
                        if (nextSpecialty) {
                          setFormState(current => ({
                            ...current,
                            folderLabel: current.folderLabel || nextSpecialty.shortLabel || nextSpecialty.name,
                          }));
                        }
                      }}
                      className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                    >
                      {specialties.map(item => (
                        <option key={item.id} value={item.slug} className="text-slate-900">
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Título do material</label>
                    <input
                      value={formState.title}
                      onChange={event => setFormState(current => ({ ...current, title: event.target.value }))}
                      className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                      placeholder="Ex.: Protocolo de preparo pré-operatório"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Pasta / aba</label>
                      <input
                        value={formState.folderLabel}
                        onChange={event => setFormState(current => ({ ...current, folderLabel: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                        placeholder="Ex.: Estudos clínicos"
                      />
                    </div>
                    <div>
                      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Tipo de material</label>
                      <select
                        value={formState.documentType}
                        onChange={event => setFormState(current => ({ ...current, documentType: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                      >
                        {Object.entries(documentTypeLabel).map(([value, label]) => (
                          <option key={value} value={value} className="text-slate-900">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Autor médico</label>
                      <input
                        value={formState.contributorName}
                        onChange={event => setFormState(current => ({ ...current, contributorName: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                        placeholder="Nome do médico responsável"
                      />
                    </div>
                    <div>
                      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Instituição</label>
                      <input
                        value={formState.contributorInstitution}
                        onChange={event => setFormState(current => ({ ...current, contributorInstitution: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                        placeholder="Hospital, clínica ou universidade"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Registro / credencial</label>
                      <input
                        value={formState.contributorCredential}
                        onChange={event => setFormState(current => ({ ...current, contributorCredential: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                        placeholder="CRM, RQE ou identificação institucional"
                      />
                    </div>
                    <div>
                      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Visibilidade</label>
                      <select
                        value={formState.visibility}
                        onChange={event => setFormState(current => ({ ...current, visibility: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                      >
                        {Object.entries(visibilityLabel).map(([value, label]) => (
                          <option key={value} value={value} className="text-slate-900">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Resumo do material</label>
                    <textarea
                      value={formState.description}
                      onChange={event => setFormState(current => ({ ...current, description: event.target.value }))}
                      className="mt-2 min-h-[132px] w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                      placeholder="Descreva o conteúdo do arquivo, a finalidade clínica e o contexto de uso educacional."
                    />
                  </div>

                  <div className="rounded-[1rem] border border-dashed border-white/15 bg-white/6 p-4">
                    <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Arquivo para anexar</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md,.zip,video/*"
                      onChange={handleFileChange}
                      className="mt-3 block w-full text-sm text-slate-100 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-200"
                    />
                    <p className="mt-3 text-xs leading-6 text-slate-200/80">
                      Você pode anexar documentos, apresentações, planilhas, estudos de caso compactados e vídeos leves de até 15 MB por envio.
                    </p>
                    {selectedFile ? (
                      <div className="mt-3 rounded-[0.9rem] border border-white/12 bg-white/8 px-3 py-2 text-sm text-slate-100">
                        Arquivo selecionado: {selectedFile.name} • {formatBytes(selectedFile.size)}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Link externo do material</label>
                    <input
                      value={formState.sourceUrl}
                      onChange={event => setFormState(current => ({ ...current, sourceUrl: event.target.value }))}
                      className="mt-2 w-full rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-300/60 focus:border-cyan-300"
                      placeholder="Ex.: https://... (use para vídeos ou estudos hospedados fora do app)"
                    />
                    <p className="mt-3 text-xs leading-6 text-slate-200/80">
                      Se o material estiver hospedado externamente, informe o link. O envio pode ser feito com arquivo, com link, ou com os dois.
                    </p>
                  </div>
                </div>

                {uploadFeedback ? (
                  <div className="rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-100">{uploadFeedback}</div>
                ) : null}

                <Button type="submit" className="w-full rounded-full bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={uploadMutation.isPending || loading || !specialties.length}>
                  {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Enviar para o drive da especialidade
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
                Últimos materiais e destaques
              </CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
                Downloads mais recentes da enciclopédia cirúrgica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestDocuments.length === 0 ? (
                <ModuleStateNotice
                  title="Ainda não existem materiais publicados"
                  description="Assim que os primeiros estudos forem anexados, esta coluna destacará os uploads mais recentes do drive educativo."
                />
              ) : (
                latestDocuments.slice(0, 5).map(document => (
                  <div key={`latest-${document.id}`} className="rounded-[1rem] border border-border/70 bg-slate-50/90 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-950">{document.title}</p>
                      <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                        {document.specialtyName ?? "Especialidade"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{document.description || "Material adicionado à enciclopédia cirúrgica com download pronto para a equipe médica."}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>{documentTypeLabel[document.documentType] ?? document.documentType}</span>
                      <span>{formatDate(document.publishedAt || document.createdAt)}</span>
                      <span>{formatBytes(document.fileSizeBytes)}</span>
                    </div>
                    {document.fileUrl || document.sourceUrl ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 border-border/70 bg-white text-slate-700 hover:bg-slate-100"
                        onClick={() => window.open(document.fileUrl ?? document.sourceUrl ?? undefined, "_blank", "noopener,noreferrer")}
                      >
                        {document.fileUrl ? "Baixar material" : document.documentType === "video" ? "Abrir vídeo" : "Abrir material"}
                      </Button>
                    ) : (
                      <div className="mt-3 text-xs font-medium text-amber-700">Material cadastrado sem anexo liberado.</div>
                    )}
                  </div>
                ))
              )}

              {featuredDocuments.length ? (
                <div className="rounded-[1.1rem] border border-border/70 bg-white p-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/75">Curadoria em destaque</p>
                  <div className="mt-3 space-y-3">
                    {featuredDocuments.slice(0, 3).map(document => (
                      <div key={`featured-${document.id}`} className="rounded-[0.95rem] border border-border/70 bg-slate-50/90 p-3">
                        <p className="text-sm font-semibold text-slate-950">{document.title}</p>
                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {document.specialtyName ?? "Especialidade"} • {document.contributorName || "Autor institucional"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppPartners() {
  const partnersQuery = trpc.sinace.partners.list.useQuery();
  const institutionsQuery = trpc.sinace.institutions.list.useQuery();
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();

  const partners = partnersQuery.data ?? [];
  const institutions = institutionsQuery.data ?? [];
  const specialties = specialtiesQuery.data ?? [];
  const loading = partnersQuery.isLoading || institutionsQuery.isLoading || specialtiesQuery.isLoading;
  const retrying = partnersQuery.isRefetching || institutionsQuery.isRefetching || specialtiesQuery.isRefetching;
  const moduleError = resolveModuleError([partnersQuery.error, institutionsQuery.error, specialtiesQuery.error]);
  const activePartners = partners.filter(item => item.status === "active").length;
  const handleRetry = () => {
    void refetchModuleQueries(partnersQuery, institutionsQuery, specialtiesQuery);
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Parceiros"
      title="A rede de parceiros agora já reflete relacionamentos persistidos com instituições, contratos e frentes de expansão do SINACE."
      description="Este módulo deixa de depender de narrativas genéricas e passa a mostrar atores institucionais reais do banco, com tipologia, status, instituições associadas e coerência com a malha operacional publicada no restante do workspace."
      icon={Network}
      badge={loading ? "Sincronizando rede" : `${partners.length} parceiros persistidos`}
      highlights={[
        {
          title: "Ecossistema mapeado no banco",
          description: "Governos, OSS, redes hospitalares e frentes acadêmicas passam a existir como entidades próprias dentro da mesma espinha dorsal do produto.",
          metric: loading ? "…" : `${activePartners} ativos`,
        },
        {
          title: "Ligação com instituições reais",
          description: "Cada parceiro pode ser lido a partir das instituições vinculadas, dando lastro operacional à narrativa de rede nacional.",
          metric: loading ? "…" : `${institutions.length} instituições`,
        },
        {
          title: "Expansão orientada por cobertura",
          description: "A própria taxonomia de especialidades pode ser cruzada com parceiros e instituições para guiar crescimento por território e frente assistencial.",
          metric: loading ? "…" : `${specialties.length} especialidades`,
        },
      ]}
      pillars={[
        {
          title: "Parceiro como entidade operacional",
          description: "A base já distingue tipo, localização, website e status, evitando uma camada institucional meramente ilustrativa no frontend.",
          note: "Isso fortalece a leitura comercial e contratual da plataforma para fases futuras.",
        },
        {
          title: "Vínculo com a malha assistencial",
          description: "As instituições vinculadas dão concretude à expansão regional e à cobertura da rede apresentada publicamente pela SINACE.",
          note: "A narrativa institucional passa a ser sustentada por registros persistidos, não por cards estáticos.",
        },
        {
          title: "Consistência entre rede e taxonomia",
          description: "A base permite cruzar parceiros com especialidades e frentes assistenciais usando o mesmo vocabulário central do produto.",
          note: "Isso elimina hardcodes e prepara indicadores territoriais mais maduros.",
        },
      ]}
      nextSteps={[
        "Adicionar visão de contratos e pipeline institucional por parceiro.",
        "Habilitar filtros por tipo, estado e estágio de relacionamento.",
        "Cruzar parceiros com especialidades prioritárias e cobertura regional.",
        "Evoluir para governança comercial e institucional mais detalhada.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Parceiros persistidos
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Relações institucionais já estruturadas no workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando rede institucional...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar a rede institucional agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : partners.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há parceiros persistidos nesta rede"
                description="Cadastre parceiros institucionais para que esta superfície passe a refletir a malha relacional do SINACE com dados reais."
              />
            ) : (
              partners.slice(0, 4).map(partner => (
                <div key={partner.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{partner.name}</h3>
                    <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                      {partnerTypeLabel[partner.partnerType] ?? partner.partnerType}
                    </Badge>
                    <Badge className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-white">
                      {partnerStatusLabel[partner.status] ?? partner.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{partner.description ?? "Parceiro institucional sem descrição expandida."}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Instituições</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{partner.institutionsCount}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Contratos</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{partner.contractsCount}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Base</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{partner.city && partner.state ? `${partner.city}/${partner.state}` : "Em consolidação"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Malha assistencial vinculada
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              Instituições já associadas à rede de relacionamento do SINACE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cruzando parceiros com instituições...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="A malha assistencial vinculada não pôde ser consolidada agora"
                description={moduleError.message}
                inverse
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : institutions.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há instituições associadas à rede de parceiros"
                description="Assim que a base institucional for preenchida, esta coluna poderá mostrar os vínculos operacionais já conectados aos parceiros persistidos."
                inverse
              />
            ) : (
              institutions.slice(0, 4).map(item => (
                <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.name}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100/88">{item.partnerName ? `Parceiro: ${item.partnerName}. ` : "Relação direta com a SINACE. "}{item.capacityProfile ?? "Capacidade assistencial em detalhamento."}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppInstitutions() {
  const institutionsQuery = trpc.sinace.institutions.list.useQuery();
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();

  const institutions = institutionsQuery.data ?? [];
  const specialties = specialtiesQuery.data ?? [];
  const loading = institutionsQuery.isLoading || specialtiesQuery.isLoading;
  const retrying = institutionsQuery.isRefetching || specialtiesQuery.isRefetching;
  const moduleError = resolveModuleError([institutionsQuery.error, specialtiesQuery.error]);
  const activeInstitutions = institutions.filter(item => item.status === "active").length;
  const handleRetry = () => {
    void refetchModuleQueries(institutionsQuery, specialtiesQuery);
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Instituições"
      title="A rede assistencial agora já consome instituições persistidas com perfil, localização, cobertura e vínculo por especialidade."
      description="Esta superfície passa a representar unidades reais da malha operacional da SINACE, deixando de lado descrições genéricas e aproveitando diretamente a base que também alimenta dashboard, parceiros e governança."
      icon={Building2}
      badge={loading ? "Sincronizando capacidade" : `${institutions.length} instituições persistidas`}
      highlights={[
        {
          title: "Rede institucional concreta",
          description: "Hospitais, Santas Casas, centros cirúrgicos e unidades de ensino já existem como entidades próprias dentro do banco do produto.",
          metric: loading ? "…" : `${activeInstitutions} ativas`,
        },
        {
          title: "Capacidade ligada a especialidades",
          description: "Cada instituição pode ser lida por perfil assistencial, equipes e linhas cirúrgicas efetivamente vinculadas à sua operação.",
          metric: loading ? "…" : `${specialties.length} áreas`,
        },
        {
          title: "Leitura territorial consistente",
          description: "Cidade, estado, parceiro e status operacional já sustentam uma visão regional menos abstrata e mais governável.",
          metric: loading ? "…" : `${institutions.length} polos`,
        },
      ]}
      pillars={[
        {
          title: "Instituição como nó operacional",
          description: "A superfície já trabalha sobre registros persistentes com tipologia, localização, status e capacidade, em vez de cards ilustrativos sem lastro de dados.",
          note: "Isso fortalece a credibilidade do workspace na entrega para publicação.",
        },
        {
          title: "Especialidades conectadas",
          description: "A cobertura por linha cirúrgica pode ser cruzada diretamente com o catálogo oficial do SINACE, preservando coerência com o restante do produto.",
          note: "Assim, a expansão da rede não precisa reinventar taxonomia em cada módulo.",
        },
        {
          title: "Governança regional preparada",
          description: "O modelo atual já permite evoluir para leitura por polos, estado, parceiro e densidade operacional mantendo a mesma estrutura central.",
          note: "Essa fundação é suficiente para publicação do site com roadmap claro e base consistente.",
        },
      ]}
      nextSteps={[
        "Adicionar filtros por estado, tipo institucional e parceiro.",
        "Exibir contratos, equipes e especialidades em páginas detalhadas por instituição.",
        "Criar indicadores agregados por território e frente assistencial.",
        "Evoluir para mapas e painéis operacionais mais específicos.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Rede persistida
            </CardDescription>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Instituições já prontas para leitura operacional
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando instituições...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar a rede institucional agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : institutions.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há instituições persistidas"
                description="Cadastre unidades assistenciais para que esta área passe a refletir a rede operacional real do SINACE."
              />
            ) : (
              institutions.slice(0, 4).map(institution => (
                <div key={institution.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{institution.name}</h3>
                    <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                      {institutionTypeLabel[institution.institutionType] ?? institution.institutionType}
                    </Badge>
                    <Badge className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-white">
                      {institutionStatusLabel[institution.status] ?? institution.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{institution.description ?? institution.capacityProfile ?? "Instituição sem descrição expandida."}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Cidade</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{institution.city ?? "—"}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Estado</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{institution.state ?? "—"}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Especialidades</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{institution.specialtiesCount}</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Equipes</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{institution.teamsCount}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Cobertura cirúrgica
            </CardDescription>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
              Leitura temática derivada da taxonomia oficial do SINACE
            </h2>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consolidando especialidades por instituição...
              </div>
            ) : moduleError ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="A leitura temática das instituições falhou nesta consulta"
                  description={moduleError.message}
                  inverse
                  onRetry={handleRetry}
                  retrying={retrying}
                />
              </div>
            ) : institutions.length === 0 ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="Ainda não há instituições para projetar cobertura cirúrgica"
                  description="Assim que a rede institucional estiver preenchida, esta coluna poderá resumir as especialidades vinculadas a cada unidade persistida."
                  inverse
                />
              </div>
            ) : (
              institutions.slice(0, 4).map(item => (
                <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.name}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100/88">
                    {(item.specialties ?? []).slice(0, 3).map(specialty => specialty.name).join(" • ") || "Especialidades em detalhamento operacional."}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppFaculty() {
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();
  const tracksQuery = trpc.sinace.tracks.list.useQuery();
  const institutionsQuery = trpc.sinace.institutions.list.useQuery();

  const specialties = specialtiesQuery.data ?? [];
  const tracks = tracksQuery.data ?? [];
  const institutions = institutionsQuery.data ?? [];
  const loading = specialtiesQuery.isLoading || tracksQuery.isLoading || institutionsQuery.isLoading;
  const retrying = specialtiesQuery.isRefetching || tracksQuery.isRefetching || institutionsQuery.isRefetching;
  const moduleError = resolveModuleError([specialtiesQuery.error, tracksQuery.error, institutionsQuery.error]);
  const facultyContexts = institutions.filter(item => item.teachingProfile && item.teachingProfile.trim().length > 0);
  const teachingInstitutions = facultyContexts.length;
  const handleRetry = () => {
    void refetchModuleQueries(specialtiesQuery, tracksQuery, institutionsQuery);
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Professores"
      title="O módulo docente passa a se apoiar na taxonomia persistente, nas trilhas já publicadas e nas instituições com perfil de ensino do SINACE."
      description="Mesmo antes da criação do cadastro individual de professores, esta superfície deixa de ser genérica ao mostrar a base científica já disponível para sustentar autoria, revisão e coordenação acadêmica por especialidade."
      icon={Microscope}
      badge={loading ? "Sincronizando governança científica" : `${teachingInstitutions} instituições com perfil de ensino`}
      highlights={[
        {
          title: "Especialidades prontas para coordenação científica",
          description: "Cada área do catálogo oficial já pode servir como eixo de curadoria e distribuição futura do corpo docente.",
          metric: loading ? "…" : `${specialties.length} áreas`,
        },
        {
          title: "Trilhas como superfície de autoria",
          description: "Os percursos formativos persistidos oferecem a camada inicial para vincular coordenação, revisão e responsabilidade pedagógica.",
          metric: loading ? "…" : `${tracks.length} trilhas`,
        },
        {
          title: "Rede com vocação formativa",
          description: "As instituições com perfil de ensino já fornecem contexto real para expansão do corpo docente dentro da plataforma.",
          metric: loading ? "…" : `${teachingInstitutions} instituições`,
        },
      ]}
      pillars={[
        {
          title: "Docência ancorada em especialidades",
          description: "A gestão futura de professores poderá partir do mesmo catálogo persistente que organiza conteúdo, operação e navegação do produto.",
          note: "Isso evita cadastros isolados e preserva coerência de domínio.",
        },
        {
          title: "Base formativa já estruturada",
          description: "As trilhas existentes criam o primeiro terreno para responsabilidade editorial, mentoria e supervisão científica associadas a temas reais.",
          note: "A fundação já existe mesmo antes do cadastro individual de docentes.",
        },
        {
          title: "Vínculo institucional verificável",
          description: "Perfis de ensino em instituições persistidas ajudam a conectar futura autoria acadêmica a contextos concretos de atuação.",
          note: "Essa leitura melhora a maturidade do módulo para publicação atual e evolução futura.",
        },
      ]}
      nextSteps={[
        "Criar cadastro individual de professores com currículo, áreas e vínculos.",
        "Associar docentes a trilhas, biblioteca, enciclopédia e casos clínicos.",
        "Permitir revisão, autoria e aprovação por especialidade.",
        "Exibir cobertura docente por instituição e frente científica.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Frente científica
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Especialidades e trilhas que já podem receber coordenação docente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando base científica...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar a base científica agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : specialties.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há especialidades disponíveis para coordenação docente"
                description="Ative o catálogo persistente para que esta área mostre as frentes científicas prontas para receber coordenação acadêmica."
              />
            ) : (
              specialties.slice(0, 4).map(item => {
                const relatedTracks = tracks.filter(track => track.specialtyName === item.name).length;
                return (
                  <div key={item.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.coordinationModel ?? item.educationalFocus ?? item.description ?? "Especialidade pronta para receber coordenação científica."}</p>
                    <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">
                      {relatedTracks} trilhas relacionadas
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Contexto institucional
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              Instituições com base para autoria e supervisão acadêmica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando contexto docente...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="O contexto institucional docente não pôde ser consolidado agora"
                description={moduleError.message}
                inverse
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : facultyContexts.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há instituições com perfil de ensino vinculado"
                description="Preencha o perfil de ensino das instituições persistidas para evidenciar a base de autoria e supervisão acadêmica do SINACE."
                inverse
              />
            ) : (
              facultyContexts
                .slice(0, 4)
                .map(item => (
                  <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.name}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-100/88">{item.teachingProfile}</p>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppStudents() {
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();
  const tracksQuery = trpc.sinace.tracks.list.useQuery();
  const documentsQuery = trpc.sinace.documents.list.useQuery();
  const institutionsQuery = trpc.sinace.institutions.list.useQuery();

  const specialties = specialtiesQuery.data ?? [];
  const tracks = tracksQuery.data ?? [];
  const documents = documentsQuery.data ?? [];
  const institutions = institutionsQuery.data ?? [];
  const loading =
    specialtiesQuery.isLoading || tracksQuery.isLoading || documentsQuery.isLoading || institutionsQuery.isLoading;
  const retrying =
    specialtiesQuery.isRefetching || tracksQuery.isRefetching || documentsQuery.isRefetching || institutionsQuery.isRefetching;
  const moduleError = resolveModuleError([
    specialtiesQuery.error,
    tracksQuery.error,
    documentsQuery.error,
    institutionsQuery.error,
  ]);

  const learningContexts = institutions.filter(item => item.teachingProfile && item.teachingProfile.trim().length > 0);
  const learningInstitutions = learningContexts.length;
  const handleRetry = () => {
    void refetchModuleQueries(specialtiesQuery, tracksQuery, documentsQuery, institutionsQuery);
  };

  return (
    <SinaceModulePlaceholder
      eyebrow="Alunos"
      title="O módulo de alunos passa a refletir a malha real de trilhas, documentos, instituições e especialidades já persistidas no SINACE."
      description="Mesmo antes do cadastro individual de matrículas e progresso, esta superfície deixa de depender de hardcodes ao se apoiar na base educacional já estruturada, oferecendo uma visão concreta da jornada formativa que o produto pode sustentar."
      icon={Users}
      badge={loading ? "Sincronizando jornadas" : `${tracks.length} trilhas e ${documents.length} materiais`}
      highlights={[
        {
          title: "Jornadas apoiadas por conteúdo real",
          description: "Os percursos de aprendizagem já se apoiam em trilhas persistidas e em um acervo documental ligado à taxonomia cirúrgica oficial.",
          metric: loading ? "…" : `${tracks.length} trilhas`,
        },
        {
          title: "Base multi-institucional",
          description: "Instituições com vocação assistencial e de ensino já criam contexto para distribuição futura de alunos e programas formativos.",
          metric: loading ? "…" : `${learningInstitutions} instituições`,
        },
        {
          title: "Especialidades como eixo de personalização",
          description: "O catálogo persistente permite orientar recomendações, progressão e descoberta por interesse clínico sem duplicar taxonomia no frontend.",
          metric: loading ? "…" : `${specialties.length} áreas`,
        },
      ]}
      pillars={[
        {
          title: "Aprendizagem baseada em catálogo único",
          description: "A experiência futura do aluno já pode ser organizada a partir da mesma taxonomia usada na operação, na biblioteca e na administração.",
          note: "Isso prepara personalização sem sacrificar consistência de domínio.",
        },
        {
          title: "Oferta formativa persistida",
          description: "Trilhas e documentos existentes fornecem uma base concreta para onboarding, estudo contínuo e expansão da comunidade acadêmica.",
          note: "A entrega para publicação ganha densidade porque o módulo deixa de ser apenas promessa conceitual.",
        },
        {
          title: "Contexto institucional disponível",
          description: "A rede já inclui instituições com perfil de ensino, criando caminho plausível para coortes, matrículas e recortes de progresso.",
          note: "Essa fundação reduz o salto entre o estado atual do produto e as próximas fases de evolução.",
        },
      ]}
      nextSteps={[
        "Criar matrícula, progresso e recomendações por usuário.",
        "Associar alunos a instituições, trilhas e especialidades prioritárias.",
        "Exibir indicadores de conclusão, engajamento e risco de evasão.",
        "Permitir jornadas personalizadas e alertas automatizados.",
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Oferta formativa
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Base já disponível para futuras jornadas do aluno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando jornada acadêmica...
              </div>
            ) : moduleError ? (
              <ModuleStateNotice
                title="Não foi possível consultar a oferta formativa agora"
                description={moduleError.message}
                onRetry={handleRetry}
                retrying={retrying}
              />
            ) : tracks.length === 0 ? (
              <ModuleStateNotice
                title="Ainda não há trilhas persistidas para sustentar jornadas discente"
                description="Publique trilhas formativas para que esta área comece a refletir a base real das jornadas de aprendizagem do SINACE."
              />
            ) : (
              tracks.slice(0, 4).map(track => (
                <div key={track.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{track.title}</h3>
                    <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                      {track.specialtyName ?? "Transversal"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{track.summary ?? "Trilha pronta para sustentar onboarding e progressão individual."}</p>
                  <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">{track.estimatedHours} horas estimadas</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Contexto de aprendizagem
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              Especialidades e instituições que já dão forma à comunidade acadêmica
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consolidando contexto discente...
              </div>
            ) : moduleError ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="O contexto de aprendizagem não pôde ser consolidado agora"
                  description={moduleError.message}
                  inverse
                  onRetry={handleRetry}
                  retrying={retrying}
                />
              </div>
            ) : specialties.length === 0 && learningContexts.length === 0 ? (
              <div className="col-span-full">
                <ModuleStateNotice
                  title="Ainda não há contexto acadêmico suficiente para esta coluna"
                  description="Ative especialidades e perfis institucionais de ensino para que esta área descreva a comunidade acadêmica real do SINACE."
                  inverse
                />
              </div>
            ) : (
              specialties.slice(0, 2).map(item => (
                <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.name}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100/88">{documents.filter(document => document.specialtyName === item.name).length} materiais vinculados e base pronta para recomendação formativa.</p>
                </div>
              ))
            )}
            {!loading && !moduleError &&
              learningContexts
                .slice(0, 2)
                .map(item => (
                  <div key={item.id} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{item.name}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-100/88">{item.teachingProfile}</p>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </SinaceModulePlaceholder>
  );
}

export function AppAdmin() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState<SpecialtyFormState>(defaultSpecialtyFormState);

  const isAdmin = user?.role === "admin";

  const {
    data: specialties,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = trpc.sinace.specialties.adminList.useQuery(undefined, {
    enabled: isAdmin,
  });

  const createMutation = trpc.sinace.specialties.create.useMutation({
    onSuccess: async () => {
      setFormState(defaultSpecialtyFormState);
      await Promise.all([
        utils.sinace.specialties.adminList.invalidate(),
        utils.sinace.specialties.list.invalidate(),
        utils.sinace.dashboard.invalidate(),
      ]);
    },
  });

  const updateMutation = trpc.sinace.specialties.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.sinace.specialties.adminList.invalidate(),
        utils.sinace.specialties.list.invalidate(),
        utils.sinace.dashboard.invalidate(),
      ]);
    },
  });

  const reorderMutation = trpc.sinace.specialties.reorder.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.sinace.specialties.adminList.invalidate(),
        utils.sinace.specialties.list.invalidate(),
        utils.sinace.dashboard.invalidate(),
      ]);
    },
  });

  const specialtyRows = useMemo(() => {
    return [...(specialties ?? [])].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }

      return a.name.localeCompare(b.name, "pt-BR");
    });
  }, [specialties]);

  const specialtyMetrics = useMemo(() => {
    return {
      total: specialtyRows.length,
      active: specialtyRows.filter(item => item.status === "active").length,
      draft: specialtyRows.filter(item => item.status === "draft").length,
      archived: specialtyRows.filter(item => item.status === "archived").length,
      withOperationalCoverage: specialtyRows.filter(
        item => item.queueCount > 0 || item.institutionsCount > 0 || item.contractsCount > 0
      ).length,
    };
  }, [specialtyRows]);

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || reorderMutation.isPending;

  const resetForm = () => {
    setEditingId(null);
    setFormState(defaultSpecialtyFormState);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: formState.name.trim(),
      shortLabel: formState.shortLabel.trim() || null,
      description: formState.description.trim() || null,
      category: formState.category,
      status: formState.status,
      displayOrder: normalizeDisplayOrder(formState.displayOrder),
      coordinationModel: formState.coordinationModel.trim() || null,
    };

    if (!payload.name) return;

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        ...payload,
      });
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  const beginEdit = (item: NonNullable<typeof specialties>[number]) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      shortLabel: item.shortLabel ?? "",
      description: item.description ?? "",
      category: item.category,
      status: item.status,
      displayOrder: String(item.displayOrder ?? ""),
      coordinationModel: item.coordinationModel ?? "",
    });
  };

  const moveSpecialty = async (id: number, direction: "up" | "down") => {
    const currentIndex = specialtyRows.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= specialtyRows.length) return;

    const reordered = [...specialtyRows];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    await reorderMutation.mutateAsync(
      reordered.map((item, index) => ({
        id: item.id,
        displayOrder: index,
      }))
    );
  };

  if (!isAdmin) {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Administração restrita
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Esta área controla a taxonomia persistente e exige papel administrativo.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <p>
              O backend já protege esta superfície com autorização específica para administradores. Quando o seu perfil for promovido,
              você poderá criar, editar, reordenar e publicar especialidades sem depender de mudanças manuais em código.
            </p>
            <p>
              Enquanto isso, o workspace continua disponível para consulta do catálogo persistente, do dashboard operacional e da rede
              institucional já conectados ao banco.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200/80 bg-amber-50/80 shadow-[0_18px_42px_rgba(147,83,14,0.10)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl tracking-[-0.03em] text-amber-950">
              Governança acessível apenas para perfis admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-amber-900/88">
            <p>Peça a promoção do seu usuário no banco para ativar o módulo administrativo completo.</p>
            <p className="rounded-[1.1rem] border border-amber-200 bg-white/70 px-4 py-3">
              Perfil atual: <strong>{user?.role ?? "não identificado"}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
                  Governança da taxonomia
                </CardDescription>
                <CardTitle className="mt-2 text-2xl tracking-[-0.03em] text-slate-950">
                  Administração real das especialidades persistentes do SINACE
                </CardTitle>
              </div>
              <Badge className="rounded-full border border-cyan-200/80 bg-cyan-50 px-3 py-1 text-cyan-900 hover:bg-cyan-50">
                {isLoading ? "Carregando catálogo" : `${specialtyMetrics.total} especialidades controladas`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Ativas",
                value: specialtyMetrics.active,
                tone: "bg-emerald-500/10 text-emerald-700",
              },
              {
                label: "Rascunhos",
                value: specialtyMetrics.draft,
                tone: "bg-amber-500/10 text-amber-700",
              },
              {
                label: "Arquivadas",
                value: specialtyMetrics.archived,
                tone: "bg-slate-200 text-slate-700",
              },
              {
                label: "Com cobertura operacional",
                value: specialtyMetrics.withOperationalCoverage,
                tone: "bg-cyan-500/10 text-cyan-700",
              },
            ].map(metric => (
              <div key={metric.label} className="rounded-[1.3rem] border border-border/70 bg-slate-50/90 p-4">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${metric.tone}`}>
                  {metric.label}
                </span>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{isLoading ? "…" : metric.value}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Indicador derivado da taxonomia persistente administrável pelo backend protegido.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Operação administrativa
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              O catálogo agora pode evoluir sem editar código-fonte a cada mudança de taxonomia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Criar novas especialidades com ordem, status e modelo de coordenação.",
              "Atualizar textos institucionais, rótulos curtos e estados de publicação da taxonomia.",
              "Reordenar a navegação operacional do catálogo persistente diretamente pela interface.",
              "Sincronizar dashboard e página de especialidades após cada mutação administrativa.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-cyan-100">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-100/86">{item}</p>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              className="w-full border-white/15 bg-white/8 text-white hover:bg-white/12 hover:text-white"
            >
              {isRefetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Reconsultar administração persistente
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Editor da taxonomia
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              {editingId ? "Editar especialidade" : "Cadastrar nova especialidade"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={event => void handleSubmit(event)}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nome oficial</label>
                <input
                  value={formState.name}
                  onChange={event => setFormState(current => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-primary"
                  placeholder="Ex.: Cirurgia geral"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Rótulo curto</label>
                  <input
                    value={formState.shortLabel}
                    onChange={event => setFormState(current => ({ ...current, shortLabel: event.target.value }))}
                    className="w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-primary"
                    placeholder="Nome resumido"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ordem</label>
                  <input
                    value={formState.displayOrder}
                    onChange={event => setFormState(current => ({ ...current, displayOrder: event.target.value }))}
                    className="w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-primary"
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Categoria</label>
                  <select
                    value={formState.category}
                    onChange={event =>
                      setFormState(current => ({
                        ...current,
                        category: event.target.value as SpecialtyFormState["category"],
                      }))
                    }
                    className="w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  >
                    {Object.entries(specialtyCategoryLabel).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</label>
                  <select
                    value={formState.status}
                    onChange={event =>
                      setFormState(current => ({
                        ...current,
                        status: event.target.value as SpecialtyFormState["status"],
                      }))
                    }
                    className="w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  >
                    {Object.entries(specialtyStatusLabel).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Modelo de coordenação</label>
                <input
                  value={formState.coordinationModel}
                  onChange={event => setFormState(current => ({ ...current, coordinationModel: event.target.value }))}
                  className="w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-primary"
                  placeholder="Coordenação nacional, linha regional, polo institucional..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Descrição institucional</label>
                <textarea
                  value={formState.description}
                  onChange={event => setFormState(current => ({ ...current, description: event.target.value }))}
                  className="min-h-[180px] w-full rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none ring-0 transition focus:border-primary"
                  placeholder="Descreva o papel assistencial, educacional e institucional da especialidade no ecossistema SINACE."
                />
              </div>

              {(createMutation.error || updateMutation.error) ? (
                <div className="rounded-[1rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
                  {createMutation.error?.message ?? updateMutation.error?.message}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting || !formState.name.trim()} className="rounded-full px-5">
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <Save className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {editingId ? "Salvar alterações" : "Criar especialidade"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-full px-5">
                  Limpar formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Catálogo administrável
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Especialidades com leitura operacional, educacional e ordenação configurável
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-[1.4rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando catálogo administrativo...
              </div>
            ) : error ? (
              <div className="rounded-[1.4rem] border border-destructive/20 bg-destructive/5 p-6 text-sm leading-7 text-destructive">
                {error.message}
              </div>
            ) : specialtyRows.length === 0 ? (
              <div className="rounded-[1.4rem] border border-dashed border-border/80 bg-slate-50/80 p-6 text-sm leading-7 text-slate-600">
                Nenhuma especialidade encontrada na base persistente.
              </div>
            ) : (
              specialtyRows.map((item, index) => (
                <div key={item.id} className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
                          Ordem {item.displayOrder}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${specialtyStatusClassName[item.status as SpecialtyFormState["status"]] ?? specialtyStatusClassName.active}`}
                        >
                          {specialtyStatusLabel[item.status as SpecialtyFormState["status"]] ?? item.status}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
                          {specialtyCategoryLabel[item.category as SpecialtyFormState["category"]] ?? item.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{item.name}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.description ?? "Sem descrição institucional registrada."}</p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-[1.1rem] border border-border/70 bg-white px-4 py-3">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/75">Coordenação</p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{item.coordinationModel ?? "A definir"}</p>
                        </div>
                        <div className="rounded-[1.1rem] border border-border/70 bg-white px-4 py-3">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/75">Foco educacional</p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{item.educationalFocus ?? "Sem foco educacional catalogado"}</p>
                        </div>
                      </div>

                      <div className="rounded-[1.1rem] border border-border/70 bg-white px-4 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/75">Foco operacional</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{item.operationalFocus ?? "Sem foco operacional catalogado"}</p>
                      </div>
                    </div>

                    <div className="w-full max-w-[360px] space-y-3 xl:w-[360px]">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "Instituições", value: item.institutionsCount },
                          { label: "Contratos", value: item.contractsCount },
                          { label: "Fila", value: item.queueCount },
                          { label: "Conteúdo", value: item.tracksCount + item.documentsCount },
                        ].map(metric => (
                          <div key={metric.label} className="rounded-[1.1rem] border border-border/70 bg-white px-4 py-3">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
                            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{metric.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" onClick={() => beginEdit(item)} className="rounded-full">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={index === 0 || reorderMutation.isPending}
                          onClick={() => void moveSpecialty(item.id, "up")}
                          className="rounded-full"
                        >
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Subir
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={index === specialtyRows.length - 1 || reorderMutation.isPending}
                          onClick={() => void moveSpecialty(item.id, "down")}
                          className="rounded-full"
                        >
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Descer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
