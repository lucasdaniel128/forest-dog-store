export function trackFBEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, params);
}

export function trackFBCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", eventName, params);
}

export function trackGAEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push(["event", eventName, params]);
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  trackFBEvent(eventName, params);
  trackGAEvent(eventName, params);
}
