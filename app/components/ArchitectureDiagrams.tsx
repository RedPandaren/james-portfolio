// "use client";

// import { useState, useEffect } from "react";
// import ScrollReveal from "./ScrollReveal";
// import MermaidDiagram from "./MermaidDiagram";

// export default function ArchitectureDiagrams() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const microservicesSecurity = `
//     flowchart TB
//       Client["Client Application"] --> LB["Load Balancer"]
//       LB --> Gateway["API Gateway"]
//       Gateway --> Auth["Auth Service<br/>JWT Validation"]
//       Auth --> ServiceA["Business Service A"]
//       Auth --> ServiceB["Business Service B"]
//       ServiceA --> DB[(Encrypted Database)]
//       ServiceA --> Cache[(Cache Layer)]
//       ServiceB --> Secrets[(Secrets Manager)]
//       ServiceB --> Queue[(Message Queue)]

//       classDef default fill:#ffffff,stroke:#171717,stroke-width:1px,color:#171717
//       classDef security fill:#f5f5f5,stroke:#171717,stroke-width:1px,stroke-dasharray:5 5,color:#171717

//       class Auth,Secrets,LB,Gateway security
//   `;

//   const paymentFlow = isMobile ? `
//     flowchart TB
//       User["User"] --> Inquiry["Inquiry"]
//       Inquiry --> Fraud["Fraud Detection"]
//       Fraud --> Staging["Staging"]
//       Staging --> OTP["OTP Service"]
//       OTP --> Partners["Partner APIs"]
//       Partners --> Settlement["Settlement"]
//       Settlement --> Audit["Audit Log"]

//       classDef default fill:#ffffff,stroke:#171717,stroke-width:1px,color:#171717
//       classDef security fill:#f5f5f5,stroke:#171717,stroke-width:1px,stroke-dasharray:5 5,color:#171717

//       class Fraud,Audit security
//   ` : `
//     flowchart LR
//       User --> Inquiry --> FraudDetection --> Staging --> OTP --> PartnerAPIs --> Settlement --> AuditLog

//       classDef default fill:#ffffff,stroke:#171717,stroke-width:1px,color:#171717
//       classDef security fill:#f5f5f5,stroke:#171717,stroke-width:1px,stroke-dasharray:5 5,color:#171717

//       class FraudDetection,AuditLog security
//   `;

//   const migration = isMobile ? `
//     flowchart TB
//       Laravel["Laravel 4.2"] --> Hybrid["Hybrid Phase"]
//       Hybrid --> NodeJS["Node.js v22"]
//       Hybrid --> Timeline["5 Months"]

//       classDef legacy fill:#f5f5f5,stroke:#737373,stroke-width:1px,color:#737373
//       classDef active fill:#ffffff,stroke:#171717,stroke-width:2px,color:#171717
//       classDef modern fill:#ffffff,stroke:#171717,stroke-width:1px,color:#171717
//       classDef meta fill:#fafafa,stroke:#a3a3a3,stroke-width:1px,stroke-dasharray:3 3,color:#525252

//       class Laravel legacy
//       class Hybrid active
//       class NodeJS modern
//       class Timeline meta
//   ` : `
//     flowchart LR
//       Laravel["Laravel 4.2"] --> Hybrid["Hybrid Phase"] --> NodeJS["Node.js v22"]
//       Hybrid --> Timeline["5 Months"]

//       classDef legacy fill:#f5f5f5,stroke:#737373,stroke-width:1px,color:#737373
//       classDef active fill:#ffffff,stroke:#171717,stroke-width:2px,color:#171717
//       classDef modern fill:#ffffff,stroke:#171717,stroke-width:1px,color:#171717
//       classDef meta fill:#fafafa,stroke:#a3a3a3,stroke-width:1px,stroke-dasharray:3 3,color:#525252

//       class Laravel legacy
//       class Hybrid active
//       class NodeJS modern
//       class Timeline meta
//   `;

//   return (
//     <section id="architecture" className="py-20 sm:py-32 lg:py-48 px-4 sm:px-8">
//       <div className="max-w-7xl mx-auto">
//         <ScrollReveal>
//           <p className="text-sm uppercase tracking-wider text-text-muted mb-4">
//             Technical Architecture
//           </p>
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-text-primary mb-12 sm:mb-16">
//             System Design
//           </h2>
//         </ScrollReveal>

//         <div className="space-y-16">
//           <ScrollReveal>
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-text-primary mb-2">
//                 Defense in Depth: Secure Microservices
//               </h3>
//               <p className="text-sm text-text-secondary">
//                 Industry-standard security architecture with layered defense mechanisms and JWT-based authentication
//               </p>
//             </div>
//             <MermaidDiagram chart={microservicesSecurity} />
//           </ScrollReveal>

//           <ScrollReveal>
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-text-primary mb-2">
//                 Payment Transaction Flow
//               </h3>
//               <p className="text-sm text-text-secondary">
//                 End-to-end transaction lifecycle with fraud detection and compliance tracking
//               </p>
//             </div>
//             <MermaidDiagram chart={paymentFlow} />
//           </ScrollReveal>

//           <ScrollReveal>
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-text-primary mb-2">
//                 Laravel to Node.js Migration
//               </h3>
//               <p className="text-sm text-text-secondary">
//                 5-month strategic migration using Strangler Pattern with 100% stability
//               </p>
//             </div>
//             <MermaidDiagram chart={migration} />
//           </ScrollReveal>
//         </div>

//         <ScrollReveal>
//           <div className="mt-16 text-center">
//             <p className="text-text-secondary mb-6">
//               Production-grade fintech architecture with security-first design and zero-downtime migrations.
//             </p>
//             <a
//               href="#contact"
//               className="inline-flex items-center gap-2 bg-primary text-text-inverse px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
//             >
//               Discuss Architecture
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//               </svg>
//             </a>
//           </div>
//         </ScrollReveal>
//       </div>
//     </section>
//   );
// }
