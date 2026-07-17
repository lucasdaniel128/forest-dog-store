import { PRODUCT } from "@/constants";
import { formatPrice, PRODUCT_PRICE_CENTS } from "@/lib/checkout-utils";
import productImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

const paymentLabels: Record<string, string> = {
  pix: "Pix",
  card: "Cartão de crédito",
  boleto: "Boleto bancário",
};

interface OrderSummaryProps {
  paymentMethod?: string;
}

export function OrderSummary({ paymentMethod = "pix" }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-strong p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
        Resumo do pedido
      </h3>

      <div className="mt-4 flex gap-3.5">
        <img
          src={productImage}
          alt={PRODUCT.name}
          className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <span className="text-[13px] font-semibold leading-tight text-foreground">
            {PRODUCT.name}
          </span>
          <span className="text-[12px] text-muted">{PRODUCT.capacity}</span>
          <span className="text-[12px] text-muted">Qtd: 1</span>
        </div>
      </div>

      <div className="mt-4 border-t border-border/60 pt-3.5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatPrice(PRODUCT_PRICE_CENTS)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Frete</span>
            <span className="text-muted">
              Calculado conforme o CEP
            </span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Pagamento</span>
            <span className="font-medium text-foreground">
              {paymentLabels[paymentMethod] || "Pix"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 border-t border-border/60 pt-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-semibold text-foreground">Total</span>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            {formatPrice(PRODUCT_PRICE_CENTS)}
          </span>
        </div>
      </div>
    </div>
  );
}
