import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function TrocasEDevolucoesPage() {
  return (
    <>
      <SEO
        title="Trocas e Devoluções — Forest Dog"
        description="Política de trocas e devoluções da Forest Dog."
      />
      <SiteHeader />
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Trocas e Devoluções
          </h1>
          <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
            <h2 className="text-lg font-bold text-foreground">Direito de arrependimento</h2>
            <p>
              Conforme o Código de Defesa do Consumidor, você pode solicitar a devolução do produto em até 7 dias corridos após o recebimento, independentemente do motivo.
            </p>
            <h2 className="text-lg font-bold text-foreground">Como solicitar</h2>
            <p>
              Para iniciar o processo de devolução, entre em contato pelo canal de atendimento informado no site. Será orientado sobre os próximos passos.
            </p>
            <h2 className="text-lg font-bold text-foreground">Condições do produto</h2>
            <p>
              O produto deve ser devolvido em suas condições originais, sem sinais de uso e com todos os acessórios acompanham a embalagem.
            </p>
            <h2 className="text-lg font-bold text-foreground">Reembolso</h2>
            <p>
              Após a confirmação da devolução, o reembolso será processado conforme o método de pagamento utilizado. Os prazos serão informados no momento da solicitação.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
