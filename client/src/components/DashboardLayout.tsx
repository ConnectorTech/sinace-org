import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { sinaceNavigationGroups } from "@/lib/sinace-navigation";
import { SINACE_INSTITUTIONAL_PROFILE } from "@shared/sinaceCatalog";
import {
  ChevronRight,
  LogOut,
  PanelLeft,
  Search,
  ShieldCheck,
} from "lucide-react";
import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 300;
const MIN_WIDTH = 240;
const MAX_WIDTH = 420;

function getInitialSidebarWidth() {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  const saved = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
  return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
}

function isTextEntryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(getInitialSidebarWidth);
  const { loading, user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    if (import.meta.env.DEV) {
      return <DashboardLayoutSkeleton />;
    }
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-[2rem] border border-border/70 bg-white/88 p-8 shadow-[0_30px_80px_rgba(7,21,46,0.14)] backdrop-blur-sm">
          <span className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary">
            Workspace protegido
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Entre para acessar o ambiente operacional e educacional da SINACE.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            O workspace autenticado reúne dashboard, especialidades cirúrgicas, trilhas, biblioteca, rede institucional e administração da plataforma.
          </p>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="mt-8 rounded-full bg-primary px-6 text-primary-foreground shadow-lg hover:opacity-95"
          >
            Fazer login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const flatNavigation = useMemo(
    () => sinaceNavigationGroups.flatMap(group => group.items.map(item => ({ ...item, group: group.label }))),
    []
  );

  const activeMenuItem =
    flatNavigation.find(item => item.path === location) ??
    flatNavigation.find(item => location.startsWith(item.path) && item.path !== "/app") ??
    flatNavigation[0];

  const commandEntries = useMemo(
    () =>
      flatNavigation.map(item => ({
        ...item,
        searchValue: `${item.label} ${item.group} ${item.description} ${item.path}`,
      })),
    [flatNavigation]
  );

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      if (isTextEntryTarget(event.target)) return;

      event.preventDefault();
      setIsCommandOpen(current => !current);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = event.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r-0 bg-sidebar/95" disableTransition={isResizing}>
          <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-4">
            <div className="flex w-full items-start gap-3 px-1">
              <button
                onClick={toggleSidebar}
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-border/80 bg-white/70 text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Alternar navegação"
              >
                <PanelLeft className="h-4 w-4" />
              </button>

              {!isCollapsed ? (
                <div className="min-w-0 space-y-3">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sidebar-foreground/65">
                      Plataforma SINACE
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-sidebar-foreground">
                      Workspace assistencial
                    </h2>
                  </div>
                  <p className="text-sm leading-6 text-sidebar-foreground/72">
                    Operação, formação e governança cirúrgica em um mesmo ambiente autenticado.
                  </p>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 px-2 pb-3 pt-3">
            {!isCollapsed ? (
              <>
                <div className="mb-4 rounded-[1.5rem] border border-sidebar-border/70 bg-white/70 p-4 shadow-[0_16px_38px_rgba(15,54,104,0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
                        Contexto ativo
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {activeMenuItem?.description ??
                          "Navegação estratégica da plataforma unificada da SINACE."}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-primary/8 px-2.5 py-1 text-primary hover:bg-primary/8">
                      Beta estrutural
                    </Badge>
                  </div>
                </div>

                <div className="mb-4 rounded-[1.5rem] border border-sidebar-border/70 bg-[linear-gradient(180deg,rgba(7,24,52,0.96),rgba(12,37,70,0.92))] p-4 text-white shadow-[0_18px_42px_rgba(10,28,56,0.18)]">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
                    Identidade institucional
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100/86">
                    {SINACE_INSTITUTIONAL_PROFILE.socialObject}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {[
                      `Sede: ${SINACE_INSTITUTIONAL_PROFILE.headquarters}`,
                      `Contato: ${SINACE_INSTITUTIONAL_PROFILE.phone}`,
                      `E-mail: ${SINACE_INSTITUTIONAL_PROFILE.email}`,
                      `Instagram: ${SINACE_INSTITUTIONAL_PROFILE.instagram}`,
                    ].map(item => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-xs leading-5 text-slate-100/84">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {sinaceNavigationGroups.map(group => (
              <div key={group.label} className="mb-3">
                {!isCollapsed ? (
                  <p className="px-2 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/55">
                    {group.label}
                  </p>
                ) : null}
                <SidebarMenu className="gap-1 px-0 py-0">
                  {group.items.map(item => {
                    const isActive = location === item.path;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => setLocation(item.path)}
                          tooltip={item.label}
                          className="h-auto min-h-11 items-start gap-3 rounded-2xl px-3 py-3 font-normal data-[active=true]:bg-white data-[active=true]:text-primary data-[active=true]:shadow-[0_14px_34px_rgba(14,50,98,0.10)]"
                        >
                          <item.icon className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-sidebar-foreground/72"}`} />
                          <div className="min-w-0 text-left group-data-[collapsible=icon]:hidden">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium">{item.label}</span>
                              {item.requiresAdmin ? (
                                <Badge className="rounded-full bg-slate-900/8 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-slate-600 hover:bg-slate-900/8">
                                  Admin
                                </Badge>
                              ) : null}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-sidebar-foreground/58">
                              {item.description}
                            </p>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border/70 p-3">
            {!isCollapsed ? (
              <div className="mb-3 rounded-[1.35rem] border border-sidebar-border/70 bg-white/70 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
                    Perfil autenticado
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A plataforma já está preparada para evoluir permissões por papel, instituição e responsabilidade editorial.
                </p>
              </div>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-2xl border border-sidebar-border/70 bg-white/74 px-2 py-2 text-left transition-colors hover:bg-sidebar-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-data-[collapsible=icon]:justify-center">
                  <Avatar className="h-10 w-10 border border-sidebar-border/80 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {user?.name?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium leading-none text-slate-900">
                      {user?.name || "Usuário SINACE"}
                    </p>
                    <p className="mt-1.5 truncate text-xs text-slate-500">
                      {user?.email || "Conta autenticada"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div
          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors hover:bg-primary/20 ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        <div className="min-h-screen bg-[linear-gradient(180deg,rgba(246,250,255,0.72),rgba(238,246,252,0.92))]">
          <header className="sticky top-0 z-40 border-b border-border/70 bg-background/84 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-4 py-4 md:px-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                {isMobile ? <SidebarTrigger className="mt-1 h-9 w-9 rounded-xl bg-white/80 shadow-sm" /> : null}
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>Plataforma</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>{activeMenuItem?.group ?? "Workspace"}</span>
                  </div>
                  <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {activeMenuItem?.label ?? "Dashboard"}
                  </h1>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                    {activeMenuItem?.description ??
                      "Ambiente unificado para organizar operação, educação e expansão institucional da SINACE."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <button
                  type="button"
                  onClick={() => setIsCommandOpen(true)}
                  aria-label="Abrir busca global do workspace"
                  className="flex min-w-[240px] items-center justify-between gap-3 rounded-full border border-border/70 bg-white/84 px-4 py-2 text-left text-sm text-slate-500 shadow-[0_12px_28px_rgba(15,54,104,0.06)] transition hover:border-primary/30 hover:text-slate-700"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Search className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">Buscar módulos, áreas e atalhos</span>
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Ctrl K
                  </span>
                </button>
                <Badge className="rounded-full border border-cyan-200/60 bg-cyan-50 px-3 py-1 text-cyan-900 hover:bg-cyan-50">
                  Base pronta para dados reais
                </Badge>
              </div>
            </div>
          </header>

          <CommandDialog
            open={isCommandOpen}
            onOpenChange={setIsCommandOpen}
            title="Busca global do workspace"
            description="Navegue rapidamente entre módulos, áreas operacionais e ações institucionais da SINACE."
            className="max-w-2xl"
          >
            <CommandInput placeholder="Busque por módulo, área, rota ou ação rápida..." />
            <CommandList className="max-h-[420px]">
              <CommandEmpty>Nenhum resultado encontrado para sua busca.</CommandEmpty>
              <CommandGroup heading="Módulos do workspace">
                {commandEntries.map(item => (
                  <CommandItem
                    key={item.path}
                    value={item.searchValue}
                    onSelect={() => {
                      setIsCommandOpen(false);
                      setLocation(item.path);
                    }}
                    className="gap-3 rounded-xl px-3 py-3"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{item.label}</p>
                      <p className="truncate text-xs text-slate-500">{item.description}</p>
                    </div>
                    <CommandShortcut>{item.group}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Ações rápidas">
                <CommandItem
                  value="dashboard inicial home workspace app"
                  onSelect={() => {
                    setIsCommandOpen(false);
                    setLocation("/app");
                  }}
                  className="gap-3 rounded-xl px-3 py-3"
                >
                  <PanelLeft className="h-4 w-4 text-primary" />
                  <span className="font-medium text-slate-900">Voltar para o dashboard inicial</span>
                </CommandItem>
                <CommandItem
                  value="site publico home institucional sinace"
                  onSelect={() => {
                    setIsCommandOpen(false);
                    setLocation("/");
                  }}
                  className="gap-3 rounded-xl px-3 py-3"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium text-slate-900">Abrir site público da SINACE</span>
                </CommandItem>
                <CommandItem
                  value="sair logout encerrar sessao"
                  onSelect={() => {
                    setIsCommandOpen(false);
                    logout();
                  }}
                  className="gap-3 rounded-xl px-3 py-3"
                >
                  <LogOut className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-slate-900">Encerrar sessão</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
            <div className="mx-auto max-w-[1600px]">
              <div className="mb-6 rounded-[1.5rem] border border-border/70 bg-white/78 px-4 py-4 shadow-[0_18px_42px_rgba(15,54,104,0.06)] md:px-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-4xl">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
                      Estrutura ativa do produto
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      A navegação, a identidade visual e a organização modular do workspace já estão alinhadas ao posicionamento institucional e educacional da SINACE.
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      <span className="font-semibold text-slate-900">Objeto social:</span> {SINACE_INSTITUTIONAL_PROFILE.socialObject}
                    </p>
                  </div>
                  <div className="grid gap-2 text-xs leading-5 text-slate-600 md:grid-cols-2 xl:min-w-[420px]">
                    <div className="rounded-2xl border border-border/70 bg-slate-50/90 px-3 py-2">
                      <span className="font-semibold text-slate-900">CNPJ:</span> {SINACE_INSTITUTIONAL_PROFILE.cnpj}
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-slate-50/90 px-3 py-2">
                      <span className="font-semibold text-slate-900">Sede:</span> {SINACE_INSTITUTIONAL_PROFILE.headquarters}
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-slate-50/90 px-3 py-2">
                      <span className="font-semibold text-slate-900">Telefone:</span> {SINACE_INSTITUTIONAL_PROFILE.phone}
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-slate-50/90 px-3 py-2">
                      <span className="font-semibold text-slate-900">E-mail:</span> {SINACE_INSTITUTIONAL_PROFILE.email}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span className="rounded-full bg-primary/8 px-3 py-1 text-primary">Operação</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700">Aprendizagem</span>
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-700">Governança</span>
                  <span className="rounded-full bg-slate-900/8 px-3 py-1 text-slate-700">{SINACE_INSTITUTIONAL_PROFILE.instagram}</span>
                </div>
              </div>

              <Separator className="mb-6 opacity-60" />
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </>
  );
}
