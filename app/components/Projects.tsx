import { projects, perahubNavLink } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";
import TrackedLink from "./TrackedLink";

const projectAnchorMap: Record<string, string> = {
  "Encryption Visualizer": "demo-encryption-visualizer",
  "Payment Flow Simulator": "demo-payment-flow",
  "API Security Tester": "demo-api-security",
  "Rate Limiting Simulator": "demo-rate-limiter",
};

const proofJourneys = [
  {
    id: "journey-security",
    title: "Security Decision Path",
    question: "Can he secure financial APIs under compliance pressure?",
    destination: "#demo-api-security",
    coverage: "API Security Tester + Encryption Visualizer",
  },
  {
    id: "journey-reliability",
    title: "Reliability Decision Path",
    question: "Can he protect service stability under volatile traffic?",
    destination: "#demo-rate-limiter",
    coverage: "Rate Limiting Simulator + incident ownership evidence",
  },
  {
    id: "journey-ownership",
    title: "Product Ownership Path",
    question: "Can he own mission-critical transaction flows end-to-end?",
    destination: "#case-study-perahub",
    coverage: "Perahub case study + Payment Flow Simulator",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 lg:py-48 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Projects
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-4">
            Interactive Demos
          </h2>
          <p className="text-text-secondary mb-16">
            Proving capability through working software
          </p>
        </ScrollReveal>

        {/* Perahub Featured Project Card */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            {proofJourneys.map((journey) => (
              <TrackedLink
                key={journey.id}
                href={journey.destination}
                className="rounded-xl border border-border-subtle bg-surface/70 p-5 hover:border-border-strong transition-colors"
                eventName="proof_path_click"
                eventPayload={{ journey: journey.title }}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted font-semibold mb-2">
                  {journey.title}
                </p>
                <p className="text-sm text-text-primary leading-relaxed mb-3">{journey.question}</p>
                <p className="text-xs text-primary font-semibold">{journey.coverage}</p>
              </TrackedLink>
            ))}
          </div>

          <div className="mb-12">
            <TrackedLink
              id="case-study-perahub"
              href={perahubNavLink.href}
              className="group block border-2 border-primary/30 rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-primary/5"
              eventName="case_study_opened"
              eventPayload={{ caseStudy: "perahub" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/20 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Live Production
                  </span>
                  <h3 className="font-semibold text-xl text-text-primary group-hover:text-primary transition-colors">
                    Perahub Mobile Application
                  </h3>
                </div>
                <span className="text-xs font-medium border border-primary/50 text-primary rounded-full px-3 py-0.5 whitespace-nowrap">
                  Featured
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-3xl">
                Production-grade unified fintech platform integrating remittance services (Western Union, RIA, Ayannah), 
                e-wallet (InstaPay/PesoNet), bill payments (ECPay), and e-load (Razer Load). Backend Lead with 90% ownership 
                of backend systems, including Laravel 4.2 → Node.js 22 migration and GCP CloudRun deployment.
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="font-mono text-xs border border-primary/50 text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                  Node.js 22
                </span>
                <span className="font-mono text-xs border border-primary/50 text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                  GCP CloudRun
                </span>
                <span className="font-mono text-xs border border-primary/50 text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                  Apigee
                </span>
                <span className="font-mono text-xs border border-primary/50 text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                  KMS
                </span>
                <span className="font-mono text-xs border border-primary/50 text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                  FinTech
                </span>
              </div>

              {/* CTA */}
              <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                <span>View Full Case Study</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </TrackedLink>
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <ScrollReveal stagger>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const CardContent = (
                <>
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className={`text-xs border rounded-full px-3 py-0.5 whitespace-nowrap ${
                      project.status === "View Demo" 
                        ? "border-primary/50 text-primary bg-primary/5" 
                        : "border-border-strong text-text-muted"
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techTags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs border border-border text-text-muted rounded-full px-2.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.href && (
                    <div className="mt-auto flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{project.status === "View Demo" ? "Start Demo" : "View Project"}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  )}
                </>
              );

              const className = "group border border-border-subtle rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full";
              const cardId = projectAnchorMap[project.title];

              return project.href ? (
                <TrackedLink
                  key={project.title}
                  id={cardId}
                  href={project.href}
                  className={className}
                  eventName="demo_opened"
                  eventPayload={{ demo: project.title, category: project.proofCategory ?? "general" }}
                >
                  {CardContent}
                </TrackedLink>
              ) : (
                <div key={project.title} className={className}>
                  {CardContent}
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
