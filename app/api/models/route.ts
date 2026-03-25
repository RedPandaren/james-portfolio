import { NextResponse } from "next/server";

export const runtime = "edge";

type Model = {
  name?: string;
  supportedGenerationMethods?: string[];
};

export async function GET() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_AI_API_KEY not set" },
      { status: 500 },
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const reason = body?.error?.message ?? `status ${res.status}`;
      return NextResponse.json({ error: reason }, { status: res.status });
    }

    const data = (await res.json()) as { models?: Model[] };
    const models = (data.models ?? []).filter((m) =>
      (m.supportedGenerationMethods ?? []).includes("generateContent"),
    );

    return NextResponse.json({
      models: models.map((m) => m.name ?? "").filter(Boolean),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "fetch_failed" },
      { status: 500 },
    );
  }
}
