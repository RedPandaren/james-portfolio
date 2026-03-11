import { professionalSummary, achievements, education } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  const educationItem = education[0];

  return (
    <section id="about" className="py-32 lg:py-48 px-4 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
            About
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-16">
            Background &amp; Impact
          </h2>
        </ScrollReveal>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Specialization & Education */}
          <ScrollReveal className="lg:col-span-5 flex flex-col gap-10">
            {/* Specialization */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Specialization
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {professionalSummary.specialization}
              </p>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Education
              </h3>
              <div className="text-text-secondary">
                <p className="font-medium text-text-primary">
                  {educationItem.institution}
                </p>
                <p className="text-sm mt-1">
                  {educationItem.degree} ({educationItem.abbreviation})
                </p>
                <p className="text-sm">
                  Major: {educationItem.major}
                </p>
                <p className="text-sm">
                  {educationItem.duration.start} - {educationItem.duration.end}
                </p>
                <p className="text-sm font-medium text-primary mt-1">
                  {educationItem.honors}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Achievements Grid */}
          <ScrollReveal className="lg:col-span-7" stagger>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.key}
                  className="bg-surface border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 min-w-0"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-1 sm:mb-2 truncate">
                    {achievement.value}
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted leading-tight">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
