import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function TermosDeUsoPage() {
  return (
    <>
      <SEO
        title="Termos de Uso — Forest Dog"
        description="Termos de uso do site da Forest Dog."
      />
      <SiteHeader />
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Termos de Uso
          </h1>
          <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
            <p>
              Ao acessar o site da Forest Dog, você concorda com os termos e condições descritos nesta página. Recomendamos a leitura atenta antes de realizar qualquer compra.
            </p>
            <h2 className="text-lg font-bold text-foreground">Uso do site</h2>
            <p>
              O site destina-se à comercialização de produtos de uso ao ar livre. Ao utilizá-lo, o usuário compromete-se a fornecer informações verdadeiras e atualizadas durante o processo de compra.
            </p>
            <h2 className="text-lg font-bold text-foreground">Produtos e preços</h2>
            <p>
              Os preços e condições de pagamento são apresentados diretamente na página do produto. A Forest Dog reserva-se o direito de alterar preços e condições sem aviso prévio.
            </p>
            <h2 className="text-lg font-bold text-foreground">Pedidos</h2>
            <p>
              A confirmação do pedido está sujeita à disponibilidade do produto e à validação do pagamento. A Forest Dog poderá cancelar pedidos em caso de erro de preço ou indisponibilidade.
            </p>
            <h2 className="text-lg font-bold text-foreground">Propriedade intelectual</h2>
            <p>
              Todo o conteúdo do site, incluindo textos, imagens, logotipos e elementos visuais, é de propriedade da Forest Dog ou de seus licenciadores. É proibida a reprodução sem autorização prévia.
            </p>
            <h2 className="text-lg font-bold text-foreground">Isenção de responsabilidade</h2>
            <p>
              A Forest Dog não se responsabiliza por danos decorrentes do uso indevido dos produtos comercializados ou por informações prestadas de forma incorreta pelo usuário.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
