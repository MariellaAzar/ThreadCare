"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/carethread/store";
import { t } from "@/lib/carethread/i18n";
import { ArrowRight, QrCode, Stethoscope, ShieldCheck, FileText, Heart, DollarSign } from "lucide-react";

export default function Landing() {
  const { lang } = useApp();
  return (
    <AppShell>
      {/* ── HERO ── */}
      <section className="relative">
        <div className="absolute inset-0 ct-grid-bg opacity-50 [mask-image:radial-gradient(900px_500px_at_30%_20%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="ct-chip" style={{ background: "var(--color-secondary)", color: "var(--color-secondary-foreground)" }}>
              <Heart className="h-3 w-3" /> AI in Healthcare · Ottawa 2026
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-tight">
              {lang === "en" ? (
                <>One health story.<br /><em className="not-italic" style={{ color: "var(--color-primary)" }}>Every provider.</em><br />Always connected.</>
              ) : (
                <>Un dossier de santé.<br /><em className="not-italic" style={{ color: "var(--color-primary)" }}>Chaque médecin.</em><br />Toujours connecté.</>
              )}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {lang === "en"
                ? "1 in 5 Canadians has no family doctor. When you have no GP, your health story lives nowhere. Every walk-in starts from scratch. Things get missed — not from negligence, but from a system with no memory."
                : "1 Canadien sur 5 n'a pas de médecin de famille. Sans médecin, votre histoire de santé n'existe nulle part. Chaque sans rendez-vous repart de zéro. Des choses passent inaperçues — non par négligence, mais par un système sans mémoire."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)", boxShadow: "var(--shadow-lift)" }}
              >
                {t("getStarted", lang)} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/clinician"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-border bg-card hover:bg-secondary transition"
              >
                <Stethoscope className="h-4 w-4" /> {t("forClinicians", lang)}
              </Link>
            </div>
            <p className="mt-8 font-display text-2xl italic leading-snug max-w-xl" style={{ color: "var(--color-ink)" }}>
              &ldquo;{t("oneLine", lang)}&rdquo;
            </p>
          </div>

          <div className="lg:col-span-5">
            <DemoCard lang={lang} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-border/60" style={{ background: "var(--color-card)" }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: QrCode,
              t: lang === "en" ? "Patient holds the record" : "Le patient détient le dossier",
              d: lang === "en"
                ? "Anchored to RAMQ or OHIP. Sign in with Google or Apple. The patient controls every access — and sees who viewed their record, when, and where."
                : "Ancré à RAMQ ou OHIP. Connexion Google ou Apple. Le patient contrôle chaque accès et voit qui a consulté son dossier.",
              rail: "var(--color-primary)",
            },
            {
              icon: Stethoscope,
              t: lang === "en" ? "Doctor scans, no login" : "Le médecin scanne, sans connexion",
              d: lang === "en"
                ? "Any clinician scans the QR and sees the full history in their browser. No EMR integration needed. No new account. Works alongside OSCAR, PS Suite, Wolf, Accuro."
                : "Tout clinicien scanne un QR et voit l'historique complet. Aucune intégration DME. Aucun compte. Compatible avec OSCAR, PS Suite, Wolf, Accuro.",
              rail: "var(--color-sage)",
            },
            {
              icon: FileText,
              t: lang === "en" ? "Admin writes itself" : "L'administratif s'écrit tout seul",
              d: lang === "en"
                ? "AI drafts referrals, flags overdue screenings, syncs follow-ups to the patient record. 19 hours of weekly admin, cut down."
                : "L'IA rédige les références, signale les dépistages en retard, synchronise les suivis. 19 heures d'administratif par semaine, réduites.",
              rail: "var(--color-copper)",
            },
          ].map((f) => (
            <article key={f.t} className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: f.rail }}>
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                style={{ background: "var(--color-secondary)", color: "var(--color-primary)" }}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── PERSONAL STORY ── */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 py-20">
        <span className="ct-chip" style={{ background: "var(--color-copper)", color: "var(--color-copper-foreground)" }}>
          <ShieldCheck className="h-3 w-3" /> {lang === "en" ? "Why it exists" : "Pourquoi"}
        </span>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
          {lang === "en" ? "Two stories that built this." : "Deux histoires à l'origine."}
        </h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <blockquote className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: "var(--color-signal)" }}>
            <p className="font-display text-xl leading-snug">
              {lang === "en"
                ? "A friend had back pain for years. Every walk-in, a different doctor, starting from zero. By the time someone ordered an X-ray, her scoliosis had progressed to a severity that changed her life."
                : "Une amie avait mal au dos depuis des années. Chaque sans rendez-vous, un médecin différent, à recommencer. Quand on a finalement demandé une radio, sa scoliose avait progressé au point de changer sa vie."}
            </p>
          </blockquote>
          <blockquote className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: "var(--color-signal)" }}>
            <p className="font-display text-xl leading-snug">
              {lang === "en"
                ? "A family member found out they had cancer at stage 4. Not because they didn't go to the doctor — because no single doctor ever had the full picture."
                : "Un membre de ma famille a appris son cancer au stade 4. Pas parce qu'il ne consultait pas — mais parce qu'aucun médecin n'avait jamais l'image complète."}
            </p>
          </blockquote>
        </div>
        <p className="mt-10 text-center text-muted-foreground max-w-2xl mx-auto">{t("whyText", lang)}</p>
      </section>

      {/* ── PRACTICAL AFFORDABILITY ── */}
      <section className="border-t border-border/60" style={{ background: "var(--color-card)" }}>
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-20">
          <span className="ct-chip" style={{ background: "var(--color-sage)", color: "var(--color-sage-foreground)" }}>
            <DollarSign className="h-3 w-3" /> {lang === "en" ? "Built for tight clinic margins" : "Conçu pour les budgets serrés"}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            {lang === "en" ? "No per-seat trap. No IT project." : "Pas de frais par siège. Pas de projet informatique."}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            {lang === "en"
              ? "Small primary care clinics operate on tight margins. Clinicians see value before they pay anything — and never pay for infrastructure they don't use."
              : "Les petites cliniques fonctionnent avec des marges serrées. Les cliniciens voient la valeur avant de payer quoi que ce soit."}
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: lang === "en" ? "Patient app" : "Application patient",
                price: lang === "en" ? "Free" : "Gratuit",
                desc: lang === "en" ? "Always free. Record, screenings, QR, reminders." : "Toujours gratuit. Dossier, dépistages, QR, rappels.",
                color: "var(--color-sage)",
                fg: "var(--color-sage-foreground)",
              },
              {
                title: lang === "en" ? "Doctor QR access" : "Accès QR médecin",
                price: lang === "en" ? "Free" : "Gratuit",
                desc: lang === "en" ? "No login. No subscription. Scan and see everything." : "Aucune connexion. Aucun abonnement. Scannez et voyez tout.",
                color: "var(--color-sage)",
                fg: "var(--color-sage-foreground)",
              },
              {
                title: lang === "en" ? "AI admin tools" : "Outils admin IA",
                price: lang === "en" ? "Per use" : "À l'usage",
                desc: lang === "en" ? "Pay only when you generate. No monthly burden." : "Payez seulement à l'utilisation. Aucun abonnement mensuel.",
                color: "var(--color-copper)",
                fg: "var(--color-copper-foreground)",
              },
              {
                title: lang === "en" ? "EMR integration" : "Intégration DME",
                price: lang === "en" ? "Per clinic" : "Par clinique",
                desc: lang === "en" ? "One flat fee per clinic. Not per provider seat." : "Un tarif fixe par clinique. Pas par praticien.",
                color: "var(--color-primary)",
                fg: "var(--color-primary-foreground)",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-5 flex flex-col gap-2"
                style={{ background: "var(--color-secondary)" }}
              >
                <div className="ct-chip self-start" style={{ background: item.color, color: item.fg }}>
                  {item.price}
                </div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground italic">
            {lang === "en"
              ? "\"If we end up with 20 different tools and 20 more logins, we've failed.\" — Clinician, COMPASS study. Clinician access is always free and login-free."
              : "« Si on se retrouve avec 20 outils et 20 connexions de plus, on a échoué. » — Clinicien, étude COMPASS. L'accès clinicien est toujours gratuit et sans connexion."}
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function DemoCard({ lang }: { lang: "en" | "fr" }) {
  return (
    <div className="ct-card p-5 relative" style={{ boxShadow: "var(--shadow-lift)" }}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{lang === "en" ? "Patient view" : "Vue patient"}</span>
        <span className="font-mono">RAMQ · TREM 8604</span>
      </div>
      <div className="mt-4 rounded-xl p-4 ct-rail" style={{ ["--rail-color" as never]: "var(--color-signal)", background: "var(--color-bone)" }}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {lang === "en" ? "Today's nudge" : "Rappel du jour"}
        </div>
        <p className="mt-1 font-display text-xl leading-snug">
          {lang === "en"
            ? "Your scoliosis check is 14 months overdue. Let's book it this week."
            : "Votre suivi de scoliose est en retard de 14 mois. On le planifie cette semaine ?"}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label={lang === "en" ? "Overdue" : "En retard"} value="3" color="var(--color-signal)" />
        <Stat label={lang === "en" ? "Due soon" : "À prévoir"} value="2" color="var(--color-copper)" />
        <Stat label={lang === "en" ? "Up to date" : "À jour"} value="4" color="var(--color-sage)" />
      </div>
      <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-center">
        <div className="mx-auto h-24 w-24 rounded-xl bg-foreground" style={{
          backgroundImage: "repeating-conic-gradient(var(--color-bone) 0 25%, var(--color-foreground) 0 50%)",
          backgroundSize: "12px 12px",
        }} />
        <div className="mt-2 text-xs font-semibold">{lang === "en" ? "Doctor scans this →" : "Le médecin scanne →"}</div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border p-2 bg-card">
      <div className="text-2xl font-display font-semibold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
