import { personalInfo, professionalSummary } from "@/app/lib/data";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center pt-40 pb-32 px-8">
      <div className="max-w-5xl mx-auto w-full hero-animate flex flex-col gap-8">
        {/* Name */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tightest leading-none text-text-primary">
          {personalInfo.fullName}
        </h1>

        {/* Headline */}
        <p className="text-xl md:text-2xl text-text-secondary font-normal max-w-2xl">
          {professionalSummary.headline}
        </p>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-3">
          {professionalSummary.focus.map((area) => (
            <span
              key={area}
              className="uppercase text-xs tracking-wide text-text-muted border border-border rounded-full px-4 py-1.5"
            >
              {area}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div>
          <Link
            href="#contact"
            className="inline-block bg-text-primary text-text-inverse rounded-full px-8 py-3.5 font-medium hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
