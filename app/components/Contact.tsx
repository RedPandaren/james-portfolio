import { personalInfo, contactIntents } from "@/app/lib/data";
import ScrollReveal from "./ScrollReveal";
import TrackedAnchor from "./TrackedAnchor";

export default function Contact() {
  return (
    <section id="contact" data-tour="contact" className="py-32 lg:py-48 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <ScrollReveal>
          {/* Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-text-primary mb-16">
            Let&apos;s Connect
          </h2>

          <p className="text-text-secondary max-w-2xl mx-auto mb-12">
            Choose the fastest path based on your goal. I respond with role-fit context,
            architecture rationale, and next-step options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 text-left">
            {contactIntents.map((intent) => (
              <TrackedAnchor
                key={intent.id}
                href={intent.href}
                className={`rounded-xl border p-5 transition-colors ${
                  intent.type === "primary"
                    ? "border-primary/40 bg-primary/5 hover:border-primary"
                    : "border-border-subtle bg-surface/70 hover:border-border-strong"
                }`}
                eventName="contact_intent_click"
                eventPayload={{ intent: intent.id }}
              >
                <h3 className="text-sm font-semibold text-text-primary mb-2">{intent.label}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{intent.description}</p>
              </TrackedAnchor>
            ))}
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {/* Phone */}
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Phone
              </p>
              <TrackedAnchor
                href={`tel:${personalInfo.contact.phone}`}
                className="text-lg text-text-secondary hover:text-primary transition-colors"
                eventName="contact_phone_click"
              >
                {personalInfo.contact.phone}
              </TrackedAnchor>
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
          <TrackedAnchor
            href={`mailto:${personalInfo.contact.email}`}
            className="inline-block bg-text-primary text-text-inverse rounded-full px-10 py-4 font-medium hover:opacity-90 transition-opacity text-lg"
            eventName="contact_email_click"
          >
            {personalInfo.contact.email}
          </TrackedAnchor>
        </ScrollReveal>
      </div>
    </section>
  );
}
