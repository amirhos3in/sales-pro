"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type ThemeName = "dark" | "light";

type ThemeValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const hydrated = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hydrated.current) return;
      hydrated.current = true;
      const stored = localStorage.getItem("nexsell-theme");
      if (stored === "light" || stored === "dark") setThemeState(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("nexsell-theme", theme);
  }, [theme]);

  const setTheme = (next: ThemeName) => {
    hydrated.current = true;
    setThemeState(next);
  };

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
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
