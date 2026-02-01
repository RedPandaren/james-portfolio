export interface PersonalInfo {
  readonly fullName: string;
  readonly title: string;
  readonly location: string;
  readonly contact: { readonly phone: string; readonly email: string };
}

export interface ProfessionalSummary {
  readonly headline: string;
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
  readonly href?: string;
}

export interface EducationItem {
  readonly institution: string;
  readonly degree: string;
  readonly major: string;
  readonly abbreviation: string;
  readonly duration: { readonly start: number; readonly end: number };
  readonly honors: string;
}
