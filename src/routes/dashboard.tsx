import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  Database,
  FileText,
  Gauge,
  LayoutDashboard,
  Menu,
  Route as RouteIcon,
  ScanSearch,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

import { CycloneLogo } from "@/components/brand/primitives";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Cyclone AI" },
      { name: "description", content: "Cyclone AI operations dashboard: detection, classification, track prediction and historical archives." },
      { property: "og:title", content: "Dashboard — Cyclone AI" },
      { property: "og:description", content: "Monitor live cyclone systems and run AI analysis from one workspace." },
    ],
  }),
  component: DashboardLayout,
});

const groups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Analysis",
    items: [
      { to: "/dashboard/detect", label: "Detection", icon: ScanSearch },
      { to: "/dashboard/classify", label: "Classification", icon: Gauge },
      { to: "/dashboard/predict", label: "Track Prediction", icon: RouteIcon },
    ],
  },
  {
    label: "Data",
    items: [
      { to: "/dashboard/history", label: "Prediction History", icon: Database },
      { to: "/dashboard/cyclones", label: "Cyclone Archive", icon: Database },
      { to: "/dashboard/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [{ to: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
] as const;

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      {groups.map((group) => (
        <div key={group.label}>
          {!collapsed ? (
            <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
              {group.label}
            </p>
          ) : null}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active =
                "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    title={item.label}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/12 text-cyan"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute top-1.5 bottom-1.5 -left-4 w-1 rounded-r-full bg-cyan"
                      />
                    ) : null}
                    <item.icon className="size-[18px] shrink-0" strokeWidth={1.8} />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl transition-[width] duration-300 lg:flex ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden text-cyan">
            <CycloneLogo className="size-8 shrink-0" />
            {!collapsed ? (
              <span className="text-sm font-bold tracking-tight whitespace-nowrap text-foreground">
                CYCLONE <span className="text-cyan">AI</span>
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        {nav}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="relative h-full w-64 border-r border-border bg-surface"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-bold text-foreground">
                CYCLONE <span className="text-cyan">AI</span>
              </span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            {nav}
          </motion.div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-5 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="text-muted-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <label className="flex max-w-md flex-1 items-center gap-3 rounded-xl border border-border bg-surface/70 px-3.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Search cyclones, predictions, reports…"
              className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </label>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-cyan">
                AR
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium text-foreground">Ananya Rao</span>
                <span className="block text-[11px] text-muted-foreground">Senior Analyst</span>
              </span>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
