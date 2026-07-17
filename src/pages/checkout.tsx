import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TreePine,
  ArrowLeft,
  QrCode,
  CreditCard,
  FileText,
  Loader2,
  ShieldCheck,
  UserRound,
  MapPin,
  LockKeyhole,
  PackageCheck,
  ChevronRight,
} from "lucide-react";
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
  "h-[50px] min-w-0 rounded-xl border border-border bg-white px-4 text-[14px] text-foreground placeholder:text-muted/40 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest/30 transition-colors";

const inputLoadingClass =
  "h-[50px] min-w-0 rounded-xl border border-border bg-white pl-4 pr-10 text-[14px] text-foreground placeholder:text-muted/40 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest/30 transition-colors";

const selectClass =
  "h-[50px] min-w-0 rounded-xl border border-border bg-white px-4 text-[14px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest/30 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10 transition-colors";

const errorInputClass = "border-red-400 focus-visible:outline-red-400";

const paymentOptions: { value: PaymentMethod; label: string; icon: typeof QrCode; description: string }[] = [
  { value: "pix", label: "Pix", icon: QrCode, description: "Pagamento instantâneo" },
  { value: "card", label: "Cartão de crédito", icon: CreditCard, description: "Parcelamento disponível" },
  { value: "boleto", label: "Boleto bancário", icon: FileText, description: "Vencimento informado no checkout" },
];

const trustItems = [
  { icon: ShieldCheck, label: "Pagamento protegido" },
  { icon: LockKeyhole, label: "Dados usados somente para o pedido" },
  { icon: PackageCheck, label: "Acompanhamento após a compra" },
] as const;

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
      <span className="mt-1 text-[12px] text-red-500">{errors[field]}</span>
    ) : null;

  const card = "rounded-2xl border border-border bg-surface-strong p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:p-6";
  const sectionHead = "flex items-center gap-3 mb-5";
  const sectionIconCircle = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-white";
  const sectionTitle = "text-base font-bold text-foreground";
  const labelClass = "text-[13px] font-medium text-foreground";

  return (
    <>
      <SEO
        title="Checkout — Forest Dog"
        description="Finalize sua compra da Barraca Automática Joyfox."
      />

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:h-[64px] sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white shadow-sm shadow-forest/20">
              <TreePine className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-[14px] font-bold tracking-tight text-foreground">
              {SITE_CONFIG.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-forest/5 px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-forest">Ambiente seguro</span>
          </div>
        </div>
      </header>

      <main className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="mb-6 sm:mb-8">
            <ProgressBar currentStep={1} />
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-[26px]">
              Finalizar compra
            </h1>
            <p className="mt-1.5 text-[14px] text-muted">
              Confira seus dados e escolha a forma de pagamento.
            </p>
            <p className="mt-0.5 text-[13px] text-muted/70">
              Compra segura e acompanhamento do pedido.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 min-w-0 lg:grid-cols-[1fr_380px] lg:gap-10">
            <form onSubmit={handleSubmit} noValidate className="min-w-0">
              <div className="flex flex-col gap-6">
                <div className={card}>
                  <div className={sectionHead}>
                    <span className={sectionIconCircle}>
                      <UserRound className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className={sectionTitle}>Dados pessoais</h2>
                      <p className="text-[12px] text-muted">Informações para contato e entrega</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fullName" className={labelClass}>
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
                        <label htmlFor="email" className={labelClass}>
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
                        <label htmlFor="cpf" className={labelClass}>
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
                      <label htmlFor="phone" className={labelClass}>
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

                <div className={card}>
                  <div className={sectionHead}>
                    <span className={sectionIconCircle}>
                      <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className={sectionTitle}>Endereço de entrega</h2>
                      <p className="text-[12px] text-muted">Informe onde deseja receber</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="cep" className={labelClass}>
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
                        <label htmlFor="state" className={labelClass}>
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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_130px]">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="street" className={labelClass}>
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
                        <label htmlFor="number" className={labelClass}>
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
                      <label htmlFor="complement" className={labelClass}>
                        Complemento{" "}
                        <span className="text-muted font-normal">(opcional)</span>
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
                        <label htmlFor="neighborhood" className={labelClass}>
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
                        <label htmlFor="city" className={labelClass}>
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

                <div className={card}>
                  <div className={sectionHead}>
                    <span className={sectionIconCircle}>
                      <CreditCard className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className={sectionTitle}>Forma de pagamento</h2>
                      <p className="text-[12px] text-muted">Escolha como deseja pagar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {paymentOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = paymentMethod === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPaymentMethod(option.value)}
                          aria-checked={isSelected}
                          role="radio"
                          className={`group flex flex-col items-center gap-2.5 rounded-xl border-2 px-4 py-5 text-center transition-all duration-150 min-w-0 ${
                            isSelected
                              ? "border-forest bg-forest/[0.04] shadow-[0_0_0_1px_rgba(38,55,40,0.1)]"
                              : "border-border/60 bg-white hover:border-muted/60"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 ${
                              isSelected
                                ? "bg-forest text-white shadow-sm shadow-forest/20"
                                : "bg-sand/50 text-muted group-hover:bg-sand/70"
                            }`}
                          >
                            <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`text-[13px] ${
                                isSelected
                                  ? "font-bold text-foreground"
                                  : "font-medium text-foreground"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="text-[11px] leading-snug text-muted">
                              {option.description}
                            </span>
                          </div>
                          <span
                            className={`h-2 w-2 rounded-full transition-colors duration-150 ${
                              isSelected ? "bg-forest" : "bg-border"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod !== "pix" && (
                    <p className="mt-4 text-[12px] text-muted">
                      Pagamento processado com segurança pela Appmax.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {trustItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-white px-3.5 py-3"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-forest/60" aria-hidden="true" />
                        <span className="text-[12px] font-medium text-muted">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pb-2 lg:hidden">
                  <Button type="submit" variant="cta" size="full" className="h-[56px] rounded-2xl text-[14px] shadow-lg shadow-cta/20">
                    <span className="flex items-center gap-2">
                      {getButtonLabel()}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Button>
                </div>

                <div className="hidden lg:block">
                  <Button type="submit" variant="cta" size="full" className="h-[56px] rounded-2xl text-[14px] shadow-lg shadow-cta/20">
                    <span className="flex items-center gap-2">
                      {getButtonLabel()}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Button>
                </div>
              </div>
            </form>

            <aside className="min-w-0 lg:sticky lg:top-[84px] lg:self-start">
              <OrderSummary paymentMethod={paymentMethod} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
