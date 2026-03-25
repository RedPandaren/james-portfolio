"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ScrollReveal from "@/app/components/ScrollReveal";
import ScrollDepthTracker from "@/app/components/ScrollDepthTracker";
import Footer from "@/app/components/Footer";

const remittanceProviders = [
  { name: "Western Union", description: "Global leader in cross-border money transfers" },
  { name: "Ayannah", description: "Philippines-based digital remittance platform" },
  { name: "RIA", description: "Third-largest global money transfer company" },
  { name: "Japanremit", description: "Japan-Philippines corridor specialist" },
  { name: "Intelexpress", description: "Fast remittance services to the Philippines" },
  { name: "TelereMIT", description: "Digital remittance solution provider" },
];

const metrics = [
  { label: "Remittance Partners", value: "6+", subtext: "Global & Local" },
  { label: "Uptime (2024)", value: "99.9%", subtext: "Internal SLA" },
  { label: "Code Ownership", value: "90%", subtext: "Backend Systems" },
  { label: "Migration Status", value: "100%", subtext: "Zero Downtime" },
];

const screenshots = [
  {
    title: "App Snapshot",
    src: "/perahubapp/dashboard.webp",
  },
  {
    title: "App Snapshot",
    src: "/perahubapp/RemittanceWu.webp",
  },
  {
    title: "App Snapshot",
    src: "/perahubapp/transaction_history.webp",
  },
];

const architectureLayers = [
  {
    title: "Client Layer",
    description: "Mobile App & Web Portals communicating via secure REST APIs.",
    items: ["React Native Mobile", "Next.js Web", "HMAC/RSA Signing"],
  },
  {
    title: "API Management",
    description: "Enterprise gateway for security, traffic control, and analytics.",
    items: ["GCP Apigee", "Rate Limiting", "Payload Encryption"],
  },
  {
    title: "Core Services",
    description: "Business logic and transaction state management.",
    items: ["Node.js 22 (Express)", "Finite State Machines", "Domain Driven Design"],
  },
  {
    title: "Infrastructure & Security",
    description: "Scalable cloud hosting and sensitive data protection.",
    items: ["GCP CloudRun", "Docker", "GCP KMS (Vault)"],
  },
];

const userJourneySteps = [
  {
    step: "01",
    title: "Initiation",
    description: "User selects a service (e.g., Remittance) and provides transaction details.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 3.15 14.98 14.98 0 0 0 3.47 15.27c1.32 1.32 3.03 2.1 4.88 2.22m7.24-3.12a6 6 0 0 1-5.84-2.58m5.84 2.58c1.32-1.32 2.1-3.03 2.22-4.88m-9.4 6.06a6 6 0 0 1-5.74-2.91" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Validation & Auth",
    description: "System validates the payload with HMAC signing and checks for compliance/KYC.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Routing & Execution",
    description: "State machine transitions the transaction and calls the 3rd party provider API.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 16.5" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Confirmation",
    description: "Postback notification sent via OneSignal (Push) and MacroKiosk (SMS).",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
  },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.5.622.621a3.618 3.618 0 0 1 5.272.808 3.617 3.617 0 0 1 4.769 1.358 3.617 3.617 0 0 1 1.358 4.769 3.618 3.618 0 0 1-.808 5.272L21 21m-4.5-4.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Digital Remittance",
    description: "Unified platform integrating 6 major remittance providers for seamless cross-border money transfers to the Philippines.",
    providers: remittanceProviders,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    title: "E-Wallet Services",
    description: "Full-featured digital wallet with InstaPay and PesoNet channel integration for instant transfers and fund management.",
    features: [
      "InstaPay channel for instant transfers",
      "PesoNet channel for peso-denominated transactions",
      "Balance management and history",
      "Contact-based transfers",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    title: "Bill Payments",
    description: "Comprehensive bill payment services through ECPay integration, covering utilities, telecom, and more.",
    features: [
      "Utility bill payments (electricity, water)",
      "Telecommunications (mobile, internet)",
      "Government fees and contributions",
      "Real-time payment confirmation",
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.6 20.25m-1.639-7.965a23.88 23.88 0 0 0 1.63-4.275m-1.63 4.275a23.91 23.91 0 0 1-1.63 4.274" />
      </svg>
    ),
    title: "E-Load Services",
    description: "Electronic load purchases through Razer Load integration (formerly Loadcentral), enabling instant mobile credit top-ups.",
    features: [
      "All major Philippine networks supported",
      "Instant delivery confirmation",
      "Bulk load capabilities",
      "Competitive pricing",
    ],
  },
];

const techStack = [
  {
    category: "Backend",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    items: [
      { name: "Node.js 22", description: "Modern runtime with latest features" },
      { name: "Express.js", description: "Minimalist web framework" },
      { name: "REST API", description: "Modern API architecture" },
      { name: "State Machine", description: "Transaction lifecycle management" },
    ],
  },
  {
    category: "Cloud & Infrastructure",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
      </svg>
    ),
    items: [
      { name: "GCP CloudRun", description: "Serverless container deployment" },
      { name: "GCP Apigee", description: "Enterprise API gateway management" },
      { name: "GCP KMS", description: "Encryption key management" },
      { name: "Docker", description: "Containerized deployment" },
    ],
  },
  {
    category: "Notifications",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
    items: [
      { name: "OneSignal", description: "Push notification service" },
      { name: "MacroKiosk", description: "SMS gateway integration" },
    ],
  },
  {
    category: "Integrations",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
    items: [
      { name: "InstaPay/PesoNet", description: "Payment network integration" },
      { name: "ECPay", description: "Bill payment aggregator" },
      { name: "Razer Load", description: "E-load provider" },
    ],
  },
];

const caseStudyScrollThresholds = [20, 40, 60, 80, 100] as const;

export default function PerahubPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-surface">
      <ScrollDepthTracker page="perahub-case-study" thresholds={caseStudyScrollThresholds} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/#projects" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back to Projects</span>
          <span className="sm:hidden">Back</span>
        </Link>
        
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted hidden sm:block">Case Study</span>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-lg border border-border-subtle hover:border-primary transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-surface/95 backdrop-blur-md pt-20 px-4 pb-8">
            <div className="flex flex-col gap-4">
              <Link
                href="/#about"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-text-primary py-3 border-b border-border-subtle"
              >
                About
              </Link>
              <Link
                href="/#impact"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-text-primary py-3 border-b border-border-subtle"
              >
                Impact
              </Link>
              <Link
                href="/#experience"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-text-primary py-3 border-b border-border-subtle"
              >
                Experience
              </Link>
              <Link
                href="/#projects"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-text-primary py-3 border-b border-border-subtle"
              >
                Projects
              </Link>
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-primary py-3"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto w-full">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              {/* Perahub Badge */}
              <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Production Live
              </span>

              {/* Main Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-none">
                Perahub
              </h1>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-text-secondary font-normal max-w-2xl">
                Unified Fintech Platform for Remittance, E-Wallet & Bill Payments
              </p>

              {/* Role & Company */}
              <div className="flex flex-wrap gap-4 items-center pt-2">
                <span className="text-sm font-medium text-text-primary bg-border-subtle/50 px-4 py-2 rounded-lg border border-border-subtle">
                  Backend Lead @ PETNET, Inc
                </span>
                <span className="text-sm text-text-muted">
                  90% Backend Ownership
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 bg-text-primary text-text-inverse rounded-full px-6 py-3 font-medium hover:opacity-90 transition-opacity"
                >
                  Explore Features
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="#tech-stack"
                  className="inline-flex items-center gap-2 border border-border-subtle text-text-secondary rounded-full px-6 py-3 font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  View Tech Stack
                </Link>
              </div>

              {/* Metrics Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-border-subtle/30">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                      {metric.value}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider mt-1">
                      {metric.label}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-text-muted mt-0.5">
                      {metric.subtext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 px-8 border-t border-border-subtle/50">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Platform Overview
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Perahub is a production-grade unified financial services platform operating in the Philippines. 
                  This case study demonstrates the **industry-standard security patterns** (like GCP KMS and Mutual TLS) 
                  that I implemented to secure the platform for millions of users.
                </p>
                <p className="text-text-secondary leading-relaxed mt-4">
                  As the primary backend developer, I architected and maintained 90% of the backend systems, 
                  successfully migrating the platform from Laravel 4.2 to Node.js 22 while ensuring zero 
                  downtime and maintaining 100% API contract stability.
                </p>
              </div>
              <div className="bg-border-subtle/30 rounded-xl p-6 border border-border-subtle">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide mb-4">
                  Key Achievements
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-secondary text-sm">99.9% service availability maintained</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-secondary text-sm">Full Laravel 4.2 → Node.js 22 migration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-secondary text-sm">Critical VAPT vulnerabilities remediated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-text-secondary text-sm">GCP CloudRun with Apigee & KMS deployment</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mobile Experience Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-t border-border-subtle/50 bg-surface-secondary/30">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Mobile Experience
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Clean, intuitive interfaces designed for lightning-fast financial operations on the go.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {screenshots.map((shot) => (
              <ScrollReveal key={shot.src} stagger>
                <div className="group flex flex-col items-center">
                  <div className="relative aspect-[9/16] sm:aspect-[9/19] w-full max-w-[200px] sm:max-w-[280px] rounded-[24px] sm:rounded-[32px] overflow-hidden border-4 sm:border-8 border-text-primary/5 shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
                    <Image
                      src={shot.src}
                      alt={shot.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-6 sm:mt-8 text-center px-4">
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">{shot.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Phase 3 */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-8 border-t border-border-subtle/50 bg-border-subtle/20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Platform Features
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Comprehensive financial services designed to meet the diverse needs of Filipino users worldwide.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <ScrollReveal key={feature.title} stagger={true}>
                <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle/50 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-text-inverse transition-colors">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      
                      {/* Feature List */}
                      {feature.features && (
                        <ul className="space-y-2">
                          {feature.features.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Provider Grid for Remittance */}
                      {feature.providers && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {feature.providers.map((provider) => (
                            <div key={provider.name} className="bg-border-subtle/30 rounded-lg px-3 py-2">
                              <span className="text-xs font-medium text-text-primary block">
                                {provider.name}
                              </span>
                              <span className="text-xs text-text-muted truncate block">
                                {provider.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Management Section */}
      <section className="py-20 px-8 border-t border-border-subtle/50">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Customer Management
                </h3>
                <p className="text-text-secondary text-sm">
                  Comprehensive customer database with full transaction history and account management.
                </p>
              </div>
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                <div className="bg-border-subtle/30 rounded-xl p-5 border border-border-subtle/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">Customer Profiles</h4>
                  <p className="text-sm text-text-muted">KYC compliance, identity verification, profile management</p>
                </div>
                <div className="bg-border-subtle/30 rounded-xl p-5 border border-border-subtle/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 16.5" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">Transaction History</h4>
                  <p className="text-sm text-text-muted">Complete audit trail, filters, reporting, exports</p>
                </div>
                <div className="bg-border-subtle/30 rounded-xl p-5 border border-border-subtle/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">Contacts Management</h4>
                  <p className="text-sm text-text-muted">Beneficiary management, quick transfers</p>
                </div>
                <div className="bg-border-subtle/30 rounded-xl p-5 border border-border-subtle/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.5.622.621a3.618 3.618 0 0 1 5.272.808 3.617 3.617 0 0 1 4.769 1.358 3.617 3.617 0 0 1 1.358 4.769 3.618 3.618 0 0 1-.808 5.272L21 21m-4.5-4.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">Savings Accounts</h4>
                  <p className="text-sm text-text-muted">Balance tracking, interest calculation, goals</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tech Stack Section - Phase 4 */}
      <section id="tech-stack" className="py-16 sm:py-24 px-4 sm:px-8 border-t border-border-subtle/50 bg-border-subtle/20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Technology Stack
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Modern, cloud-native architecture built for scalability, security, and reliability.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((category) => (
              <ScrollReveal key={category.category}>
                <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle/50 rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-text-primary">
                      {category.category}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item.name}>
                        <span className="text-sm font-medium text-text-primary block">
                          {item.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Migration Highlight */}
          <ScrollReveal>
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 rounded-xl bg-primary/20 text-primary">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Laravel 4.2 → Node.js 22 Migration
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Successfully migrated the entire backend from legacy Laravel 4.2 to modern Node.js 22, 
                    maintaining 100% API contract stability to ensure zero disruption to existing clients. 
                    The migration improved performance by 40% and reduced infrastructure costs by 25%.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    100% Contract Stability
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    40% Performance Boost
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Security Highlight */}
          <ScrollReveal>
            <div className="mt-6 bg-gradient-to-r from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 rounded-xl bg-red-500/20 text-red-500">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    VAPT Security Remediation
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Identified and resolved critical vulnerabilities through comprehensive Vulnerability Assessment 
                    and Penetration Testing. Implemented HMAC/RSA signing, payload encryption, IAM least privilege 
                    policies, and RBAC to meet financial services security compliance requirements.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Critical Issues Fixed
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Compliant
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Architecture Overview Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-t border-border-subtle/50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Architecture Overview
              </h1>
              <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
                Enterprise-grade architecture built on GCP, optimized for security, reliability, and high-throughput financial processing.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {architectureLayers.map((layer, index) => (
              <ScrollReveal key={layer.title} stagger={true}>
                <div className="relative group p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border-subtle bg-surface-secondary/20 hover:border-primary/30 transition-colors h-full">
                  <div className="absolute -top-3 left-6 px-2 bg-surface text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    Layer {index + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2 pt-2">{layer.title}</h3>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">{layer.description}</p>
                  <ul className="space-y-2">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-4 sm:gap-8">
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-semibold text-text-primary mb-2">High Availability Design</h4>
              <p className="text-xs sm:text-sm text-text-secondary">
                Leveraging Google Cloud Run multi-region failover and auto-scaling to ensure 99.9% uptime 
                during peak transaction windows like paydays and holidays.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">0</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Data Loss Incidents</div>
              </div>
              <div className="text-center border-l border-border-subtle pl-4">
                <div className="text-xl sm:text-2xl font-bold text-primary">{"<"}250ms</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Avg API Latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Artifacts Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 border-t border-border-subtle/50 bg-surface-secondary/20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col gap-3 mb-8">
              <p className="text-sm uppercase tracking-wider text-text-muted">Proof Artifacts</p>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Operational evidence (redacted)</h2>
              <p className="text-text-secondary max-w-3xl">
                Runbooks, migration excerpts, and decision logs that mirror the Perahub delivery constraints. Sensitive identifiers redacted for compliance.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            <ScrollReveal>
              <a
                href="/artifacts/perahub-incident-runbook.txt"
                className="block rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-5 hover:border-primary/50 transition"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-primary mb-2">Incident Runbook</p>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Partner Timeout (redacted)</h3>
                <p className="text-sm text-text-secondary">Step-by-step response for provider 5xx spikes; includes throttling, failover, and audit export.</p>
              </a>
            </ScrollReveal>

            <ScrollReveal>
              <a
                href="/artifacts/perahub-migration-plan-excerpt.txt"
                className="block rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-5 hover:border-primary/50 transition"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-primary mb-2">Migration Plan</p>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Laravel 4.2 → Node.js 22</h3>
                <p className="text-sm text-text-secondary">Strangler milestones, contract tests, and risk controls for a 5-month cutover.</p>
              </a>
            </ScrollReveal>

            <ScrollReveal>
              <a
                href="/artifacts/perahub-decision-log.txt"
                className="block rounded-2xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] p-5 hover:border-primary/50 transition"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-primary mb-2">Decision Log</p>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Architecture trade-offs</h3>
                <p className="text-sm text-text-secondary">Gateway choice, crypto, state machines, and observability reasoning with outcomes.</p>
              </a>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="mt-8 rounded-2xl border border-border-subtle bg-surface px-4 sm:px-6 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">Decision Timeline</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
                  <p className="text-xs font-semibold text-text-primary">Month 1-2</p>
                  <p className="text-[12px] text-text-secondary">Shadow traffic + contract diff tests; no customer impact.</p>
                </div>
                <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
                  <p className="text-xs font-semibold text-text-primary">Month 3-4</p>
                  <p className="text-[12px] text-text-secondary">Write paths behind flags; dual-write and rollback-ready.</p>
                </div>
                <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
                  <p className="text-xs font-semibold text-text-primary">Month 5</p>
                  <p className="text-[12px] text-text-secondary">Final cutover, freeze window, decommission legacy queues.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* User Journey Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-t border-border-subtle/50 bg-border-subtle/10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Transaction Lifecycle
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Mapping the secure flow of data from user initiation to external provider execution.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-border-strong/50 -z-10" />
            
            {userJourneySteps.map((step) => (
              <ScrollReveal key={step.step}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border-strong flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-text-inverse group-hover:border-primary transition-all duration-300 mb-6 bg-surface shadow-lg">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{step.step}</span>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed px-4">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation CTA */}
      <section className="py-20 px-8 border-t border-border-subtle/50">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Explore More Projects
            </h2>
            <p className="text-text-secondary mb-8">
              Discover other simulations and technical demonstrations showcasing fintech expertise.
            </p>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 bg-text-primary text-text-inverse rounded-full px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Projects
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
