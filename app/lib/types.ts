export interface PersonalInfo {
  readonly fullName: string;
  readonly title: string;
  readonly location: string;
  readonly contact: { readonly phone: string; readonly email: string };
}

export interface ProfessionalSummary {
  readonly headline: string;
  readonly valueProposition: string;
  readonly focus: readonly string[];
  readonly specialization: string;
}

export interface ExperienceItem {
  readonly company: string;
  readonly position: string;
  readonly duration: { readonly start: string; readonly end: string };
  readonly description: string;
  readonly keyResponsibilities: readonly {
    readonly area: string;
    readonly details: string;
  }[];
}

export interface TechSkillCategory {
  readonly name: string;
  readonly items: readonly string[];
}

export interface Achievement {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export interface ProjectCard {
  readonly title: string;
  readonly description: string;
  readonly techTags: readonly string[];
  readonly status: string;
  readonly proofCategory?: "security" | "reliability" | "ownership";
  readonly href?: string;
}

export interface ProofPath {
  readonly id: string;
  readonly audience: string;
  readonly question: string;
  readonly destination: string;
  readonly cta: string;
}

export interface EvidenceCard {
  readonly id: string;
  readonly claim: string;
  readonly problem: string;
  readonly action: string;
  readonly result: string;
  readonly constraint: string;
}

export interface ContactIntent {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly href: string;
  readonly type: "primary" | "secondary";
}

export interface EducationItem {
  readonly institution: string;
  readonly degree: string;
  readonly major: string;
  readonly abbreviation: string;
  readonly duration: { readonly start: number; readonly end: number };
  readonly honors: string;
}

export type RateLimitStrategy = 'token-bucket' | 'fixed-window' | 'sliding-window';

export type TrafficPattern = 'normal' | 'burst' | 'ddos' | 'spike';

export type RequestStatus = 'pending' | 'allowed' | 'blocked' | 'processing';

export interface SimulatedRequest {
  id: string;
  timestamp: number;
  status: RequestStatus;
  clientId: string;
  responseTime?: number;
  headers?: {
    'X-RateLimit-Limit': number;
    'X-RateLimit-Remaining': number;
    'X-RateLimit-Reset': number;
    'Retry-After'?: number;
  };
}
