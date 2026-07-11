import { TreePine, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest text-white">
            <TreePine className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] leading-tight text-muted-custom">
              {SITE_CONFIG.tagline}
            </span>
          </div>
        </div>

        <a
          href="#"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-background hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Atendimento
        </a>
      </div>
    </header>
  );
}
