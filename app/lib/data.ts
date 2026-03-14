import type {
  PersonalInfo,
  ProfessionalSummary,
  ExperienceItem,
  TechSkillCategory,
  Achievement,
  NavLink,
  ProjectCard,
  EducationItem,
  ProofPath,
  EvidenceCard,
  ContactIntent,
} from "./types";

export const personalInfo: PersonalInfo = {
  fullName: "James Florence Conales",
  title: "Software Engineer",
  location: "Quezon City, Metro Manila, Philippines",
  contact: {
    phone: "+63 908 927 9200",
    email: "conalesjames@gmail.com",
  },
};

export const professionalSummary: ProfessionalSummary = {
  headline: "Fintech-specialized Backend Engineer",
  valueProposition:
    "I help fintech teams ship secure payment systems faster by modernizing legacy platforms without breaking partner contracts.",
  focus: [
    "High-stakes payment infrastructure",
    "Secure cloud architecture",
    "Greenfield REST platforms",
    "Complex EMI migrations",
    "GCP-native deployments",
  ],
  specialization:
    "Fintech systems with expertise in payment migrations, microservices transformation, and security-compliant backend architecture",
};

export const experience: readonly ExperienceItem[] = [
  {
    company: "PETNET, Inc",
    position: "Software Engineer",
    duration: { start: "June 2024", end: "Present" },
    description:
      "Software Engineer specializing in high-availability fintech systems and secure cloud architecture",
    keyResponsibilities: [
      {
        area: "System Ownership & Reliability",
        details:
          "Maintain end-to-end technical ownership of PERAHUB Mobile App backend; Primary Technical Responder for production incidents; ensured 99.9% service availability",
      },
      {
        area: "Full-Stack Architecture (DFP)",
        details:
          "Architected greenfield Digital Forex Platform using Nuxt 3/Express framework; designed state-machine logic for document approval workflows; Technical Authorizer for production code and FOREX API integrations",
      },
      {
        area: "Strategic Migrations & Leadership",
        details:
          "Technical Lead for 5-month EMI migration (EON to NetBank) and Western Union modernization; transitioned legacy SOAP services to REST while ensuring 100% contract stability",
      },
      {
        area: "Security & Compliance Standardizations",
        details:
          "Spearheaded adoption of Google Cloud KMS for cryptographic key management; remediated high-risk VAPT vulnerabilities; engineered secure API layers with request signing and payload encryption",
      },
      {
        area: "Platform Modernization",
        details:
          "Drove transition of legacy Laravel 4.2 monoliths to Node.js (v22) on GCP Cloud Run; optimized latency and developer productivity across 10+ business-critical systems",
      },
      {
        area: "Production Incident Leadership",
        details:
          "Authored comprehensive technical Runbooks for troubleshooting partner-side API failures; significantly lowered Mean-Time-To-Recovery (MTTR)",
      },
      {
        area: "Engineering Process Standardization",
        details:
          "Established Security-First development lifecycle with reusable encryption modules and middleware templates; reduced onboarding time by 30%",
      },
      {
        area: "System Design & Architectural Documentation",
        details:
          "Created technical architecture documentation and Data Flow Diagrams (DFDs) for Perahub Mobile ecosystem; bridged communication between stakeholders and architects",
      },
      {
        area: "Cross-Platform Feature Delivery",
        details:
          "Led development of QRPH support and automated payment schedulers; maintained 100% backward compatibility with legacy mobile frontend",
      },
      {
        area: "Infrastructure & Observability",
        details:
          "Architected CI/CD lifecycles using GitLab CI and Docker; implemented centralized logging via GCP Log Explorer for audit traceability",
      },
    ],
  },
];

export const education: readonly EducationItem[] = [
  {
    institution: "FEU Institute of Technology",
    degree: "Bachelor of Science in Computer Science",
    major: "Software Engineering",
    abbreviation: "BSCSSE",
    duration: { start: 2019, end: 2024 },
    honors: "Cum Laude",
  },
];

export const technicalSkills: readonly TechSkillCategory[] = [
  {
    name: "Backend Architecture",
    items: [
      "Node.js (v22)",
      "PHP (7.4-8.3)",
      "Express.js",
      "Laravel",
      "Lumen",
      "Microservices Architecture",
      "REST & SOAP API Design",
      "Event-Driven Design",
      "State Machine Logic",
      "Data Flow Diagrams",
      "Database Schema Design",
      "API Contract Preservation",
      "Idempotency",
      "Rate Limiting",
    ],
  },
  {
    name: "Cloud Infrastructure",
    items: [
      "GCP Certified",
      "Google Cloud Run",
      "Docker",
      "GitLab CI/CD",
      "Cloud Build",
      "PostgreSQL",
      "MySQL",
      "Google Cloud Storage",
      "Pub/Sub",
    ],
  },
  {
    name: "Security & Compliance",
    items: [
      "Google Cloud KMS",
      "HMAC/RSA Signing",
      "Payload Encryption",
      "IAM (Least Privilege)",
      "RBAC",
      "OAuth2",
      "Secure Session Management",
      "VAPT Resolution",
      "Audit-Driven Hardening",
    ],
  },
  {
    name: "Frontend & Observability",
    items: [
      "Nuxt.js (SSR)",
      "Vue.js",
      "React",
      "Next.js",
      "Tailwind CSS",
      "GCP Log Explorer",
      "Middleware-based Tracing",
      "Incident Triage (MTTR)",
    ],
  },
];

export const achievements: readonly Achievement[] = [
  {
    key: "reliability",
    label: "Service Availability",
    value: "99.9%",
  },
  {
    key: "migration",
    label: "Contract Stability",
    value: "100%",
  },
  {
    key: "efficiency",
    label: "Onboarding Time Reduced",
    value: "30%",
  },
  {
    key: "modernization",
    label: "Systems Modernized",
    value: "10+",
  },
  {
    key: "security",
    label: "Encryption Standardized",
    value: "Org-wide",
  },
  {
    key: "mttr",
    label: "MTTR Improvement",
    value: "Significant",
  },
];

export const projects: readonly ProjectCard[] = [
  {
    title: "Encryption Visualizer",
    description:
      "Interactive visualization of Cloud KMS key management, HMAC/RSA signing flows, and payload encryption at rest and in transit.",
    interactionHint: "Sign a financial payload, then verify how tamper detection protects message integrity.",
    techTags: ["Cloud KMS", "HMAC", "RSA", "Node.js"],
    status: "View Demo",
    preview: {
      imageSrc: "/demos/encryption-preview.svg",
      imageAlt: "Diagram style preview of signing and verification flow for encryption visualizer demo",
      eyebrow: "Security Workflow",
    },
    proofCategory: "security",
    href: "/demos/encryption-visualizer",
  },
  {
    title: "Payment Flow Simulator",
    description:
      "Step-through simulation of a 4-step remittance payment lifecycle — from legacy details inquiry to final payout confirmation.",
    interactionHint: "Walk each lifecycle state and inspect how backward compatibility is preserved during transitions.",
    techTags: ["REST", "State Machine", "Express.js", "Nodemailer"],
    status: "View Demo",
    preview: {
      imageSrc: "/demos/payment-flow-preview.svg",
      imageAlt: "Timeline style preview for payment flow simulator demo",
      eyebrow: "Lifecycle Simulation",
    },
    proofCategory: "ownership",
    href: "/demos/payment-simulator",
  },
  {
    title: "API Security Tester",
    description:
      "Live demonstration of request signing, payload encryption, and secure API layer patterns used in production fintech systems.",
    interactionHint: "Run signed requests and compare accepted versus rejected payload scenarios in real time.",
    techTags: ["HMAC", "Encryption", "IAM", "OAuth2"],
    status: "View Demo",
    preview: {
      imageSrc: "/demos/api-security-preview.svg",
      imageAlt: "Shield and endpoint preview for API security tester demo",
      eyebrow: "Defense Controls",
    },
    proofCategory: "security",
    href: "/demos/api-security-tester",
  },
  {
    title: "Rate Limiting Simulator",
    description:
      "Interactive comparison of Token Bucket, Fixed Window, and Sliding Window algorithms with live traffic simulation and real-time metrics.",
    interactionHint: "Switch traffic patterns and watch algorithm behavior under bursts, spikes, and sustained load.",
    techTags: ["Token Bucket", "Express.js", "API Gateway", "DDoS Protection"],
    status: "View Demo",
    preview: {
      imageSrc: "/demos/rate-limiter-preview.svg",
      imageAlt: "Traffic chart style preview for rate limiting simulator demo",
      eyebrow: "Resilience Lab",
    },
    proofCategory: "reliability",
    href: "/demos/rate-limiter",
  },
];

export const proofPaths: readonly ProofPath[] = [
  {
    id: "hiring-manager",
    audience: "Hiring Managers",
    question: "Need evidence of production ownership and outcomes?",
    destination: "#impact",
    cta: "Review quantified impact",
  },
  {
    id: "engineering-leads",
    audience: "Engineering Leads",
    question: "Evaluating architecture and security judgment?",
    destination: "#projects",
    cta: "Inspect technical proof",
  },
  {
    id: "fintech-founders",
    audience: "Founders / Clients",
    question: "Planning fintech delivery under risk and compliance constraints?",
    destination: "#contact",
    cta: "Start architecture conversation",
  },
];

export const evidenceCards: readonly EvidenceCard[] = [
  {
    id: "emi-migration",
    claim: "100% contract stability during EMI migration",
    problem: "Legacy SOAP endpoints with partner dependencies could not break during transition.",
    action: "Led phased migration to REST with compatibility adapters and contract-based validation.",
    result: "Completed a 5-month migration to NetBank with zero partner contract breakage.",
    constraint: "Detailed contracts and client identifiers are redacted under NDA.",
  },
  {
    id: "security-remediation",
    claim: "High-risk findings remediated with reusable security standards",
    problem: "VAPT surfaced high-risk vulnerabilities in critical payment paths.",
    action: "Standardized Cloud KMS, request signing, encrypted payload handling, and least-privilege controls.",
    result: "Raised baseline security posture across multiple services and shortened secure integration onboarding by 30%.",
    constraint: "Security reports and exact findings are withheld for compliance reasons.",
  },
  {
    id: "incident-operations",
    claim: "99.9% availability with incident runbook ownership",
    problem: "Partner outages and integration variance increased operational recovery risk.",
    action: "Authored runbooks and responder flows for recurring payment failure scenarios.",
    result: "Sustained 99.9% availability while reducing mean-time-to-recovery.",
    constraint: "Incident timelines and provider-level data are summarized due to operational confidentiality.",
  },
];

export const contactIntents: readonly ContactIntent[] = [
  {
    id: "book-intro",
    label: "Book Intro Call",
    description: "15-20 minute fit check for backend, fintech, or platform roles.",
    href: "mailto:conalesjames@gmail.com?subject=Portfolio%20Intro%20Call&body=Hi%20James%2C%20I%20want%20to%20schedule%20a%20short%20intro%20call.",
    type: "primary",
  },
  {
    id: "architecture-walkthrough",
    label: "Request Architecture Walkthrough",
    description: "Deep dive into migration decisions, security trade-offs, and delivery constraints.",
    href: "mailto:conalesjames@gmail.com?subject=Architecture%20Walkthrough%20Request&body=Hi%20James%2C%20I%20want%20to%20review%20your%20fintech%20architecture%20approach.",
    type: "secondary",
  },
  {
    id: "recruiter-priority",
    label: "Recruiter Priority Thread",
    description: "Share role scope and timeline to receive a targeted capability match response.",
    href: "mailto:conalesjames@gmail.com?subject=Recruiter%20Priority%20Thread&body=Hi%20James%2C%20I%20am%20hiring%20for%20a%20role%20that%20matches%20your%20profile.",
    type: "secondary",
  },
];

export const navLinks: readonly NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Impact", href: "#impact" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Architecture", href: "#architecture" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Contact", href: "#contact" },
];

export const perahubNavLink: NavLink = { label: "Perahub", href: "/perahub" };

export const metrics = {
  reliability: {
    title: "Service Reliability",
    value: "99.9%",
    unit: "uptime",
    trend: "up" as const,
    description: "PERAHUB Mobile App backend service availability",
    icon: "📊",
    visualization: "gauge" as const,
  },
  efficiency: {
    title: "Onboarding Efficiency",
    value: "30%",
    unit: "reduction",
    trend: "up" as const,
    description: "Time saved on payment integrations",
    icon: "⚡",
    visualization: "comparison" as const,
  },
  ownership: {
    title: "Backend Ownership",
    value: "90%",
    unit: "coverage",
    trend: "neutral" as const,
    description: "PERAHUB Mobile ecosystem ownership",
    icon: "🏗️",
    visualization: "pie" as const,
  },
  migration: {
    title: "Migration Success",
    value: "100%",
    unit: "stability",
    trend: "up" as const,
    description: "Contract stability during EMI migration",
    icon: "🔄",
    visualization: "timeline" as const,
  },
  modernization: {
    title: "Systems Modernized",
    value: "10+",
    unit: "systems",
    trend: "up" as const,
    description: "Laravel to Node.js transformations",
    icon: "🚀",
    visualization: "counter" as const,
  },
  security: {
    title: "Security Standardization",
    value: "KMS",
    unit: "encryption",
    trend: "up" as const,
    description: "Google Cloud KMS implementation",
    icon: "🔒",
    visualization: "badge" as const,
  },
};
