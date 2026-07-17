import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TreePine, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/checkout/progress-bar";
import { OrderSummary } from "@/components/checkout/order-summary";
import { SITE_CONFIG } from "@/constants";
import type { CheckoutData } from "@/types/checkout";
import {
  maskCPF,
  maskPhone,
  maskCEP,
  validateCheckoutData,
  saveCheckoutData,
  loadCheckoutData,
  BRAZILIAN_STATES,
} from "@/lib/checkout-utils";

const saved = loadCheckoutData();

const inputClass =
  "h-12 rounded-xl border border-border bg-surface-strong px-4 text-[15px] text-foreground placeholder:text-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

const selectClass =
  "h-12 rounded-xl border border-border bg-surface-strong px-4 text-[15px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10";

const errorInputClass = "border-red-500 focus-visible:outline-red-500";

export function CheckoutPage() {
  const navigate = useNavigate();
  const firstErrorRef = useRef<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      navigate("/checkout/pix");
    },
    [data, navigate],
  );

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

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            <form onSubmit={handleSubmit} noValidate>
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
                    Informe o endereço para receiving da sua encomenda.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="cep"
                        className="text-sm font-medium text-foreground"
                      >
                        CEP
                      </label>
                      <input
                        id="cep"
                        name="cep"
                        type="text"
                        inputMode="numeric"
                        value={data.shipping.cep}
                        onChange={(e) =>
                          updateShipping("cep", maskCEP(e.target.value))
                        }
                        placeholder="00000-000"
                        maxLength={9}
                        className={`${inputClass} ${errors.cep ? errorInputClass : ""}`}
                      />
                      {inputError("cep")}
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
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

              <div className="mt-8 lg:hidden">
                <Button type="submit" variant="cta" size="full">
                  CONTINUAR PARA O PIX
                </Button>
              </div>

              <div className="mt-6 hidden lg:block">
                <Button type="submit" variant="cta" size="full">
                  CONTINUAR PARA O PIX
                </Button>
              </div>
            </form>

            <aside className="lg:sticky lg:top-[88px] lg:self-start">
              <OrderSummary />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
