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
      title="Panorama do workspace"
      description="Rede, acervo e fila cirúrgica em uma leitura única."
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
      <Card>
        <CardHeader>
          <CardDescription className="app-label text-primary">
            Síntese executiva
          </CardDescription>
          <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
            Vetores principais já conectados ao aplicativo
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map(metric => (
            <div key={metric.label} className="rounded-tile border border-border/70 bg-tile p-4">
              <p className="app-label text-primary">{metric.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                {loading ? "…" : metric.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{metric.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="app-label text-primary">
            Mapa do workspace
          </CardDescription>
          <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
            Módulos-base da primeira fundação multiárea do app SINACE
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {workspaceEntries.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="flex flex-col items-start rounded-tile border border-border/70 bg-tile p-4">
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-chip bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-6 tracking-[-0.02em] text-slate-950">{item.label}</h3>
                    <p className="app-label text-slate-500">{item.group}</p>
                  </div>
                </div>
                <p className="mb-4 mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <Button asChild variant="outline" size="sm" className="mt-auto border-primary/20 bg-white text-primary hover:bg-primary/5">
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start">
        <Card>
          <CardHeader>
            <CardDescription className="app-label text-primary">
              Rede institucional
            </CardDescription>
            <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
              Instituições já prontas para aparecer no ecossistema do aplicativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-tile border border-dashed border-border/80 bg-tile text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando instituições...
              </div>
            ) : institutions.length === 0 ? (
              <div className="rounded-tile border border-dashed border-border/80 bg-tile p-5 text-sm leading-6 text-slate-600">
                Ainda não há instituições disponíveis para esta visualização.
              </div>
            ) : (
              institutions.slice(0, 4).map(item => (
                <div key={item.id} className="rounded-tile border border-border/70 bg-tile p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.name}</h3>
                      <p className="app-label mt-2 text-primary/70">
                        {item.institutionType} · {item.city}/{item.state}
                      </p>
                    </div>
                    <div className="app-eyebrow rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
                      {item.status}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.capacityProfile || item.description || "Instituição preparada para operação assistencial e crescimento de rede."}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Especialidades", value: item.specialtiesCount ?? 0 },
                      { label: "Equipes", value: item.teamsCount ?? 0 },
                      { label: "Parceiro", value: item.partnerName || "Direto" },
                    ].map(metric => (
                      <div key={metric.label} className="rounded-chip border border-border/70 bg-white px-4 py-3">
                        <p className="app-label text-slate-500">{metric.label}</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="app-label text-primary">
              Leitura da fila
            </CardDescription>
            <CardTitle className="text-xl leading-7 tracking-[-0.03em] text-slate-950">
              Casos recentes que ajudam a demonstrar pressão assistencial e oportunidade de redução de espera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-tile border border-dashed border-border/80 bg-tile text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando leitura da fila...
              </div>
            ) : queueEntries.length === 0 ? (
              <div className="rounded-tile border border-dashed border-border/80 bg-tile p-5 text-sm leading-6 text-slate-600">
                Ainda não há entradas recentes da fila disponíveis para esta visualização.
              </div>
            ) : (
              queueEntries.map(entry => (
                <div key={`${entry.patientCode}-${entry.specialtyName}`} className="rounded-tile border border-border/70 bg-tile p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{entry.specialtyName}</h3>
                        <span className="app-eyebrow rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-700">
                          {queuePriorityLabel[entry.priority] ?? entry.priority}
                        </span>
                        <span className="app-eyebrow rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                          {queueStatusLabel[entry.status] ?? entry.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {entry.institutionName || "Instituição não informada"} · {entry.originCity || "Origem não informada"}/{entry.originState || "--"}
                      </p>
                    </div>
                    <div className="rounded-chip border border-border/70 bg-white px-4 py-3 text-right">
                      <p className="app-label text-slate-500">Tempo em espera</p>
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
