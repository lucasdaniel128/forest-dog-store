import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function PoliticaDePrivacidadePage() {
  return (
    <>
      <SEO
        title="Política de Privacidade — Forest Dog"
        description="Política de privacidade da Forest Dog."
      />
      <SiteHeader />
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Política de Privacidade
          </h1>
          <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
            <p>
              A sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações dos usuários que acessam o site da Forest Dog.
            </p>
            <h2 className="text-lg font-bold text-foreground">Coleta de informações</h2>
            <p>
              Podemos coletar informações pessoais fornecidas voluntariamente pelos usuários, como nome, e-mail e dados de pagamento, exclusivamente para a finalização de pedidos e comunicação relacionada ao atendimento.
            </p>
            <h2 className="text-lg font-bold text-foreground">Uso das informações</h2>
            <p>
              As informações coletadas são utilizadas para processar pedidos, enviar comunicações sobre o status da entrega e melhorar a experiência de navegação no site.
            </p>
            <h2 className="text-lg font-bold text-foreground">Compartilhamento de dados</h2>
            <p>
              Não compartilhamos informações pessoais com terceiros para fins de marketing. Os dados podem ser compartilhados apenas com prestadores de serviços necessários para a execução do pedido, como transportadoras e gateways de pagamento.
            </p>
            <h2 className="text-lg font-bold text-foreground">Segurança</h2>
            <p>
              Adotamos medidas de segurança para proteger as informações dos usuários contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
            <h2 className="text-lg font-bold text-foreground">Direitos do usuário</h2>
            <p>
              O usuário pode solicitar a correção ou exclusão dos seus dados pessoais a qualquer momento, entrando em contato pelo canal de atendimento disponível no site.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
