import Link from "next/link";
import PaymentFlowSimulator from "@/app/components/PaymentFlowSimulator";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Payment Flow Simulator | James Florence Conales",
  description: "Interactive demonstration of a 4-step remittance payment lifecycle.",
};

export default function PaymentSimulatorPage() {
  return (
    <main className="min-h-screen bg-surface">
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle px-8 h-20 flex items-center justify-between">
        <Link href="/#projects" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">Demonstration</span>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Interactive Demo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Remittance Flow Simulator
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            A step-through simulation showcasing **standard backend patterns** for inquiry, staging, and confirming 
            cross-border financial transactions while maintaining security and state integrity.
          </p>
        </div>

        <PaymentFlowSimulator />
      </div>

      <Footer />
    </main>
  );
}
