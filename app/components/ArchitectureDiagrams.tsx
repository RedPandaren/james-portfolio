import ScrollReveal from "./ScrollReveal";
import TrackedLink from "./TrackedLink";

type ArchitecturePath = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  anchor: string;
  accent: "security" | "reliability";
  steps: { label: string; detail: string }[];
  highlights: { label: string; value: string }[];
};

const paths: ArchitecturePath[] = [
  {
    id: "security-path",
    eyebrow: "Security Path",
    title: "API Security Control Path",
    description:
      "How a signed fintech request moves through Apigee, KMS-backed cryptography, and service-level guards before hitting a partner API.",
    anchor: "#demo-api-security",
    accent: "security",
    steps: [
      { label: "Client", detail: "Payload signed + timestamped" },
      { label: "Apigee Edge", detail: "Rate limit, authN, canonical string" },
      { label: "KMS + Signing", detail: "HMAC/RSA signing, encrypt PII" },
      { label: "Service Mesh", detail: "State machine validation + RBAC" },
      { label: "Partner API", detail: "Mutual TLS + replay guard" },
    ],
    highlights: [
      { label: "Threats", value: "Replay, tamper, key sprawl" },
      { label: "Proof", value: "Run API Security Tester" },
    ],
  },
  {
    id: "reliability-path",
    eyebrow: "Reliability Path",
    title: "Traffic Resilience Path",
    description:
      "Resiliency controls from ingress to provider failover, mirroring the Rate Limiting Simulator and Perahub incident runbooks.",
    anchor: "#demo-rate-limiter",
    accent: "reliability",
    steps: [
      { label: "Traffic Shaper", detail: "Normal, burst, spike patterns" },
      { label: "Sliding Window", detail: "Adaptive throttling per client" },
      { label: "State Machine", detail: "Idempotent workflow progression" },
      { label: "Provider Failover", detail: "Primary → secondary → queue" },
      { label: "Observability", detail: "p95 latency + error rate" },
    ],
    highlights: [
      { label: "SLO", value: "99.9% availability target" },
      { label: "Proof", value: "Open Rate Limiter demo" },
    ],
  },
];

const accentStyles: Record<ArchitecturePath["accent"], string> = {
  security: "from-primary/20 via-primary/10 to-transparent border-primary/20",
  reliability: "from-emerald-500/15 via-emerald-500/8 to-transparent border-emerald-500/20",
};

export default function ArchitectureDiagrams() {
  return (
    <section id="architecture" className="py-24 lg:py-40 px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Architecture & Controls
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-4">
            How the platform stays secure and reliable
          </h2>
          <p className="text-text-secondary max-w-3xl mb-14">
            Fast view of the control paths behind the demos: the security chain that signs and encrypts every request, and the reliability chain that keeps service levels steady under volatile traffic.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paths.map((path) => (
            <ScrollReveal key={path.id}>
              <div className="h-full rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-6 sm:p-7 shadow-sm hover:border-[var(--sem-interactive-border-hover)] hover:bg-[var(--sem-interactive-bg-hover)] transition-all duration-300">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {path.eyebrow}
                    </span>
                    <h3 className="text-2xl font-semibold text-text-primary leading-tight">
                      {path.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                  <TrackedLink
                    href={path.anchor}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1 mt-1"
                    eventName="architecture_path_cta"
                    eventPayload={{ path: path.id }}
                  >
                    View demo
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </TrackedLink>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface/70">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${accentStyles[path.accent]} opacity-80 pointer-events-none`}
                  />
                  <div className="relative p-5 space-y-5">
                    <div className="relative pl-4">
                      <div className="absolute left-[6px] top-1 bottom-1 w-px bg-border-strong/50" />
                      {path.steps.map((step, index) => (
                        <div key={step.label} className="relative pl-5 pb-4 last:pb-0">
                          <span className="absolute left-[-2px] top-1.5 h-3 w-3 rounded-full bg-surface border border-border-strong shadow-sm" />
                          <p className="text-[13px] font-semibold text-text-primary leading-tight">
                            {index + 1}. {step.label}
                          </p>
                          <p className="text-[12px] text-text-secondary leading-snug mt-0.5">
                            {step.detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {path.highlights.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-lg border border-border-subtle bg-surface/90 px-3.5 py-3"
                        >
                          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-text-primary leading-tight">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
