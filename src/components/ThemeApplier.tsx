"use client";

import { useEffect } from "react";
import { useSettings } from "@/state/settings";

// Applies the persisted theme to <html> after hydration. Dark is the default,
// so dark users see no flash; light users get one paint before it switches.
export default function ThemeApplier() {
  const theme = useSettings((s) => s.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return null;
}
