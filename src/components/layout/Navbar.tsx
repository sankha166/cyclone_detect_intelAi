import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { CycloneLogo, GradientButton } from "@/components/brand/primitives";
import { navLinks } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-cyan">
          <CycloneLogo />
          <span className="leading-none">
            <span className="block text-lg font-bold tracking-tight text-foreground">
              CYCLONE <span className="text-cyan">AI</span>
            </span>
            <span className="mt-1 block text-[10px] font-medium tracking-[0.24em] text-muted-foreground">
              STORM INTELLIGENCE
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-cyan transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Log In
          </Link>
          <Link to="/signup">
            <GradientButton className="px-5 py-2.5">Get Started</GradientButton>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="rounded-lg border border-border p-2 text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background/95 px-5 pb-6 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold"
            >
              Log In
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="flex-1">
              <GradientButton className="w-full px-4 py-3">Get Started</GradientButton>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
