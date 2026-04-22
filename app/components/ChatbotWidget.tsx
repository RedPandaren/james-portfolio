"use client";

import { useEffect, useMemo, useState } from "react";
import { GREETING_RESPONSE } from "@/app/lib/chatbot-persona";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatError = {
  type: "quota" | "network" | "validation" | "server" | "unknown";
  message: string;
  canRetry: boolean;
  retryAfter?: number;
};

const quickPrompts = [
  "Summarize my fintech experience",
  "Biggest achievements for hiring managers",
  "How do I handle security and compliance?",
  "Recent role impact at PETNET",
];

const SENSITIVE_PATTERNS = [/(rate|salary|compensation|pay|bonus|confidential|sensitive)/i];
const MEETING_SUGGESTION =
  "That's sensitive information — let's set a meeting to discuss directly. Use the contact form below to schedule a call!";

function classifyError(status: number, errorBody?: { error?: string }): ChatError {
  if (status === 429) {
    return {
      type: "quota",
      message: "API quota reached. Wait a moment before trying again.",
      canRetry: true,
      retryAfter: 60,
    };
  }
  if (status >= 500) {
    return {
      type: "server",
      message: "Server busy. Retrying automatically...",
      canRetry: true,
    };
  }
  if (status >= 400 && status < 500) {
    return {
      type: "validation",
      message: errorBody?.error ?? `Request failed (${status})`,
      canRetry: false,
    };
  }
  return {
    type: "unknown",
    message: "Something went wrong. Please try again.",
    canRetry: true,
  };
}

function checkSensitiveTopic(text: string): boolean {
  const lower = text.toLowerCase();
  return SENSITIVE_PATTERNS.some((p) => p.test(lower));
}

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastModel, setLastModel] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [seededIntro, setSeededIntro] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [nowTs, setNowTs] = useState<number>(() => Date.now());
  const [quotaExceededUntil, setQuotaExceededUntil] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const cooldownRemainingMs = Math.max(0, cooldownUntil - nowTs);
  const quotaRemainingMs = Math.max(0, quotaExceededUntil - nowTs);
  const coolingDown = cooldownRemainingMs > 0;
  const quotaExceeded = quotaRemainingMs > 0;
  const isDisabled = isSending || coolingDown || quotaExceeded || isRetrying;
  const canSend = input.trim().length > 0 && !isDisabled;

  useEffect(() => {
    if (isOpen && !seededIntro && messages.length === 0) {
      setMessages([{ id: createId(), role: "assistant", content: GREETING_RESPONSE }]);
      setSeededIntro(true);
    }
  }, [isOpen, seededIntro, messages.length]);

  const lastAssistantMessage = useMemo(
    () => messages.filter((m) => m.role === "assistant").slice(-1)[0]?.content,
    [messages],
  );

  async function sendMessage(text?: string) {
    const userContent = (text ?? input).trim();
    if (!userContent || isSending || isRetrying) return;
    if (coolingDown || quotaExceeded) {
      setError(`Please wait ${Math.ceil(Math.max(cooldownRemainingMs, quotaRemainingMs) / 1000)}s before trying again.`);
      return;
    }

    if (checkSensitiveTopic(userContent)) {
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: MEETING_SUGGESTION },
      ]);
      return;
    }

    const newMessage: Message = { id: createId(), role: "user", content: userContent };
    const pendingMessages = [...messages, newMessage];
    setMessages(pendingMessages);
    setInput("");
    setIsSending(true);
    setError(null);
    setCooldownUntil(Date.now() + 3000);

    let lastError: ChatError | null = null;
    const maxRetries = 2;
    const baseDelay = 2000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userContent,
            history: pendingMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const error = classifyError(res.status, body);

          if (error.type === "quota" && attempt < maxRetries) {
            setQuotaExceededUntil(Date.now() + (error.retryAfter ?? 60) * 1000);
            continue;
          }

          if (error.canRetry && attempt < maxRetries && attempt < maxRetries - 1) {
            lastError = error;
            setIsRetrying(true);
            await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
            setIsRetrying(false);
            continue;
          }

          throw new Error(error.message);
        }

        const data = (await res.json()) as {
          answer: string;
          usedModel?: string;
          fromCache?: boolean;
        };

        setMessages((prev) => [
          ...prev,
          { id: createId(), role: "assistant", content: data.answer },
        ]);
        if (data.usedModel) setLastModel(data.usedModel);
        setFromCache(Boolean(data.fromCache));
        return;
      } catch (err) {
        lastError = classifyError(0);
        if (attempt >= maxRetries) {
          console.error(err);
          setError(lastError.message);
          setMessages((prev) => prev.slice(0, -1));
        }
      }
    }

    setIsSending(false);
    setIsRetrying(false);
  }

  async function copyLastAnswer() {
    if (!lastAssistantMessage || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(lastAssistantMessage);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Copy failed. Try again.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        data-tour="chatbot-launcher"
        className="group fixed bottom-12 right-6 z-[1600] flex items-center gap-3 rounded-full border border-[var(--sem-border)] bg-[var(--sem-surface)] px-4 py-3 shadow-md backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--sem-border-focus)]"
        aria-expanded={isOpen}
      >
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span
            className={`absolute inset-0 rounded-full bg-[var(--sem-primary)] opacity-40 blur-md ${
              reducedMotion ? "" : "animate-pulse"
            }`}
            aria-hidden
          />
          <span className="relative h-3 w-3 rounded-full bg-[var(--sem-primary)] shadow-[0_0_0_6px_rgba(26,86,219,0.15)]" aria-hidden />
        </span>
        <span className="text-sm font-medium text-[var(--sem-text-primary)]">
          Want to know more about me? <span className="text-[var(--sem-primary)]">Ask my AI Chatbot</span>
        </span>
      </button>

      <div
        className={`fixed bottom-32 right-6 z-[1600] w-[min(380px,calc(100vw-24px))] transform rounded-2xl border border-[var(--sem-border)] bg-[var(--sem-surface-overlay)]/95 shadow-xl backdrop-blur-md transition-all duration-200 ${
          isOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--sem-border-subtle)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--sem-text-primary)]">AI Chatbot</p>
            <p className="text-xs text-[var(--sem-text-muted)]">
              Hiring manager friendly · grounded in resume
            </p>
          </div>
          {lastModel ? (
            <span className="rounded-full bg-[var(--sem-primary-subtle)] px-3 py-1 text-xs font-medium text-[var(--sem-primary)] whitespace-nowrap">
              Powered by Gemini{lastModel ? ` · ${lastModel}` : ""}
              {fromCache ? " · cached" : ""}
            </span>
          ) : null}
        </div>

        <div className="flex h-[28rem] flex-col gap-3 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-[var(--sem-border-subtle)] px-3 py-1 text-xs text-[var(--sem-text-secondary)] transition-colors hover:border-[var(--sem-primary)] hover:text-[var(--sem-primary)] disabled:opacity-60"
                disabled={isDisabled}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto rounded-xl border border-[var(--sem-border-subtle)] bg-[var(--sem-surface)] px-3 py-3">
            {messages.length === 0 ? (
              <p className="text-sm text-[var(--sem-text-muted)]">
                Ask about fintech experience, security leadership, or recent impact. This chatbot stays truthful to the resume.
              </p>
            ) : (
              <div className="flex flex-col gap-3 text-sm text-[var(--sem-text-primary)]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                        msg.role === "user"
                          ? "bg-[var(--sem-primary-subtle)] text-[var(--sem-text-primary)]"
                          : "bg-[var(--sem-surface-secondary)] text-[var(--sem-text-primary)]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isSending ? (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-[var(--sem-surface-secondary)] px-3 py-2 text-[var(--sem-text-muted)]">
                      {isRetrying ? "Retrying..." : "Thinking…"}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {error ? (
            <div className="rounded-lg border border-[var(--sem-error)] bg-[var(--sem-error)]/10 px-3 py-2 text-xs text-[var(--sem-error)]">
              {error}
            </div>
          ) : null}

          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <input
              name="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--sem-border)] bg-[var(--sem-surface)] px-3 py-2 text-sm text-[var(--sem-text-primary)] outline-none transition focus:border-[var(--sem-border-focus)]"
              placeholder="Ask about my fintech impact, security, or stack"
              disabled={isSending}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-xl bg-[var(--sem-primary)] px-3 py-2 text-sm font-semibold text-[var(--sem-text-inverse)] shadow-sm transition disabled:opacity-60"
            >
              {isSending ? "Sending" : "Send"}
            </button>
            <button
              type="button"
              onClick={copyLastAnswer}
              className="rounded-xl border border-[var(--sem-border-subtle)] bg-[var(--sem-surface)] px-3 py-2 text-xs text-[var(--sem-text-secondary)] transition hover:border-[var(--sem-primary)] hover:text-[var(--sem-primary)]"
              disabled={!lastAssistantMessage}
            >
              Copy
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
