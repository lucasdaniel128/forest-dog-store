import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TreePine,
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Mail,
} from "lucide-react";
import { SEO } from "@/components/seo";
import { ProgressBar } from "@/components/checkout/progress-bar";
import { OrderSummary } from "@/components/checkout/order-summary";
import { SITE_CONFIG, PRODUCT } from "@/constants";
import { formatPrice } from "@/lib/checkout-utils";
import {
  loadCheckoutData,
  loadPersistedCharge,
  savePersistedCharge,
  isChargeValid,
  saveConfirmationData,
  clearCheckoutData,
  clearPersistedCharge,
} from "@/lib/checkout-utils";
import {
  createPixCharge,
  getPixCharge,
 
  type PixCharge,
} from "@/services/pix-service";
import { trackEvent } from "@/lib/tracking";
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");

  if (!local || !domain) return email;

  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }

  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}
const POLL_INTERVAL_MS = 5000;
const GENERIC_ERROR_MSG = "Não foi possível gerar o Pix agora. Tente novamente.";

type PageState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "charge"; charge: PixCharge }
  | { kind: "paid"; charge: PixCharge }
  | { kind: "expired" }
  | { kind: "failed" };

function formatTimeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expirado";
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isUrgent(expiresAt: string): boolean {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < 5 * 60 * 1000;
}

export function CheckoutPixPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ kind: "loading" });
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const purchaseTrackedRef = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const screenReaderTimeRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (chargeId: string) => {
      cleanup();

      pollingRef.current = setInterval(async () => {
        if (abortRef.current) return;
        const controller = new AbortController();
        abortRef.current = controller;

        try {
          const charge = await getPixCharge(chargeId, controller.signal);
          if (controller.signal.aborted) return;

          if (charge.status === "paid") {
            cleanup();

            if (!purchaseTrackedRef.current) {
              purchaseTrackedRef.current = true;
              trackEvent("Purchase", { value: 164.99, currency: "BRL" });
            }

            setPageState({ kind: "paid", charge });

            const checkoutData = loadCheckoutData();
            saveConfirmationData({
              orderId: charge.metadata.order_id,
              customerEmail: checkoutData?.customer.email ?? "",
              productName: "Barraca Automática Joyfox",
              totalCents: charge.amount_cents,
              confirmedAt: new Date().toISOString(),
            });
            clearPersistedCharge();
            clearCheckoutData();

            setTimeout(() => {
              navigate("/checkout/sucesso");
            }, 800);
            return;
          }

          if (charge.status === "expired") {
            cleanup();
            setPageState({ kind: "expired" });
            return;
          }

          if (charge.status === "failed") {
            cleanup();
            setPageState({ kind: "failed" });
            return;
          }

          setPageState({ kind: "charge", charge });
        } catch {
          if (!controller.signal.aborted) {
            // Network error during polling — keep trying silently
          }
        } finally {
          if (abortRef.current === controller) {
            abortRef.current = null;
          }
        }
      }, POLL_INTERVAL_MS);
    },
    [cleanup, navigate],
  );

  const handleCreateCharge = useCallback(
    async (signal?: AbortSignal) => {
      setPageState({ kind: "loading" });
      const checkoutData = loadCheckoutData();

      if (!checkoutData) {
        navigate("/checkout");
        return;
      }

      const persisted = loadPersistedCharge();
      if (persisted && isChargeValid(persisted)) {
        try {
          const charge = await getPixCharge(persisted.chargeId, signal);
          if (charge.status === "pending") {
            setPageState({ kind: "charge", charge });
            startPolling(charge.id);
            return;
          }
        } catch {
          clearPersistedCharge();
        }
      }

      try {
        const charge = await createPixCharge(checkoutData, signal);
        savePersistedCharge({
          chargeId: charge.id,
          expiresAt: charge.expires_at,
          orderId: charge.metadata.order_id,
        });
        setPageState({ kind: "charge", charge });
        startPolling(charge.id);
      } catch (err) {
        if (signal?.aborted) return;
        const message =
          err instanceof Error ? err.message : GENERIC_ERROR_MSG;
        setPageState({ kind: "error", message });
      }
    },
    [navigate, startPolling],
  );

  const handleRetry = useCallback(() => {
    purchaseTrackedRef.current = false;
    cleanup();
    clearPersistedCharge();
    handleCreateCharge();
  }, [cleanup, handleCreateCharge]);

  const handleBackToCheckout = useCallback(() => {
    cleanup();
    navigate("/checkout");
  }, [cleanup, navigate]);

  useEffect(() => {
    titleRef.current?.focus();
    handleCreateCharge();
    return cleanup;
  }, [handleCreateCharge, cleanup]);

  useEffect(() => {
    if (pageState.kind !== "charge") return;

    const tick = () => {
      if (pageState.charge.expires_at) {
        const remaining = formatTimeRemaining(pageState.charge.expires_at);
        setTimeRemaining(remaining);
        if (remaining === "Expirado") {
          cleanup();
          setPageState({ kind: "expired" });
        }
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [pageState, cleanup]);

  useEffect(() => {
    if (pageState.kind !== "charge" || pageState.charge.status !== "pending") return;

    const srTime = formatTimeRemaining(pageState.charge.expires_at);
    if (srTime !== screenReaderTimeRef.current) {
      screenReaderTimeRef.current = srTime;
    }
  }, [pageState, timeRemaining]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } else if (pageState.kind === "charge" && pageState.charge.status === "pending") {
        startPolling(pageState.charge.id);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [pageState, startPolling]);

  const handleCopy = useCallback(async () => {
    if (pageState.kind !== "charge") return;
    try {
      await navigator.clipboard.writeText(pageState.charge.qr_code);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = pageState.charge.qr_code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) {
        setCopied(true);
        setCopyFailed(false);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopyFailed(true);
        setTimeout(() => setCopyFailed(false), 3000);
      }
    }
  }, [pageState]);

  const checkoutData = loadCheckoutData();

  return (
    <>
      <SEO
        title="Pagamento via Pix — Forest Dog"
        description="Finalize seu pagamento via Pix."
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:h-[64px] sm:px-6 lg:px-8">
          <button
            onClick={handleBackToCheckout}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white">
              <TreePine className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              {SITE_CONFIG.name}
            </span>
          </div>

          <span className="text-xs text-muted">Checkout seguro</span>
        </div>
      </header>

      <main className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mb-8">
            <ProgressBar currentStep={2} />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            <div className="flex flex-col gap-6">
              {pageState.kind === "loading" && (
                <div
                  className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-strong px-6 py-12 sm:px-10"
                  aria-live="polite"
                >
                  <div className="relative">
                    <Loader2 className="h-10 w-10 animate-spin text-cta" aria-hidden="true" />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/30" />
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1
                      ref={titleRef}
                      tabIndex={-1}
                      className="text-lg font-bold tracking-tight text-foreground outline-none"
                    >
                      Preparando seu pagamento
                    </h1>
                    <p className="text-[13px] text-muted">
                      Estamos gerando o Pix do seu pedido.
                    </p>
                  </div>

                  <div className="w-full max-w-xs rounded-xl border border-border bg-background p-4">
                    <div className="flex flex-col gap-2 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-muted">Produto</span>
                        <span className="font-medium text-foreground">
                          {PRODUCT.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Total</span>
                        <span className="font-semibold text-foreground">
                          {formatPrice(16499)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pageState.kind === "paid" && (
                <div
                  className="flex flex-col items-center gap-6 rounded-2xl border border-green-200 bg-green-50/50 px-6 py-12 sm:px-10"
                  aria-live="polite"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-lg font-bold tracking-tight text-foreground">
                      Pagamento confirmado
                    </h1>
                    <p className="text-[13px] text-muted">
                      Recebemos o pagamento do seu pedido.
                    </p>
                  </div>
                </div>
              )}

              {pageState.kind === "error" && (
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-strong px-6 py-10 sm:px-10" role="alert">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-7 w-7 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1
                      ref={titleRef}
                      tabIndex={-1}
                      className="text-lg font-bold tracking-tight text-foreground outline-none"
                    >
                      Não conseguimos gerar o Pix agora
                    </h1>
                    <p className="text-[13px] text-muted">
                      Tente novamente em alguns instantes.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleRetry}
                      className="flex items-center justify-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-hover"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Tentar novamente
                    </button>
                    <button
                      onClick={handleBackToCheckout}
                      className="rounded-xl border border-border px-8 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
                    >
                      Voltar ao checkout
                    </button>
                  </div>
                </div>
              )}

              {pageState.kind === "expired" && (
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-strong px-6 py-10 sm:px-10" role="alert">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand">
                    <Clock className="h-7 w-7 text-muted" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1
                      ref={titleRef}
                      tabIndex={-1}
                      className="text-lg font-bold tracking-tight text-foreground outline-none"
                    >
                      Este Pix expirou
                    </h1>
                    <p className="text-[13px] text-muted">
                      Gere um novo código para continuar com o pagamento.
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="flex items-center justify-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-hover"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Gerar novo Pix
                  </button>
                </div>
              )}

              {pageState.kind === "failed" && (
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-strong px-6 py-10 sm:px-10" role="alert">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-7 w-7 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1
                      ref={titleRef}
                      tabIndex={-1}
                      className="text-lg font-bold tracking-tight text-foreground outline-none"
                    >
                      Não foi possível concluir esta cobrança
                    </h1>
                    <p className="text-[13px] text-muted">
                      Tente gerar um novo Pix para continuar.
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="flex items-center justify-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-hover"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Tentar novamente
                  </button>
                </div>
              )}

              {pageState.kind === "charge" && pageState.charge.status === "pending" && (
                <>
                  <div>
                    <h1
                      ref={titleRef}
                      tabIndex={-1}
                      className="text-lg font-bold tracking-tight text-foreground outline-none"
                    >
                      Pagamento via Pix
                    </h1>
                    <p className="mt-1 text-[15px] text-muted">
                      Total:{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(16499)}
                      </span>
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3"
                    aria-live="polite"
                  >
                    <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        Aguardando pagamento
                      </span>
                      <span className="text-[12px] text-muted">
                        Após pagar, aguarde alguns instantes enquanto confirmamos.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-surface-strong px-6 py-8 sm:px-8">
                    {pageState.charge.qr_code_image ? (
                      <div className="flex w-full max-w-[260px] items-center justify-center rounded-xl bg-white p-4">
                        <img
                          src={pageState.charge.qr_code_image}
                          alt="QR Code para pagamento Pix do pedido Forest Dog"
                          className="h-auto w-full max-h-[240px] object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    ) : (
                      <p className="text-center text-[13px] text-muted">
                        Use o código Pix abaixo para realizar o pagamento.
                      </p>
                    )}

                    {pageState.charge.qr_code && (
                      <div className="flex w-full flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Pix Copia e Cola
                        </span>
                        <div className="relative rounded-xl border border-border bg-background">
                          <pre className="overflow-x-auto whitespace-pre-wrap break-all px-4 py-3 font-mono text-[12px] leading-relaxed text-muted select-all">
                            {pageState.charge.qr_code}
                          </pre>
                        </div>

                        <button
                          onClick={handleCopy}
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest text-sm font-bold text-white transition-colors hover:bg-forest-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                          aria-label={copied ? "Código copiado" : "Copiar código Pix"}
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4" aria-hidden="true" />
                              CÓDIGO COPIADO
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" aria-hidden="true" />
                              COPIAR CÓDIGO PIX
                            </>
                          )}
                        </button>

                        {copyFailed && (
                          <p className="text-center text-[12px] text-muted" role="status" aria-live="polite">
                            Selecione e copie o código manualmente.
                          </p>
                        )}
                        {copied && (
                          <p className="text-center text-[12px] text-green-600" role="status" aria-live="polite">
                            Código copiado
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-strong px-4 py-3 text-center"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <span className="text-[13px] text-muted">
                      Pix válido por:{" "}
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          isUrgent(pageState.charge.expires_at) ? "text-amber-600" : "text-foreground"
                        }`}
                      >
                        {timeRemaining}
                      </span>
                    </span>
                    <span className="sr-only" aria-live="polite">
                      {timeRemaining}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-strong p-5">
                    <h2 className="text-sm font-bold tracking-tight text-foreground">
                      Informações da compra
                    </h2>
                    <ul className="flex flex-col gap-3 text-[13px] text-muted">
                      <li className="flex items-start gap-3">
                        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-cta" aria-hidden="true" />
                        Pagamento via Pix no próprio site
                      </li>
                      <li className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cta" aria-hidden="true" />
                        Dados utilizados para processar seu pedido
                      </li>
                      <li className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cta" aria-hidden="true" />
                        Rastreio enviado por e-mail após a postagem
                      </li>
                    </ul>
                  </div>

                  <div
                    className="flex items-center justify-center gap-2 rounded-xl bg-background px-4 py-2.5"
                    aria-live="polite"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" aria-hidden="true" />
                    <span className="text-[12px] text-muted">
                      Verificando pagamento automaticamente...
                    </span>
                  </div>
                </>
              )}
            </div>

            <aside className="lg:sticky lg:top-[88px] lg:self-start">
              <OrderSummary />
              {checkoutData && pageState.kind === "charge" && pageState.charge.status === "pending" && (
                <div className="mt-4 rounded-2xl border border-border bg-surface-strong p-4">
                  <h3 className="text-xs font-bold tracking-tight text-foreground">
                    Dados utilizados
                  </h3>
                  <div className="mt-2 flex flex-col gap-1.5 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-muted">E-mail</span>
                      <span className="font-medium text-foreground">
                        {maskEmail(checkoutData.customer.email)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Telefone</span>
                      <span className="font-medium text-foreground">
                        {checkoutData.customer.phone}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
