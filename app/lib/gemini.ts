import { getResumeContext } from "@/app/lib/resume-context";
import { GREETING_RESPONSE } from "@/app/lib/chatbot-persona";
import { headers } from "next/headers";

type ChatHistoryItem = { role: "user" | "assistant"; content: string };

type ChatResult = {
  answer: string;
  usedModel: string;
  fromCache: boolean;
};

// Default preference list for v1beta generateContent. Override via GEMINI_MODEL_PREFERENCE.
// Ordered from latest/free-first to broader options.
const DEFAULT_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash",
  "gemini-1.5-pro-002",
];
const GENERATE_BASE = "https://generativelanguage.googleapis.com/v1beta";

type CachedHandle = {
  name: string;
  expiresAt: number;
  model: string;
};

const cachedHandles = new Map<string, CachedHandle>();

function getEnvList(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
}

function getEnvNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function stripControl(input: string): string {
  return input.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

function buildSystemPrompt(): string {
  return [
    "You are James Florence Conales' professional assistant.",
    "Audience: hiring managers and tech leads.",
    "Tone: concise, factual, security-first fintech engineer; optionally add technical depth when useful; professional and confident.",
    "Greeting behavior: if the user greets with no specific ask, respond immediately with: " + GREETING_RESPONSE,
    "Grounding: use ONLY facts from the provided resume context. Do NOT invent employers, dates, metrics, or contact details. If information is missing, say it is not available.",
    "Compliance: refuse to share phone numbers, emails, salary expectations, or unrelated personal data.",
    "Format: 3-6 tight sentences or bullets; call out achievements and relevant fintech/security skills. Offer a short follow-up suggestion if relevant.",
  ].join(" \n");
}

function buildUserContext(contextText: string): string {
  return [
    "Resume context (sanitized, no PII):",
    contextText,
    "Use only this context when answering.",
  ].join("\n");
}

function isRetryableStatus(status: number): boolean {
  // Retry on rate limit, server errors, and model/permission issues (403/404) to fall back to the next model.
  return [403, 404, 429, 500, 502, 503, 504].includes(status);
}

function parseAnswer(json: any): string | null {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .map((part: any) => {
      if (typeof part?.text === "string") return part.text;
      if (typeof part === "string") return part;
      return "";
    })
    .join("")
    .trim();
  return text || null;
}

async function ensureCachedContext(model: string, contextText: string): Promise<CachedHandle | null> {
  const ttlMinutes = getEnvNumber("GEMINI_CACHE_TTL_MINUTES", 60);
  const existing = cachedHandles.get(model);
  const now = Date.now();
  if (existing && existing.expiresAt > now + 30_000) {
    return existing;
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;

  const url = `${GENERATE_BASE}/cachedContents?key=${apiKey}`;
  const ttlSeconds = Math.max(60, Math.min(ttlMinutes * 60, 86_400));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${model}`,
        displayName: "resume-context",
        ttl: `${ttlSeconds}s`,
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserContext(contextText) }],
          },
        ],
      }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as { name?: string; expireTime?: string };
    if (!json.name) return null;

    const expiresAt = json.expireTime
      ? Date.parse(json.expireTime)
      : now + ttlSeconds * 1000;

    const handle: CachedHandle = {
      name: json.name,
      expiresAt,
      model,
    };
    cachedHandles.set(model, handle);
    return handle;
  } catch (error) {
    console.error("[gemini-cache] create failed", error);
    return null;
  }
}

function redactPrompt(input: string): string {
  return input.replace(/https?:\/\/\S+/gi, "[link redacted]");
}

function normalizeRole(role: "user" | "assistant"): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

function buildContents({
  history,
  message,
  contextText,
  useCached,
}: {
  history: ChatHistoryItem[];
  message: string;
  contextText: string;
  useCached: boolean;
}): Array<{ role: string; parts: { text: string }[] }> {
  const contents: Array<{ role: string; parts: { text: string }[] }> = [];

  if (!useCached) {
    contents.push({ role: "user", parts: [{ text: buildUserContext(contextText) }] });
  }

  history.forEach((item) => {
    const text = stripControl(item.content);
    if (!text) return;
    contents.push({ role: normalizeRole(item.role), parts: [{ text }] });
  });

  contents.push({ role: "user", parts: [{ text: stripControl(message) }] });
  return contents;
}

async function callModel(params: {
  model: string;
  apiKey: string;
  message: string;
  history: ChatHistoryItem[];
  contextText: string;
  temperature: number;
  maxOutputTokens: number;
}): Promise<ChatResult> {
  const { model, apiKey, message, history, contextText, temperature, maxOutputTokens } = params;

  const cacheHandle = await ensureCachedContext(model, contextText);
  const useCached = Boolean(cacheHandle);

  const body: Record<string, any> = {
    systemInstruction: {
      role: "system",
      parts: [{ text: buildSystemPrompt() }],
    },
    contents: buildContents({ history, message, contextText, useCached }),
    generationConfig: {
      temperature,
      maxOutputTokens,
      topP: 0.9,
      topK: 40,
    },
  };

  if (useCached && cacheHandle) {
    body.cachedContent = cacheHandle.name;
  }

  const endpoint = `${GENERATE_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const requestHeaders = await headers();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-agent": requestHeaders.get("user-agent") ?? "",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let reason = "";
    try {
      const errBody = await res.json();
      reason = errBody?.error?.message ?? "";
    } catch {
      // ignore
    }

    const retryable = isRetryableStatus(res.status);
    const error = new Error(
      `Gemini request failed: ${res.status}${reason ? ` - ${reason}` : ""}`,
    ) as Error & {
      status?: number;
      retryable?: boolean;
    };
    error.status = res.status;
    error.retryable = retryable;
    throw error;
  }

  const json = await res.json();
  const answer = parseAnswer(json);
  if (!answer) {
    const error = new Error("model_format_error");
    (error as any).status = 502;
    throw error;
  }

  return {
    answer: redactPrompt(answer),
    usedModel: model,
    fromCache: useCached,
  };
}

export async function generateChatAnswer(input: {
  message: string;
  history?: ChatHistoryItem[];
}): Promise<ChatResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("GOOGLE_AI_API_KEY is not set"), { status: 500 });
  }

  const models = getEnvList("GEMINI_MODEL_PREFERENCE", DEFAULT_MODELS);
  if (!models.length) {
    throw Object.assign(new Error("no_models_configured"), { status: 500 });
  }
  const temperature = getEnvNumber("GEMINI_TEMPERATURE", 0.25);
  const maxOutputTokens = getEnvNumber("GEMINI_MAX_OUTPUT_TOKENS", 512);

  const trimmedHistory = (input.history ?? [])
    .filter((item) => item && item.content)
    .slice(-6)
    .map((item) => ({ role: item.role, content: item.content.slice(0, 1200) }));

  const message = stripControl(input.message).slice(0, 800);

  const { contextText } = await getResumeContext();

  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const result = await callModel({
        model,
        apiKey,
        message,
        history: trimmedHistory,
        contextText,
        temperature,
        maxOutputTokens,
      });
      return result;
    } catch (error) {
      const err = error as Error & { status?: number; retryable?: boolean };
      lastError = err;
      if (!err.retryable) break;
      continue;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw Object.assign(new Error("model_unavailable"), { status: 503 });
}

export type { ChatHistoryItem };
