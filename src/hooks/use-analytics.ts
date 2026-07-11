import { GA_MEASUREMENT_ID } from "@/constants";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function useAnalytics() {
  function trackPageView(pagePath: string, pageTitle?: string) {
    gtag("event", "page_view", {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  function trackEvent(
    eventName: string,
    params?: Record<string, unknown>
  ) {
    gtag("event", eventName, params);
  }

  function trackPurchase(value: number, transactionId: string) {
    gtag("event", "purchase", {
      value,
      transaction_id: transactionId,
    });
  }

  function trackBeginCheckout(value: number) {
    gtag("event", "begin_checkout", { value });
  }

  return { trackPageView, trackEvent, trackPurchase, trackBeginCheckout };
}
