import { metrics, evidenceCards } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";
import TrackedLink from "./TrackedLink";

export default function Impact() {
  return (
    <section id="impact" className="py-20 sm:py-32 lg:py-48 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Quantified Impact
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-12 sm:mb-16">
            Measurable Results
          </h2>
        </ScrollReveal>

        {/* Metrics Grid */}
        <ScrollReveal stagger>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(metrics).map(([key, metric]) => (
              <div
                key={key}
                className="bg-surface border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm text-text-muted mb-2 sm:mb-3">
                  {metric.title}
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-12 sm:mt-16">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted mb-4">
              Evidence Trail
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {evidenceCards.map((card) => (
                <article
                  key={card.id}
                  className="bg-surface border border-border-subtle rounded-xl p-5 sm:p-6"
                >
                  <h3 className="text-sm font-semibold text-text-primary leading-relaxed mb-4">
                    {card.claim}
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <p>
                      <span className="font-semibold text-text-primary">Problem:</span> {card.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">Action:</span> {card.action}
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">Result:</span> {card.result}
                    </p>
                    <p className="text-text-muted">
                      <span className="font-semibold text-text-primary">Constraint:</span> {card.constraint}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Call to Action */}
        <ScrollReveal>
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-text-secondary mb-6">
              These metrics demonstrate consistent delivery of production-grade fintech solutions 
              with measurable business impact.
            </p>
            <TrackedLink
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary text-text-inverse px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              eventName="impact_cta_click"
              eventPayload={{ cta: "discuss-project" }}
            >
              Discuss Your Project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </TrackedLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
