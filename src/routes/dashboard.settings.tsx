import { createFileRoute } from "@tanstack/react-router";
import { Copy, KeyRound } from "lucide-react";
import { useState } from "react";

import { GhostButton, GradientButton } from "@/components/brand/primitives";
import { apiKeys } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cyclone AI" },
      { name: "description", content: "Configure your Cyclone AI profile, notifications and API access." },
      { property: "og:title", content: "Settings — Cyclone AI" },
      { property: "og:description", content: "Manage Cyclone AI workspace preferences and access settings." },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["Profile", "Notifications", "API keys"] as const;

function Toggle({ label, hint, defaultOn }: { label: string; hint: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(Boolean(defaultOn));
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-surface-2"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-foreground transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, alerts and API access.</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors ${
              tab === t
                ? "border-primary/50 bg-primary/12 text-cyan"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl">
        {tab === "Profile" ? (
          <form className="max-w-xl space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center gap-4">
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-cyan">
                AR
              </span>
              <GhostButton type="button">Change avatar</GhostButton>
            </div>
            {[
              ["Full name", "Ananya Rao"],
              ["Email", "analyst@cyclone.ai"],
              ["Organisation", "India Meteorological Department"],
              ["Role", "Senior Analyst"],
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
                <input
                  defaultValue={value}
                  className="mt-2 w-full rounded-xl border border-border bg-surface/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60"
                />
              </label>
            ))}
            <GradientButton type="submit">Save changes</GradientButton>
          </form>
        ) : tab === "Notifications" ? (
          <div className="max-w-2xl">
            <Toggle label="Severe cyclone alerts" hint="Push alert when a system reaches VSCS or above" defaultOn />
            <Toggle label="Landfall warnings" hint="Notify 24 hours before projected landfall" defaultOn />
            <Toggle label="Model retraining digests" hint="Weekly summary of model accuracy changes" />
            <Toggle label="Email bulletins" hint="Daily basin bulletin to your inbox" defaultOn />
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-cyan">
                    <KeyRound className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{key.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {key.id}••••••••••••
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created {key.created}</span>
                  <span>Last used {key.lastUsed}</span>
                  <button
                    type="button"
                    aria-label="Copy key"
                    className="rounded-lg border border-border p-2 text-foreground hover:bg-surface-2"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            <GradientButton type="button">Create new key</GradientButton>
          </div>
        )}
      </div>
    </div>
  );
}
