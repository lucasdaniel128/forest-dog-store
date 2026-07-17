import type { CheckoutData, OrderSummary } from "@/types/checkout";

export const CHECKOUT_STORAGE_KEY = "forest-dog-checkout" as const;

export const PRODUCT_PRICE_CENTS = 16499;

export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
] as const;

export function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateCPF(cpf: string): boolean {
  const digits = unmask(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const firstDigit = remainder === 10 || remainder === 11 ? 0 : remainder;
  if (parseInt(digits.charAt(9)) !== firstDigit) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const secondDigit = remainder === 10 || remainder === 11 ? 0 : remainder;
  if (parseInt(digits.charAt(10)) !== secondDigit) return false;

  return true;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  const digits = unmask(phone);
  return digits.length >= 10 && digits.length <= 11;
}

export function validateCEP(cep: string): boolean {
  return unmask(cep).length === 8;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 3;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateCheckoutData(data: CheckoutData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!validateName(data.customer.fullName)) {
    errors.fullName = "Informe seu nome completo";
  }
  if (!validateEmail(data.customer.email)) {
    errors.email = "Informe um e-mail válido";
  }
  if (!validateCPF(data.customer.cpf)) {
    errors.cpf = "Informe um CPF válido";
  }
  if (!validatePhone(data.customer.phone)) {
    errors.phone = "Informe um telefone com DDD";
  }
  if (!validateCEP(data.shipping.cep)) {
    errors.cep = "Informe um CEP válido";
  }
  if (!validateRequired(data.shipping.street)) {
    errors.street = "Informe a rua";
  }
  if (!validateRequired(data.shipping.number)) {
    errors.number = "Informe o número";
  }
  if (!validateRequired(data.shipping.neighborhood)) {
    errors.neighborhood = "Informe o bairro";
  }
  if (!validateRequired(data.shipping.city)) {
    errors.city = "Informe a cidade";
  }
  if (!validateRequired(data.shipping.state)) {
    errors.state = "Selecione o estado";
  }

  return errors;
}

export function createOrderSummary(_checkoutData: CheckoutData): OrderSummary {
  return {
    productName: "Barraca Automática Joyfox",
    capacity: "5–6 pessoas",
    quantity: 1,
    unitPrice: PRODUCT_PRICE_CENTS,
    totalPrice: PRODUCT_PRICE_CENTS,
    installments: "Parcelamento disponível no cartão",
    paymentMethod: "Pix",
    estimatedDelivery: "Prazo de entrega calculado conforme o CEP informado",
  };
}

export interface PersistedCharge {
  chargeId: string;
  externalId?: string;
  expiresAt: string;
  orderId: string;
}

const CHARGE_STORAGE_KEY = "forest-dog-charge" as const;

export function savePersistedCharge(charge: PersistedCharge): void {
  try {
    sessionStorage.setItem(CHARGE_STORAGE_KEY, JSON.stringify(charge));
  } catch {
    // sessionStorage unavailable
  }
}

export function loadPersistedCharge(): PersistedCharge | null {
  try {
    const raw = sessionStorage.getItem(CHARGE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedCharge;
  } catch {
    return null;
  }
}

export function clearPersistedCharge(): void {
  try {
    sessionStorage.removeItem(CHARGE_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable
  }
}

export function isChargeValid(charge: PersistedCharge): boolean {
  if (!charge.expiresAt) return false;
  const expiresAt = new Date(charge.expiresAt);
  return expiresAt.getTime() > Date.now();
}

export function clearCheckoutData(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable
  }
}

export interface ConfirmationData {
  orderId: string;
  customerEmail: string;
  productName: string;
  totalCents: number;
  confirmedAt: string;
}

const CONFIRMATION_STORAGE_KEY = "forest-dog-confirmation" as const;

export function saveConfirmationData(data: ConfirmationData): void {
  try {
    sessionStorage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable
  }
}

export function loadConfirmationData(): ConfirmationData | null {
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConfirmationData;
  } catch {
    return null;
  }
}

export function clearConfirmationData(): void {
  try {
    sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable
  }
}

const CONFIRMATION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function isValidConfirmationData(data: unknown): data is ConfirmationData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.orderId !== "string" || obj.orderId.trim().length === 0) return false;
  if (typeof obj.customerEmail !== "string") return false;
  if (typeof obj.productName !== "string" || obj.productName.trim().length === 0) return false;
  if (typeof obj.totalCents !== "number" || !Number.isInteger(obj.totalCents) || obj.totalCents <= 0) return false;
  if (typeof obj.confirmedAt !== "string") return false;
  const parsed = new Date(obj.confirmedAt);
  if (isNaN(parsed.getTime())) return false;
  return true;
}

export function isConfirmationFresh(data: ConfirmationData): boolean {
  const age = Date.now() - new Date(data.confirmedAt).getTime();
  return age >= 0 && age < CONFIRMATION_MAX_AGE_MS;
}

export function loadValidConfirmation(): ConfirmationData | null {
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidConfirmationData(parsed)) {
      sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY);
      return null;
    }
    if (!isConfirmationFresh(parsed)) {
      sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    try { sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY); } catch { /* noop */ }
    return null;
  }
}

export function saveCheckoutData(data: CheckoutData): void {
  try {
    sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable
  }
}

export function loadCheckoutData(): CheckoutData | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutData;
  } catch {
    return null;
  }
}
