import { installKeyboardAvoidance } from "@/lib/keyboardAvoidance";
import { useEffect } from "react";

/** Mantém o campo ativo e a barra de ações (Salvar) visíveis com o teclado virtual aberto. */
export function useKeyboardAvoidance() {
  useEffect(() => installKeyboardAvoidance(window), []);
}
