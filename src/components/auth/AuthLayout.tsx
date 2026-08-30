import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

import earthPanel from "@/assets/earth-auth-panel.jpg";
import { CycloneLogo } from "@/components/brand/primitives";

export function AuthLayout({
  eyebrow,
  headline,
  bullets,
  children,
}: {
  eyebrow: string;
  headline: string;
  bullets: string[];
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <motion.aside
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative hidden overflow-hidden lg:block"
      >
        <img
          src={earthPanel}
          alt="Earth from space with a cyclone swirling over the Bay of Bengal"
          className="absolute inset-0 size-full object-cover"
          width={1024}
          height={1536}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3 text-cyan">
            <CycloneLogo />
            <span className="text-lg font-bold tracking-tight text-foreground">
              CYCLONE <span className="text-cyan">AI</span>
            </span>
          </Link>

          <div className="max-w-sm">
            <p className="text-sm text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-3 text-4xl leading-tight font-bold text-foreground">{headline}</h2>
            <ul className="mt-8 space-y-4">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/15 text-cyan">
                    <Check className="size-3.5" strokeWidth={2.4} />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center bg-surface/40 px-5 py-14 sm:px-10"
      >
        <div className="w-full max-w-md">{children}</div>
      </motion.main>
    </div>
  );
}
