import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Package } from "lucide-react";
import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

interface LocationState {
  orderId?: string;
  email?: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

export function RastrearPedidoPage() {
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const [code, setCode] = useState("");
  const hasOrderContext = Boolean(state.orderId);

  return (
    <>
      <SEO
        title="Rastrear Pedido — Forest Dog"
        description="Acompanhe o status do seu pedido."
      />
      <SiteHeader />
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Rastrear Pedido
          </h1>

          {hasOrderContext && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface-strong p-5">
              <Package className="mt-0.5 h-5 w-5 shrink-0 text-cta" aria-hidden="true" />
              <div className="flex flex-col gap-1 text-[14px]">
                <span className="font-medium text-foreground">
                  Pedido {state.orderId}
                </span>
                {state.email && (
                  <span className="text-muted">
                    {maskEmail(state.email)}
                  </span>
                )}
                <span className="mt-1 text-[13px] text-muted">
                  Pedido recebido. O código de rastreio ficará disponível após a postagem.
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
            {!hasOrderContext && (
              <p>
                Informe o código de rastreio enviado para o seu e-mail após a postagem do pedido.
              </p>
            )}

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
            >
              <div className="flex flex-col gap-1.5 sm:flex-1">
                <label
                  htmlFor="tracking-code"
                  className="text-sm font-medium text-foreground"
                >
                  Código de rastreio
                </label>
                <input
                  id="tracking-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: AB123456789BR"
                  className="h-12 rounded-xl border border-border bg-surface-strong px-4 text-[15px] text-foreground placeholder:text-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                />
              </div>
              <Button variant="cta" size="default" disabled>
                Rastrear pedido
              </Button>
            </form>

            <p className="text-[13px] text-muted/60">
              Rastreamento disponível após a integração do serviço.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
