import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";
import {
  getSinaceCacheKeys,
  shouldEnableSinaceServiceWorker,
} from "./lib/serviceWorker";

const queryClient = new QueryClient();
const PREVIEW_CACHE_RESET_FLAG = "sinace-preview-cache-reset";

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  // Comentado para evitar redirecionamento automático para a Manus
  // window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

function syncStandaloneState() {
  if (typeof window === "undefined") return;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  document.documentElement.dataset.displayMode = isStandalone ? "standalone" : "browser";
  document.body.classList.toggle("sinace-standalone", isStandalone);
}

async function clearSinaceCaches() {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  const keys = await window.caches.keys();
  const relevantKeys = getSinaceCacheKeys(keys);

  await Promise.all(relevantKeys.map(key => window.caches.delete(key)));

  return relevantKeys.length > 0;
}

async function disableServiceWorkerForPreview() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  const hadRegistrations = registrations.length > 0;

  await Promise.all(registrations.map(registration => registration.unregister()));

  const clearedCache = await clearSinaceCaches();

  if ((hadRegistrations || clearedCache) && !window.sessionStorage.getItem(PREVIEW_CACHE_RESET_FLAG)) {
    window.sessionStorage.setItem(PREVIEW_CACHE_RESET_FLAG, "1");
    window.location.reload();
    return;
  }

  window.sessionStorage.removeItem(PREVIEW_CACHE_RESET_FLAG);
}

function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      if (!shouldEnableSinaceServiceWorker(window.location.hostname)) {
        await disableServiceWorkerForPreview();
        return;
      }

      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (error) {
      console.error("[PWA] Falha ao configurar service worker", error);
    }
  });
}

syncStandaloneState();
if (typeof window !== "undefined") {
  window.matchMedia("(display-mode: standalone)").addEventListener("change", syncStandaloneState);
}
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
