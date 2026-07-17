import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function formatBRL(cents: number): string {
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  product: string;
  amountCents: number;
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const displayName = data.customerName || "Cliente";
  const productName =
    data.product === "barraca-automatica-joyfox"
      ? "Barraca Automática Joyfox"
      : data.product;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento confirmado — Forest Dog</title>
</head>
<body style="margin:0;padding:0;background-color:#F3EFE7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3EFE7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFFFF;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#263728;padding:24px 32px;text-align:center;">
              <span style="color:#FFFFFF;font-size:18px;font-weight:700;letter-spacing:-0.02em;">Forest Dog</span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#171914;">Pagamento confirmado</h1>
              <p style="margin:0 0 32px;font-size:14px;color:#666A61;">Seu pedido foi recebido com sucesso.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DDD8CE;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#666A61;">
                      <tr>
                        <td style="padding-bottom:12px;">Cliente</td>
                        <td style="padding-bottom:12px;text-align:right;color:#171914;font-weight:500;">${displayName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">Pedido</td>
                        <td style="padding-bottom:12px;text-align:right;color:#171914;font-weight:500;">${data.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">Produto</td>
                        <td style="padding-bottom:12px;text-align:right;color:#171914;font-weight:500;">${productName}</td>
                      </tr>
                      <tr>
                        <td style="border-top:1px solid #DDD8CE;padding-top:12px;">Total</td>
                        <td style="border-top:1px solid #DDD8CE;padding-top:12px;text-align:right;color:#171914;font-weight:700;font-size:15px;">${formatBRL(data.amountCents)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DDD8CE;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#171914;">Próximos passos</p>
                    <p style="margin:0 0 8px;font-size:13px;color:#666A61;line-height:1.6;">Seu pedido foi recebido e será preparado para envio.</p>
                    <p style="margin:0;font-size:13px;color:#666A61;line-height:1.6;">O código de rastreio ficará disponível após a postagem.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#666A61;text-align:center;">
                Em caso de dúvidas, entre em contato pelo WhatsApp.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F3EFE7;padding:16px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#666A61;">© 2026 Forest Dog — Todos os direitos reservados</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildOrderConfirmationText(data: OrderEmailData): string {
  const displayName = data.customerName || "Cliente";
  const productName =
    data.product === "barraca-automatica-joyfox"
      ? "Barraca Automática Joyfox"
      : data.product;

  return [
    `Pagamento confirmado — Forest Dog`,
    ``,
    `Olá ${displayName},`,
    ``,
    `Seu pedido foi recebido com sucesso.`,
    ``,
    `Pedido: ${data.orderId}`,
    `Produto: ${productName}`,
    `Total: ${formatBRL(data.amountCents)}`,
    ``,
    `Próximos passos:`,
    `- Seu pedido foi recebido e será preparado para envio.`,
    `- O código de rastreio ficará disponível após a postagem.`,
    ``,
    `Em caso de dúvidas, entre em contato pelo WhatsApp.`,
    ``,
    `© 2026 Forest Dog`,
  ].join("\n");
}

async function sendOrderConfirmationEmail(
  data: OrderEmailData,
): Promise<{ ok: boolean; emailId?: string; error?: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

  if (!apiKey || !fromEmail) {
    console.error(
      `[email] RESEND_API_KEY or RESEND_FROM_EMAIL not configured`,
    );
    return { ok: false, error: "Resend not configured" };
  }

  const subject = `Pagamento confirmado — Pedido ${data.orderId}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [data.customerEmail],
      subject,
      text: buildOrderConfirmationText(data),
      html: buildOrderConfirmationHtml(data),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error(
      `[email] Resend failed: order=${data.orderId} http=${res.status}`,
    );
    return { ok: false, error: `HTTP ${res.status}: ${errBody.slice(0, 200)}` };
  }

  const body = await res.json();
  console.log(
    `[email] Sent: order=${data.orderId} email_id=${body.id ?? "unknown"}`,
  );
  return { ok: true, emailId: body.id };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signature = req.headers.get("X-Laranjinha-Signature");
    const timestamp = req.headers.get("X-Laranjinha-Timestamp");
    const deliveryId = req.headers.get("X-Laranjinha-Delivery");
    const eventType = req.headers.get("X-Laranjinha-Event");

    if (!signature || !timestamp || !deliveryId || !eventType) {
      return new Response(JSON.stringify({ error: "Missing required headers" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const timestampMs = new Date(timestamp).getTime();
    if (isNaN(timestampMs)) {
      return new Response(JSON.stringify({ error: "Invalid timestamp" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    if (Math.abs(now - timestampMs) > FIVE_MINUTES_MS) {
      return new Response(JSON.stringify({ error: "Timestamp too old" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    const expectedSignature = await crypto.subtle
      .importKey(
        "raw",
        new TextEncoder().encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      )
      .then((key) =>
        crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body))
      )
      .then((sig) =>
        Array.from(new Uint8Array(sig))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );

    const signatureBytes = hexToBytes(expectedSignature);
    const providedSignatureBytes = hexToBytes(signature);

    if (!timingSafeEqual(signatureBytes, providedSignatureBytes)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials not configured");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: deliveryError } = await supabase
      .from("webhook_deliveries")
      .upsert(
        {
          delivery_id: deliveryId,
          event_type: eventType,
          processed_at: new Date().toISOString(),
        },
        { onConflict: "delivery_id" },
      );

    if (deliveryError) {
      console.error("Failed to record delivery:", deliveryError);
      return new Response(JSON.stringify({ error: "Failed to record delivery" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (eventType === "sale.paid") {
      const charge = payload.charge as Record<string, unknown> | undefined;
      if (!charge) {
        return new Response(JSON.stringify({ error: "Missing charge data" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const chargeId = charge.id as string;
      const metadata = charge.metadata as Record<string, unknown> | undefined;
      const orderId =
        (metadata?.order_id as string) || (charge.external_id as string);

      if (!orderId) {
        return new Response(JSON.stringify({ error: "Missing order ID" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id, status")
        .eq("order_id", orderId)
        .single();

      if (existingOrder && existingOrder.status === "paid") {
        return new Response(JSON.stringify({ received: true, idempotent: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const payer = charge.payer as Record<string, unknown> | undefined;
      const updateData: Record<string, unknown> = {
        status: "paid",
        charge_id: chargeId,
        paid_at: new Date().toISOString(),
      };

      if (existingOrder) {
        if (payer?.name) updateData.customer_name = payer.name;
        if (payer?.email) updateData.customer_email = payer.email;
        if (payer?.document) updateData.customer_document = payer.document;
        if (charge.amount_cents) updateData.amount_cents = charge.amount_cents;

        const { error: updateError } = await supabase
          .from("orders")
          .update(updateData)
          .eq("order_id", orderId);

        if (updateError) {
          console.error("Failed to update order:", updateError);
          return new Response(JSON.stringify({ error: "Failed to update order" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        updateData.order_id = orderId;
        updateData.product = metadata?.product || "barraca-automatica-joyfox";
        if (payer?.name) updateData.customer_name = payer.name;
        if (payer?.email) updateData.customer_email = payer.email;
        if (payer?.document) updateData.customer_document = payer.document;
        if (charge.amount_cents) updateData.amount_cents = charge.amount_cents;

        const { error: insertError } = await supabase
          .from("orders")
          .insert(updateData);

        if (insertError) {
          console.error("Failed to insert order:", insertError);
          return new Response(JSON.stringify({ error: "Failed to create order" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const { data: orderRow } = await supabase
        .from("orders")
        .select("customer_email, customer_name, product, amount_cents, confirmation_email_sent_at")
        .eq("order_id", orderId)
        .single();

      if (!orderRow) {
        console.error(`[email] Order row not found after save: ${orderId}`);
      } else if (!orderRow.customer_email) {
        console.error(`[email] No customer_email for order ${orderId}`);
      } else if (orderRow.confirmation_email_sent_at) {
        console.log(`[email] Already sent for order ${orderId}`);
      } else {
        const result = await sendOrderConfirmationEmail({
          orderId,
          customerName: orderRow.customer_name || "",
          customerEmail: orderRow.customer_email,
          product: orderRow.product || "barraca-automatica-joyfox",
          amountCents: orderRow.amount_cents || 0,
        });

        if (result.ok) {
          await supabase
            .from("orders")
            .update({
              confirmation_email_sent_at: new Date().toISOString(),
              confirmation_email_id: result.emailId || null,
              confirmation_email_error: null,
            })
            .eq("order_id", orderId);
        } else {
          await supabase
            .from("orders")
            .update({
              confirmation_email_error: result.error || "Unknown error",
            })
            .eq("order_id", orderId);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
