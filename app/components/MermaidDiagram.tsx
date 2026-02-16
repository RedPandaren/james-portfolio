"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#ffffff",
        primaryTextColor: "#171717",
        primaryBorderColor: "#171717",
        secondaryColor: "#fafafa",
        secondaryTextColor: "#171717",
        secondaryBorderColor: "#171717",
        tertiaryColor: "#f5f5f5",
        lineColor: "#a3a3a3",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontSize: "14px",
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        padding: 16,
        nodeSpacing: 50,
        rankSpacing: 60,
      },
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!elementRef.current) return;
      
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        setError("Failed to render diagram");
        console.error("Mermaid render error:", err);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <p className="text-text-muted text-sm">Architecture diagram unavailable</p>
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      className={`mermaid-diagram bg-surface border border-border rounded-xl p-8 overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
