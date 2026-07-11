import { useEffect } from "react";
import { META_PIXEL_ID } from "@/constants";

export function useMetaPixel() {
  function trackEvent(eventName: string, params?: Record<string, unknown>) {
    if (typeof window === "undefined" || !META_PIXEL_ID) return;
    window.fbq("track", eventName, params);
  }

  function trackCustomEvent(
    eventName: string,
    params?: Record<string, unknown>
  ) {
    if (typeof window === "undefined" || !META_PIXEL_ID) return;
    window.fbq("trackCustom", eventName, params);
  }

  function trackPageView() {
    trackEvent("PageView");
  }

  return { trackEvent, trackCustomEvent, trackPageView };
}

export function useTrackPageView() {
  const { trackPageView } = useMetaPixel();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);
}
