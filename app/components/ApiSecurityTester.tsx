import ApiSecurityTester from "@/app/components/ApiSecurityTester";

export const metadata = {
  title: "API Security Tester | James Florence Conales",
  description: "Interactive demonstration of production-grade API security patterns including HMAC signing, encryption, IAM policies, and rate limiting.",
};

export default function ApiSecurityTesterPage() {
  return <ApiSecurityTester />;
}