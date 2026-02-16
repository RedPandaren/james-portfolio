import type {
  PersonalInfo,
  ProfessionalSummary,
  ExperienceItem,
  TechSkillCategory,
  Achievement,
  NavLink,
  ProjectCard,
  EducationItem,
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
    techTags: ["Cloud KMS", "HMAC", "RSA", "Node.js"],
    status: "View Demo",
    href: "/demos/encryption-visualizer",
  },
  {
    title: "Payment Flow Simulator",
    description:
      "Step-through simulation of a 4-step remittance payment lifecycle — from legacy details inquiry to final payout confirmation.",
    techTags: ["REST", "State Machine", "Express.js", "Nodemailer"],
    status: "View Demo",
    href: "/demos/payment-simulator",
  },
  {
    title: "API Security Tester",
    description:
      "Live demonstration of request signing, payload encryption, and secure API layer patterns used in production fintech systems.",
    techTags: ["HMAC", "Encryption", "IAM", "OAuth2"],
    status: "View Demo",
    href: "/demos/api-security-tester",
  },
  {
    title: "Rate Limiting Simulator",
    description:
      "Interactive comparison of Token Bucket, Fixed Window, and Sliding Window algorithms with live traffic simulation and real-time metrics.",
    techTags: ["Token Bucket", "Express.js", "API Gateway", "DDoS Protection"],
    status: "View Demo",
    href: "/demos/rate-limiter",
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


