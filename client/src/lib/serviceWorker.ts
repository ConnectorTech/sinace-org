const SERVICE_WORKER_CACHE_PREFIX = "sinace-pwa-";

export function shouldEnableSinaceServiceWorker(hostname: string) {
  const normalizedHostname = hostname.trim().toLowerCase();
  const isLocalHost = normalizedHostname === "localhost" || normalizedHostname === "127.0.0.1";
  const isPreviewHost = normalizedHostname.endsWith(".manus.computer");

  return !isLocalHost && !isPreviewHost;
}

export function getSinaceCacheKeys(keys: string[]) {
  return keys.filter(key => key.startsWith(SERVICE_WORKER_CACHE_PREFIX));
}

export { SERVICE_WORKER_CACHE_PREFIX };
