import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function ContatoPage() {
  return (
    <>
      <SEO
        title="Contato — Forest Dog"
        description="Canal de atendimento da Forest Dog."
      />
      <SiteHeader />
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Contato
          </h1>
          <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
            <p>
              Para dúvidas sobre pedidos, devoluções ou informações gerais, utilize o canal de atendimento disponível nesta página.
            </p>
            <p>
              Nosso time retornará o mais breve possível.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
