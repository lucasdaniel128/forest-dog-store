import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TreePine, ArrowLeft, QrCode, CreditCard, FileText, Loader2 } from "lucide-react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/checkout/progress-bar";
import { OrderSummary } from "@/components/checkout/order-summary";
import { SITE_CONFIG, APP_MAX_CHECKOUT_URL } from "@/constants";
import type { CheckoutData } from "@/types/checkout";
import {
  maskCPF,
  maskPhone,
  maskCEP,
  unmask,
  validateCheckoutData,
  saveCheckoutData,
  loadCheckoutData,
  BRAZILIAN_STATES,
} from "@/lib/checkout-utils";

type PaymentMethod = "pix" | "card" | "boleto";

const saved = loadCheckoutData();

const inputClass =
  "h-12 min-w-0 rounded-xl border border-border bg-surface-strong px-4 text-[15px] text-foreground placeholder:text-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

const inputLoadingClass =
  "h-12 min-w-0 rounded-xl border border-border bg-surface-strong pl-4 pr-10 text-[15px] text-foreground placeholder:text-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

const selectClass =
  "h-12 min-w-0 rounded-xl border border-border bg-surface-strong px-4 text-[15px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10";

const errorInputClass = "border-red-500 focus-visible:outline-red-500";

const paymentOptions: { value: PaymentMethod; label: string; icon: typeof QrCode; description: string }[] = [
  { value: "pix", label: "Pix", icon: QrCode, description: "Pagamento instantâneo" },
  { value: "card", label: "Cartão de crédito", icon: CreditCard, description: "Parcelamento disponível" },
  { value: "boleto", label: "Boleto bancário", icon: FileText, description: "Vencimento informado no checkout" },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const firstErrorRef = useRef<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<CheckoutData>(() => ({
    customer: {
      fullName: saved?.customer.fullName ?? "",
      email: saved?.customer.email ?? "",
      cpf: saved?.customer.cpf ? maskCPF(saved.customer.cpf) : "",
      phone: saved?.customer.phone ? maskPhone(saved.customer.phone) : "",
    },
    shipping: {
      cep: saved?.shipping.cep ? maskCEP(saved.shipping.cep) : "",
      street: saved?.shipping.street ?? "",
      number: saved?.shipping.number ?? "",
      complement: saved?.shipping.complement ?? "",
      neighborhood: saved?.shipping.neighborhood ?? "",
      city: saved?.shipping.city ?? "",
      state: saved?.shipping.state ?? "",
    },
  }));

  useEffect(() => {
    const raw = unmask(data.shipping.cep);
    if (raw.length !== 8) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCepLoading(true);
    setCepError(null);

    fetch(`https://viacep.com.br/ws/${raw}/json/`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("network");
        const json = await res.json();
        if (json.erro) {
          setCepError("CEP não encontrado. Confira os números informados.");
          setCepLoading(false);
          return;
        }
        setData((prev) => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            street: json.logradouro ?? prev.shipping.street,
            neighborhood: json.bairro ?? prev.shipping.neighborhood,
            city: json.localidade ?? prev.shipping.city,
            state: json.uf ?? prev.shipping.state,
          },
        }));
        setCepLoading(false);
        setTimeout(() => numberRef.current?.focus(), 60);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setCepError(null);
        setCepLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [data.shipping.cep]);

  const updateCustomer = useCallback(
    (field: keyof CheckoutData["customer"], value: string) => {
      setData((prev) => ({
        ...prev,
        customer: { ...prev.customer, [field]: value },
      }));
    },
    [],
  );

  const updateShipping = useCallback(
    (field: keyof CheckoutData["shipping"], value: string) => {
      setData((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [field]: value },
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validateCheckoutData(data);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        const firstField = Object.keys(validationErrors)[0];
        firstErrorRef.current = firstField;
        const el = document.querySelector(
          `[name="${firstField}"]`,
        ) as HTMLElement | null;
        el?.focus();
        return;
      }

      setErrors({});
      saveCheckoutData(data);

      if (paymentMethod === "pix") {
        navigate("/checkout/pix");
      } else {
        window.location.assign(APP_MAX_CHECKOUT_URL);
      }
    },
    [data, navigate, paymentMethod],
  );

  const getButtonLabel = () => {
    switch (paymentMethod) {
      case "pix":
        return "PAGAR COM PIX";
      case "card":
        return "PAGAR COM CARTÃO";
      case "boleto":
        return "GERAR BOLETO";
    }
  };

  const inputError = (field: string) =>
    errors[field] ? (
      <span className="text-[12px] text-red-500">{errors[field]}</span>
    ) : null;

  return (
    <>
      <SEO
        title="Checkout — Forest Dog"
        description="Finalize sua compra da Barraca Automática Joyfox."
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:h-[64px] sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
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
            <ProgressBar currentStep={1} />
          </div>

          <div className="grid grid-cols-1 gap-10 min-w-0 lg:grid-cols-[1fr_360px] lg:gap-14">
            <form onSubmit={handleSubmit} noValidate className="min-w-0">
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Seus dados
                  </h2>
                  <p className="mt-1 text-[13px] text-muted">
                    Informe seus dados pessoais para a entrega.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-foreground"
                    >
                      Nome completo
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={data.customer.fullName}
                      onChange={(e) => updateCustomer("fullName", e.target.value)}
                      placeholder="Seu nome completo"
                      className={`${inputClass} ${errors.fullName ? errorInputClass : ""}`}
                    />
                    {inputError("fullName")}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        E-mail
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={data.customer.email}
                        onChange={(e) => updateCustomer("email", e.target.value)}
                        placeholder="seu@email.com"
                        className={`${inputClass} ${errors.email ? errorInputClass : ""}`}
                      />
                      {inputError("email")}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="cpf"
                        className="text-sm font-medium text-foreground"
                      >
                        CPF
                      </label>
                      <input
                        id="cpf"
                        name="cpf"
                        type="text"
                        inputMode="numeric"
                        value={data.customer.cpf}
                        onChange={(e) =>
                          updateCustomer("cpf", maskCPF(e.target.value))
                        }
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={`${inputClass} ${errors.cpf ? errorInputClass : ""}`}
                      />
                      {inputError("cpf")}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Telefone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={data.customer.phone}
                      onChange={(e) =>
                        updateCustomer("phone", maskPhone(e.target.value))
                      }
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className={`${inputClass} ${errors.phone ? errorInputClass : ""}`}
                    />
                    {inputError("phone")}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-8">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Endereço de entrega
                  </h2>
                  <p className="mt-1 text-[13px] text-muted">
                    Informe o endereço para recebimento da sua encomenda.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="cep"
                        className="text-sm font-medium text-foreground"
                      >
                        CEP
                      </label>
                      <div className="relative">
                        <input
                          id="cep"
                          name="cep"
                          type="text"
                          inputMode="numeric"
                          value={data.shipping.cep}
                          onChange={(e) => {
                            setCepError(null);
                            updateShipping("cep", maskCEP(e.target.value));
                          }}
                          placeholder="00000-000"
                          maxLength={9}
                          className={`${cepLoading ? inputLoadingClass : inputClass} ${errors.cep ? errorInputClass : ""}`}
                        />
                        {cepLoading && (
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </span>
                        )}
                      </div>
                      {errors.cep
                        ? inputError("cep")
                        : cepError && (
                            <span className="text-[12px] text-red-500">
                              {cepError}
                            </span>
                          )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="state"
                        className="text-sm font-medium text-foreground"
                      >
                        Estado
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={data.shipping.state}
                        onChange={(e) => updateShipping("state", e.target.value)}
                        className={`${selectClass} ${errors.state ? errorInputClass : ""}`}
                      >
                        <option value="">Selecione</option>
                        {BRAZILIAN_STATES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      {inputError("state")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="street"
                        className="text-sm font-medium text-foreground"
                      >
                        Rua
                      </label>
                      <input
                        id="street"
                        name="street"
                        type="text"
                        value={data.shipping.street}
                        onChange={(e) => updateShipping("street", e.target.value)}
                        placeholder="Rua, avenida..."
                        className={`${inputClass} ${errors.street ? errorInputClass : ""}`}
                      />
                      {inputError("street")}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="number"
                        className="text-sm font-medium text-foreground"
                      >
                        Número
                      </label>
                      <input
                        ref={numberRef}
                        id="number"
                        name="number"
                        type="text"
                        value={data.shipping.number}
                        onChange={(e) => updateShipping("number", e.target.value)}
                        placeholder="Nº"
                        className={`${inputClass} ${errors.number ? errorInputClass : ""}`}
                      />
                      {inputError("number")}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="complement"
                      className="text-sm font-medium text-foreground"
                    >
                      Complemento{" "}
                      <span className="text-muted">(opcional)</span>
                    </label>
                    <input
                      id="complement"
                      name="complement"
                      type="text"
                      value={data.shipping.complement}
                      onChange={(e) =>
                        updateShipping("complement", e.target.value)
                      }
                      placeholder="Apto, bloco, casa..."
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="neighborhood"
                        className="text-sm font-medium text-foreground"
                      >
                        Bairro
                      </label>
                      <input
                        id="neighborhood"
                        name="neighborhood"
                        type="text"
                        value={data.shipping.neighborhood}
                        onChange={(e) =>
                          updateShipping("neighborhood", e.target.value)
                        }
                        placeholder="Bairro"
                        className={`${inputClass} ${errors.neighborhood ? errorInputClass : ""}`}
                      />
                      {inputError("neighborhood")}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-foreground"
                      >
                        Cidade
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={data.shipping.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        placeholder="Cidade"
                        className={`${inputClass} ${errors.city ? errorInputClass : ""}`}
                      />
                      {inputError("city")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-8">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Forma de pagamento
                  </h2>
                  <p className="mt-1 text-[13px] text-muted">
                    Escolha como deseja pagar.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {paymentOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = paymentMethod === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPaymentMethod(option.value)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors duration-150 min-w-0 ${
                          isSelected
                            ? "border-forest bg-forest/5"
                            : "border-border bg-surface-strong hover:border-muted/60"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                            isSelected ? "bg-forest text-white" : "bg-sand/60 text-muted"
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-px">
                          <span className="text-sm font-medium text-foreground">
                            {option.label}
                          </span>
                          <span className="text-[12px] text-muted">
                            {option.description}
                          </span>
                        </div>
                        <span
                          className={`ml-auto h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] transition-colors duration-150 ${
                            isSelected
                              ? "border-forest bg-forest"
                              : "border-muted/40"
                          }`}
                        >
                          {isSelected && (
                            <span className="flex h-full w-full items-center justify-center">
                              <span className="h-[6px] w-[6px] rounded-full bg-white" />
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod !== "pix" && (
                  <p className="text-[13px] text-muted">
                    Pagamento processado com segurança pela Appmax.
                  </p>
                )}
              </div>

              <div className="mt-8 pb-4 lg:hidden">
                <Button type="submit" variant="cta" size="full">
                  {getButtonLabel()}
                </Button>
              </div>

              <div className="mt-6 hidden lg:block">
                <Button type="submit" variant="cta" size="full">
                  {getButtonLabel()}
                </Button>
              </div>
            </form>

            <aside className="min-w-0 lg:sticky lg:top-[88px] lg:self-start">
              <OrderSummary paymentMethod={paymentMethod} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
