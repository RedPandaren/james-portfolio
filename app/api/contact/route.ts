import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email(),
  intent: z.enum(["hiring", "talk"]),
  message: z.string().trim().min(1).max(1000),
  company: z.string().max(200).optional().default(""),
});

const IN_MEMORY_RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

type AutomationPayload = {
  name: string;
  email: string;
  intent: "hiring" | "talk";
  message: string;
  source: "portfolio-contact-form";
  submittedAt: string;
  userAgent?: string;
  ipHash?: string;
};

type DiscordPayload = Pick<AutomationPayload, "name" | "email" | "intent" | "message">;

function hashIp(ip: string): string | undefined {
  if (!ip || ip === "unknown") {
    return undefined;
  }

  return createHash("sha256").update(ip).digest("hex");
}

async function sendToAutomation(payload: AutomationPayload) {
  const webhookUrl = process.env.AUTOMATION_WEBHOOK_URL;
  const webhookSecret = process.env.AUTOMATION_WEBHOOK_SECRET;

  if (!webhookUrl) {
    console.error("[contact] AUTOMATION_WEBHOOK_URL not configured");
    throw new Error("Webhook not configured");
  }

  if (!webhookSecret) {
    console.error("[contact] AUTOMATION_WEBHOOK_SECRET not configured");
    throw new Error("Webhook secret not configured");
  }

  const timeoutMs = Number(process.env.AUTOMATION_TIMEOUT_MS ?? 8000);

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-automation-secret": webhookSecret,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(Number.isFinite(timeoutMs) ? timeoutMs : 8000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[contact] Automation webhook failed:", res.status, text);
    throw new Error("Failed to trigger automation");
  }
}

async function sendToDiscord(payload: DiscordPayload) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("[contact] DISCORD_WEBHOOK_URL not configured");
    throw new Error("Discord webhook not configured");
  }

  const intentLabel = payload.intent === "hiring" ? "Hiring Inquiry" : "Talk Request";
  const embed = {
    embeds: [
      {
        title: `New Lead - ${intentLabel}`,
        color: 5814783,
        fields: [
          {
            name: "Name",
            value: payload.name,
            inline: true,
          },
          {
            name: "Email",
            value: payload.email,
            inline: true,
          },
          {
            name: "Message",
            value: payload.message.slice(0, 1024),
          },
        ],
        footer: {
          text: "Source: jamesconales.com",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(embed),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[contact] Discord webhook failed:", res.status, text);
    throw new Error("Failed to send to Discord");
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = IN_MEMORY_RATE_LIMIT.get(ip);

  if (!record || now > record.resetAt) {
    IN_MEMORY_RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "rate_limit_exceeded" },
        { status: 429 },
      );
    }

    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, intent, message, company } = parsed.data;

    if (company.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const sanitized = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      intent,
      message: sanitizeInput(message),
      source: "portfolio-contact-form" as const,
      submittedAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") ?? undefined,
      ipHash: hashIp(clientIp),
    };

    await Promise.all([
      sendToAutomation(sanitized),
      sendToDiscord(sanitized),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    let status = 500;
    let code = "internal_error";

    if (error instanceof Error) {
      code = error.message;
      if ("status" in error && typeof (error as { status?: unknown }).status === "number") {
        status = (error as { status: number }).status;
      }
    }

    console.error("[contact] Error:", code);
    return NextResponse.json({ error: code }, { status });
  }
}
