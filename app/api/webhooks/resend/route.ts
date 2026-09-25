import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const payload = await request.text();

  try {
    const event = secret
      ? await new Resend(process.env.RESEND_API_KEY ?? "re_placeholder").webhooks.verify({
          payload,
          headers: {
            id: request.headers.get("svix-id") ?? "",
            timestamp: request.headers.get("svix-timestamp") ?? "",
            signature: request.headers.get("svix-signature") ?? "",
          },
          webhookSecret: secret,
        })
      : JSON.parse(payload);

    const typedEvent = event as { type?: string; data?: Record<string, unknown> };
    const data = typedEvent.data ?? {};
    await prisma.auditLog.create({
      data: {
        action: `EMAIL_${String(typedEvent.type ?? "UNKNOWN").toUpperCase()}`,
        entityType: "Email",
        entityId: String(data.email_id ?? data.id ?? ""),
        metadata: typedEvent,
      },
    });

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
