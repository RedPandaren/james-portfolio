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

          <p className="text-text-secondary max-w-2xl mx-auto mb-10">
            Choose the fastest path based on your goal. I respond with role-fit context,
            architecture rationale, and next-step options.
          </p>

          {/* Quick actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <TrackedAnchor
              href={`mailto:${personalInfo.contact.email}`}
              className="inline-flex items-center gap-2 bg-text-primary text-text-inverse rounded-full px-7 py-3.5 font-medium hover:opacity-90 transition-all shadow-sm"
              eventName="contact_email_click"
            >
              <span>Send an email</span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-wide text-text-inverse/80">
                Response under 24h
              </span>
            </TrackedAnchor>

            <TrackedAnchor
              href={`tel:${personalInfo.contact.phone}`}
              className="inline-flex items-center gap-2 border border-border-strong text-text-primary rounded-full px-7 py-3.5 font-medium hover:border-primary hover:text-primary transition-colors"
              eventName="contact_phone_click"
            >
              <span>Call directly</span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-wide text-text-muted">
                GMT+8
              </span>
            </TrackedAnchor>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 text-left">
            {contactIntents.map((intent) => (
              <TrackedAnchor
                key={intent.id}
                href={intent.href}
                className={`group block rounded-xl border p-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sem-interactive-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  intent.type === "primary"
                    ? "border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/8"
                    : "border-border-subtle bg-surface/70 hover:border-border-strong hover:bg-surface"
                }`}
                eventName="contact_intent_click"
                eventPayload={{ intent: intent.id }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1.5">{intent.label}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{intent.description}</p>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-primary group-hover:translate-x-0.5 transition-transform">
                    Compose
                  </span>
                </div>
              </TrackedAnchor>
            ))}
          </div>

          {/* Contact details */}
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Email</p>
              <TrackedAnchor
                href={`mailto:${personalInfo.contact.email}`}
                className="text-lg text-text-secondary hover:text-primary transition-colors"
                eventName="contact_email_click"
              >
                {personalInfo.contact.email}
              </TrackedAnchor>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Phone</p>
              <TrackedAnchor
                href={`tel:${personalInfo.contact.phone}`}
                className="text-lg text-text-secondary hover:text-primary transition-colors"
                eventName="contact_phone_click"
              >
                {personalInfo.contact.phone}
              </TrackedAnchor>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Location</p>
              <p className="text-lg text-text-secondary">{personalInfo.location}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
