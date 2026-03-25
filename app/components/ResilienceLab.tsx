"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

type StepStatus = "pending" | "running" | "done";

type IncidentScenario = {
  id: string;
  title: string;
  category: "traffic" | "dependency" | "crypto";
  trigger: string;
  impact: string;
  steps: { label: string; detail: string }[];
  result: {
    p95: string;
    errorRate: string;
    allowed: string;
    blocked: string;
    note: string;
  };
};

const scenarios: IncidentScenario[] = [
  {
    id: "partner-timeout",
    title: "Partner Timeout",
    category: "dependency",
    trigger: "Primary remittance provider returns 504 during payout",
    impact: "Payout confirmation delays; customer-facing lag",
    steps: [
      { label: "Detect", detail: "Apigee 5xx spike + tracing correlation IDs" },
      { label: "Throttle", detail: "Sliding Window 65 rpm per partner client_id" },
      { label: "Failover", detail: "Reroute to secondary provider with sticky IDs" },
      { label: "Communicate", detail: "Status page + IVR update" },
      { label: "Audit", detail: "Export redacted headers to GCS" },
    ],
    result: {
      p95: "280ms",
      errorRate: "0.8%",
      allowed: "94%",
      blocked: "6% (rate-limited)",
      note: "Zero double-settlement; retries carried idempotency keys",
    },
  },
  {
    id: "kms-latency",
    title: "KMS Latency Spike",
    category: "crypto",
    trigger: "Cloud KMS region jitter adds 200ms to sign calls",
    impact: "Auth pipeline slows; upstream requests queue",
    steps: [
      { label: "Detect", detail: "p95 sign latency breach in metrics" },
      { label: "Cache", detail: "Short-lived key handles with expiry" },
      { label: "Degrade", detail: "Read-only mode for non-critical flows" },
      { label: "Retry", detail: "Exponential backoff with jitter" },
      { label: "Record", detail: "Tag spans with key-ring + region" },
    ],
    result: {
      p95: "210ms",
      errorRate: "0.4%",
      allowed: "97%",
      blocked: "3% (backpressure)",
      note: "No signature failures; cached handles kept SLAs",
    },
  },
  {
    id: "burst-traffic",
    title: "Burst Traffic",
    category: "traffic",
    trigger: "Payday surge + marketing campaign",
    impact: "Throughput spike risks 429s and queue buildup",
    steps: [
      { label: "Shape", detail: "Token bucket with burst=35, refill tuned" },
      { label: "Prioritize", detail: "Partner traffic > anonymous" },
      { label: "Scale", detail: "Auto-scale Cloud Run; warm pool" },
      { label: "Observe", detail: "Emit per-client fairness snapshot" },
      { label: "Recover", detail: "Drain queues; reset burst to baseline" },
    ],
    result: {
      p95: "240ms",
      errorRate: "0.6%",
      allowed: "96%",
      blocked: "4% (fairness guard)",
      note: "Kept partner SLAs while protecting platform",
    },
  },
];

export default function ResilienceLab() {
  const [selectedId, setSelectedId] = useState<string>(scenarios[0].id);
  const [stepStatus, setStepStatus] = useState<StepStatus[]>(() => scenarios[0].steps.map(() => "pending"));
  const [isRunning, setIsRunning] = useState(false);
  const [completedResult, setCompletedResult] = useState<IncidentScenario["result"] | null>(null);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const scenario = useMemo(() => scenarios.find((s) => s.id === selectedId) ?? scenarios[0], [selectedId]);

  useEffect(() => {
    setStepStatus(scenario.steps.map(() => "pending"));
    setCompletedResult(null);
    setIsRunning(false);
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, [scenario]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runPlaybook = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedResult(null);
    const updates: NodeJS.Timeout[] = [];

    scenario.steps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setStepStatus((prev) => prev.map((status, i) => (i < index ? "done" : i === index ? "running" : "pending")));
      }, index * 700);
      updates.push(timeout);
    });

    const finish = setTimeout(() => {
      setStepStatus(scenario.steps.map(() => "done"));
      setCompletedResult(scenario.result);
      setIsRunning(false);
    }, scenario.steps.length * 700 + 500);

    timers.current = updates.concat(finish);
  };

  const statusColor = (status: StepStatus) => {
    if (status === "running") return "bg-yellow-500/20 border-yellow-500/50 text-yellow-500";
    if (status === "done") return "bg-green-500/15 border-green-500/30 text-green-500";
    return "bg-border-subtle/40 border-border-subtle text-text-muted";
  };

  const categoryBadge = (cat: IncidentScenario["category"]) => {
    if (cat === "traffic") return "bg-primary/10 text-primary border-primary/25";
    if (cat === "dependency") return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
  };

  return (
    <section id="resilience-lab" className="py-20 lg:py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-3">Resilience Lab</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-3">
            Incident playbooks with measurable outcomes
          </h2>
          <p className="text-text-secondary max-w-3xl mb-10">
            Pick an incident, run the playbook, and see how service levels stabilize. Mirrors the rate limiting and failover patterns used in production.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ScrollReveal className="space-y-3">
            {scenarios.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left rounded-2xl border px-4 py-4 transition-all ${
                  item.id === scenario.id
                    ? "border-primary/50 bg-primary/10 shadow-lg"
                    : "border-border-subtle bg-[var(--sem-interactive-bg)] hover:border-[var(--sem-interactive-border-hover)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1 rounded-full border ${categoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] text-text-muted">{item.trigger}</span>
                </div>
                <p className="text-base font-semibold text-text-primary">{item.title}</p>
                <p className="text-xs text-text-secondary mt-1">{item.impact}</p>
              </button>
            ))}

            <button
              onClick={runPlaybook}
              disabled={isRunning}
              className="w-full h-12 rounded-xl bg-text-primary text-text-inverse font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {isRunning ? "Running playbook..." : "Run playbook"}
            </button>
          </ScrollReveal>

          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-text-muted font-semibold">Runbook</p>
                    <h3 className="text-2xl font-semibold text-text-primary">{scenario.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{scenario.trigger}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Impact</p>
                    <p className="text-sm font-semibold text-primary max-w-[240px] leading-snug">{scenario.impact}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {scenario.steps.map((step, index) => (
                    <div
                      key={step.label}
                      className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${statusColor(stepStatus[index])}`}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-primary">{String(index + 1).padStart(2, "0")}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                        <p className="text-[12px] text-text-secondary leading-snug">{step.detail}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-text-muted">
                        {stepStatus[index] === "running" && "Running"}
                        {stepStatus[index] === "done" && "Done"}
                        {stepStatus[index] === "pending" && "Queued"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-border-subtle pt-4">
                  <MetricCard label="p95 latency" value={(completedResult ?? scenario.result).p95} />
                  <MetricCard label="Error rate" value={(completedResult ?? scenario.result).errorRate} />
                  <MetricCard label="Allowed" value={(completedResult ?? scenario.result).allowed} positive />
                  <MetricCard label="Protected" value={(completedResult ?? scenario.result).blocked} />
                </div>

                <div className="mt-4 rounded-xl border border-border-subtle bg-surface/80 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-muted">Outcome</p>
                  <p className="text-sm text-text-primary font-semibold">{(completedResult ?? scenario.result).note}</p>
                  <p className="text-[12px] text-text-secondary mt-1">
                    Mirrors the Rate Limiting Simulator controls and Perahub failover runbooks.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface px-3.5 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">{label}</p>
      <p className={`text-lg font-bold ${positive ? "text-primary" : "text-text-primary"}`}>{value}</p>
    </div>
  );
}
