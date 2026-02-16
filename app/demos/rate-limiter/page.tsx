import Link from "next/link";
import RateLimiterSimulator from "@/app/components/RateLimiterSimulator";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Rate Limiting Simulator | James Florence Conales",
  description: "Interactive simulation of Token Bucket, Fixed Window, and Sliding Window rate limiting algorithms for API protection.",
};

export default function RateLimiterPage() {
  return (
    <main className="min-h-screen bg-surface">
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle px-8 h-20 flex items-center justify-between">
        <Link href="/#projects" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">Infrastructure Demo</span>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Interactive Simulation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
            Rate Limiting Simulator
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Compare three industry-standard algorithms for protecting APIs against abuse, 
            ensuring fair usage, and maintaining service availability under high load.
          </p>
        </div>

        <RateLimiterSimulator />

        {/* Strategy Comparison */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Algorithm Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Token Bucket</h3>
              <p className="text-sm text-text-secondary mb-4">
                Tokens are added to a bucket at a fixed rate. Each request consumes one token. 
                Allows bursts up to bucket capacity.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-text-secondary">Handles burst traffic well</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-text-secondary">Smooth rate limiting</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-text-secondary">Requires token management</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-primary font-medium">Best for: Payment APIs, user-facing endpoints</p>
              </div>
            </div>

            <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Fixed Window</h3>
              <p className="text-sm text-text-secondary mb-4">
                Time is divided into fixed windows. Counter resets at each window boundary. 
                Simple but can have edge case issues.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-text-secondary">Simple to implement</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-text-secondary">Low memory usage</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-text-secondary">Thundering herd problem</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-primary font-medium">Best for: Internal APIs, simple use cases</p>
              </div>
            </div>

            <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0v7.5m0-7.5h7.5m-7.5 0 7.5-7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Sliding Window</h3>
              <p className="text-sm text-text-secondary mb-4">
                Tracks exact timestamps of requests within the window. Most accurate but requires 
                more memory to store request history.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-text-secondary">Most accurate</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-text-secondary">No edge cases</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-text-secondary">Higher memory usage</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-primary font-medium">Best for: Critical endpoints, strict compliance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Production Use Case */}
        <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 rounded-xl bg-primary/20 text-primary">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-2">Production Implementation</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                In production fintech systems, rate limiting protects against DDoS attacks, ensures fair API usage, 
                and prevents resource exhaustion. During my work at PETNET, I implemented token bucket rate limiting 
                on GCP Cloud Run to handle burst traffic from mobile remittance apps while maintaining 99.9% availability.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  GCP Cloud Run
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Express.js
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Redis Backed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
