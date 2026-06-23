export function detectStandaloneMode(
  matchesDisplayMode: boolean,
  navigatorStandalone?: boolean
) {
  return matchesDisplayMode || Boolean(navigatorStandalone);
}

export function detectIosDevice(userAgent: string) {
  return /iphone|ipad|ipod/i.test(userAgent);
}

export function shouldRenderInstallPrompt(params: {
  standalone: boolean;
  dismissed: boolean;
  ios: boolean;
  hasDeferredPrompt: boolean;
}) {
  if (params.standalone) return false;
  if (params.dismissed) return false;
  if (params.ios) return true;
  return params.hasDeferredPrompt;
}
