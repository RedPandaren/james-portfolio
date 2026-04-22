"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  intent: "hiring" | "talk";
  message: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

const initialForm: FormData = {
  name: "",
  email: "",
  intent: "hiring",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleChange(
    field: keyof FormData,
    value: string,
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }

      setStatus("success");
      setFormData(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMessage((err as Error).message || "Failed to send. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[var(--sem-primary)] bg-[var(--sem-primary-subtle)] p-5">
        <p className="text-sm font-medium text-[var(--sem-primary)]">
          Thanks for reaching out! I&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-primary)]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--sem-border)] p-5">
      <p className="text-xs text-[var(--sem-text-muted)] mb-4">
        Sends to Discord as a workflow automation
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          required
          minLength={1}
          maxLength={100}
          disabled={status === "loading"}
          className="rounded-lg border border-[var(--sem-border)] bg-[var(--sem-surface)] px-3 py-2 text-sm text-[var(--sem-text-primary)] outline-none transition focus:border-[var(--sem-border-focus)] disabled:opacity-60"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Your email"
          required
          disabled={status === "loading"}
          className="rounded-lg border border-[var(--sem-border)] bg-[var(--sem-surface)] px-3 py-2 text-sm text-[var(--sem-text-primary)] outline-none transition focus:border-[var(--sem-border-focus)] disabled:opacity-60"
        />
      </div>

      <select
        name="intent"
        value={formData.intent}
        onChange={(e) => handleChange("intent", e.target.value)}
        disabled={status === "loading"}
        className="mb-3 w-full rounded-lg border border-[var(--sem-border)] bg-[var(--sem-surface)] px-3 py-2 text-sm text-[var(--sem-text-primary)] outline-none transition focus:border-[var(--sem-border-focus)] disabled:opacity-60"
      >
        <option value="hiring">I&apos;m hiring — let&apos;s talk</option>
        <option value="talk">Just want to talk</option>
      </select>

      <textarea
        name="message"
        value={formData.message}
        onChange={(e) => handleChange("message", e.target.value)}
        placeholder="Your message"
        required
        minLength={1}
        maxLength={1000}
        rows={3}
        disabled={status === "loading"}
        className="mb-3 w-full rounded-lg border border-[var(--sem-border)] bg-[var(--sem-surface)] px-3 py-2 text-sm text-[var(--sem-text-primary)] outline-none transition focus:border-[var(--sem-border-focus)] disabled:opacity-60 resize-none"
      />

      {status === "error" && errorMessage ? (
        <p className="mb-3 text-xs text-[var(--sem-error)]">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[var(--sem-primary)] px-4 py-2 text-sm font-semibold text-[var(--sem-text-inverse)] shadow-sm transition disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}