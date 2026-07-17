import { TreePine } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:h-[64px] sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-white shadow-sm shadow-forest/15">
            <TreePine className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-[21px] font-semibold tracking-tight text-foreground">
            {SITE_CONFIG.name}
          </span>
        </div>
      </div>
    </header>
  );
}
