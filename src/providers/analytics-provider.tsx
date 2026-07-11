import { useEffect } from "react";
import { GA_MEASUREMENT_ID } from "@/constants";

function initGA(): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    initGA();
  }, []);

  return <>{children}</>;
}
