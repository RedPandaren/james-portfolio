import { personalInfo } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section id="contact" className="py-32 lg:py-48 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <ScrollReveal>
          {/* Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-text-primary mb-16">
            Let&apos;s Connect
          </h2>

          {/* Contact Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {/* Phone */}
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Phone
              </p>
              <a
                href={`tel:${personalInfo.contact.phone}`}
                className="text-lg text-text-secondary hover:text-primary transition-colors"
              >
                {personalInfo.contact.phone}
              </a>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Location
              </p>
              <p className="text-lg text-text-secondary">
                {personalInfo.location}
              </p>
            </div>
          </div>

          {/* Primary Email CTA */}
          <a
            href={`mailto:${personalInfo.contact.email}`}
            className="inline-block bg-text-primary text-text-inverse rounded-full px-10 py-4 font-medium hover:opacity-90 transition-opacity text-lg"
          >
            {personalInfo.contact.email}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
