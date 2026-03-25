import { personalInfo, professionalSummary, proofPaths } from "@/app/lib/data";
import TrackedLink from "@/app/components/TrackedLink";

export default function Hero() {
  return (
    <section
      data-tour="hero"
      className="min-h-[92vh] flex items-center pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full hero-animate grid lg:grid-cols-12 gap-10 items-end relative">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Fintech Infrastructure Engineer
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tightest leading-[0.9] text-text-primary">
            {personalInfo.fullName}
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary font-normal max-w-3xl">
            {professionalSummary.headline}
          </p>

          <p className="text-base md:text-lg text-text-secondary max-w-3xl leading-relaxed">
            {professionalSummary.valueProposition}
          </p>

          <div className="flex flex-wrap gap-3">
            {professionalSummary.focus.map((area) => (
              <span
                key={area}
                className="uppercase text-xs tracking-wide text-text-muted border border-border rounded-full px-4 py-1.5 bg-surface/70"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href="#projects"
              className="inline-block bg-text-primary text-text-inverse rounded-full px-8 py-3.5 font-medium hover:opacity-90 transition-opacity"
              eventName="hero_primary_cta_click"
              eventPayload={{ cta: "explore-proof" }}
            >
              Explore proof paths
            </TrackedLink>
            <TrackedLink
              href="#contact"
              className="inline-block border border-border-strong text-text-primary rounded-full px-8 py-3.5 font-medium hover:border-primary hover:text-primary transition-colors"
              eventName="hero_secondary_cta_click"
              eventPayload={{ cta: "contact" }}
            >
              Start a conversation
            </TrackedLink>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {proofPaths.map((path) => (
              <TrackedLink
                key={path.id}
                href={path.destination}
                className="rounded-xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-4 shadow-sm hover:border-[var(--sem-interactive-border-hover)] hover:bg-[var(--sem-interactive-bg-hover)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sem-interactive-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                eventName="hero_audience_path_click"
                eventPayload={{ audience: path.audience }}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">
                  {path.audience}
                </p>
                <p className="text-sm text-text-primary leading-relaxed mb-3">
                  {path.question}
                </p>
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {path.cta}
                </span>
              </TrackedLink>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="border border-border rounded-2xl bg-surface/90 backdrop-blur-sm p-6 space-y-4 shadow-lg">
            <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-semibold">Operational Proof</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-sm text-text-secondary">System Type</span>
                <span className="text-sm font-semibold text-text-primary">High-stakes payments</span>
              </div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-sm text-text-secondary">Core Domain</span>
                <span className="text-sm font-semibold text-text-primary">Security + Reliability</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Delivery Style</span>
                <span className="text-sm font-semibold text-primary">Backend-led ownership</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
