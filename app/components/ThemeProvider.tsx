"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}>({ theme: "light", toggleTheme: () => {}, mounted: false });

export function useTheme() {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
