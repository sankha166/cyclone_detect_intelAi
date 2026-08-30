import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useMemo, useState } from "react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { GradientButton } from "@/components/brand/primitives";

const title = "Create Account — Cyclone AI";
const description = "Join Cyclone AI to monitor, classify and forecast tropical cyclones with AI-assisted satellite intelligence.";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SignupPage,
});

const strengthLabels = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

function scorePassword(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function SignupPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const score = useMemo(() => scorePassword(password), [password]);

  return (
    <AuthLayout
      eyebrow="Start monitoring in minutes"
      headline="Turn satellite noise into storm intelligence."
      bullets={[
        "Upload INSAT-3D imagery for instant detection",
        "Category classification with confidence scores",
        "Shareable reports for response teams",
      ]}
    >
      <h1 className="text-3xl font-bold text-foreground">Create account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Set up your workspace and start tracking cyclones today.
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
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Full name</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 focus-within:border-primary/60">
              <User className="size-4 text-muted-foreground" />
              <input
                required
                placeholder="Ananya Rao"
                className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </span>
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Organisation</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 focus-within:border-primary/60">
              <Building2 className="size-4 text-muted-foreground" />
              <input
                placeholder="IMD / Research lab"
                className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </span>
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Email</span>
          <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 focus-within:border-primary/60">
            <Mail className="size-4 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="you@agency.gov"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Password</span>
          <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 focus-within:border-primary/60">
            <Lock className="size-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
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
          <span className="mt-3 flex items-center gap-3">
            <span className="flex h-1.5 flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-full flex-1 rounded-full ${i < score ? "bg-cyan" : "bg-surface-2"}`}
                />
              ))}
            </span>
            <span className="w-20 text-right text-[11px] text-muted-foreground">{strengthLabels[score]}</span>
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-border bg-surface accent-[oklch(0.62_0.18_235)]"
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>

        <GradientButton type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Creating account…" : "Create Account"}
        </GradientButton>
      </form>

      <div className="my-7 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR SIGN UP WITH
        <span className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-cyan hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
