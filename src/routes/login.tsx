import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { GradientButton } from "@/components/brand/primitives";

const title = "Sign In — Cyclone AI";
const description = "Access the Cyclone AI intelligence dashboard: live storm tracking, AI classification and track forecasts.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout
      eyebrow="Welcome back to the storm room"
      headline="Track every storm before it makes landfall."
      bullets={[
        "Live multi-satellite cyclone monitoring",
        "AI intensity classification in seconds",
        "72-hour track and landfall forecasts",
      ]}
    >
      <h1 className="text-3xl font-bold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your credentials to access the intelligence dashboard.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            void navigate({ to: "/dashboard" });
          }, 900);
        }}
      >
        <label className="block">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Email</span>
          <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 transition-colors focus-within:border-primary/60">
            <Mail className="size-4 text-muted-foreground" />
            <input
              type="email"
              required
              defaultValue="analyst@cyclone.ai"
              placeholder="you@agency.gov"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Password</span>
          <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 transition-colors focus-within:border-primary/60">
            <Lock className="size-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              defaultValue="cyclone2026"
              placeholder="••••••••"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="size-4 rounded border-border bg-surface accent-[oklch(0.62_0.18_235)]" />
            Remember me
          </label>
          <button type="button" className="font-medium text-cyan hover:underline">
            Forgot password?
          </button>
        </div>

        <GradientButton type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Signing in…" : "Sign In"}
        </GradientButton>
      </form>

      <div className="my-7 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR CONTINUE WITH
        <span className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-cyan hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
