import resumeData from "@/specs/Resume/resume.json";

type ResumeJson = {
  personalInfo?: {
    fullName?: string;
    title?: string;
  };
  professionalSummary?: {
    headline?: string;
    focus?: string[];
    specialization?: string;
  };
  experience?: Array<{
    company?: string;
    position?: string;
    duration?: { start?: string | number; end?: string | number };
    description?: string;
    keyResponsibilities?: Array<{ area?: string; details?: string }>;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    major?: string;
    honors?: string;
  }>;
  technicalSkills?:
    | Record<string, Record<string, string[]>>
    | {
        backendArchitecture?: {
          core?: string[];
          designPatterns?: string[];
          systemDesign?: string[];
        };
        cloudInfrastructure?: {
          compute?: string[];
          devops?: string[];
          storage?: string[];
          certification?: string;
        };
        securityCompliance?: {
          cryptography?: string[];
          identity?: string[];
          remediation?: string[];
        };
        fullStackObservability?: {
          frontend?: string[];
          observability?: string[];
        };
      };
  coreCompetencies?: string[];
  achievements?: Record<string, string>;
  currentRole?: {
    company?: string;
    position?: string;
    since?: string;
    status?: string;
  };
};

type ResumeContext = {
  contextText: string;
};

let cachedContext: ResumeContext | null = null;

function joinList(
  items: Array<string | undefined> | undefined,
  limit = 12,
): string {
  if (!items || items.length === 0) return "";
  return items.filter(Boolean).slice(0, limit).join(", ");
}

function buildContextText(resume: ResumeJson): string {
  const summary = resume.professionalSummary;
  const experience = resume.experience ?? [];
  const education = resume.education ?? [];
  const achievements = resume.achievements ?? {};
  const tech = resume.technicalSkills as ResumeJson["technicalSkills"];
  const competencies = joinList(resume.coreCompetencies ?? [], 20);

  const focus = joinList(summary?.focus ?? [], 8);
  const achievementsList = Object.entries(achievements)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");

  const techLines: string[] = [];
  if (tech && "backendArchitecture" in tech && tech.backendArchitecture) {
    techLines.push(
      `Backend: ${joinList(tech.backendArchitecture.core, 10)}; Patterns: ${joinList(tech.backendArchitecture.designPatterns, 10)}; System: ${joinList(tech.backendArchitecture.systemDesign, 10)}`,
    );
  }
  if (tech && "cloudInfrastructure" in tech && tech.cloudInfrastructure) {
    techLines.push(
      `Cloud: ${joinList(tech.cloudInfrastructure.compute, 8)}; DevOps: ${joinList(tech.cloudInfrastructure.devops, 8)}; Storage: ${joinList(tech.cloudInfrastructure.storage, 8)}; Cert: ${tech.cloudInfrastructure.certification ?? ""}`,
    );
  }
  if (tech && "securityCompliance" in tech && tech.securityCompliance) {
    techLines.push(
      `Security: ${joinList(tech.securityCompliance.cryptography, 8)}; Identity: ${joinList(tech.securityCompliance.identity, 8)}; Remediation: ${joinList(tech.securityCompliance.remediation, 6)}`,
    );
  }
  if (tech && "fullStackObservability" in tech && tech.fullStackObservability) {
    techLines.push(
      `Frontend/Observability: ${joinList(tech.fullStackObservability.frontend, 8)}; Observability: ${joinList(tech.fullStackObservability.observability, 8)}`,
    );
  }

  const experienceLines = experience.map((role) => {
    const responsibilities = (role.keyResponsibilities ?? [])
      .slice(0, 9)
      .map((item) => `${item.area}: ${item.details}`)
      .join(" | ");
    return `${role.position ?? ""} at ${role.company ?? ""} (${role.duration?.start ?? ""} - ${role.duration?.end ?? "Present"}): ${role.description ?? ""}. Key work: ${responsibilities}`;
  });

  const educationLines = education.map(
    (ed) =>
      `${ed.degree ?? ""} in ${ed.major ?? ""} at ${ed.institution ?? ""} (${ed.honors ?? ""})`,
  );

  const parts = [
    `Name: ${resume.personalInfo?.fullName ?? "James Florence Conales"}`,
    `Title: ${resume.personalInfo?.title ?? "Software Engineer"}`,
    `Professional headline: ${summary?.headline ?? "Fintech-specialized Backend Engineer"}`,
    `Specialization: ${summary?.specialization ?? "Fintech systems"}`,
    `Focus areas: ${focus}`,
    `Current role: ${resume.currentRole?.position ?? ""} at ${resume.currentRole?.company ?? ""} since ${resume.currentRole?.since ?? "June 2024"}`,
    `Experience: ${experienceLines.join(" || ")}`,
    `Achievements: ${achievementsList}`,
    `Core competencies: ${competencies}`,
    `Technical skills: ${techLines.join(" || ")}`,
    `Education: ${educationLines.join(" || ")}`,
  ];

  return parts.filter(Boolean).join("\n");
}

export async function getResumeContext(): Promise<ResumeContext> {
  if (cachedContext) return cachedContext;
  const resumeJson = resumeData as ResumeJson;
  if (!resumeJson || Object.keys(resumeJson).length === 0) {
    throw Object.assign(new Error("resume_data_missing"), { status: 500 });
  }
  const contextText = buildContextText(resumeJson);

  cachedContext = { contextText };
  return cachedContext;
}

export function clearResumeContextCache() {
  cachedContext = null;
}
