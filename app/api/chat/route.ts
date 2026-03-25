import { NextResponse } from "next/server";
import { z } from "zod";
import { generateChatAnswer, type ChatHistoryItem } from "@/app/lib/gemini";
import { GREETING_RESPONSE, isGreetingMessage } from "@/app/lib/chatbot-persona";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(800),
  history: z
    .array(
      z.object({
        // We accept assistant/user but normalize to model/user for Gemini inside the client.
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1200),
      }),
    )
    .optional(),
});

const disallowedPattern = /(phone number|email|contact|salary|rate|whatsapp)/i;
const urlPattern = /https?:\/\/\S+/i;
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

function hasDisallowed(content: string): boolean {
  return disallowedPattern.test(content) || urlPattern.test(content) || emailPattern.test(content);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { message, history = [] } = parsed.data;

    const invalid = [message, ...history.map((h) => h.content)].some((item) => hasDisallowed(item));
    if (invalid) {
      return NextResponse.json({ error: "restricted_prompt" }, { status: 400 });
    }

    if (isGreetingMessage(message)) {
      return NextResponse.json({
        answer: GREETING_RESPONSE,
        usedModel: "deterministic",
        fromCache: true,
      });
    }

    const result = await generateChatAnswer({
      message,
      history: history as ChatHistoryItem[],
    });

    return NextResponse.json({
      answer: result.answer,
      usedModel: result.usedModel,
      fromCache: result.fromCache,
    });
  } catch (error) {
    const status = (error as any)?.status ?? 500;
    const code = (error as any)?.code ?? (error as Error).message ?? "internal_error";
    return NextResponse.json({ error: code }, { status });
  }
}
