"use client";

import { useMemo, useState } from "react";

type Corridor = "domestic" | "crossBorder" | "highRisk";
type AmountBand = "small" | "medium" | "large";
type Channel = "web" | "mobile" | "apiPartner";

interface SimulationState {
  amount: AmountBand;
  corridor: Corridor;
  channel: Channel;
  velocity: number; // tx per minute
  deviceTrusted: boolean;
  disputes: boolean;
  geoMismatch: boolean;
}

interface Reason {
  label: string;
  weight: number;
}

type IdempotencyStatus = "accepted" | "duplicate";

const presets: Record<
  "safe" | "borderline" | "highRisk",
  { label: string; description: string; state: SimulationState }
> = {
  safe: {
    label: "Safe payout",
    description: "Domestic, trusted device, low velocity",
    state: {
      amount: "small",
      corridor: "domestic",
      channel: "mobile",
      velocity: 2,
      deviceTrusted: true,
      disputes: false,
      geoMismatch: false,
    },
  },
  borderline: {
    label: "Borderline review",
    description: "Cross-border with untrusted device",
    state: {
      amount: "medium",
      corridor: "crossBorder",
      channel: "web",
      velocity: 7,
      deviceTrusted: false,
      disputes: false,
      geoMismatch: false,
    },
  },
  highRisk: {
    label: "High-risk burst",
    description: "High-risk corridor, disputes, geo mismatch",
    state: {
      amount: "large",
      corridor: "highRisk",
      channel: "apiPartner",
      velocity: 16,
      deviceTrusted: false,
      disputes: true,
      geoMismatch: true,
    },
  },
};

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function computeRisk(state: SimulationState) {
  const reasons: Reason[] = [];
  let score = 0;

  const corridorWeights: Record<Corridor, number> = {
    domestic: 5,
    crossBorder: 12,
    highRisk: 22,
  };

  const amountWeights: Record<AmountBand, number> = {
    small: 0,
    medium: 6,
    large: 14,
  };

  const channelWeights: Record<Channel, number> = {
    web: 4,
    mobile: 6,
    apiPartner: 10,
  };

  const corridorWeight = corridorWeights[state.corridor];
  score += corridorWeight;
  reasons.push({
    label: `Corridor (${labelForCorridor(state.corridor)})`,
    weight: corridorWeight,
  });

  const amountWeight = amountWeights[state.amount];
  score += amountWeight;
  reasons.push({
    label: `Amount band (${labelForAmount(state.amount)})`,
    weight: amountWeight,
  });

  const channelWeight = channelWeights[state.channel];
  score += channelWeight;
  reasons.push({
    label: `Channel (${labelForChannel(state.channel)})`,
    weight: channelWeight,
  });

  const velocityWeight = Math.min(20, state.velocity * 1.2);
  score += velocityWeight;
  reasons.push({
    label: `Velocity (${state.velocity.toFixed(0)} tx/min)`,
    weight: velocityWeight,
  });

  if (!state.deviceTrusted) {
    score += 12;
    reasons.push({ label: "Untrusted device fingerprint", weight: 12 });
  }

  if (state.disputes) {
    score += 14;
    reasons.push({ label: "Past dispute history", weight: 14 });
  }

  if (state.geoMismatch) {
    score += 10;
    reasons.push({ label: "Geo/IP mismatch", weight: 10 });
  }

  const finalScore = clampScore(score);
  let tier: "Low" | "Medium" | "High" = "Low";
  if (finalScore > 65) tier = "High";
  else if (finalScore >= 35) tier = "Medium";

  const action =
    tier === "Low"
      ? "Allow"
      : tier === "Medium"
        ? "Step-up auth / Manual review"
        : "Manual review / Block";

  const badges = reasons.filter((r) => r.weight >= 10).map((r) => r.label);

  return { score: finalScore, tier, action, reasons, badges };
}

function labelForCorridor(value: Corridor) {
  if (value === "crossBorder") return "Cross-border";
  if (value === "highRisk") return "High-risk";
  return "Domestic";
}

function labelForAmount(value: AmountBand) {
  if (value === "medium") return "Medium";
  if (value === "large") return "Large";
  return "Small";
}

function labelForChannel(value: Channel) {
  if (value === "mobile") return "Mobile";
  if (value === "apiPartner") return "API partner";
  return "Web";
}

export default function FraudSignalExplainer() {
  const [state, setState] = useState<SimulationState>(presets.safe.state);
  const [idempotencyKey, setIdempotencyKey] = useState("txn-123");
  const [idempotencyState, setIdempotencyState] = useState<{
    processedKeys: Set<string>;
    log: { key: string; status: IdempotencyStatus }[];
    status: IdempotencyStatus | null;
  }>({ processedKeys: new Set(), log: [], status: null });

  const result = useMemo(() => computeRisk(state), [state]);

  const acceptedCount = idempotencyState.log.filter(
    (entry) => entry.status === "accepted",
  ).length;
  const duplicateCount = idempotencyState.log.filter(
    (entry) => entry.status === "duplicate",
  ).length;

  const applyPreset = (key: keyof typeof presets) => {
    setState(presets[key].state);
  };

  const simulateIdempotency = () => {
    setIdempotencyState((prev) => {
      const nextKeys = new Set(prev.processedKeys);
      const status: IdempotencyStatus = nextKeys.has(idempotencyKey)
        ? "duplicate"
        : "accepted";
      if (status === "accepted") {
        nextKeys.add(idempotencyKey);
      }
      const nextLog = [{ key: idempotencyKey, status }, ...prev.log].slice(
        0,
        6,
      );
      return { processedKeys: nextKeys, log: nextLog, status };
    });
  };

  const resetIdempotency = () => {
    setIdempotencyState({ processedKeys: new Set(), log: [], status: null });
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-semibold">
                  Inputs
                </p>
                <h3 className="text-xl font-semibold text-text-primary">
                  Transaction signals
                </h3>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1 font-semibold">
                Simulated
              </span>
            </div>

            <div className="space-y-5 mt-4">
              <SelectField
                label="Corridor"
                value={state.corridor}
                options={[
                  { value: "domestic", label: "Domestic" },
                  { value: "crossBorder", label: "Cross-border" },
                  { value: "highRisk", label: "High-risk corridor" },
                ]}
                onChange={(value) =>
                  setState((s) => ({ ...s, corridor: value as Corridor }))
                }
              />

              <SelectField
                label="Amount band"
                value={state.amount}
                options={[
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ]}
                onChange={(value) =>
                  setState((s) => ({ ...s, amount: value as AmountBand }))
                }
              />

              <SelectField
                label="Channel"
                value={state.channel}
                options={[
                  { value: "web", label: "Web" },
                  { value: "mobile", label: "Mobile" },
                  { value: "apiPartner", label: "API partner" },
                ]}
                onChange={(value) =>
                  setState((s) => ({ ...s, channel: value as Channel }))
                }
              />

              <SliderField
                label="Velocity (tx/min)"
                min={0}
                max={20}
                step={1}
                value={state.velocity}
                onChange={(value) =>
                  setState((s) => ({ ...s, velocity: value }))
                }
              />

              <ToggleField
                label="Trusted device fingerprint"
                active={state.deviceTrusted}
                onToggle={() =>
                  setState((s) => ({ ...s, deviceTrusted: !s.deviceTrusted }))
                }
              />

              <ToggleField
                label="Past dispute history"
                active={state.disputes}
                onToggle={() =>
                  setState((s) => ({ ...s, disputes: !s.disputes }))
                }
              />

              <ToggleField
                label="Geo/IP mismatch detected"
                active={state.geoMismatch}
                onToggle={() =>
                  setState((s) => ({ ...s, geoMismatch: !s.geoMismatch }))
                }
              />
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted mb-3 font-semibold">
              Presets
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key as keyof typeof presets)}
                  className="border border-border-subtle rounded-xl p-3 text-left hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 bg-surface/70"
                >
                  <p className="text-sm font-semibold text-text-primary">
                    {preset.label}
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-semibold">
                  Score &amp; Action
                </p>
                <h3 className="text-xl font-semibold text-text-primary">
                  Fraud signal outcome
                </h3>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted bg-border-subtle/50 border border-border-subtle rounded-full px-3 py-1 font-semibold">
                Simulated — not production data
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 items-start">
              <div className="sm:col-span-1 bg-surface-secondary/40 border border-border-subtle rounded-xl p-4 text-center shadow-inner">
                <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-semibold">
                  Risk score
                </p>
                <div className="text-5xl font-bold text-text-primary mt-2">
                  {result.score}
                </div>
                <p className="text-sm text-text-secondary">
                  0 = safe, 100 = risky
                </p>
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between bg-[var(--sem-interactive-bg)] border border-[var(--sem-interactive-border)] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-text-muted font-semibold">
                      Tier
                    </p>
                    <p className="text-lg font-semibold text-text-primary">
                      {result.tier} risk
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
                    {result.action}
                  </span>
                </div>

                {result.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-[11px] font-medium text-primary bg-primary/12 border border-primary/30 rounded-full px-3 py-1"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-semibold">
                  Reason codes
                </p>
                <h3 className="text-lg font-semibold text-text-primary">
                  Explainable signals
                </h3>
              </div>
              <span className="text-[10px] text-text-muted">
                Weights shown are illustrative
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {result.reasons.map((reason) => (
                <div
                  key={reason.label}
                  className="border border-border-subtle rounded-xl p-3 bg-surface/70 flex items-center justify-between"
                >
                  <div className="text-sm text-text-primary">
                    {reason.label}
                  </div>
                  <span className="text-xs font-semibold text-text-secondary bg-border-subtle/60 rounded-full px-3 py-1">
                    +{reason.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-semibold">
                  Idempotency Gate
                </p>
                <h3 className="text-lg font-semibold text-text-primary">
                  Duplicate request protection
                </h3>
              </div>
              <span className="text-[10px] text-text-muted">
                Synthetic queue example
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 md:items-start">
              <div className="md:col-span-2 space-y-3">
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-text-primary">
                    Idempotency key
                  </span>
                  <input
                    value={idempotencyKey}
                    onChange={(e) => setIdempotencyKey(e.target.value)}
                    className="w-full bg-surface-secondary/50 border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--sem-interactive-focus)]"
                    placeholder="txn-123"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={simulateIdempotency}
                    className="inline-flex items-center gap-2 bg-text-primary text-text-inverse rounded-full px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Simulate request
                  </button>
                  <button
                    type="button"
                    onClick={resetIdempotency}
                    className="inline-flex items-center gap-2 border border-border-subtle text-text-secondary rounded-full px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Reset queue
                  </button>
                </div>
                <p className="text-xs text-text-muted">
                  First time a key is seen: enqueued. Subsequent identical keys:
                  short-circuited as duplicates to prevent double processing.
                </p>
              </div>

              <div className="md:col-span-2 w-full border border-border-subtle rounded-2xl p-4 bg-surface-secondary/30 shadow-sm h-full flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted font-semibold">
                    Queue status
                  </p>
                  <span className="text-[10px] text-text-muted">Last 6</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="rounded-lg border border-border-subtle/70 bg-surface/60 px-3 py-2 flex items-center justify-between shadow-inner">
                    <span className="text-text-secondary">Current</span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        idempotencyState.status === "accepted"
                          ? "border-border-subtle text-text-secondary bg-border-subtle/40"
                          : idempotencyState.status === "duplicate"
                            ? "border-primary/40 text-primary bg-primary/10"
                            : "border-border-subtle text-text-muted"
                      }`}
                    >
                      {idempotencyState.status === null
                        ? "Waiting"
                        : idempotencyState.status === "accepted"
                          ? "Enqueued"
                          : "Duplicate"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border-subtle px-3 py-2 bg-surface/60 shadow-inner text-center">
                      <p className="text-text-muted">Accepted</p>
                      <p className="text-base font-semibold text-text-primary">
                        {acceptedCount}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border-subtle px-3 py-2 bg-surface/60 shadow-inner text-center">
                      <p className="text-text-muted">Duplicates</p>
                      <p className="text-base font-semibold text-primary">
                        {duplicateCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-1 min-h-[120px] max-h-[200px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between text-[11px] text-text-muted uppercase tracking-[0.12em]">
                    <span>Recent attempts</span>
                    <span className="text-text-secondary normal-case tracking-normal text-[10px]">
                      Key / Status
                    </span>
                  </div>
                  <div className="space-y-2">
                    {idempotencyState.log.length === 0 && (
                      <div className="text-xs text-text-muted">
                        No requests yet.
                      </div>
                    )}
                    {idempotencyState.log.map((entry, idx: number) => (
                      <div
                        key={`${entry.key}-${idx}`}
                        className="grid grid-cols-[1fr,0.6fr] md:grid-cols-3 items-center gap-2 text-[11px] border border-border-subtle rounded-lg px-3 py-1.5 bg-surface/70"
                      >
                        <span
                          className="text-text-primary truncate col-span-1 md:col-span-2"
                          title={entry.key}
                        >
                          {entry.key}
                        </span>
                        <span
                          className={`text-right font-semibold ${
                            entry.status === "accepted"
                              ? "text-text-secondary"
                              : "text-primary"
                          }`}
                        >
                          {entry.status === "accepted"
                            ? "enqueued"
                            : "duplicate"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <select
        className="w-full bg-surface-secondary/50 border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--sem-interactive-focus)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface SliderFieldProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

function SliderField({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-primary">{label}</span>
        <span className="text-text-secondary">{value.toFixed(0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-[11px] text-text-muted">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function ToggleField({ label, active, onToggle }: ToggleFieldProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-left transition-all duration-150 ${
        active
          ? "border-primary/50 bg-primary/5 text-text-primary"
          : "border-border-subtle bg-surface/70 text-text-secondary hover:border-border"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          active
            ? "border-primary/40 text-primary bg-primary/10"
            : "border-border-subtle text-text-muted"
        }`}
      >
        {active ? "On" : "Off"}
      </span>
    </button>
  );
}
