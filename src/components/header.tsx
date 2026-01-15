"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();

  // Don't render header on the story page
  if (pathname.startsWith('/story/')) {
    return null;
  }
  
  return (
    <header className="relative w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">
              StoryForge
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <a href="https://github.com/bethwel3001/storyforge" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
