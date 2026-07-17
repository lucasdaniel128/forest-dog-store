import type { CheckoutData } from "@/types/checkout";
import { unmask } from "@/lib/checkout-utils";

export type PixChargeStatus = "pending" | "paid" | "expired" | "failed";

export interface PixChargePayer {
  name: string;
  email: string;
  document: string;
}

export interface PixChargeMetadata {
  order_id: string;
  product: string;
}

export interface PixCharge {
  id: string;
  status: PixChargeStatus;
  amount_cents: number;
  qr_code: string;
  qr_code_image: string | null;
  expires_at: string;
  external_id: string | null;
  payer: PixChargePayer;
  metadata: PixChargeMetadata;
  created_at: string;
}

interface PixCreateChargeBody {
  amount_cents: number;
  description: string;
  payer: PixChargePayer;
  metadata: PixChargeMetadata;
  shipping_address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  } | null;
}

const GENERIC_ERROR = "Não foi possível gerar o Pix agora. Tente novamente.";

function getProxyUrl(): string {
  const url = import.meta.env.VITE_PIX_PROXY_URL;
  if (!url) {
    throw new Error(GENERIC_ERROR);
  }
  return url.replace(/\/+$/, "");
}

function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `fd-${timestamp}-${random}`;
}

function buildRequestConfig(signal?: AbortSignal): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  };
}

function validateChargeResponse(data: unknown): PixCharge {
  if (!data || typeof data !== "object") {
    throw new Error(GENERIC_ERROR);
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== "string") {
    throw new Error(GENERIC_ERROR);
  }

  const validStatuses: PixChargeStatus[] = [
    "pending",
    "paid",
    "expired",
    "failed",
  ];
  if (
    typeof obj.status !== "string" ||
    !validStatuses.includes(obj.status as PixChargeStatus)
  ) {
    throw new Error(GENERIC_ERROR);
  }

  if (typeof obj.amount_cents !== "number") {
    throw new Error(GENERIC_ERROR);
  }

  return {
    id: obj.id,
    status: obj.status as PixChargeStatus,
    amount_cents: obj.amount_cents,
    qr_code: typeof obj.qr_code === "string" ? obj.qr_code : "",
    qr_code_image:
      typeof obj.qr_code_image === "string" ? obj.qr_code_image : null,
    expires_at: typeof obj.expires_at === "string" ? obj.expires_at : "",
    external_id:
      typeof obj.external_id === "string" ? obj.external_id : null,
    payer:
      obj.payer && typeof obj.payer === "object"
        ? (obj.payer as PixChargePayer)
        : { name: "", email: "", document: "" },
    metadata:
      obj.metadata && typeof obj.metadata === "object"
        ? (obj.metadata as PixChargeMetadata)
        : { order_id: "", product: "" },
    created_at: typeof obj.created_at === "string" ? obj.created_at : "",
  };
}

export async function createPixCharge(
  checkoutData: CheckoutData,
  signal?: AbortSignal,
): Promise<PixCharge> {
  const proxyUrl = getProxyUrl();
  const orderId = generateOrderId();

  const body: PixCreateChargeBody = {
    amount_cents: 16499,
    description: "Barraca Automática Joyfox",
    payer: {
      name: checkoutData.customer.fullName,
      email: checkoutData.customer.email,
      document: unmask(checkoutData.customer.cpf),
    },
    metadata: {
      order_id: orderId,
      product: "barraca-automatica-joyfox",
    },
    shipping_address: {
      cep: checkoutData.shipping.cep,
      street: checkoutData.shipping.street,
      number: checkoutData.shipping.number,
      complement: checkoutData.shipping.complement,
      neighborhood: checkoutData.shipping.neighborhood,
      city: checkoutData.shipping.city,
      state: checkoutData.shipping.state,
    },
  };

  let response: Response;
  try {
    response = await fetch(`${proxyUrl}/charges`, {
      ...buildRequestConfig(signal),
      body: JSON.stringify(body),
    });
  } catch {
    if (signal?.aborted) throw new Error("abortado");
    throw new Error(GENERIC_ERROR);
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 400 || status === 401 || status === 404 || status === 502) {
      throw new Error(GENERIC_ERROR);
    }
    throw new Error(GENERIC_ERROR);
  }

  let json: unknown;

try {
  const text = await response.text();
  json = JSON.parse(text);
} catch {
  throw new Error(GENERIC_ERROR);
}

const payload =
  typeof json === "object" &&
  json !== null &&
  "charge" in json
    ? (json as { charge: unknown }).charge
    : json;

return validateChargeResponse(payload);
}


export async function getPixCharge(
  chargeId: string,
  signal?: AbortSignal,
): Promise<PixCharge> {
  const proxyUrl = getProxyUrl();

  let response: Response;
  try {
    response = await fetch(`${proxyUrl}/charges/${chargeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });
  } catch {
    if (signal?.aborted) throw new Error("abortado");
    throw new Error(GENERIC_ERROR);
  }

  if (!response.ok) {
    throw new Error(GENERIC_ERROR);
  }

  let json: unknown;

try {
  const text = await response.text();
  json = JSON.parse(text);
} catch {
  throw new Error(GENERIC_ERROR);
}

const payload =
  typeof json === "object" &&
  json !== null &&
  "charge" in json
    ? (json as { charge: unknown }).charge
    : json;

return validateChargeResponse(payload);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");

  if (!local || !domain) return email;

  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }

  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}