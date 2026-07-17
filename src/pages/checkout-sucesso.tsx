import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TreePine, CheckCircle, Package } from "lucide-react";
import { SEO } from "@/components/seo";
import { ProgressBar } from "@/components/checkout/progress-bar";
import { SITE_CONFIG } from "@/constants";
import { formatPrice, loadValidConfirmation } from "@/lib/checkout-utils";

export function CheckoutSucessoPage() {
  const navigate = useNavigate();
  const data = loadValidConfirmation();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, [data, navigate]);

  if (!data) return null;

  const confirmation = data;

  const maskedEmail = (() => {
    const [local, domain] = confirmation.customerEmail.split("@");
    if (!local || !domain) return confirmation.customerEmail;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
  })();

  function handleTrackOrder() {
    navigate("/rastrear-pedido", {
      state: { orderId: confirmation.orderId, email: confirmation.customerEmail },
    });
  }

  return (
    <>
      <SEO
        title="Pagamento Confirmado — Forest Dog"
        description="Seu pagamento foi confirmado com sucesso."
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:h-[64px] sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <TreePine className="h-5 w-5 text-forest" aria-hidden="true" />
            <span className="font-bold tracking-tight text-foreground">
              {SITE_CONFIG.name}
            </span>
          </button>
        </div>
      </header>

      <main className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="mb-8">
            <ProgressBar currentStep={3} />
          </div>

          <div className="flex flex-col items-center gap-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div
                ref={titleRef}
                tabIndex={-1}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 outline-none"
              >
                <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Pagamento recebido
                </h1>
                <p className="text-[15px] text-muted">
                  Seu pedido foi registrado.
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-strong p-6 text-left">
              <div className="flex flex-col gap-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-muted">Produto</span>
                  <span className="font-medium text-foreground">
                    {data.productName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total</span>
                  <span className="text-base font-extrabold text-foreground">
                    {formatPrice(data.totalCents)}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Pedido</span>
                    <span className="font-medium text-foreground">
                      {data.orderId}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">E-mail</span>
                  <span className="font-medium text-foreground">
                    {maskedEmail}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-strong p-6 text-left">
              <h2 className="text-sm font-bold tracking-tight text-foreground">
                Próximos passos
              </h2>
              <ol className="mt-4 flex flex-col gap-4 text-[13px] text-muted">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand text-[11px] font-bold text-foreground">
                    1
                  </span>
                  <span className="flex-1">
                    Seu pedido foi recebido e seguirá para preparação.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand text-[11px] font-bold text-foreground">
                    2
                  </span>
                  <span className="flex-1">
                    Você poderá acompanhar as próximas atualizações usando o número do pedido.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand text-[11px] font-bold text-foreground">
                    3
                  </span>
                  <span className="flex-1">
                    O código de rastreio ficará disponível após a postagem.
                  </span>
                </li>
              </ol>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
              <button
                onClick={handleTrackOrder}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <Package className="h-4 w-4" aria-hidden="true" />
                ACOMPANHAR PEDIDO
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-hover"
              >
                VOLTAR PARA A LOJA
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
