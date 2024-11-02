"use client";

import { useTheme } from "next-themes";

export function DotPatternBackground() {
  const { theme } = useTheme();

  const dotColor =
    theme === undefined || theme === "system"
      ? "var(--dot-pattern)"
      : theme === "dark"
        ? "38 38 38"
        : "229 231 235";

  return (
    <div
      className="absolute inset-0 z-0 h-full w-full [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      style={{
        backgroundImage: `radial-gradient(rgb(${dotColor}) 1px, transparent 1px)`,
      }}
    />
  );
}
