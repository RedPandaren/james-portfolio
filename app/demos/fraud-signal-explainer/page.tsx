import Link from "next/link";
import Footer from "@/app/components/Footer";
import FraudSignalExplainer from "@/app/components/FraudSignalExplainer";

export const metadata = {
  title: "Fraud Signal Explainer | James Florence Conales",
  description: "Interactive simulation showing transparent fraud-risk signal weighting for payment and remittance flows.",
};

export default function FraudSignalPage() {
  return (
    <main className="min-h-screen bg-surface">
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle px-8 h-20 flex items-center justify-between">
        <Link href="/#projects" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">Security Demo</span>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Interactive Simulation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Fraud Signal Explainer
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Adjust transaction attributes to see how a transparent risk score is assembled for remittance and payment flows. This demo is deterministic, NDA-safe, and uses synthetic assumptions only.
          </p>
          <p className="text-xs text-text-muted mt-4">Simulated scoring; not production data. NDA-protected details omitted.</p>
        </div>

        <FraudSignalExplainer />

        <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 rounded-xl bg-primary/20 text-primary">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-2">How this translates to production</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                In production environments, scores would be backed by real feature stores, streaming enrichment, and monitored for drift. This demo keeps everything deterministic while showcasing explainable decisioning for fraud triage.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Feature store ready</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Explainability first</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Compliance-friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
