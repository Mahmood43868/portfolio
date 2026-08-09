"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Both icons are rendered and CSS picks one off the `dark` class that
 * next-themes sets before first paint. No mounted flag, no hydration
 * mismatch, and the right icon is correct even before JS hydrates.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      // Native tooltip — the icon alone wasn't discoverable enough in testing.
      title="Switch between light and dark"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group grid size-9 place-items-center rounded-lg border border-line text-fg/70 transition-colors hover:border-line-strong hover:bg-raised hover:text-fg"
    >
      <Sun
        className="hidden size-4 transition-transform duration-300 group-hover:rotate-45 dark:block"
        strokeWidth={1.75}
      />
      <Moon
        className="size-4 transition-transform duration-300 group-hover:-rotate-12 dark:hidden"
        strokeWidth={1.75}
      />
    </button>
  );
}
