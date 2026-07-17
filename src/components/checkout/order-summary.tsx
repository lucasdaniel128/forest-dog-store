import { PRODUCT } from "@/constants";
import { formatPrice, PRODUCT_PRICE_CENTS } from "@/lib/checkout-utils";
import productImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

export function OrderSummary() {
  return (
    <div className="rounded-2xl border border-border bg-surface-strong p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
        Resumo do pedido
      </h3>

      <div className="mt-4 flex gap-4">
        <img
          src={productImage}
          alt={PRODUCT.name}
          className="h-24 w-24 rounded-xl object-cover"
        />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <span className="text-sm font-bold text-foreground">
            {PRODUCT.name}
          </span>
          <span className="text-[13px] text-muted">{PRODUCT.capacity}</span>
          <span className="text-[12px] text-muted">Qtd: 1</span>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Pagamento</span>
            <span className="font-medium text-foreground">Pix</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Entrega</span>
            <span className="text-right text-muted">
              Calculado conforme o CEP
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-foreground">Total</span>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            {formatPrice(PRODUCT_PRICE_CENTS)}
          </span>
        </div>
      </div>
    </div>
  );
}
