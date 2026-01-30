import { experience } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";

export default function Experience() {
  const exp = experience[0];

  return (
    <section id="experience" className="py-32 lg:py-48 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Experience
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-16">
            Where I&apos;ve Built
          </h2>
        </ScrollReveal>

        {/* Company Bar */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border mb-12 pb-6">
            <div>
              <h3 className="text-2xl font-semibold text-text-primary">
                {exp.company}
              </h3>
              <p className="text-lg text-text-secondary mt-1">
                {exp.position}
              </p>
            </div>
            <p className="text-sm text-text-muted mt-2 sm:mt-0 sm:self-end">
              {exp.duration.start} - {exp.duration.end}
            </p>
          </div>
        </ScrollReveal>

        {/* Responsibilities Grid */}
        <ScrollReveal stagger>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {exp.keyResponsibilities.map((responsibility, index) => (
              <div
                key={index}
                className="border border-border-subtle rounded-xl p-6 hover:border-border-strong transition-colors duration-200"
              >
                <h4 className="font-semibold text-text-primary mb-2">
                  {responsibility.area}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {responsibility.details}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
