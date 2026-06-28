"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/carethread/store";
import { t } from "@/lib/carethread/i18n";
import { Activity, Bell, BellOff } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useApp();
  const pathname = usePathname();
  const onClinician = pathname.startsWith("/clinician");
  const [dnd, setDnd] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur bg-background/80">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
              style={{ background: "var(--color-primary)" }}
            >
              <Activity className="h-4 w-4" />
            </span>
            <span>CareThread</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
            <NavLink href="/patient" active={pathname.startsWith("/patient")}>
              {t("patientView", lang)}
            </NavLink>
            <NavLink href="/clinician" active={onClinician}>
              {t("clinicianView", lang)}
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* DND toggle — clinician only. Covers "don't interrupt me now" from COMPASS design requirements */}
            {onClinician && (
              <button
                onClick={() => setDnd((d) => !d)}
                title={
                  dnd
                    ? lang === "en" ? "Resume AI nudges" : "Reprendre les rappels IA"
                    : lang === "en" ? "Pause AI nudges during consult" : "Mettre les rappels en pause"
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  dnd
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {dnd ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                {dnd
                  ? (lang === "en" ? "Nudges paused" : "Rappels en pause")
                  : (lang === "en" ? "Pause nudges" : "Mettre en pause")}
              </button>
            )}

            <div className="inline-flex rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >EN</button>
              <button
                onClick={() => setLang("fr")}
                className={`px-3 py-1 rounded-full transition ${lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >FR</button>
            </div>
          </div>
        </div>

        {/* DND active banner */}
        {onClinician && dnd && (
          <div className="border-t border-amber-200 bg-amber-50 px-5 py-2 text-center text-xs font-medium text-amber-800">
            {lang === "en"
              ? "AI nudges paused — you won't be interrupted during this consult. Pre-visit flags are still visible."
              : "Rappels IA en pause — vous ne serez pas interrompu. Les alertes pré-visite restent visibles."}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        CareThread · Built at the AI in Healthcare Co-Design Hackathon · Ottawa 2026
      </footer>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full transition ${
        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

export function StatusChip({ status, lang }: { status: "ok" | "due" | "overdue"; lang: "en" | "fr" }) {
  const map = {
    ok:      { bg: "var(--color-sage)",   fg: "var(--color-sage-foreground)",   en: "Up to date", fr: "À jour" },
    due:     { bg: "var(--color-copper)", fg: "var(--color-copper-foreground)", en: "Due soon",   fr: "À prévoir" },
    overdue: { bg: "var(--color-signal)", fg: "var(--color-signal-foreground)", en: "Overdue",    fr: "En retard" },
  } as const;
  const s = map[status];
  return (
    <span className="ct-chip" style={{ background: s.bg, color: s.fg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg, opacity: 0.85 }} />
      {s[lang]}
    </span>
  );
}
