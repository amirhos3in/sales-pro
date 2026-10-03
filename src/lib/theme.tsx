"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeName = "dark" | "light";

type ThemeValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem("nexsell-theme");
      if (stored === "light" || stored === "dark") setThemeState(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("nexsell-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggle: () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useThemeMode must be used inside ThemeProvider");
  return value;
}
