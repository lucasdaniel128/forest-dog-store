import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const MAX_BODY_BYTES = 8 * 1024;
const REQUEST_TIMEOUT_MS = 30000;

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizePath(pathname: string): string {
  let p = pathname;
  p = p.replace(/^\/functions\/v1\/api-proxy/i, "");
  p = p.replace(/^\/api-proxy/i, "");
  if (!p.startsWith("/")) p = "/" + p;
  return p;
}

function parsePath(
  normalizedPath: string,
): { action: string; chargeId: string | null } {
  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments[0] === "charges" && segments.length === 2) {
    return { action: "get_charge", chargeId: segments[1] };
  }
  if (segments[0] === "charges" && segments.length === 1) {
    return { action: "create_charge", chargeId: null };
  }
  return { action: "unknown", chargeId: null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const originalPath = url.pathname;
  const normalizedPath = normalizePath(originalPath);
  const { action, chargeId } = parsePath(normalizedPath);

  console.log(
    JSON.stringify({
      type: "incoming",
      method: req.method,
      original_path: originalPath,
      normalized_path: normalizedPath,
      action,
    }),
  );

  const laranjinhaBaseUrl = Deno.env.get("LARANJINHA_BASE_URL");
  const laranjinhaSecretKey = Deno.env.get("LARANJINHA_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!laranjinhaBaseUrl || !laranjinhaSecretKey) {
    console.error(
      JSON.stringify({ type: "config_error", message: "LARANJINHA env vars missing" }),
    );
    return jsonResponse({ error: "Payment service not configured" }, 500);
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      JSON.stringify({ type: "config_error", message: "Supabase env vars missing" }),
    );
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const laranjinhaBase = laranjinhaBaseUrl.replace(/\/+$/, "");

  if (action === "create_charge" && req.method === "POST") {
    let bodyText: string;
    try {
      const reader = req.body?.getReader();
      if (!reader) {
        return jsonResponse({ error: "Missing request body" }, 400);
      }

      const chunks: Uint8Array[] = [];
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        if (totalBytes > MAX_BODY_BYTES) {
          reader.cancel();
          return jsonResponse({ error: "Body too large" }, 413);
        }
        chunks.push(value);
      }
      bodyText = new TextDecoder().decode(
        new Uint8Array(chunks.flatMap((c) => Array.from(c))),
      );
    } catch {
      return jsonResponse({ error: "Failed to read body" }, 400);
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    const metadata = body.metadata as Record<string, unknown> | undefined;
    const orderId = metadata?.order_id as string | undefined;
    const payer = body.payer as Record<string, unknown> | undefined;

    if (!orderId || !payer?.name || !payer?.email || !payer?.document) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    const { error: insertError } = await supabase.from("orders").insert({
      order_id: orderId,
      status: "pending",
      customer_name: payer.name as string,
      customer_email: payer.email as string,
      customer_document: payer.document as string,
      amount_cents: body.amount_cents as number,
      product: (metadata?.product as string) || "barraca-automatica-joyfox",
      shipping_address: body.shipping_address || null,
    });

    if (insertError) {
      console.error(
        JSON.stringify({ type: "db_error", message: "insert order failed", detail: insertError.message }),
      );
      return jsonResponse({ error: "Failed to create order" }, 500);
    }

    const providerUrl = `${laranjinhaBase}/charges`;

    console.log(
      JSON.stringify({
        type: "provider_request",
        method: "POST",
        provider_url: providerUrl,
        laranjinha_base_len: laranjinhaBase.length,
        action: "create_charge",
      }),
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let laranjinhaResponse: Response;
    try {
      laranjinhaResponse = await fetch(providerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": laranjinhaSecretKey,
        },
        body: JSON.stringify({
          amount_cents: body.amount_cents,
          description: body.description,
          payer: {
            name: payer.name,
            email: payer.email,
            document: payer.document,
          },
          metadata: {
            order_id: orderId,
            product: metadata?.product || "barraca-automatica-joyfox",
          },
        }),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      console.error(
        JSON.stringify({
          type: "provider_error",
          message: "fetch failed",
          provider_url: providerUrl,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("order_id", orderId);
      return jsonResponse({ error: "Payment service unavailable" }, 502);
    }
    clearTimeout(timeout);

    let providerResponseBody = "";
    try {
      providerResponseBody = await laranjinhaResponse.text();
    } catch {
      providerResponseBody = "<unreadable>";
    }

    console.log(
      JSON.stringify({
        type: "provider_response",
        method: "POST",
        provider_url: providerUrl,
        provider_status: laranjinhaResponse.status,
        provider_response_preview: providerResponseBody.substring(0, 500),
      }),
    );

    if (!laranjinhaResponse.ok) {
      const status = laranjinhaResponse.status;
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("order_id", orderId);
      return jsonResponse(
        { error: "Payment provider error", provider_status: status },
        status,
      );
    }

    let chargeData: Record<string, unknown>;
    try {
      chargeData = JSON.parse(providerResponseBody);
    } catch {
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("order_id", orderId);
      return jsonResponse({ error: "Invalid response from payment service" }, 502);
    }

    const chargeIdFromResponse = chargeData.id as string | undefined;
    if (chargeIdFromResponse) {
      await supabase
        .from("orders")
        .update({ charge_id: chargeIdFromResponse })
        .eq("order_id", orderId);
    }

    return new Response(JSON.stringify(chargeData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (action === "get_charge" && req.method === "GET" && chargeId) {
    const providerUrl = `${laranjinhaBase}/charges/${chargeId}`;

    console.log(
      JSON.stringify({
        type: "provider_request",
        method: "GET",
        provider_url: providerUrl,
        action: "get_charge",
      }),
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let laranjinhaResponse: Response;
    try {
      laranjinhaResponse = await fetch(providerUrl, {
        method: "GET",
        headers: {
          "X-API-Key": laranjinhaSecretKey,
        },
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      console.error(
        JSON.stringify({
          type: "provider_error",
          message: "fetch failed",
          provider_url: providerUrl,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      return jsonResponse({ error: "Payment service unavailable" }, 502);
    }
    clearTimeout(timeout);

    let providerResponseBody = "";
    try {
      providerResponseBody = await laranjinhaResponse.text();
    } catch {
      providerResponseBody = "<unreadable>";
    }

    console.log(
      JSON.stringify({
        type: "provider_response",
        method: "GET",
        provider_url: providerUrl,
        provider_status: laranjinhaResponse.status,
        provider_response_preview: providerResponseBody.substring(0, 500),
      }),
    );

    if (!laranjinhaResponse.ok) {
      const status = laranjinhaResponse.status;
      return jsonResponse(
        { error: "Charge not found", provider_status: status },
        status,
      );
    }

    let chargeData: Record<string, unknown>;
    try {
      chargeData = JSON.parse(providerResponseBody);
    } catch {
      return jsonResponse({ error: "Invalid response from payment service" }, 502);
    }

    const chargeStatus = chargeData.status as string | undefined;
    const chargeMetadata = chargeData.metadata as Record<string, unknown> | undefined;
    const chargeOrderId = chargeMetadata?.order_id as string | undefined;

    if (chargeStatus && chargeOrderId) {
      const validStatuses = ["pending", "paid", "expired", "failed"];
      if (validStatuses.includes(chargeStatus)) {
        const updateData: Record<string, unknown> = { status: chargeStatus };
        if (chargeStatus === "paid") {
          updateData.paid_at = new Date().toISOString();
        }
        await supabase
          .from("orders")
          .update(updateData)
          .eq("order_id", chargeOrderId);
      }
    }

    return new Response(JSON.stringify(chargeData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return jsonResponse(
    {
      ok: false,
      error: "route_not_found",
      method: req.method,
      path: originalPath,
      normalized_path: normalizedPath,
    },
    404,
  );
});
