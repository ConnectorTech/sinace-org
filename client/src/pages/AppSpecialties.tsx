import { SinaceSectionShell } from "@/components/SinaceSectionShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  BookOpenText,
  BriefcaseMedical,
  Building2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const statusLabel: Record<string, string> = {
  draft: "Rascunho",
  active: "Ativa",
  archived: "Arquivada",
};

const statusClassName: Record<string, string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function AppSpecialties() {
  const {
    data: specialties,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = trpc.sinace.specialties.list.useQuery();

  const specialtyRows = specialties ?? [];
  const activeSpecialties = specialtyRows.filter(item => item.status === "active");
  const institutionalCoverage = specialtyRows.filter(item => item.institutionsCount > 0).length;
  const queueCoverage = specialtyRows.filter(item => item.queueCount > 0).length;
  const educationalCoverage = specialtyRows.filter(item => item.tracksCount > 0 || item.documentsCount > 0).length;

  const topOperationalSpecialties = [...specialtyRows]
    .sort((a, b) => {
      const operationalDelta = b.queueCount - a.queueCount;
      if (operationalDelta !== 0) return operationalDelta;
      return b.institutionsCount - a.institutionsCount;
    })
    .slice(0, 4);

  return (
    <SinaceSectionShell
      eyebrow="Especialidades persistidas"
      title="O núcleo cirúrgico do SINACE agora nasce do banco de dados e organiza operação, educação e governança por área." 
      description="A taxonomia obrigatória das 19 especialidades foi consolidada como fonte persistente do produto. Cada área pode concentrar coordenação, trilhas, documentos, contratos, instituições e leitura da fila cirúrgica em uma única estrutura de domínio."
      icon={Stethoscope}
      badge={isLoading ? "Sincronizando base" : `${specialtyRows.length} especialidades no banco`}
      ctaLabel="Atualizar catálogo"
      highlights={[
        {
          title: "Taxonomia oficial sincronizada",
          description:
            "As especialidades do SINACE deixam de ser seed visual e passam a existir como catálogo persistente, com slug, descrição, coordenação e ordem de exibição.",
          metric: isLoading ? "…" : `${activeSpecialties.length} ativas`,
        },
        {
          title: "Cobertura institucional real",
          description:
            "A base já conecta especialidades a instituições, contratos governamentais, equipes e frentes assistenciais configuráveis.",
          metric: isLoading ? "…" : `${institutionalCoverage} com instituições`,
        },
        {
          title: "Camada educacional integrada",
          description:
            "As áreas podem concentrar trilhas, documentos e, em seguida, casos clínicos, enciclopédia e curadoria científica sem depender de hardcode.",
          metric: isLoading ? "…" : `${educationalCoverage} com conteúdo`,
        },
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Leitura do catálogo persistente
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              As especialidades passam a ser unidades operacionais e educacionais do sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                Cobertura institucional
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                {isLoading ? "…" : institutionalCoverage}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Especialidades já vinculadas a instituições operacionais ou docentes na base persistente.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700">
                <BookOpenText className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                Acervo estruturado
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                {isLoading
                  ? "…"
                  : specialtyRows.reduce((total, item) => total + item.tracksCount + item.documentsCount, 0)}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Relações já materializadas entre especialidades, trilhas e documentos do ambiente educacional.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <BriefcaseMedical className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                Pressão assistencial
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                {isLoading ? "…" : queueCoverage}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Linhas com fila já observada no banco, prontas para priorização e leitura operacional do contrato.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Estrutura de dados ativa
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              O banco já suporta a espinha dorsal cirúrgica do SINACE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Especialidades persistidas com ordem, status, coordenação e descrição institucional.",
              "Relações com instituições, contratos, equipes, fila cirúrgica, trilhas e documentos.",
              "Catálogo pronto para alimentar site, aplicativo e futuras superfícies administrativas.",
              "Base preparada para evolução com casos clínicos, enciclopédia e curadoria científica por área.",
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
              className="mt-2 w-full border-white/15 bg-white/8 text-white hover:bg-white/12 hover:text-white"
            >
              {isRefetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Reconsultar dados persistentes
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Prioridades operacionais
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Especialidades com maior densidade relacional no estado atual do banco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-[1.4rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando especialidades persistidas...
              </div>
            ) : topOperationalSpecialties.length === 0 ? (
              <div className="rounded-[1.4rem] border border-dashed border-border/80 bg-slate-50/80 p-6 text-sm leading-7 text-slate-600">
                Ainda não há especialidades relacionadas a instituições, contratos ou fila na base atual.
              </div>
            ) : (
              topOperationalSpecialties.map(item => (
                <div key={item.id} className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.name}</h3>
                        <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] ${statusClassName[item.status] ?? statusClassName.active}`}>
                          {statusLabel[item.status] ?? item.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-[0_10px_30px_rgba(15,54,104,0.08)]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
                        Coordenação
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                        {item.coordinationModel || "Modelo a definir"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Instituições", value: item.institutionsCount },
                      { label: "Contratos", value: item.contractsCount },
                      { label: "Fila", value: item.queueCount },
                      { label: "Conteúdo", value: item.tracksCount + item.documentsCount },
                    ].map(metric => (
                      <div key={metric.label} className="rounded-[1.1rem] border border-border/70 bg-white px-4 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Catálogo integral
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Taxonomia persistida das 19 áreas cirúrgicas do SINACE
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-[1.4rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-7 text-rose-700">
                Não foi possível carregar as especialidades do banco agora. Tente atualizar a consulta para verificar o estado persistente.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {specialtyRows.map(item => (
                  <div key={item.id} className="rounded-[1.25rem] border border-border/70 bg-slate-50/85 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{item.shortLabel || item.name}</h3>
                        </div>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {item.slug}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] ${statusClassName[item.status] ?? statusClassName.active}`}>
                        {statusLabel[item.status] ?? item.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">{item.operationalFocus || item.description}</p>

                    <div className="mt-4 space-y-3 rounded-[1.05rem] bg-white px-4 py-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
                          Foco operacional
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{item.operationalFocus || "Em estruturação"}</p>
                      </div>
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
                          Foco educacional
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{item.educationalFocus || "Em estruturação"}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { label: "Trilhas", value: item.tracksCount },
                        { label: "Documentos", value: item.documentsCount },
                        { label: "Instituições", value: item.institutionsCount },
                        { label: "Fila", value: item.queueCount },
                      ].map(metric => (
                        <div key={metric.label} className="rounded-[1rem] border border-border/70 bg-white px-3 py-3">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {metric.label}
                          </p>
                          <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Banco como fonte única",
            description:
              "A navegação e as próximas superfícies administrativas podem consumir a mesma taxonomia persistente sem divergência entre site, app e operação.",
          },
          {
            icon: BookOpenText,
            title: "Curadoria por especialidade",
            description:
              "Cada linha cirúrgica já está pronta para consolidar trilhas, biblioteca, casos clínicos e enciclopédia dentro de um mesmo eixo semântico.",
          },
          {
            icon: BriefcaseMedical,
            title: "Leitura executiva da fila",
            description:
              "As relações com contratos, instituições e fila tornam possível medir pressão assistencial por área antes de abrir módulos analíticos mais profundos.",
          },
        ].map(card => (
          <Card key={card.title} className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SinaceSectionShell>
  );
}
