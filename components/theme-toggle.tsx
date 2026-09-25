"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-1" aria-label="Theme options">
      <Button
        type="button"
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        aria-label="Use light theme"
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        aria-label="Use dark theme"
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        aria-label="Use system theme"
      >
        <Monitor className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
