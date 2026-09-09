import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_KEY = "cyclone-ai-theme";

function applyTheme(theme: "dark" | "light") {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent("cyclone-theme-change", { detail: theme }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");

    const onThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<"dark" | "light">).detail;
      if (nextTheme === "dark" || nextTheme === "light") setTheme(nextTheme);
    };
    window.addEventListener("cyclone-theme-change", onThemeChange);
    return () => window.removeEventListener("cyclone-theme-change", onThemeChange);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      onClick={() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}