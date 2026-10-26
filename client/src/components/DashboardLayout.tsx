import { useAuth } from "@/_core/hooks/useAuth";
import AppBottomNav from "@/components/AppBottomNav";
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
import {
  ChevronRight,
  Info,
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
    window.location.href = "/auth";
    return null;
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
  const isHeaderCompact = useCompactHeaderOnScroll();
  const isMacPlatform = useMemo(
    () => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent),
    []
  );

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

  // Cada módulo abre no topo; o layout persiste entre rotas, então a rolagem não é resetada sozinha.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

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
                className="pressable mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-chip border border-sidebar-border/80 bg-white/70 text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Alternar navegação"
              >
                <img src="/images/sinace-logo.png" alt="Marca SINACE" className="h-6 w-6 object-contain" />
              </button>

              {!isCollapsed ? (
                <div className="min-w-0 space-y-1">
                  <h2 className="text-base font-bold tracking-[-0.03em] text-sidebar-foreground">
                    SINACE
                  </h2>
                  <p className="text-xs leading-5 text-sidebar-foreground/72">
                    Workspace assistencial &amp; governança cirúrgica.
                  </p>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 px-2 pb-3 pt-3">
            {sinaceNavigationGroups.map(group => (
              <div key={group.label} className="mb-3">
                {!isCollapsed ? (
                  <p className="app-eyebrow px-2 pb-2 text-sidebar-foreground/55">
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
                          tooltip={{
                            hidden: isMobile,
                            className: "max-w-64",
                            children: isCollapsed ? (
                              <div>
                                <p className="font-semibold">{item.label}</p>
                                <p className="mt-0.5 opacity-80">{item.description}</p>
                              </div>
                            ) : (
                              item.description
                            ),
                          }}
                          className="pressable h-10 gap-3 rounded-tile px-3 font-normal data-[active=true]:bg-white data-[active=true]:text-primary data-[active=true]:shadow-soft"
                        >
                          <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-sidebar-foreground/72"}`} />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                          {item.requiresAdmin ? (
                            <Badge className="app-eyebrow shrink-0 rounded-full bg-slate-900/8 px-2 py-0.5 text-[0.62rem] text-slate-600 hover:bg-slate-900/8 group-data-[collapsible=icon]:hidden">
                              Admin
                            </Badge>
                          ) : null}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border/70 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="pressable flex w-full items-center gap-3 rounded-tile border border-sidebar-border/70 bg-white px-2 py-2 text-left hover:bg-sidebar-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-data-[collapsible=icon]:justify-center">
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
                <DropdownMenuItem onClick={() => setLocation("/app/sobre")} className="cursor-pointer">
                  <Info className="mr-2 h-4 w-4" />
                  <span>Sobre a SINACE</span>
                </DropdownMenuItem>
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
        <div className="min-h-screen bg-background">
          <header
            data-compact={isHeaderCompact}
            className={`sticky top-0 z-40 border-b bg-background/84 pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none ${
              isHeaderCompact
                ? "border-border/70 shadow-raised"
                : "border-transparent"
            }`}
          >
            <div
              className={`pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] transition-[padding] duration-200 motion-reduce:transition-none md:px-6 ${
                isHeaderCompact ? "py-2" : "py-3 md:py-4"
              }`}
            >
              <div className="flex items-center gap-3">
                {isMobile ? <SidebarTrigger className="pressable h-10 w-10 shrink-0 rounded-chip border border-border/70 bg-white shadow-sm" /> : null}

                <div className="min-w-0 flex-1">
                  <CollapsibleRow open={!isHeaderCompact}>
                    <div className="flex min-w-0 items-center gap-2 pb-0.5 text-xs text-slate-500">
                      <span className="truncate font-medium">{activeMenuItem?.group ?? "Workspace"}</span>
                      {activeMenuItem?.requiresAdmin ? (
                        <span className="app-eyebrow shrink-0 rounded-full border border-slate-200 bg-white px-2 py-px text-[0.62rem] text-slate-500">
                          Admin
                        </span>
                      ) : null}
                      <span className="app-eyebrow hidden shrink-0 items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-px text-[0.62rem] text-emerald-800 sm:inline-flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-biomedical" aria-hidden="true" />
                        Beta
                      </span>
                    </div>
                  </CollapsibleRow>
                  <h1
                    className={`truncate font-semibold tracking-[-0.04em] text-slate-950 transition-[font-size,line-height] duration-200 motion-reduce:transition-none ${
                      isHeaderCompact ? "text-base leading-6 md:text-lg" : "text-2xl leading-8 md:text-[1.75rem] md:leading-9"
                    }`}
                  >
                    {activeMenuItem?.label ?? "Dashboard"}
                  </h1>
                </div>

                {isMobile ? (
                  <button
                    type="button"
                    onClick={() => setIsCommandOpen(true)}
                    aria-label="Abrir busca global do workspace"
                    className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-chip border border-border/70 bg-white text-slate-600 shadow-sm hover:border-primary/30 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCommandOpen(true)}
                    aria-label="Abrir busca global do workspace"
                    aria-keyshortcuts={isMacPlatform ? "Meta+K" : "Control+K"}
                    className="pressable flex w-[260px] shrink-0 items-center justify-between gap-3 rounded-full border border-border/70 bg-white px-4 py-2 text-left text-sm text-slate-500 shadow-soft hover:border-primary/30 hover:text-slate-700 lg:w-[300px]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Search className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">Buscar módulos e atalhos</span>
                    </span>
                    <kbd className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-sans text-[0.68rem] font-semibold tracking-[0.08em] text-slate-500">
                      {isMacPlatform ? "⌘ K" : "Ctrl K"}
                    </kbd>
                  </button>
                )}
              </div>

              <CollapsibleRow open={!isHeaderCompact}>
                <p className={`line-clamp-2 max-w-3xl pt-1 md:line-clamp-none text-sm leading-6 text-slate-600 ${isMobile ? "pl-[3.25rem]" : ""}`}>
                  {activeMenuItem?.description ??
                    "Ambiente unificado para organizar operação, educação e expansão institucional da SINACE."}
                </p>
              </CollapsibleRow>
            </div>
          </header>

          <CommandDialog
            open={isCommandOpen}
            onOpenChange={setIsCommandOpen}
            title="Busca global do workspace"
            description="Navegue rapidamente entre módulos, áreas operacionais e ações institucionais da SINACE."
            className="max-w-2xl max-md:top-[calc(0.75rem+env(safe-area-inset-top))] max-md:max-w-[calc(100%-1.5rem)] max-md:translate-y-0"
          >
            <CommandInput
              placeholder={isMobile ? "Buscar módulos e ações..." : "Busque por módulo, área, rota ou ação rápida..."}
              className="max-md:text-base"
            />
            <CommandList className="max-h-[420px] max-md:max-h-[calc(100dvh-8rem)]">
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
                    className="gap-3 rounded-chip px-3 py-3"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{item.label}</p>
                      <p className="truncate text-xs text-slate-500">{item.description}</p>
                    </div>
                    <CommandShortcut className="max-md:hidden">{item.group}</CommandShortcut>
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
                  className="gap-3 rounded-chip px-3 py-3"
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
                  className="gap-3 rounded-chip px-3 py-3"
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
                  className="gap-3 rounded-chip px-3 py-3"
                >
                  <LogOut className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-slate-900">Encerrar sessão</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <main className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-5 md:px-6 md:py-6">
            {/* A key reinicia só a animação de entrada do módulo, sem remontar o shell do workspace. */}
            <div
              key={location}
              className="mx-auto max-w-[1600px] animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out motion-reduce:animate-none"
            >
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>

      <AppBottomNav />
    </>
  );
}

const HEADER_COMPACT_AT = 96;
const HEADER_EXPAND_AT = 8;

/**
 * Recolhe o cabeçalho (Large Title → Top Bar) ao rolar a página.
 * Usa histerese para evitar oscilação quando a altura do cabeçalho muda.
 */
function useCompactHeaderOnScroll() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setIsCompact(current => (current ? y > HEADER_EXPAND_AT : y > HEADER_COMPACT_AT));
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return isCompact;
}

function CollapsibleRow({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
