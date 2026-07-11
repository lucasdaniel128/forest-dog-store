import { TreePine } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:h-[64px] sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white">
            <TreePine className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] leading-tight text-muted">
              {SITE_CONFIG.tagline}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
