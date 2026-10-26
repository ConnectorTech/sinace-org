import React, { type ReactNode, useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import { ChevronRight } from "lucide-react";

const clampClassName = {
  2: "line-clamp-2",
  3: "line-clamp-3",
} as const;

type ExpandableTextProps = {
  text: string;
  /** Título exibido no topo do Sheet com o conteúdo completo. */
  title: string;
  /** Linha de contexto curta abaixo do título (especialidade, tipo, autor...). */
  subtitle?: string;
  lines?: 2 | 3;
  className?: string;
  /** Conteúdo extra mostrado apenas no Sheet; quando presente, o botão de abertura fica sempre visível. */
  details?: ReactNode;
  triggerLabel?: string;
};

/**
 * Texto truncado com line-clamp que abre o conteúdo completo em um Sheet:
 * bottom sheet no mobile e painel lateral a partir do tablet.
 */
export function ExpandableText({
  text,
  title,
  subtitle,
  lines = 3,
  className = "text-sm leading-6 text-slate-600",
  details,
  triggerLabel,
}: ExpandableTextProps) {
  const isMobile = useIsMobile();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const measure = () => setIsClamped(element.scrollHeight - element.clientHeight > 1);
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  const canExpand = isClamped || Boolean(details);

  return (
    <>
      <p ref={textRef} className={`${clampClassName[lines]} ${className}`}>
        {text}
      </p>
      {canExpand ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pressable mt-1.5 inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:text-primary/80"
        >
          {triggerLabel ?? (isClamped ? "Ler mais" : "Ver detalhes")}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={
            isMobile
              ? "max-h-[85dvh] gap-0 rounded-t-[1.5rem] pb-[env(safe-area-inset-bottom)]"
              : "w-full gap-0 sm:max-w-md"
          }
        >
          {isMobile ? <div aria-hidden="true" className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-slate-200" /> : null}
          <SheetHeader className="border-b border-border/60 px-5 pb-4 pt-5 pr-12">
            {subtitle ? (
              <p className="app-label text-primary">{subtitle}</p>
            ) : null}
            <SheetTitle className="text-lg leading-7 tracking-[-0.02em] text-slate-950">{title}</SheetTitle>
            <SheetDescription className="sr-only">Conteúdo completo</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <p className="whitespace-pre-line text-[0.95rem] leading-7 text-slate-700">{text}</p>
            {details}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
