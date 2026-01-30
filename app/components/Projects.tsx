import { projects } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";

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

        {/* Projects Grid */}
        <ScrollReveal stagger>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group border border-border-subtle rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs border border-border-strong text-text-muted rounded-full px-3 py-0.5 whitespace-nowrap">
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs border border-border text-text-muted rounded-full px-2.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
