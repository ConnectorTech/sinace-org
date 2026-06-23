import { Button } from "@/components/ui/button";
import { detectIosDevice, detectStandaloneMode, shouldRenderInstallPrompt } from "@/lib/pwa";
import { cn } from "@/lib/utils";
import { CheckCircle2, Download, PlusSquare, Share2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type DeferredInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "sinace-pwa-install-dismissed";

function getStandaloneMode() {
  if (typeof window === "undefined") return false;
  return detectStandaloneMode(
    window.matchMedia("(display-mode: standalone)").matches,
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
}

function getIosDevice() {
  if (typeof navigator === "undefined") return false;
  return detectIosDevice(navigator.userAgent);
}

export default function PwaInstallPrompt() {
  const [location] = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [standalone, setStandalone] = useState(getStandaloneMode);
  const ios = useMemo(getIosDevice, []);
  const isPublicRoute = !location.startsWith("/app") && location !== "/404";

  useEffect(() => {
    if (typeof window === "undefined") return;

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "true");

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as DeferredInstallPromptEvent);
    };

    const handleInstalled = () => {
      setStandalone(true);
      setDeferredPrompt(null);
      window.localStorage.removeItem(DISMISS_KEY);
    };

    const handleDisplayMode = () => {
      setStandalone(getStandaloneMode());
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.matchMedia("(display-mode: standalone)").addEventListener("change", handleDisplayMode);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.matchMedia("(display-mode: standalone)").removeEventListener("change", handleDisplayMode);
    };
  }, []);

  const hidePrompt = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "true");
    }
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setStandalone(true);
      setDismissed(false);
    }
    setDeferredPrompt(null);
  };

  if (standalone) {
    return (
      <div
        className={cn(
          "fixed inset-x-0 z-[80] px-4 pointer-events-none",
          isPublicRoute ? "bottom-[5.75rem]" : "bottom-4"
        )}
      >
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-[1.6rem] border border-emerald-300/45 bg-emerald-50/95 px-4 py-3 text-emerald-950 shadow-[0_18px_38px_rgba(4,72,48,0.16)] backdrop-blur-xl pointer-events-auto">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-emerald-700">App ativo</p>
            <p className="mt-1 text-sm leading-6 text-emerald-900">O SINACE está aberto como aplicativo na tela inicial deste dispositivo.</p>
          </div>
        </div>
      </div>
    );
  }

  if (
    !shouldRenderInstallPrompt({
      standalone,
      dismissed,
      ios,
      hasDeferredPrompt: Boolean(deferredPrompt),
    })
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-[80] px-3 pt-3 md:px-6",
        isPublicRoute
          ? "bottom-[4.9rem] pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          : "bottom-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      )}
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.9rem] border border-primary/12 bg-[linear-gradient(180deg,rgba(7,24,51,0.96),rgba(10,35,71,0.94))] text-white shadow-[0_28px_70px_rgba(8,27,54,0.32)] backdrop-blur-xl">
        <div className="flex items-start gap-4 px-4 py-4 md:px-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
            {ios ? <Share2 className="h-5 w-5" /> : <Download className="h-5 w-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-200/90">Modo app no iPhone</p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white md:text-xl">Instale o SINACE na tela inicial para usar como app.</h2>
              </div>
              <button
                type="button"
                onClick={hidePrompt}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/6 text-slate-100 transition-colors hover:bg-white/10"
                aria-label="Fechar orientação de instalação"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {ios ? (
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-200">
                <p>
                  No Safari do iPhone, toque em <span className="font-semibold text-white">Compartilhar</span>, depois escolha <span className="font-semibold text-white">Adicionar à Tela de Início</span>. O SINACE abrirá em tela cheia, com ícone próprio e aparência de aplicativo nativo.
                </p>
                <div className="grid gap-2 md:grid-cols-3">
                  {[
                    { label: "1", icon: Share2, text: "Abra o menu Compartilhar no Safari." },
                    { label: "2", icon: PlusSquare, text: "Selecione Adicionar à Tela de Início." },
                    { label: "3", icon: CheckCircle2, text: "Confirme e abra o app pelo novo ícone SINACE." },
                  ].map(step => (
                    <div key={step.label} className="rounded-[1.25rem] border border-white/12 bg-white/6 px-3 py-3">
                      <div className="flex items-center gap-2 text-cyan-200">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/16 text-[0.72rem] font-semibold">{step.label}</span>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-100">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-3 text-sm leading-6 text-slate-200 md:flex-row md:items-center md:justify-between">
                <p className="max-w-xl">
                  O navegador detectou suporte à instalação direta. Ao instalar, o SINACE passa a abrir como aplicativo independente, com cache básico offline e acesso rápido pela tela inicial.
                </p>
                <Button
                  onClick={handleInstall}
                  className={cn(
                    "rounded-full bg-cyan-300 px-5 text-slate-950 shadow-lg hover:bg-cyan-200",
                    !deferredPrompt && "pointer-events-none opacity-60"
                  )}
                >
                  Instalar aplicativo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
