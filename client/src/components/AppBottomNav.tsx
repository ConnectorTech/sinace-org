import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getActiveBottomNavAxis,
  getBottomNavMoreGroups,
  SINACE_BOTTOM_NAV_MORE_ICON as MoreIcon,
  sinaceBottomNavAxes,
} from "@/lib/sinace-navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "wouter";

const moreGroups = getBottomNavMoreGroups();

/**
 * Bottom Navigation Bar fixa do workspace autenticado (mobile/tablet).
 * Quatro eixos principais + "Mais", que agrupa os demais módulos.
 */
export default function AppBottomNav() {
  const [location, setLocation] = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const activeAxis = getActiveBottomNavAxis(location);
  const isMoreActive = isMoreOpen || activeAxis === null;

  const navigate = (path: string) => {
    setIsMoreOpen(false);
    setLocation(path);
  };

  const tabClassName = (active: boolean) =>
    cn(
      "pressable flex min-h-[3.75rem] flex-col items-center justify-center gap-1 rounded-tile px-1 py-2 text-center text-[0.68rem] font-semibold tracking-[0.02em] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96]",
      active
        ? "bg-primary/10 text-primary"
        : "text-slate-600 hover:bg-tile hover:text-slate-950"
    );

  return (
    <>
      <nav
        aria-label="Navegação principal do workspace SINACE"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/94 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pt-2 shadow-[0_-8px_24px_rgba(15,54,104,0.07)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
          {sinaceBottomNavAxes.map(axis => {
            const active = !isMoreOpen && activeAxis?.key === axis.key;
            return (
              <button
                key={axis.key}
                type="button"
                onClick={() => navigate(axis.path)}
                className={tabClassName(active)}
                aria-current={active ? "page" : undefined}
              >
                <axis.icon className={cn("h-5 w-5 transition-transform duration-200", active && "scale-110")} />
                <span className="leading-tight">{axis.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={tabClassName(isMoreActive)}
            aria-haspopup="dialog"
            aria-expanded={isMoreOpen}
          >
            <MoreIcon className={cn("h-5 w-5 transition-transform duration-200", isMoreActive && "scale-110")} />
            <span className="leading-tight">Mais</span>
          </button>
        </div>
      </nav>

      <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[calc(85dvh-env(safe-area-inset-top))] gap-0 rounded-t-[1.5rem] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
        >
          <SheetHeader className="shrink-0 gap-1 border-b border-slate-200/80 px-5 pb-4 pr-12 pt-5">
            <SheetTitle className="text-base leading-6">Mais módulos</SheetTitle>
            <SheetDescription className="text-sm leading-5">
              Acesse os demais módulos e áreas da plataforma SINACE.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 pb-4 pt-4">
            {moreGroups.map(group => (
              <div key={group.label}>
                <p className="app-eyebrow px-2 pb-2 text-slate-500">
                  {group.label}
                </p>
                <div className="grid gap-1">
                  {group.items.map(item => {
                    const active = location === item.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => navigate(item.path)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "pressable flex min-h-11 items-center gap-3 rounded-tile px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active ? "bg-primary/8 text-primary" : "hover:bg-tile"
                        )}
                      >
                        <item.icon
                          className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-slate-500")}
                        />
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-sm font-medium leading-5",
                            active ? "text-primary" : "text-slate-900"
                          )}
                        >
                          {item.label}
                        </span>
                        {item.requiresAdmin ? (
                          <Badge className="app-eyebrow shrink-0 rounded-full bg-slate-900/8 px-2 py-0.5 text-[0.62rem] text-slate-600 hover:bg-slate-900/8">
                            Admin
                          </Badge>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
