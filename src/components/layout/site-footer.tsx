import { Link } from "react-router-dom";
import { TreePine } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

const LINKS = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Uso", href: "/termos-de-uso" },
  { label: "Trocas e Devoluções", href: "/trocas-e-devolucoes" },
  { label: "Contato", href: "/contato" },
  { label: "Rastrear Pedido", href: "/rastrear-pedido" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest text-white">
              <TreePine className="h-3.5 w-3.5" aria-hidden="true" />
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

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-center text-[11px] text-muted/50">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
