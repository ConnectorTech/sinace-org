import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  BriefcaseMedical,
  FolderKanban,
  Globe2,
  GraduationCap,
  KeyRound,
  Loader2,
  type LucideIcon,
  Network,
  Newspaper,
  Save,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";

type QueryLike = {
  isLoading: boolean;
  isRefetching: boolean;
  error: { message: string } | null;
  refetch: () => Promise<unknown>;
};

function resolveModuleError(errors: Array<{ message: string } | null | undefined>) {
  return errors.find((error): error is { message: string } => Boolean(error)) ?? null;
}

function ModuleShell({
  eyebrow,
  title,
  description,
  badge,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,rgba(8,25,53,0.98),rgba(18,61,108,0.95))] px-6 py-7 text-white shadow-[0_28px_80px_rgba(8,25,53,0.22)] md:px-8 md:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-100/88">
              <Icon className="h-4 w-4" />
              {eyebrow}
            </div>
            <h1 className="mt-5 max-w-4xl text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-100/82 md:text-lg">{description}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-100/88 backdrop-blur">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/90">Status operacional</p>
            <p className="mt-2 text-base font-medium text-white">{badge}</p>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}

function StateCard({
  title,
  description,
  onRetry,
  retrying,
  inverse = false,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
  retrying?: boolean;
  inverse?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.25rem] border p-5 ${
        inverse ? "border-white/12 bg-white/8 text-slate-100/86" : "border-border/70 bg-slate-50/85 text-slate-600"
      }`}
    >
      <p className={`text-sm font-semibold tracking-[-0.01em] ${inverse ? "text-white" : "text-slate-950"}`}>{title}</p>
      <p className={`mt-3 text-sm leading-7 ${inverse ? "text-slate-100/82" : "text-slate-600"}`}>{description}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} className={`mt-4 ${inverse ? "border-white/15 bg-white/8 text-white hover:bg-white/12 hover:text-white" : "bg-white"}`}>
          {retrying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

function LoadingCard({ label, inverse = false }: { label: string; inverse?: boolean }) {
  return (
    <div
      className={`flex min-h-[220px] items-center justify-center rounded-[1.25rem] border ${
        inverse ? "border-white/12 bg-white/8 text-slate-100/86" : "border-dashed border-border/80 bg-slate-50/85 text-slate-500"
      }`}
    >
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

function refetchAll(...queries: QueryLike[]) {
  return Promise.all(queries.map(query => query.refetch()));
}

function labelize(value: string | null | undefined) {
  if (!value) return "Não definido";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function getList<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function getUniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export function AppKnowledgeHub() {
  const snapshotQuery = trpc.sinace.knowledgeHub.snapshot.useQuery();
  const loading = snapshotQuery.isLoading;
  const retrying = snapshotQuery.isRefetching;
  const error = snapshotQuery.error;
  const snapshot = (snapshotQuery.data ?? null) as any;

  const assets = getList<any>(snapshot?.featuredAssets);
  const caseStudies = getList<any>(snapshot?.featuredCaseStudies);
  const flowcharts = getList<any>(snapshot?.featuredFlowcharts);
  const tracks = getList<any>(snapshot?.latestTracks);
  const documents = getList<any>(snapshot?.latestDocuments);
  const coverage = getUniqueStrings([
    ...assets.map(item => item?.specialtyName),
    ...caseStudies.map(item => item?.specialtyName),
    ...flowcharts.map(item => item?.specialtyName),
  ]);

  return (
    <ModuleShell
      eyebrow="Biblioteca cirúrgica ampliada"
      title="Um hub nacional para protocolos, casos, fluxogramas e formação contínua em todas as frentes cirúrgicas do SINACE."
      description="Esta área consolida o acervo clínico e editorial da plataforma para servir como drive de estudo, consulta rápida, trilhas de aprofundamento e base de decisão para expansão nacional e internacional."
      badge={loading ? "Consolidando acervo" : `${snapshot?.metrics?.libraryAssets ?? 0} ativos curatoriais mapeados`}
      icon={BookOpen}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Acervo central</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Biblioteca viva para estudo, governança e consulta por especialidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingCard label="Carregando o hub de conhecimento..." />
            ) : error ? (
              <StateCard
                title="Não foi possível carregar o hub de conhecimento agora"
                description={error.message}
                onRetry={() => void snapshotQuery.refetch()}
                retrying={retrying}
              />
            ) : !snapshot ? (
              <StateCard
                title="Ainda não há snapshot do acervo"
                description="Assim que a base editorial estiver ativa, esta área concentrará ativos de estudo, protocolos, casos e fluxogramas por frente cirúrgica."
              />
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Ativos</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{snapshot.metrics?.libraryAssets ?? 0}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Materiais entre biblioteca, suporte clínico e documentação complementar.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Casos</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{snapshot.metrics?.caseStudies ?? 0}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Casos estruturados para ensino, publicação e memória institucional.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Fluxogramas</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{snapshot.metrics?.flowcharts ?? 0}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Fluxos operacionais para fila zero cirúrgica e redes hospitalares.</p>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-border/70 bg-white p-5">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Especialidades em destaque</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {coverage.length > 0 ? (
                      coverage.slice(0, 10).map(name => (
                        <Badge key={name} className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                          {name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600">A cobertura por especialidade será exibida conforme o acervo editorial crescer.</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-border/70 bg-white p-5">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Trilhas recentes</p>
                    <div className="mt-4 space-y-3">
                      {tracks.length > 0 ? (
                        tracks.slice(0, 3).map(item => (
                          <div key={String(item?.id ?? item?.slug ?? item?.title)} className="rounded-[1rem] border border-border/60 bg-slate-50/85 p-4">
                            <p className="text-sm font-semibold text-slate-950">{item?.title ?? item?.name ?? "Trilha"}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{item?.summary ?? item?.description ?? "Estrutura de aprendizagem contínua por especialidade."}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">As trilhas de aprendizagem aparecerão aqui conforme forem expandidas.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-border/70 bg-white p-5">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Documentos recentes</p>
                    <div className="mt-4 space-y-3">
                      {documents.length > 0 ? (
                        documents.slice(0, 3).map(item => (
                          <div key={String(item?.id ?? item?.slug ?? item?.title)} className="rounded-[1rem] border border-border/60 bg-slate-50/85 p-4">
                            <p className="text-sm font-semibold text-slate-950">{item?.title ?? item?.name ?? "Documento"}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{item?.summary ?? item?.description ?? "Documento pronto para consulta, protocolo e governança clínica."}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">Os documentos clínicos aparecerão aqui conforme a base for enriquecida.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Arquitetura editorial</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">Como o app evolui de biblioteca para infraestrutura nacional de conhecimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <LoadingCard label="Mapeando a espinha editorial..." inverse />
            ) : error ? (
              <StateCard
                title="A arquitetura editorial não pôde ser carregada"
                description={error.message}
                onRetry={() => void snapshotQuery.refetch()}
                retrying={retrying}
                inverse
              />
            ) : (
              [
                "Drive de ativos por especialidade com protocolos, guias, vídeos e arquivos de suporte.",
                "Casos publicados ligados a curadoria científica e uso em formação médica continuada.",
                "Fluxogramas clínicos e operacionais para acelerar decisão assistencial e reduzir gargalos.",
                "Base preparada para anexos, indexação futura e expansão internacional de conteúdo.",
              ].map(item => (
                <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                  {item}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

export function AppPublications() {
  const publicationsQuery = trpc.sinace.publications.list.useQuery({ limit: 12 });
  const showcaseQuery = trpc.sinace.showcase.list.useQuery({ limit: 8 });
  const loading = publicationsQuery.isLoading || showcaseQuery.isLoading;
  const retrying = publicationsQuery.isRefetching || showcaseQuery.isRefetching;
  const error = resolveModuleError([publicationsQuery.error, showcaseQuery.error]);
  const publications = getList<any>(publicationsQuery.data);
  const showcase = getList<any>(showcaseQuery.data);

  return (
    <ModuleShell
      eyebrow="Publicações institucionais"
      title="A vitrine editorial do SINACE para relatórios do CEO, reduções de filas, resultados assistenciais e demonstração pública de autoridade institucional."
      description="Aqui o aplicativo passa a concentrar publicações institucionais, peças editoriais e ativos de mídia que sustentam comunicação com governos, parceiros, hospitais, médicos especialistas e ecossistema internacional."
      badge={loading ? "Consolidando publicações" : `${publications.length} publicações e ${showcase.length} mídias`}
      icon={Newspaper}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Publicações recentes</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Mensagens institucionais, provas sociais e narrativa de impacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingCard label="Carregando publicações institucionais..." />
            ) : error ? (
              <StateCard
                title="Não foi possível carregar as publicações agora"
                description={error.message}
                onRetry={() => void refetchAll(publicationsQuery, showcaseQuery)}
                retrying={retrying}
              />
            ) : publications.length === 0 ? (
              <StateCard
                title="Ainda não há publicações institucionais cadastradas"
                description="Esta área receberá comunicados do CEO, relatórios de avanço, provas de redução de fila, artigos institucionais e chamadas públicas do ecossistema SINACE."
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Destaques</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{publications.filter(item => item?.featured === "yes").length}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Peças que já podem funcionar como vitrine principal para governo, parceiros e imprensa.</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Clínico-editoriais</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{publications.filter(item => Boolean(item?.specialtyName)).length}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Conteúdos ancorados em especialidade para apoiar credibilidade técnica e repertório médico.</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Prova social</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{showcase.length}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Ativos visuais e multimídia disponíveis para reforçar alcance, narrativa e demonstração pública.</p>
                  </div>
                </div>
                {publications.slice(0, 4).map(item => (
                  <article key={String(item?.id ?? item?.slug ?? item?.title)} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-white">{labelize(item?.publicationType)}</Badge>
                      <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">{labelize(item?.visibility)}</Badge>
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{labelize(item?.status)}</Badge>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-950">{item?.title ?? "Publicação institucional"}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item?.excerpt ?? "Publicação institucional pronta para reforçar autoridade, governança e expansão da marca SINACE."}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.78rem] font-medium text-slate-500">
                      <span>{item?.authorName ?? "Editorial SINACE"}</span>
                      {item?.specialtyName ? (
                        <>
                          <span>•</span>
                          <span>{item.specialtyName}</span>
                        </>
                      ) : null}
                      <span>•</span>
                      <span>{item?.featured === "yes" ? "Destaque editorial" : "Catálogo editorial"}</span>
                    </div>
                  </article>
                ))}
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-border/70 bg-white p-4 text-sm leading-7 text-slate-600">
                    Relatórios do CEO e mensagens institucionais sustentam a camada executiva da marca diante de governos, OSS e investidores estratégicos.
                  </div>
                  <div className="rounded-[1.1rem] border border-border/70 bg-white p-4 text-sm leading-7 text-slate-600">
                    Provas de redução de fila, produtividade e ganho assistencial podem ser convertidas em peças recorrentes de autoridade pública.
                  </div>
                  <div className="rounded-[1.1rem] border border-border/70 bg-white p-4 text-sm leading-7 text-slate-600">
                    Artigos por especialidade aproximam o núcleo médico do app da narrativa institucional e da futura esteira científica da startup.
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Showcase de mídia</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">Vídeos, campanhas, ativos institucionais e base multimídia do app</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <LoadingCard label="Carregando vitrine de mídia..." inverse />
            ) : error ? (
              <StateCard
                title="A vitrine de mídia não pôde ser carregada"
                description={error.message}
                onRetry={() => void refetchAll(publicationsQuery, showcaseQuery)}
                retrying={retrying}
                inverse
              />
            ) : showcase.length === 0 ? (
              <StateCard
                title="Ainda não há itens de mídia destacados"
                description="A plataforma está pronta para receber vídeos, fotos, peças de campanha e demonstrações institucionais do SINACE."
                inverse
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Vídeos</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{showcase.filter(item => String(item?.mediaType ?? "").toLowerCase().includes("video")).length}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Imagens</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{showcase.filter(item => {
                      const mediaType = String(item?.mediaType ?? "").toLowerCase();
                      return mediaType.includes("image") || mediaType.includes("foto");
                    }).length}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Campanhas</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{showcase.filter(item => String(item?.title ?? item?.description ?? "").toLowerCase().includes("campanha")).length}</p>
                  </div>
                </div>
                {showcase.slice(0, 4).map(item => (
                  <div key={String(item?.id ?? item?.slug ?? item?.title)} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <div className="flex items-center gap-2 text-cyan-200/90">
                      <Video className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.22em]">{labelize(item?.mediaType)}</p>
                    </div>
                    <p className="mt-3 text-base font-semibold tracking-[-0.02em] text-white">{item?.title ?? "Ativo institucional"}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-100/84">{item?.description ?? "Ativo institucional pronto para campanhas, presença pública e apoio comercial."}</p>
                  </div>
                ))}
                <div className="rounded-[1.2rem] border border-cyan-200/15 bg-cyan-200/10 p-4 text-sm leading-7 text-slate-100/88">
                  A vitrine multimídia já pode ser organizada para três frentes complementares: apresentação executiva, prova social de impacto e repertório de marca para expansão institucional.
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

export function AppMedicalProfiles() {
  const directoryQuery = trpc.sinace.directory.list.useQuery({ limit: 12 });
  const snapshotQuery = trpc.sinace.directory.snapshot.useQuery();
  const loading = directoryQuery.isLoading || snapshotQuery.isLoading;
  const retrying = directoryQuery.isRefetching || snapshotQuery.isRefetching;
  const error = resolveModuleError([directoryQuery.error, snapshotQuery.error]);
  const doctors = getList<any>(directoryQuery.data);
  const snapshot = (snapshotQuery.data ?? null) as any;

  return (
    <ModuleShell
      eyebrow="Perfis médicos"
      title="Um diretório nacional de especialistas com currículo, áreas de atuação, disponibilidade institucional e base para credenciamento digital."
      description="O aplicativo passa a ter uma superfície própria para atrair médicos especialistas, organizar o cadastro profissional por nicho cirúrgico e preparar credenciais, verificações, anexos, vínculos e descoberta por especialidade."
      badge={loading ? "Consolidando diretório médico" : `${snapshot?.metrics?.professionals ?? doctors.length} perfis com base cirúrgica`}
      icon={Stethoscope}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Diretório ativo</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Especialistas prontos para descoberta, vínculo e expansão da rede</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingCard label="Carregando diretório médico..." />
            ) : error ? (
              <StateCard
                title="Não foi possível carregar o diretório médico agora"
                description={error.message}
                onRetry={() => void refetchAll(directoryQuery, snapshotQuery)}
                retrying={retrying}
              />
            ) : doctors.length === 0 ? (
              <StateCard
                title="Ainda não há especialistas visíveis no diretório"
                description="A plataforma já está preparada para receber currículos, vínculos, credenciais, CRM e áreas de atuação por especialidade."
              />
            ) : (
              doctors.map(item => (
                <article key={String(item?.id ?? item?.fullName)} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item?.fullName ?? "Especialista"}</h3>
                    {item?.specialtyName ? (
                      <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">{item.specialtyName}</Badge>
                    ) : null}
                    {item?.verificationStatus ? (
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{labelize(item.verificationStatus)}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item?.curriculumSummary ?? item?.miniBio ?? "Perfil preparado para receber currículo detalhado, comprovações e histórico de atuação institucional."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.78rem] font-medium text-slate-500">
                    <span>{item?.roleTitle ?? labelize(item?.professionalType)}</span>
                    {item?.institutionName ? (
                      <>
                        <span>•</span>
                        <span>{item.institutionName}</span>
                      </>
                    ) : null}
                    {item?.credentialNumber ? (
                      <>
                        <span>•</span>
                        <span>
                          {item.credentialAuthority ?? "Registro"} {item.credentialNumber}
                          {item?.credentialState ? `/${item.credentialState}` : ""}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1rem] border border-border/60 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Rede</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item?.connectionsCount ?? 0} conexões aceitas</p>
                    </div>
                    <div className="rounded-[1rem] border border-border/60 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Equipes</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item?.teamsCount ?? 0} equipes cirúrgicas vinculadas</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Capacidade da rede</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">A base do cadastro médico pronta para credenciais, comunidade e matching cirúrgico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <LoadingCard label="Consolidando a capacidade da rede médica..." inverse />
            ) : error ? (
              <StateCard
                title="A capacidade da rede médica não pôde ser carregada"
                description={error.message}
                onRetry={() => void refetchAll(directoryQuery, snapshotQuery)}
                retrying={retrying}
                inverse
              />
            ) : !snapshot ? (
              <StateCard
                title="O snapshot da rede médica ainda não está disponível"
                description="Assim que a camada de dados estiver completa, esta coluna exibirá verificações, disponibilidade e sinais de expansão profissional."
                inverse
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Perfis</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{snapshot.metrics?.professionals ?? 0}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Verificados</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{snapshot.metrics?.verifiedProfiles ?? 0}</p>
                  </div>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                  {snapshot.metrics?.acceptedConnections ?? 0} conexões aceitas já formam a base para relacionamento, convites e matching especializado.
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                  {snapshot.metrics?.specialties ?? 0} especialidades mapeadas e {snapshot.metrics?.institutions ?? 0} instituições conectadas ao ecossistema do aplicativo.
                </div>
                {getList<any>(snapshot.featuredProfiles)
                  .slice(0, 3)
                  .map(item => (
                    <div key={String(item?.id ?? item?.fullName)} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                      <p className="text-sm font-semibold text-white">{item?.fullName ?? "Especialista"}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100/84">{item?.specialtyName ?? item?.roleTitle ?? "Perfil médico"}</p>
                    </div>
                  ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

export function AppPrivateMedicalWorkspace() {
  const utils = trpc.useUtils();
  const workspaceQuery = trpc.sinace.directory.mine.useQuery();
  const specialtiesQuery = trpc.sinace.specialties.list.useQuery();
  const institutionsQuery = trpc.sinace.institutions.list.useQuery();
  const saveMutation = trpc.sinace.directory.saveMine.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.sinace.directory.mine.invalidate(),
        utils.sinace.directory.snapshot.invalidate(),
        utils.sinace.directory.list.invalidate(),
      ]);
    },
  });

  const loading = workspaceQuery.isLoading || specialtiesQuery.isLoading || institutionsQuery.isLoading;
  const retrying = workspaceQuery.isRefetching || specialtiesQuery.isRefetching || institutionsQuery.isRefetching;
  const error = resolveModuleError([workspaceQuery.error, specialtiesQuery.error, institutionsQuery.error]);
  const workspace = (workspaceQuery.data ?? null) as any;
  const profile = workspace?.profile ?? null;
  const specialties = getList<any>(specialtiesQuery.data);
  const institutions = getList<any>(institutionsQuery.data);
  const libraryAssets = getList<any>(workspace?.libraryAssets);
  const tracks = getList<any>(workspace?.tracks ?? workspace?.drive?.tracks);
  const documents = getList<any>(workspace?.documents ?? workspace?.drive?.documents);
  const publications = getList<any>(workspace?.publications ?? workspace?.drive?.publications);
  const caseStudies = getList<any>(workspace?.caseStudies ?? workspace?.drive?.caseStudies);
  const flowcharts = getList<any>(workspace?.flowcharts ?? workspace?.drive?.flowcharts);
  const connections = getList<any>(workspace?.connections);
  const networkHighlights = getList<any>(workspace?.networkHighlights);
  const onboardingChecklist = getList<any>(workspace?.onboarding?.checklist);
  const completionScore = Number(workspace?.completionScore ?? 0);
  const quickStats = (workspace?.quickStats ?? {}) as Record<string, number>;
  const profileHighlights = getList<string>(profile?.highlights);
  const profilePracticeAreas = getList<string>(profile?.practiceAreas);

  const [form, setForm] = useState({
    fullName: "",
    roleTitle: "",
    professionalType: "surgeon",
    institutionId: "",
    specialtyId: "",
    credentialNumber: "",
    credentialState: "",
    credentialAuthority: "CRM",
    rqeNumber: "",
    publicEmail: "",
    privateAccessEmail: "",
    passwordAccessStatus: "not_started",
    passwordRecoveryChannel: "",
    phone: "",
    city: "",
    state: "",
    regionLabel: "",
    profileImageUrl: "",
    miniBio: "",
    curriculumSummary: "",
    highlightsText: "",
    practiceAreasText: "",
    collaborationInterest: "medium",
    visibility: "restricted",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName ?? "",
      roleTitle: profile.roleTitle ?? "",
      professionalType: profile.professionalType ?? "surgeon",
      institutionId: profile.institutionId ? String(profile.institutionId) : "",
      specialtyId: profile.specialtyId ? String(profile.specialtyId) : "",
      credentialNumber: profile.credentialNumber ?? "",
      credentialState: profile.credentialState ?? "",
      credentialAuthority: profile.credentialAuthority ?? "CRM",
      rqeNumber: profile.rqeNumber ?? "",
      publicEmail: profile.publicEmail ?? "",
      privateAccessEmail: profile.privateAccessEmail ?? profile.publicEmail ?? "",
      passwordAccessStatus: profile.passwordAccessStatus ?? "not_started",
      passwordRecoveryChannel: profile.passwordRecoveryChannel ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      regionLabel: profile.regionLabel ?? "",
      profileImageUrl: profile.profileImageUrl ?? "",
      miniBio: profile.miniBio ?? "",
      curriculumSummary: profile.curriculumSummary ?? "",
      highlightsText: getList<string>(profile.highlights).join(", "),
      practiceAreasText: getList<string>(profile.practiceAreas).join(", "),
      collaborationInterest: profile.collaborationInterest ?? "medium",
      visibility: profile.visibility ?? "restricted",
    });
  }, [profile]);

  const featuredSpecialtyLabel = useMemo(() => {
    const selected = specialties.find(item => String(item.id) === form.specialtyId);
    return selected?.name ?? profile?.specialtyName ?? "Especialidade ainda não vinculada";
  }, [form.specialtyId, profile?.specialtyName, specialties]);

  const onboardingSections = useMemo(
    () => [
      {
        key: "identity",
        title: "Identidade profissional",
        done: Boolean(form.fullName.trim() && form.roleTitle.trim() && form.specialtyId),
        summary: form.fullName.trim()
          ? `${form.fullName.trim()} já possui um núcleo inicial de identificação clínica dentro da plataforma.`
          : "Defina nome, cargo clínico e especialidade foco para estruturar o cartão principal do especialista.",
        nextAction: "Completar nome, função clínica e especialidade principal.",
      },
      {
        key: "credentials",
        title: "Credenciais verificáveis",
        done: Boolean(form.credentialNumber.trim() && form.credentialState.trim() && form.credentialAuthority.trim()),
        summary: form.credentialNumber.trim()
          ? `Conselho ${form.credentialAuthority.trim() || "profissional"} já informado para validação institucional.`
          : "Registrar conselho, UF e órgão emissor para ampliar confiança no diretório médico.",
        nextAction: "Informar conselho profissional, UF e órgão emissor do registro.",
      },
      {
        key: "institution",
        title: "Vínculo territorial e institucional",
        done: Boolean(form.institutionId && form.city.trim() && form.state.trim()),
        summary: form.institutionId
          ? "A instituição principal já foi vinculada; cidade, estado e recorte regional refinam a descoberta do perfil."
          : "Associe o perfil a uma instituição e ao território de atuação para posicionar o especialista na rede.",
        nextAction: "Selecionar instituição principal e completar cidade, estado e recorte regional.",
      },
      {
        key: "narrative",
        title: "Narrativa clínica",
        done: Boolean(form.miniBio.trim() && form.curriculumSummary.trim() && form.practiceAreasText.trim()),
        summary: form.miniBio.trim()
          ? "A narrativa profissional já começou a formar contexto para currículo, bio e frentes de atuação."
          : "Construa uma mini bio, um resumo curricular e as áreas de atuação para contextualizar o especialista.",
        nextAction: "Escrever mini bio, resumo curricular e áreas de atuação prioritárias.",
      },
      {
        key: "access",
        title: "Acesso privado por senha",
        done: Boolean(form.privateAccessEmail.trim() && form.passwordAccessStatus !== "not_started"),
        summary: form.privateAccessEmail.trim()
          ? `A conta privada já possui canal de acesso ${form.passwordAccessStatus === "managed" ? "gerenciado" : form.passwordAccessStatus === "recovery" ? "em recuperação" : "pronto para uso"}.`
          : "Defina o e-mail de acesso privado e o status da senha para preparar a entrada do especialista no workspace autenticado.",
        nextAction: "Informar e-mail de acesso privado, status da senha e canal de recuperação.",
      },
      {
        key: "networking",
        title: "Disponibilidade para networking",
        done: Boolean(form.publicEmail.trim() && form.visibility !== "private" && form.collaborationInterest),
        summary:
          form.visibility !== "private"
            ? "O perfil já pode caminhar para descoberta controlada com foco em colaboração qualificada."
            : "A descoberta do perfil ainda está restrita enquanto a visibilidade permanecer totalmente privada.",
        nextAction: "Definir contato profissional, visibilidade e apetite de colaboração para abrir conexões.",
      },
    ],
    [
      form.city,
      form.collaborationInterest,
      form.credentialAuthority,
      form.credentialNumber,
      form.credentialState,
      form.curriculumSummary,
      form.fullName,
      form.institutionId,
      form.miniBio,
      form.passwordAccessStatus,
      form.passwordRecoveryChannel,
      form.practiceAreasText,
      form.privateAccessEmail,
      form.publicEmail,
      form.roleTitle,
      form.specialtyId,
      form.state,
      form.visibility,
    ],
  );

  const nextOnboardingActions = useMemo(() => {
    const pending = onboardingSections.filter(section => !section.done).map(section => section.nextAction);

    if (!workspace?.featureFlags?.driveReady) {
      pending.push("Selecionar uma especialidade principal e completar o resumo curricular para ativar a curadoria segmentada do drive.");
    }

    if (!workspace?.featureFlags?.canConnect) {
      pending.push("Ajustar a visibilidade para público ou restrito e manter um contato profissional ativo para ampliar o networking.");
    }

    return getUniqueStrings(pending).slice(0, 4);
  }, [onboardingSections, workspace?.featureFlags?.canConnect, workspace?.featureFlags?.driveReady]);

  const driveSegments = useMemo(
    () => [
      {
        key: "tracks",
        title: "Trilhas de aprofundamento",
        icon: GraduationCap,
        count: Number(quickStats.learningTracks ?? tracks.length),
        description: `Percursos formativos alinhados à especialidade ${featuredSpecialtyLabel.toLowerCase()}.`,
        items: tracks.slice(0, 2).map(item => ({
          title: item?.title ?? "Trilha de aprofundamento",
          badge: labelize(item?.difficulty ?? "curadoria"),
          description: item?.summary ?? `Trilha recomendada para ${item?.specialtyName ?? featuredSpecialtyLabel}.`,
        })),
      },
      {
        key: "documents",
        title: "Documentos operacionais",
        icon: BookOpen,
        count: Number(quickStats.documents ?? documents.length),
        description: "Protocolos, guias e materiais de consulta rápida associados ao contexto do especialista.",
        items: documents.slice(0, 2).map(item => ({
          title: item?.title ?? "Documento técnico",
          badge: labelize(item?.documentType ?? "documento"),
          description: item?.description ?? item?.specialtyName ?? featuredSpecialtyLabel,
        })),
      },
      {
        key: "caseStudies",
        title: "Casos e repertório clínico",
        icon: FolderKanban,
        count: Number(quickStats.caseStudies ?? caseStudies.length),
        description: "Estudos de caso para decisão clínica, ensino e preparação de equipes cirúrgicas.",
        items: caseStudies.slice(0, 2).map(item => ({
          title: item?.title ?? "Estudo de caso",
          badge: labelize(item?.caseType ?? "caso"),
          description: item?.summary ?? item?.specialtyName ?? "Caso relacionado à sua linha de atuação.",
        })),
      },
      {
        key: "publications",
        title: "Publicações aplicadas",
        icon: Newspaper,
        count: Number(quickStats.publications ?? publications.length),
        description: "Conteúdo editorial e institucional que reforça autoridade, repertório e posicionamento técnico.",
        items: publications.slice(0, 2).map(item => ({
          title: item?.title ?? "Publicação institucional",
          badge: labelize(item?.publicationType ?? "publicação"),
          description: item?.excerpt ?? item?.specialtyName ?? "Publicação vinculada ao seu foco profissional.",
        })),
      },
      {
        key: "flowcharts",
        title: "Fluxogramas assistenciais",
        icon: Network,
        count: Number(quickStats.flowcharts ?? flowcharts.length),
        description: "Fluxos clínicos e operacionais para padronização de jornada, triagem e execução assistencial.",
        items: flowcharts.slice(0, 2).map(item => ({
          title: item?.title ?? "Fluxograma clínico",
          badge: "Fluxo",
          description: item?.summary ?? item?.institutionName ?? item?.specialtyName ?? "Fluxo assistencial relacionado à sua especialidade.",
        })),
      },
      {
        key: "libraryAssets",
        title: "Ativos curatoriais",
        icon: Globe2,
        count: Number(workspace?.metrics?.libraryAssets ?? libraryAssets.length),
        description: "Ativos complementares para ampliar estudo, referência rápida e visão de expansão do especialista.",
        items: libraryAssets.slice(0, 2).map(item => ({
          title: item?.title ?? "Ativo curatorial",
          badge: labelize(item?.assetType ?? "asset"),
          description: item?.description ?? item?.specialtyName ?? featuredSpecialtyLabel,
        })),
      },
    ],
    [
      caseStudies,
      documents,
      featuredSpecialtyLabel,
      flowcharts,
      libraryAssets,
      publications,
      quickStats.caseStudies,
      quickStats.documents,
      quickStats.flowcharts,
      quickStats.learningTracks,
      quickStats.publications,
      tracks,
      workspace?.metrics?.libraryAssets,
    ],
  );

  const visibleDriveSegments = driveSegments.filter(segment => segment.count > 0 || segment.items.length > 0);

  const driveScopeBadges = getUniqueStrings([
    featuredSpecialtyLabel !== "Especialidade ainda não vinculada" ? featuredSpecialtyLabel : null,
    profile?.institutionName,
    form.state.trim() || profile?.state,
    form.regionLabel.trim() || profile?.regionLabel,
  ]);

  const readinessFronts = useMemo(
    () => [
      {
        key: "identity",
        title: "Identidade clínica",
        icon: Stethoscope,
        done: onboardingSections[0]?.done ?? false,
        description: form.fullName.trim()
          ? `${labelize(form.professionalType)} com foco em ${featuredSpecialtyLabel.toLowerCase()} já pode ocupar um lugar identificável no ecossistema.`
          : "Nome, função clínica e especialidade principal ainda precisam consolidar a identidade do especialista.",
      },
      {
        key: "credentials",
        title: "Confiança regulatória",
        icon: ShieldCheck,
        done: onboardingSections[1]?.done ?? false,
        description: form.credentialNumber.trim()
          ? `Conselho ${form.credentialAuthority.trim() || "profissional"}${form.credentialState.trim() ? ` · ${form.credentialState.trim().toUpperCase()}` : ""} já oferece base para verificação institucional.`
          : "A ausência de conselho, UF e órgão emissor reduz a força de verificação do perfil no diretório médico.",
      },
      {
        key: "institution",
        title: "Posicionamento territorial",
        icon: Globe2,
        done: onboardingSections[2]?.done ?? false,
        description: [profile?.institutionName, form.city.trim(), form.state.trim(), form.regionLabel.trim()]
          .filter(Boolean)
          .join(" · ") || "Instituição, cidade, estado e recorte regional ainda não formam um mapa territorial claro.",
      },
      {
        key: "narrative",
        title: "Narrativa e repertório",
        icon: BookOpen,
        done: onboardingSections[3]?.done ?? false,
        description: form.curriculumSummary.trim()
          ? "Bio, resumo curricular e áreas de atuação já ajudam a contextualizar a autoridade clínica e editorial do especialista."
          : "A narrativa clínica ainda precisa traduzir experiência, áreas de atuação e diferenciais curriculares.",
      },
      {
        key: "access",
        title: "Acesso autenticado",
        icon: KeyRound,
        done: onboardingSections[4]?.done ?? false,
        description: form.privateAccessEmail.trim()
          ? `Canal privado ${form.privateAccessEmail.trim()} com status ${form.passwordAccessStatus === "managed" ? "gerenciado" : form.passwordAccessStatus === "recovery" ? "em recuperação" : form.passwordAccessStatus === "ready" ? "pronto" : "a configurar"}.`
          : "O acesso privado por senha ainda não foi parametrizado para este especialista.",
      },
      {
        key: "networking",
        title: "Ativação de networking",
        icon: Network,
        done: onboardingSections[5]?.done ?? false,
        description: workspace?.featureFlags?.canConnect
          ? "A visibilidade e o canal profissional já permitem descoberta qualificada dentro da plataforma."
          : "Sem visibilidade compatível e contato profissional ativo, o perfil ainda não entra plenamente no radar de conexões.",
      },
    ],
    [
      featuredSpecialtyLabel,
      form.city,
      form.credentialAuthority,
      form.credentialNumber,
      form.credentialState,
      form.curriculumSummary,
      form.fullName,
      form.professionalType,
      form.regionLabel,
      form.state,
      onboardingSections,
      profile?.institutionName,
      workspace?.featureFlags?.canConnect,
    ],
  );

  const driveCategorySummary = useMemo(
    () =>
      visibleDriveSegments.map(segment => ({
        key: segment.key,
        title: segment.title,
        count: segment.count,
        description: segment.description,
      })),
    [visibleDriveSegments],
  );

  const driveProfessionalCuts = useMemo(
    () => [
      {
        label: "Especialidade foco",
        value: featuredSpecialtyLabel,
      },
      {
        label: "Tipo profissional",
        value: labelize(form.professionalType),
      },
      {
        label: "Instituição e território",
        value:
          [profile?.institutionName, form.city.trim(), form.state.trim(), form.regionLabel.trim()]
            .filter(Boolean)
            .join(" · ") || "Recorte institucional e territorial ainda incompleto.",
      },
      {
        label: "Modelo de visibilidade",
        value:
          form.visibility === "public"
            ? "Descoberta pública ampliada"
            : form.visibility === "restricted"
              ? "Descoberta restrita e controlada"
              : "Perfil privado fora do radar amplo",
      },
      {
        label: "Acesso privado",
        value: form.privateAccessEmail.trim()
          ? `${form.privateAccessEmail.trim()} · ${form.passwordAccessStatus === "managed" ? "gerenciado" : form.passwordAccessStatus === "recovery" ? "em recuperação" : form.passwordAccessStatus === "ready" ? "pronto" : "não iniciado"}`
          : "Acesso privado ainda não parametrizado",
      },
      {
        label: "Apetite de colaboração",
        value:
          form.collaborationInterest === "high"
            ? "Alta abertura para colaboração"
            : form.collaborationInterest === "medium"
              ? "Disponibilidade moderada"
              : "Baixa abertura declarada",
      },
      {
        label: "Sinal de curadoria",
        value: workspace?.featureFlags?.driveReady
          ? "Drive apto para recomendação mais fina por nicho"
          : "Drive ainda depende de mais contexto do perfil",
      },
    ],
    [
      featuredSpecialtyLabel,
      form.city,
      form.collaborationInterest,
      form.passwordAccessStatus,
      form.privateAccessEmail,
      form.professionalType,
      form.regionLabel,
      form.state,
      form.visibility,
      profile?.institutionName,
      workspace?.featureFlags?.driveReady,
    ],
  );

  const handleChange = (field: string, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveMutation.mutateAsync({
      fullName: form.fullName.trim(),
      roleTitle: form.roleTitle.trim(),
      professionalType: form.professionalType as
        | "surgeon"
        | "anesthesiologist"
        | "nurse"
        | "coordinator"
        | "faculty"
        | "resident"
        | "student"
        | "manager",
      institutionId: form.institutionId ? Number(form.institutionId) : null,
      specialtyId: form.specialtyId ? Number(form.specialtyId) : null,
      credentialNumber: form.credentialNumber.trim() || null,
      credentialState: form.credentialState.trim() || null,
      credentialAuthority: form.credentialAuthority.trim() || null,
      rqeNumber: form.rqeNumber.trim() || null,
      publicEmail: form.publicEmail.trim() || null,
      privateAccessEmail: form.privateAccessEmail.trim() || null,
      passwordAccessStatus: form.passwordAccessStatus as "not_started" | "ready" | "recovery" | "managed",
      passwordRecoveryChannel: form.passwordRecoveryChannel.trim() || null,
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      regionLabel: form.regionLabel.trim() || null,
      profileImageUrl: form.profileImageUrl.trim() || null,
      miniBio: form.miniBio.trim() || null,
      curriculumSummary: form.curriculumSummary.trim() || null,
      highlights: form.highlightsText
        .split(",")
        .map(item => item.trim())
        .filter(Boolean),
      practiceAreas: form.practiceAreasText
        .split(",")
        .map(item => item.trim())
        .filter(Boolean),
      collaborationInterest: form.collaborationInterest as "low" | "medium" | "high",
      visibility: form.visibility as "public" | "restricted" | "private",
    });
  };

  return (
    <ModuleShell
      eyebrow="Área privada do especialista"
      title="Currículo profissional, credenciais verificáveis e drive pessoal do médico em uma superfície autenticada dentro do ecossistema SINACE."
      description="Esta área transforma o cadastro do especialista em um workspace contínuo: perfil editável, vínculo por especialidade, resumo curricular, disponibilidade para colaboração e acervo técnico relacionado ao seu nicho cirúrgico."
      badge={loading ? "Carregando área privada" : `${Math.round(completionScore)}% do perfil estruturado`}
      icon={BriefcaseMedical}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Identidade profissional</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Meu perfil médico privado</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingCard label="Carregando perfil autenticado..." />
            ) : error ? (
              <StateCard
                title="Não foi possível abrir a área privada agora"
                description={error.message}
                onRetry={() => void refetchAll(workspaceQuery, specialtiesQuery, institutionsQuery)}
                retrying={retrying}
              />
            ) : (
              <form className="space-y-5" onSubmit={event => void handleSubmit(event)}>
                <div className="rounded-[1.25rem] border border-primary/15 bg-primary/5 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Onboarding do especialista</p>
                      <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-slate-950">
                        {workspace?.onboarding?.stage === "start"
                          ? "Início do cadastro"
                          : workspace?.onboarding?.stage === "profile"
                            ? "Estruturação do perfil"
                            : workspace?.onboarding?.stage === "credentials"
                              ? "Validação de credenciais"
                              : "Abertura para networking"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {workspace?.onboarding?.nextAction ?? "Preencha as informações principais para liberar o ecossistema profissional do app."}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-primary/15 bg-white/80 px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-950">{workspace?.onboarding?.completedSteps ?? 0} de {workspace?.onboarding?.totalSteps ?? onboardingChecklist.length} etapas concluídas</p>
                      <p className="mt-1 text-slate-600">O score acompanha identidade, credenciais, acesso privado, bio, currículo e disponibilidade institucional.</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
                    <div className="grid gap-3 md:grid-cols-2">
                      {onboardingSections.map(section => (
                        <div
                          key={section.key}
                          className={`rounded-[1rem] border px-4 py-4 text-sm leading-6 ${section.done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border/70 bg-white/80 text-slate-600"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{section.title}</p>
                              <p className="mt-1">{section.summary}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${section.done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                              {section.done ? "Concluído" : "Prioritário"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white/80 p-4">
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Próximas liberações</p>
                      <div className="mt-3 space-y-3">
                        {nextOnboardingActions.length > 0 ? (
                          nextOnboardingActions.map(item => (
                            <div key={item} className="rounded-[0.95rem] border border-border/60 bg-slate-50/80 px-3 py-3 text-sm leading-6 text-slate-600">
                              {item}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[0.95rem] border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-800">
                            As frentes principais do onboarding já estão estruturadas e o perfil está pronto para refinamentos editoriais.
                          </div>
                        )}
                      </div>
                      {onboardingChecklist.length > 0 ? (
                        <div className="mt-4 border-t border-border/60 pt-4">
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Checklist monitorado</p>
                          <div className="mt-3 grid gap-2">
                            {onboardingChecklist.slice(0, 4).map(item => (
                              <div
                                key={String(item?.label ?? item?.key ?? Math.random())}
                                className="flex items-center justify-between gap-3 rounded-[0.95rem] border border-border/60 bg-slate-50/80 px-3 py-3 text-sm"
                              >
                                <p className="text-slate-700">{item?.label ?? "Etapa do onboarding"}</p>
                                <span className={`rounded-full px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${item?.done ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                                  {item?.done ? "ok" : "pendente"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {readinessFronts.map(front => {
                    const Icon = front.icon;

                    return (
                      <div
                        key={front.key}
                        className={`rounded-[1rem] border px-4 py-4 text-sm leading-6 ${front.done ? "border-emerald-200 bg-emerald-50/90 text-emerald-900" : "border-border/70 bg-slate-50/80 text-slate-600"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${front.done ? "bg-emerald-100 text-emerald-700" : "bg-white text-primary"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{front.title}</p>
                            <p className="mt-1">{front.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Nome completo</span>
                    <input value={form.fullName} onChange={event => handleChange("fullName", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Cargo / função clínica</span>
                    <input value={form.roleTitle} onChange={event => handleChange("roleTitle", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Tipo profissional</span>
                    <select value={form.professionalType} onChange={event => handleChange("professionalType", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0">
                      <option value="surgeon">Cirurgião</option>
                      <option value="anesthesiologist">Anestesiologista</option>
                      <option value="nurse">Enfermagem</option>
                      <option value="coordinator">Coordenação</option>
                      <option value="faculty">Docência</option>
                      <option value="resident">Residente</option>
                      <option value="student">Estudante</option>
                      <option value="manager">Gestão</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Especialidade principal</span>
                    <select value={form.specialtyId} onChange={event => handleChange("specialtyId", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0">
                      <option value="">Selecionar</option>
                      {specialties.map(item => (
                        <option key={item.id} value={String(item.id)}>{item.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Instituição principal</span>
                    <select value={form.institutionId} onChange={event => handleChange("institutionId", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0">
                      <option value="">Selecionar</option>
                      {institutions.map(item => (
                        <option key={item.id} value={String(item.id)}>{item.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>E-mail profissional</span>
                    <input type="email" value={form.publicEmail} onChange={event => handleChange("publicEmail", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>E-mail de acesso privado</span>
                    <input type="email" value={form.privateAccessEmail} onChange={event => handleChange("privateAccessEmail", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Número do conselho</span>
                    <input value={form.credentialNumber} onChange={event => handleChange("credentialNumber", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>UF</span>
                    <input value={form.credentialState} onChange={event => handleChange("credentialState", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm uppercase outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Órgão</span>
                    <input value={form.credentialAuthority} onChange={event => handleChange("credentialAuthority", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>RQE</span>
                    <input value={form.rqeNumber} onChange={event => handleChange("rqeNumber", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Status do acesso por senha</span>
                    <select value={form.passwordAccessStatus} onChange={event => handleChange("passwordAccessStatus", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0">
                      <option value="not_started">Não iniciado</option>
                      <option value="ready">Pronto para uso</option>
                      <option value="recovery">Em recuperação</option>
                      <option value="managed">Gerenciado pela equipe</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Telefone</span>
                    <input value={form.phone} onChange={event => handleChange("phone", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>URL da imagem do perfil</span>
                    <input value={form.profileImageUrl} onChange={event => handleChange("profileImageUrl", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Cidade</span>
                    <input value={form.city} onChange={event => handleChange("city", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Estado</span>
                    <input value={form.state} onChange={event => handleChange("state", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Recorte regional</span>
                    <input value={form.regionLabel} onChange={event => handleChange("regionLabel", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Canal de recuperação / suporte de acesso</span>
                  <input value={form.passwordRecoveryChannel} onChange={event => handleChange("passwordRecoveryChannel", event.target.value)} placeholder="Ex.: e-mail do suporte, coordenação médica, WhatsApp institucional" className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0" />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Mini bio</span>
                  <textarea value={form.miniBio} onChange={event => handleChange("miniBio", event.target.value)} className="min-h-[96px] w-full rounded-xl border border-border/70 bg-white px-3 py-3 text-sm outline-none ring-0" />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Resumo curricular</span>
                  <textarea value={form.curriculumSummary} onChange={event => handleChange("curriculumSummary", event.target.value)} className="min-h-[140px] w-full rounded-xl border border-border/70 bg-white px-3 py-3 text-sm outline-none ring-0" />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Destaques do currículo</span>
                    <textarea value={form.highlightsText} onChange={event => handleChange("highlightsText", event.target.value)} placeholder="Ex.: Coordenação de mutirões, cirurgia minimamente invasiva" className="min-h-[110px] w-full rounded-xl border border-border/70 bg-white px-3 py-3 text-sm outline-none ring-0" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Áreas de atuação</span>
                    <textarea value={form.practiceAreasText} onChange={event => handleChange("practiceAreasText", event.target.value)} placeholder="Ex.: fila ortopédica, ambulatório pré-operatório" className="min-h-[110px] w-full rounded-xl border border-border/70 bg-white px-3 py-3 text-sm outline-none ring-0" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Interesse em colaboração</span>
                    <select value={form.collaborationInterest} onChange={event => handleChange("collaborationInterest", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0">
                      <option value="low">Baixo</option>
                      <option value="medium">Médio</option>
                      <option value="high">Alto</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Visibilidade</span>
                    <select value={form.visibility} onChange={event => handleChange("visibility", event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-white px-3 text-sm outline-none ring-0">
                      <option value="public">Público</option>
                      <option value="restricted">Restrito</option>
                      <option value="private">Privado</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col gap-3 rounded-[1.2rem] border border-border/70 bg-slate-50/80 p-4 text-sm leading-7 text-slate-600 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">Status do cadastro</p>
                    <p className="mt-1">O perfil privado conversa com o diretório médico, com o network profissional e com o drive técnico da sua especialidade.</p>
                  </div>
                  <Button type="submit" className="min-w-[180px] rounded-full">
                    {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar perfil
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(8,25,53,0.98),rgba(18,61,108,0.95))] text-white shadow-[0_24px_70px_rgba(8,25,53,0.24)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/90">Leitura executiva</CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-white">Prontidão do especialista dentro da plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Conclusão do perfil</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{Math.round(completionScore)}%</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Especialidade foco</p>
                  <p className="mt-3 text-lg font-semibold text-white">{featuredSpecialtyLabel}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Trilhas sugeridas</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{quickStats.learningTracks ?? tracks.length}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Fluxogramas</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{quickStats.flowcharts ?? flowcharts.length}</p>
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                {connections.length} conexões aceitas ou mapeadas já aproximam este perfil da comunidade do app, enquanto {networkHighlights.length} especialistas relacionados permanecem no radar da mesma especialidade.
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                {workspace?.featureFlags?.driveReady ? "Drive técnico habilitado para a especialidade selecionada, com curadoria de trilhas, documentos, casos e fluxogramas." : "O drive técnico ainda depende da seleção de especialidade e da evolução editorial do acervo."}
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                {profile?.privateAccessEmail
                  ? `Acesso privado parametrizado em ${profile.privateAccessEmail}${profile.passwordAccessStatus && profile.passwordAccessStatus !== "not_started" ? ` com status ${profile.passwordAccessStatus}.` : "."}`
                  : "O acesso privado por senha ainda não foi parametrizado neste perfil e permanece como etapa operacional pendente."}
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                {workspace?.featureFlags?.canConnect ? "O network profissional já pode descobrir este especialista de forma estruturada e relacioná-lo por instituição, estado e interesse de colaboração." : "A descoberta pública do perfil ainda está em preparação dentro do ecossistema."}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileHighlights.slice(0, 3).map(item => (
                  <Badge key={item} className="rounded-full border border-white/12 bg-white/8 text-white hover:bg-white/8">{item}</Badge>
                ))}
                {profilePracticeAreas.slice(0, 2).map(item => (
                  <Badge key={item} className="rounded-full border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/10">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Drive por especialidade</CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Acervo recomendado para o seu nicho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Documentos</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quickStats.documents ?? documents.length}</p>
                </div>
                <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Casos</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quickStats.caseStudies ?? caseStudies.length}</p>
                </div>
                <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Publicações</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quickStats.publications ?? publications.length}</p>
                </div>
                <div className="rounded-[1.1rem] border border-border/70 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Trilhas</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quickStats.learningTracks ?? tracks.length}</p>
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-border/70 bg-slate-50/85 p-4 text-sm leading-7 text-slate-600">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Recorte ativo do drive</p>
                <p className="mt-2">
                  {workspace?.featureFlags?.driveReady
                    ? "A curadoria já está segmentando o acervo por especialidade, território e sinais de prontidão do perfil."
                    : "O drive já consolida os tipos de acervo disponíveis, mas depende de mais contexto do perfil para afinar a recomendação por nicho."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {driveScopeBadges.length > 0 ? (
                    driveScopeBadges.map(item => (
                      <Badge key={item} variant="outline" className="border-primary/20 bg-white text-primary">
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="border-border/70 bg-white text-slate-600">
                      Recorte profissional ainda em estruturação
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="rounded-[1.15rem] border border-border/70 bg-white p-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Segmentação por tipo de acervo</p>
                  <div className="mt-3 space-y-2">
                    {driveCategorySummary.length > 0 ? (
                      driveCategorySummary.map(item => (
                        <div key={item.key} className="rounded-[0.95rem] border border-border/60 bg-slate-50/80 px-3 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/75">{item.count} itens</span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[0.95rem] border border-dashed border-border/70 bg-slate-50/80 px-3 py-3 text-sm leading-6 text-slate-500">
                        O drive ainda não possui volume suficiente por categoria para exibir uma segmentação editorial mais detalhada.
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-[1.15rem] border border-border/70 bg-slate-50/85 p-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Recortes profissionais ativos</p>
                  <div className="mt-3 grid gap-2">
                    {driveProfessionalCuts.map(item => (
                      <div key={item.label} className="rounded-[0.95rem] border border-border/60 bg-white px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/75">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {visibleDriveSegments.length === 0 ? (
                <StateCard
                  title="Ainda não há acervo personalizado"
                  description="Selecione sua especialidade e avance na curadoria para que documentos, casos, trilhas e fluxogramas sejam filtrados automaticamente para o seu workspace."
                />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {visibleDriveSegments.map(segment => {
                    const Icon = segment.icon;

                    return (
                      <div key={segment.key} className="rounded-[1.2rem] border border-border/70 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-950">{segment.title}</p>
                              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/75">
                                {segment.count} sinais ou itens disponíveis
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{segment.description}</p>
                        <div className="mt-3 space-y-2">
                          {segment.items.length > 0 ? (
                            segment.items.map(item => (
                              <div key={`${segment.key}-${item.title}`} className="rounded-[0.95rem] border border-border/60 bg-slate-50/80 p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/75">{item.badge}</span>
                                </div>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-[0.95rem] border border-dashed border-border/70 bg-slate-50/80 p-3 text-sm leading-6 text-slate-500">
                              A contagem desta frente já aparece no snapshot do workspace, mas a listagem editorial detalhada ainda está em expansão.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Radar de networking</CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Especialistas e conexões com maior aderência ao seu perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
              {connections.slice(0, 2).map(item => (
                <div key={String(item?.id ?? item?.profileId ?? item?.fullName)} className="rounded-[1.1rem] border border-border/70 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{item?.fullName ?? "Conexão validada"}</p>
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{labelize(item?.connectionType ?? "rede")}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {[item?.roleTitle, item?.specialtyName, item?.institutionName].filter(Boolean).join(" · ") || "Contato relacionado ao seu contexto assistencial."}
                  </p>
                </div>
              ))}
              {networkHighlights.slice(0, 3).map(item => (
                <div key={String(item?.id ?? item?.fullName)} className="rounded-[1.1rem] border border-border/70 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{item?.fullName ?? "Especialista sugerido"}</p>
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{labelize(item?.collaborationInterest ?? item?.visibility ?? "match")}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {[item?.roleTitle, item?.specialtyName, item?.institutionName, item?.state].filter(Boolean).join(" · ") || "Perfil relacionado à mesma especialidade ou fronteira institucional."}
                  </p>
                </div>
              ))}
              {connections.length === 0 && networkHighlights.length === 0 ? (
                <StateCard
                  title="Ainda não há radar de relacionamento suficiente"
                  description="Quando mais perfis públicos surgirem na mesma especialidade e os vínculos forem aceitos, esta área passará a sugerir contatos qualificados automaticamente."
                />
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
            <CardHeader>
              <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Checklist de confiança</CardDescription>
              <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Sinais de verificação do perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
              {[
                profile?.credentialNumber ? "Conselho profissional informado." : "Adicionar número de conselho para destravar verificação institucional.",
                profile?.rqeNumber ? "RQE registrado para reforçar a qualificação da especialidade." : "Registrar RQE quando aplicável para fortalecer o diretório público.",
                profile?.institutionName ? `Vínculo principal com ${profile.institutionName}.` : "Associar o perfil a uma instituição parceira da rede.",
                profile?.visibility === "public" ? "Perfil elegível para descoberta mais ampla dentro da plataforma." : "Ajustar visibilidade para ampliar networking quando desejar.",
              ].map(item => (
                <div key={item} className="flex gap-3 rounded-[1.1rem] border border-border/70 bg-slate-50/80 p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                  <p>{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleShell>
  );
}

export function AppProfessionalNetwork() {
  const directoryQuery = trpc.sinace.directory.snapshot.useQuery();
  const ecosystemQuery = trpc.sinace.ecosystem.snapshot.useQuery();
  const loading = directoryQuery.isLoading || ecosystemQuery.isLoading;
  const retrying = directoryQuery.isRefetching || ecosystemQuery.isRefetching;
  const error = resolveModuleError([directoryQuery.error, ecosystemQuery.error]);
  const network = (directoryQuery.data ?? null) as any;
  const ecosystem = (ecosystemQuery.data ?? null) as any;
  const partners = getList<any>(ecosystem?.latestPartners);
  const institutions = getList<any>(ecosystem?.latestInstitutions);
  const featuredProfiles = getList<any>(network?.featuredProfiles);

  return (
    <ModuleShell
      eyebrow="Network profissional"
      title="Conexão entre especialistas, parceiros, instituições e ecossistema SUS para acelerar cooperação clínica, expansão territorial e inteligência operacional."
      description="Esta área organiza a comunidade do app como um hub de relacionamento entre médicos, hospitais, secretarias, OSS, parceiros acadêmicos e frentes institucionais nas esferas federal, estadual, municipal e regional."
      badge={loading ? "Consolidando ecossistema" : `${ecosystem?.metrics?.partners ?? 0} parceiros e ${network?.metrics?.professionals ?? 0} perfis`}
      icon={Network}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Rede institucional</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Frentes do SUS, parceiros e vetores de cooperação nacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingCard label="Carregando rede institucional..." />
            ) : error ? (
              <StateCard
                title="Não foi possível consolidar o network profissional agora"
                description={error.message}
                onRetry={() => void refetchAll(directoryQuery, ecosystemQuery)}
                retrying={retrying}
              />
            ) : !ecosystem ? (
              <StateCard
                title="Ainda não há snapshot do ecossistema institucional"
                description="Conforme os parceiros e instituições forem enriquecidos, esta área exibirá mapas de cooperação por esfera e tipo de relacionamento."
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Parceiros</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{ecosystem.metrics?.partners ?? 0}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Instituições</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{ecosystem.metrics?.institutions ?? 0}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Contratos</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{ecosystem.metrics?.contracts ?? 0}</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(
                    partners.reduce((acc: Record<string, number>, item) => {
                      const key = labelize(item?.sphere ?? item?.partnerType ?? "ecossistema");
                      acc[key] = (acc[key] ?? 0) + 1;
                      return acc;
                    }, {})
                  )
                    .slice(0, 4)
                    .map(([label, count]) => (
                      <div key={label} className="rounded-[1.15rem] border border-border/70 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{count} frentes institucionais já aparecem no radar de relacionamento.</p>
                      </div>
                    ))}
                </div>
                {partners.length > 0 ? (
                  partners.slice(0, 4).map(item => (
                    <div key={String(item?.id ?? item?.slug ?? item?.name)} className="rounded-[1.25rem] border border-border/70 bg-white p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold tracking-[-0.02em] text-slate-950">{item?.name ?? "Parceiro institucional"}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item?.description ?? "Base estratégica para relacionamento, expansão territorial e demonstração de presença institucional."}</p>
                        </div>
                        <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">{labelize(item?.sphere ?? item?.partnerType)}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <StateCard
                    title="A cobertura de parceiros ainda está em formação"
                    description="Os parceiros por esfera do SUS aparecerão aqui conforme o cadastro institucional for enriquecido."
                  />
                )}
                {institutions.slice(0, 2).map(item => (
                  <div key={String(item?.id ?? item?.slug ?? item?.name)} className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4 text-sm leading-7 text-slate-600">
                    <p className="font-semibold text-slate-950">{item?.name ?? "Instituição assistencial"}</p>
                    <p className="mt-2">{item?.description ?? item?.regionLabel ?? "Instituição conectada ao eixo regional do ecossistema SINACE."}</p>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Comunidade médica</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">A rede profissional pronta para relacionamento, publicação e matching especializado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <LoadingCard label="Carregando sinais da comunidade médica..." inverse />
            ) : error ? (
              <StateCard
                title="A comunidade médica não pôde ser consolidada"
                description={error.message}
                onRetry={() => void refetchAll(directoryQuery, ecosystemQuery)}
                retrying={retrying}
                inverse
              />
            ) : !network ? (
              <StateCard
                title="O snapshot da comunidade médica ainda não está disponível"
                description="Quando os perfis, conexões e vínculos estiverem mais completos, esta área mostrará densidade relacional e oportunidades de matching."
                inverse
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Perfis</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{network.metrics?.professionals ?? 0}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Conexões</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{network.metrics?.acceptedConnections ?? 0}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Verificados</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{network.metrics?.verifiedProfiles ?? 0}</p>
                  </div>
                </div>
                {featuredProfiles.slice(0, 3).map(item => (
                  <div key={String(item?.id ?? item?.fullName)} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{item?.fullName ?? "Especialista sugerido"}</p>
                      <Badge className="rounded-full border border-white/12 bg-white/8 text-white hover:bg-white/8">{labelize(item?.specialtyName ?? item?.collaborationInterest ?? "match")}</Badge>
                    </div>
                    <p className="mt-2 text-slate-100/84">{item?.miniBio ?? item?.curriculumSummary ?? "Perfil com aderência potencial para cooperação clínica e construção de comunidade especializada."}</p>
                  </div>
                ))}
                {featuredProfiles.length === 0
                  ? [
                      `${network.metrics?.professionals ?? 0} perfis médicos disponíveis para descoberta estruturada.`,
                      `${network.metrics?.acceptedConnections ?? 0} conexões aceitas já indicam aderência à comunidade cirúrgica.`,
                      `${network.metrics?.verifiedProfiles ?? 0} perfis verificados formam a base para confiança e credenciamento.`,
                      "A próxima etapa conecta convites, interesses, mensagens e vínculos institucionais por especialidade.",
                    ].map(item => (
                      <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                        {item}
                      </div>
                    ))
                  : null}
                <div className="rounded-[1.2rem] border border-cyan-200/15 bg-cyan-200/10 p-4 text-sm leading-7 text-slate-100/88">
                  O networking já combina descoberta por especialidade, perfis verificados e base de conexões aceitas para sustentar matching profissional mais qualificado.
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

export function AppInstitutionalEcosystem() {
  const ecosystemQuery = trpc.sinace.ecosystem.snapshot.useQuery();
  const loading = ecosystemQuery.isLoading;
  const retrying = ecosystemQuery.isRefetching;
  const error = resolveModuleError([ecosystemQuery.error]);
  const ecosystem = (ecosystemQuery.data ?? null) as any;
  const partners = getList<any>(ecosystem?.latestPartners);
  const institutions = getList<any>(ecosystem?.latestInstitutions);
  const contracts = getList<any>(ecosystem?.recentContracts ?? ecosystem?.latestContracts);

  return (
    <ModuleShell
      eyebrow="Ecossistema institucional"
      title="Parceiros, instituições, vitrines públicas e cobertura por esfera para sustentar a startup cirúrgica em escala nacional."
      description="Esta área resume a malha institucional do SINACE para mostrar como o aplicativo pode reunir governo, redes hospitalares, comunidade médica, conteúdo e mídia em uma mesma plataforma de expansão."
      badge={loading ? "Consolidando ecossistema institucional" : `${ecosystem?.metrics?.partners ?? 0} parceiros ativos no radar`}
      icon={Globe2}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Matriz institucional</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Presença nas esferas de governo, ensino, operação e articulação regional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <LoadingCard label="Carregando matriz institucional..." />
            ) : error ? (
              <StateCard
                title="Não foi possível carregar a matriz institucional agora"
                description={error.message}
                onRetry={() => void ecosystemQuery.refetch()}
                retrying={retrying}
              />
            ) : !ecosystem ? (
              <StateCard
                title="Ainda não há snapshot institucional disponível"
                description="Quando a base de parceiros estiver mais completa, esta área mostrará a presença da plataforma entre governo, academia, hospitais e fornecedores."
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Parceiros</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{ecosystem.metrics?.partners ?? 0}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Organizações mapeadas para expansão e cooperação operacional.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Instituições</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{ecosystem.metrics?.institutions ?? 0}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Unidades assistenciais e formativas que dão tração à plataforma.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-slate-50/90 p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">Contratos</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{ecosystem.metrics?.contracts ?? contracts.length}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Frentes já convertidas em relacionamento formal ou tração institucional.</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(
                    partners.reduce((acc: Record<string, number>, item) => {
                      const key = labelize(item?.sphere ?? item?.partnerType ?? "ecossistema");
                      acc[key] = (acc[key] ?? 0) + 1;
                      return acc;
                    }, {})
                  )
                    .slice(0, 4)
                    .map(([label, count]) => (
                      <div key={label} className="rounded-[1.15rem] border border-border/70 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{count} relações já mapeadas nesta frente institucional.</p>
                      </div>
                    ))}
                </div>
                <div className="grid gap-3">
                  {partners.slice(0, 3).map(item => (
                    <div key={String(item?.id ?? item?.slug ?? item?.name)} className="rounded-[1.25rem] border border-border/70 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold tracking-[-0.02em] text-slate-950">{item?.name ?? "Parceiro"}</p>
                        <Badge className="rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50">{labelize(item?.partnershipType ?? item?.partnerType)}</Badge>
                        <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">{labelize(item?.status)}</Badge>
                        <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{labelize(item?.sphere ?? "regional")}</Badge>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item?.description ?? "Parceiro estratégico do ecossistema institucional do SINACE."}</p>
                    </div>
                  ))}
                  {institutions.slice(0, 2).map(item => (
                    <div key={String(item?.id ?? item?.slug ?? item?.name)} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold tracking-[-0.02em] text-slate-950">{item?.name ?? "Instituição"}</p>
                        {item?.regionLabel ? (
                          <Badge className="rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">{item.regionLabel}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item?.description ?? item?.regionLabel ?? "Instituição do ecossistema assistencial e formativo do SINACE."}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Vetores de expansão</CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">Os movimentos que transformam o site publicado em plataforma de startup expansiva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error || loading ? (
              error ? (
                <StateCard
                  title="Os vetores de expansão não puderam ser carregados"
                  description={error.message}
                  onRetry={() => void ecosystemQuery.refetch()}
                  retrying={retrying}
                  inverse
                />
              ) : (
                <LoadingCard label="Projetando vetores de expansão..." inverse />
              )
            ) : (
              <>
                {[
                  "Cadastro médico robusto para atrair especialistas por nicho cirúrgico e ampliar a comunidade ativa.",
                  "Biblioteca e casos clínicos como motor de recorrência, estudo e autoridade científica.",
                  "Publicações institucionais do CEO e da rede para demonstrar redução de filas e impacto operacional.",
                  "Camada de parceiros e instituições por esfera para abrir portas regionais, estaduais, federais e internacionais.",
                ].map(item => (
                  <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-100/88">
                    {item}
                  </div>
                ))}
                <div className="rounded-[1.2rem] border border-cyan-200/15 bg-cyan-200/10 p-4 text-sm leading-7 text-slate-100/88">
                  Hoje o ecossistema já pode ser lido em três camadas complementares: rede médica, malha institucional por esfera e ativos editoriais capazes de sustentar expansão nacional.
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

export function AppTrainingTracks() {
  return (
    <ModuleShell
      eyebrow="Formação contínua"
      title="Uma camada de trilhas, anexos e desenvolvimento profissional para transformar estudo em recorrência dentro do app."
      description="Esta visão antecipa a evolução da biblioteca para uma plataforma de aprendizagem estruturada, com jornadas por especialidade, anexos, certificações e histórico de aprofundamento do médico dentro do ecossistema SINACE."
      badge="Base conceitual pronta para evolução"
      icon={GraduationCap}
    >
      <Card className="border-border/70 bg-white/85 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
        <CardHeader>
          <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">Próxima expansão</CardDescription>
          <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">Trilhas, anexos e jornadas por nicho cirúrgico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
          <p>O núcleo editorial já está preparado para evoluir para percursos completos de estudo, indexação de arquivos, anexos multimídia, casos comentados e progressão por especialidade.</p>
          <p>Na próxima etapa, esta camada pode incorporar histórico individual, favoritos, listas personalizadas, checkpoints e mecanismos de publicação científica por comunidade médica.</p>
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
