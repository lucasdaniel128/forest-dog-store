import { Link } from "react-router-dom";
import { SITE_CONFIG } from "@/constants";
import logoImg from "@/assets/images/forest-dog-logo-horizontal.png";

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
          <img
            src={logoImg}
            alt={SITE_CONFIG.name}
            className="h-8 max-h-10 w-auto object-contain"
          />

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
