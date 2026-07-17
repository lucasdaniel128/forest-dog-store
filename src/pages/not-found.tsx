import { useNavigate } from "react-router-dom";
import { TreePine } from "lucide-react";
import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Página não encontrada"
        description="A página que você procura não existe ou foi movida."
      />
      <SiteHeader />
      <main className="bg-background">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
            <TreePine className="h-10 w-10 text-forest" aria-hidden="true" />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            404
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            A página que você procura não existe.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 rounded-xl bg-cta px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-hover"
          >
            VOLTAR PARA A LOJA
          </button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
