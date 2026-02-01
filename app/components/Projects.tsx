import { projects, perahubNavLink } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";
import Link from "next/link";

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
          <div className="mb-12">
            <Link
              href={perahubNavLink.href}
              className="group block border-2 border-primary/30 rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-primary/5"
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
            </Link>
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

              return project.href ? (
                <Link key={project.title} href={project.href} className={className}>
                  {CardContent}
                </Link>
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
