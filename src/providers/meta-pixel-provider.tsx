import { useEffect } from "react";
import { META_PIXEL_ID } from "@/constants";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq?: Window["fbq"];
  }
}

let initialized = false;

function initMetaPixel(): void {
  if (!META_PIXEL_ID || typeof window === "undefined" || initialized) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq = function () {
    window.fbq = function () {};
  };

  window.fbq("init", META_PIXEL_ID);
}

interface MetaPixelProviderProps {
  children: React.ReactNode;
}

export function MetaPixelProvider({ children }: MetaPixelProviderProps) {
  useEffect(() => {
    initMetaPixel();
  }, []);

  return <>{children}</>;
}
