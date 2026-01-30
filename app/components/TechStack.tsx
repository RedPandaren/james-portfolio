import { technicalSkills } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-32 lg:py-48 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
            Tech Stack
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-16">
            Tools &amp; Expertise
          </h2>
        </ScrollReveal>

        {/* Skills Grid */}
        <ScrollReveal stagger>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {technicalSkills.map((category) => (
              <div key={category.name}>
                {/* Category Name */}
                <h3 className="uppercase text-sm tracking-wide font-semibold text-text-primary border-b border-border-subtle pb-2 mb-4">
                  {category.name}
                </h3>

                {/* Skills List */}
                <div className="flex flex-col">
                  {category.items.map((skill) => {
                    const isGCPCertified = skill === "GCP Certified";
                    return (
                      <span
                        key={skill}
                        className={
                          isGCPCertified
                            ? "text-primary font-medium text-sm py-1"
                            : "text-sm text-text-secondary py-1"
                        }
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
