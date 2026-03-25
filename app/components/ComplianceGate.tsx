"use client";

import { useMemo, useState } from "react";
import ScrollReveal from "./ScrollReveal";

type KycStatus = "verified" | "pending" | "failed";

interface EvaluationState {
  kyc: KycStatus;
  amlHit: boolean;
  corridor: "standard" | "high-risk";
  amount: number;
  deviceTrust: number;
  disputes: number;
  customerName: string;
  email: string;
  account: string;
}

const defaultState: EvaluationState = {
  kyc: "verified",
  amlHit: false,
  corridor: "standard",
  amount: 350,
  deviceTrust: 8,
  disputes: 0,
  customerName: "Aria Santos",
  email: "aria.santos@example.com",
  account: "PH-1029-8832-4471",
};

export default function ComplianceGate() {
  const [form, setForm] = useState<EvaluationState>(defaultState);
  const [decision, setDecision] = useState<{ verdict: string; reasons: string[]; score: number } | null>(null);

  const tokenizedPayload = useMemo(() => {
    const mask = (value: string, visible = 2) => `${value.slice(0, visible)}***${value.slice(-2)}`;
    return {
      name: mask(form.customerName, 1),
      email: form.email.replace(/(^.).*(@.*$)/, (_m, start, domain) => `${start}***${domain}`),
      account: mask(form.account, 3),
    };
  }, [form]);

  const evaluate = () => {
    let score = 0;
    const reasons: string[] = [];

    if (form.amlHit) {
      score += 40;
      reasons.push("AML watchlist flag");
    }
    if (form.kyc === "pending") {
      score += 15;
      reasons.push("KYC pending");
    }
    if (form.kyc === "failed") {
      score += 40;
      reasons.push("KYC failed");
    }
    if (form.corridor === "high-risk") {
      score += 20;
      reasons.push("High-risk corridor");
    }
    if (form.amount > 1000) {
      score += 15;
      reasons.push("High amount");
    }
    if (form.deviceTrust < 5) {
      score += 10;
      reasons.push("Low device trust");
    }
    if (form.disputes >= 2) {
      score += 10;
      reasons.push("Dispute history");
    }

    const verdict = score >= 70 ? "Reject" : score >= 40 ? "Manual Review" : "Approve";
    setDecision({ verdict, reasons, score });
  };

  const downloadAudit = () => {
    const payload = {
      decision: decision?.verdict ?? "Pending",
      score: decision?.score ?? 0,
      reasons: decision?.reasons ?? [],
      inputs: { ...form, email: tokenizedPayload.email, account: tokenizedPayload.account },
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "compliance-audit-log.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const verdictTone = decision?.verdict === "Approve" ? "text-primary" : decision?.verdict === "Reject" ? "text-red-500" : "text-amber-500";

  return (
    <section id="compliance-gate" className="py-20 lg:py-32 px-8 bg-surface-secondary/20 border-t border-border-subtle/60">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-3">Compliance Gate</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-3">
            KYC/AML checks with tokenized payloads
          </h2>
          <p className="text-text-secondary max-w-3xl mb-10">
            Simulate corridor risk, AML hits, and device trust; see decision reasons and a redacted audit log ready for regulators.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollReveal>
            <div className="rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-6 space-y-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <Field label="KYC status">
                  <select
                    value={form.kyc}
                    onChange={(e) => setForm((f) => ({ ...f, kyc: e.target.value as KycStatus }))}
                    className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </Field>
                <Field label="AML watchlist">
                  <button
                    onClick={() => setForm((f) => ({ ...f, amlHit: !f.amlHit }))}
                    className={`w-full h-11 rounded-xl border text-sm font-semibold transition ${
                      form.amlHit
                        ? "bg-red-500/10 border-red-500/40 text-red-500"
                        : "bg-surface border-border-strong text-text-secondary hover:border-primary/40"
                    }`}
                  >
                    {form.amlHit ? "Hit detected" : "No hit"}
                  </button>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Corridor risk">
                  <div className="grid grid-cols-2 gap-2">
                    {(["standard", "high-risk"] as const).map((corridor) => (
                      <button
                        key={corridor}
                        onClick={() => setForm((f) => ({ ...f, corridor }))}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                          form.corridor === corridor
                            ? "bg-primary text-text-inverse"
                            : "bg-surface border border-border-strong text-text-secondary hover:border-primary/50"
                        }`}
                      >
                        {corridor}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Device trust score">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.deviceTrust}
                    onChange={(e) => setForm((f) => ({ ...f, deviceTrust: Number(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-text-muted mt-1">{form.deviceTrust} / 10</p>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Transaction amount (USD)">
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Disputes in last 12mo">
                  <input
                    type="number"
                    value={form.disputes}
                    onChange={(e) => setForm((f) => ({ ...f, disputes: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Customer name">
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                    className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
                <Field label="Account ID">
                  <input
                    type="text"
                    value={form.account}
                    onChange={(e) => setForm((f) => ({ ...f, account: e.target.value }))}
                    className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </Field>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={evaluate}
                  className="flex-1 h-12 rounded-xl bg-text-primary text-text-inverse font-semibold hover:opacity-90 transition"
                >
                  Evaluate controls
                </button>
                <button
                  onClick={() => setForm(defaultState)}
                  className="h-12 px-4 rounded-xl border border-border-strong text-text-secondary hover:border-primary/40"
                >
                  Reset
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Decision</p>
                  <p className={`text-2xl font-bold ${verdictTone || "text-text-primary"}`}>
                    {decision?.verdict ?? "Pending"}
                  </p>
                  <p className="text-sm text-text-secondary">Score: {decision?.score ?? 0} / 100</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Controls</p>
                  <p className="text-sm text-text-primary">KYC + AML + Tokenization</p>
                  <p className="text-[11px] text-text-secondary">Audit-ready JSON export</p>
                </div>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">Reason codes</p>
                {decision && decision.reasons.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {decision.reasons.map((reason) => (
                      <li key={reason} className="text-[11px] font-semibold text-text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                        {reason}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-secondary">Run an evaluation to surface reason codes.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TokenCard label="Tokenized name" value={tokenizedPayload.name} />
                <TokenCard label="Tokenized email" value={tokenizedPayload.email} />
                <TokenCard label="Tokenized account" value={tokenizedPayload.account} />
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-muted">Controls enforced</p>
                <ul className="text-sm text-text-secondary space-y-1 mt-1">
                  <li>PII tokenized before storage</li>
                  <li>Audit log export with reason codes</li>
                  <li>Risk-based decisioning (corridor + AML + device trust)</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadAudit}
                  className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-primary text-text-inverse font-semibold hover:opacity-90 transition"
                >
                  Download audit log
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                </button>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-border-strong text-text-secondary hover:border-primary/40"
                >
                  Map to demos
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</p>
      {children}
    </div>
  );
}

function TokenCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface px-3.5 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
