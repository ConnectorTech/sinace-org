import { SinaceSectionShell } from "@/components/SinaceSectionShell";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sinaceNavigationGroups } from "@/lib/sinace-navigation";
import { trpc } from "@/lib/trpc";
import { Activity, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

const queuePriorityLabel: Record<string, string> = {
  low: "Baixa",
  moderate: "Moderada",
  high: "Alta",
  urgent: "Urgente",
};

const queueStatusLabel: Record<string, string> = {
  waiting: "Em espera",
  scheduled: "Agendada",
  performed: "Realizada",
  cancelled: "Cancelada",
};

export default function AppDashboard() {
  const dashboardQuery = trpc.sinace.dashboard.useQuery();
  const institutionsQuery = trpc.sinace.institutions.list.useQuery();
  const queueQuery = trpc.sinace.queue.recent.useQuery();

  const dashboard = dashboardQuery.data;
  const institutions = institutionsQuery.data ?? [];
  const queueEntries = queueQuery.data ?? [];
  const metrics = dashboard?.metrics;
  const loading = dashboardQuery.isLoading || institutionsQuery.isLoading || queueQuery.isLoading;

  const workspaceEntries = sinaceNavigationGroups.flatMap(group =>
    group.items.map(item => ({
      group: group.label,
      ...item,
    }))
  );

  const dashboardMetrics = [
    {
      label: "Especialidades cirúrgicas",
      value: metrics?.specialties ?? 0,
      description:
        "Base nacional organizada para descoberta por nicho, governança assistencial e expansão do catálogo clínico-cirúrgico.",
    },
    {
      label: "Instituições conectadas",
      value: metrics?.institutions ?? 0,
      description:
        "Hospitais, Santas Casas, centros cirúrgicos e polos de ensino articulados na mesma espinha dorsal do produto.",
    },
    {
      label: "Fluxo assistencial observado",
      value: metrics?.queueEntries ?? 0,
      description:
        "Leitura da fila e da pressão cirúrgica para apoiar comunicação institucional, operação e futura prova de impacto.",
    },
    {
      label: "Ativos de conhecimento",
      value: (metrics?.tracks ?? 0) + (metrics?.documents ?? 0),
      description:
        "Trilhas, protocolos e documentos que já sustentam a biblioteca, os fluxogramas e a frente de estudos do aplicativo.",
    },
  ];

  return (
    <SinaceSectionShell
      eyebrow="App SINACE"
      title="A entrada autenticada do SINACE passa a funcionar como centro operacional, científico e institucional da plataforma." 
      description="O aplicativo deixa de ser apenas uma extensão do site e assume o papel de hub para rede cirúrgica, publicações estratégicas, diretório médico, biblioteca técnica e leitura da fila assistencial em escala nacional."
      icon={Activity}
      badge={loading ? "Sincronizando fundação do app" : `${workspaceEntries.length} áreas estruturadas no workspace`}
      highlights={[
        {
          title: "Rede cirúrgica em uma única superfície",
          description:
            "Especialidades, instituições, parceiros, fluxos e sinais da fila já podem ser lidos dentro do mesmo workspace autenticado.",
          metric: loading ? "…" : `${metrics?.institutions ?? 0} instituições`,
        },
        {
          title: "Conhecimento organizado para escala",
          description:
            "Biblioteca, estudos de caso e enciclopédia formam a base do drive científico e da camada educacional da plataforma.",
          metric: loading ? "…" : `${(metrics?.tracks ?? 0) + (metrics?.documents ?? 0)} ativos`,
        },
        {
          title: "Diretório profissional e network em evolução",
          description:
            "A arquitetura já aponta para cadastro de especialistas, currículo, credenciais, áreas de atuação e conexões por nicho.",
          metric: `${workspaceEntries.filter(item => item.group === "Comunidade médica").length} módulos`,
        },
      ]}
      ctaLabel="Fundação ativa"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Síntese executiva
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Vetores principais já conectados ao aplicativo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {dashboardMetrics.map(metric => (
              <div key={metric.label} className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{metric.label}</p>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                  {loading ? "…" : metric.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{metric.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(9,23,51,0.95),rgba(12,37,70,0.92))] text-white shadow-[0_24px_60px_rgba(8,22,48,0.2)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
              Narrativa do produto
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-white">
              O app foi organizado para crescer em quatro frentes complementares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Gestão institucional da redução de filas, contratos e cobertura regional do SUS.",
              "Drive de conhecimento cirúrgico com trilhas, protocolos, materiais de apoio, casos e publicações.",
              "Diretório de médicos especialistas com identidade profissional, currículo e futura autenticação ampliada.",
              "Camada de network para conexão entre especialistas, parceiros, instituições e frentes acadêmicas.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-cyan-100">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-100/86">{item}</p>
              </div>
            ))}

            {loading ? (
              <div className="flex items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-5 text-sm text-slate-100/86">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consolidando visão executiva do aplicativo...
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
        <CardHeader>
          <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
            Mapa do workspace
          </CardDescription>
          <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
            Módulos-base da primeira fundação multiárea do app SINACE
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {workspaceEntries.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-border/80 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {item.group}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.label}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <Button asChild variant="outline" className="mt-5 border-primary/20 bg-white text-primary hover:bg-primary/5">
                  <Link href={item.path}>
                    Abrir módulo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="border-border/70 bg-white/82 shadow-[0_20px_48px_rgba(15,54,104,0.08)]">
          <CardHeader>
            <CardDescription className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Rede institucional
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Instituições já prontas para aparecer no ecossistema do aplicativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-[1.35rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando instituições...
              </div>
            ) : institutions.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-border/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
                Ainda não há instituições disponíveis para esta visualização.
              </div>
            ) : (
              institutions.slice(0, 4).map(item => (
                <div key={item.id} className="rounded-[1.35rem] border border-border/70 bg-slate-50/90 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.name}</h3>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">
                        {item.institutionType} · {item.city}/{item.state}
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      {item.status}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.capacityProfile || item.description || "Instituição preparada para operação assistencial e crescimento de rede."}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Especialidades", value: item.specialtiesCount ?? 0 },
                      { label: "Equipes", value: item.teamsCount ?? 0 },
                      { label: "Parceiro", value: item.partnerName || "Direto" },
                    ].map(metric => (
                      <div key={metric.label} className="rounded-[1rem] border border-border/70 bg-white px-4 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{metric.value}</p>
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
              Leitura da fila
            </CardDescription>
            <CardTitle className="text-2xl tracking-[-0.03em] text-slate-950">
              Casos recentes que ajudam a demonstrar pressão assistencial e oportunidade de redução de espera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-[1.35rem] border border-dashed border-border/80 bg-slate-50/80 text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando leitura da fila...
              </div>
            ) : queueEntries.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-border/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
                Ainda não há entradas recentes da fila disponíveis para esta visualização.
              </div>
            ) : (
              queueEntries.map(entry => (
                <div key={`${entry.patientCode}-${entry.specialtyName}`} className="rounded-[1.25rem] border border-border/70 bg-slate-50/90 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{entry.specialtyName}</h3>
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                          {queuePriorityLabel[entry.priority] ?? entry.priority}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
                          {queueStatusLabel[entry.status] ?? entry.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {entry.institutionName || "Instituição não informada"} · {entry.originCity || "Origem não informada"}/{entry.originState || "--"}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-border/70 bg-white px-4 py-3 text-right">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Tempo em espera</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{entry.waitingDays} dias</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </SinaceSectionShell>
  );
}
