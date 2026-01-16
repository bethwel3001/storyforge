
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {cn} from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  return (
    <header className={cn(pathname.startsWith('/story/')&&"!hidden",
        "flex flex-col mx-auto justify-center items-center fixed py-1 backdrop-blur-lg z-[999] w-full border-b bg-background")}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <a href="https://github.com/bethwel3001/flowtale" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
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
