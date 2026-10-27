import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";

/**
 * Barra de ações de formulário (Salvar, Enviar...) que fica fixa no rodapé visível enquanto o
 * formulário está na tela e sobe junto com o teclado virtual (ver useKeyboardAvoidance).
 */
export default function StickyFormActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="form-actions"
      className={cn(
        "form-actions-sticky flex flex-wrap items-center gap-3 rounded-tile border border-border/70 bg-white/95 p-3 shadow-raised backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
