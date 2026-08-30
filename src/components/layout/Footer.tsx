import { Link } from "@tanstack/react-router";

import { CycloneLogo } from "@/components/brand/primitives";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex items-center gap-3 text-cyan">
          <CycloneLogo className="h-7 w-7" />
          <span className="text-sm font-bold tracking-tight text-foreground">CYCLONE AI</span>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">
            Intelligence
          </Link>
          <Link to="/how-it-works" className="hover:text-foreground">
            How It Works
          </Link>
          <Link to="/technology" className="hover:text-foreground">
            Data &amp; Technology
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2026 Cyclone AI · Research demonstrator with simulated data
        </p>
      </div>
    </footer>
  );
}
