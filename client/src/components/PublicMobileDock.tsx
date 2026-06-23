import { cn } from "@/lib/utils";
import { SINACE_PUBLIC_NAV_ITEMS } from "@/lib/sinacePublicSite";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/$/, "");
}

export default function PublicMobileDock() {
  const [location] = useLocation();
  const pathname = normalizePath(location || "/");
  const [hash, setHash] = useState<string>(() =>
    typeof window === "undefined" ? "" : normalizePath(window.location.hash)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHash = () => {
      setHash(normalizePath(window.location.hash));
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  if (pathname.startsWith("/app") || pathname === "/404") {
    return null;
  }

  return (
    <nav
      aria-label="Navegação pública rápida do SINACE"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200/80 bg-white/94 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        {SINACE_PUBLIC_NAV_ITEMS.map(item => {
          const active =
            pathname === item.path ||
            (pathname === "/" && (hash ? hash === item.homeAnchor : item.path === "/proposta"));

          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex min-h-[4.25rem] flex-col items-center justify-center rounded-2xl px-2 py-2 text-center text-[0.7rem] font-semibold tracking-[0.02em] transition-colors",
                  active
                    ? "bg-slate-950 text-cyan-300 shadow-[0_12px_26px_rgba(8,27,54,0.2)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-[0.62rem] uppercase tracking-[0.18em] text-current/75">
                  Aba
                </span>
                <span className="mt-1 leading-tight">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
