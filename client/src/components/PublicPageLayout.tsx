import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SINACE_PUBLIC_IMAGES,
  SINACE_PUBLIC_NAV_ITEMS,
} from "@/lib/sinacePublicSite";
import { SINACE_INSTITUTIONAL_PROFILE } from "@shared/sinaceCatalog";
import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/$/, "");
}

export default function PublicPageLayout({
  children,
  pageTitle,
  pageDescription,
}: {
  children: ReactNode;
  pageTitle: string;
  pageDescription: string;
}) {
  const [location] = useLocation();
  const pathname = normalizePath(location || "/");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f8fc_0%,#ffffff_18%,#f8fbff_100%)] text-slate-950 pb-28 lg:pb-0">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-4 py-3.5">
          <Link href="/">
            <a className="flex min-w-0 items-center gap-3 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_28px_rgba(15,23,42,0.1)]">
                <img src={SINACE_PUBLIC_IMAGES.logo} alt="Marca SINACE" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold tracking-[0.24em] text-slate-900 uppercase">SINACE</p>
                <p className="truncate text-[0.68rem] text-slate-500">{SINACE_INSTITUTIONAL_PROFILE.extendedName}</p>
              </div>
            </a>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
            <Link href="/">
              <a
                className={cn(
                  "anchor-link transition-colors",
                  pathname === "/" ? "font-semibold text-cyan-600" : "font-medium text-slate-600 hover:text-cyan-600"
                )}
              >
                Home
              </a>
            </Link>
            {SINACE_PUBLIC_NAV_ITEMS.map(item => {
              const active = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "anchor-link transition-colors",
                      active ? "font-semibold text-cyan-600" : "font-medium text-slate-600 hover:text-cyan-600"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="outline" className="rounded-full border-slate-300 bg-transparent px-5 text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900">
              <Link href="/app">Entrar no workspace</Link>
            </Button>
            <Button asChild className="rounded-full bg-cyan-300 px-6 text-slate-950 font-semibold hover:bg-cyan-200">
              <Link href="/contato">Apresentar proposta</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.04),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.03),transparent_40%)]" />
        <div className="container relative grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:py-20">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-cyan-700 text-center">SINACE • ambiente institucional</p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] md:text-6xl mx-auto text-center text-slate-950">{pageTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg mx-auto text-center">{pageDescription}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 backdrop-blur-md shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-700">Base institucional</p>
            <dl className="mt-6 space-y-4 text-sm text-slate-600">
              <div>
                <dt className="text-slate-500">Sede base</dt>
                <dd className="mt-1 text-base font-medium text-slate-900">{SINACE_INSTITUTIONAL_PROFILE.headquarters}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Contato</dt>
                <dd className="mt-1 text-base font-medium text-slate-900">{SINACE_INSTITUTIONAL_PROFILE.phone}</dd>
                <dd className="text-sm text-cyan-700">{SINACE_INSTITUTIONAL_PROFILE.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Escopo</dt>
                <dd className="mt-1 leading-6 text-slate-700">Todas as cirurgias, convencionais e laparoscópicas, com atuação ambulatorial e hospitalar.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white pb-28 pt-16 lg:pb-16 text-slate-600">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 font-bold">
              {SINACE_INSTITUTIONAL_PROFILE.extendedName}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-500 max-w-2xl mx-auto">
              {SINACE_INSTITUTIONAL_PROFILE.socialObject}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <a href={`tel:+55${SINACE_INSTITUTIONAL_PROFILE.phone.replace(/\D/g, "")}`} className="hover:text-cyan-600 transition-colors">
              {SINACE_INSTITUTIONAL_PROFILE.phone}
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <a href={`mailto:${SINACE_INSTITUTIONAL_PROFILE.email}`} className="hover:text-cyan-600 transition-colors">
              {SINACE_INSTITUTIONAL_PROFILE.email}
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>{SINACE_INSTITUTIONAL_PROFILE.headquarters}</span>
          </div>

          <p className="text-xs text-slate-400">
            CNPJ {SINACE_INSTITUTIONAL_PROFILE.cnpj}
          </p>
        </div>
      </footer>
    </div>
  );
}
