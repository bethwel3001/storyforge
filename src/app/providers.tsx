"use client";

import { StoryProvider } from "@/lib/story-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <StoryProvider>
        {children}
        <Toaster />
      </StoryProvider>
    </ThemeProvider>
  );
}
