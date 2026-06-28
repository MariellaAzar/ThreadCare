"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/carethread/store";
import { t } from "@/lib/carethread/i18n";
import { useState } from "react";
import { DEMO_PATIENT } from "@/lib/carethread/data";
import type { Province } from "@/lib/carethread/types";
import { Apple, Check } from "lucide-react";

export default function Onboarding() {
  const { lang, setPatient, setOnboarded } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [province, setProvince] = useState<Province>("QC");
  const [cardNum, setCardNum] = useState("TREM 8604 1242");

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-5 sm:px-8 py-16">
        <div className="ct-card p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{lang === "en" ? "Step" : "Étape"} {step}/2</span>
            <div className="ml-2 h-1 flex-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full transition-all" style={{ width: step === 1 ? "50%" : "100%", background: "var(--color-primary)" }} />
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
                {lang === "en" ? "One tap. No new password." : "Une touche. Aucun nouveau mot de passe."}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {lang === "en" ? "Sign in with an account you already trust." : "Connectez-vous avec un compte que vous utilisez déjà."}
              </p>
              <div className="mt-6 grid gap-3">
                <button onClick={() => setStep(2)} className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-secondary transition">
                  <GoogleG /> {t("signInGoogle", lang)}
                </button>
                <button onClick={() => setStep(2)} className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition" style={{ background: "var(--color-ink)" }}>
                  <Apple className="h-4 w-4" /> {t("signInApple", lang)}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">{t("linkCard", lang)}</h1>
              <p className="mt-2 text-muted-foreground">
                {lang === "en" ? "Your provincial health number becomes your unique ID — not an app account." : "Votre numéro provincial devient votre identité — pas un compte."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {(["QC", "ON"] as Province[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvince(p)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${province === p ? "border-transparent text-primary-foreground" : "border-border bg-card"}`}
                    style={province === p ? { background: "var(--color-primary)" } : {}}
                  >
                    {p === "QC" ? t("ramq", lang) : t("ohip", lang)}
                  </button>
                ))}
              </div>

              <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {province === "QC" ? "RAMQ" : "OHIP"} #
              </label>
              <input
                value={cardNum}
                onChange={(e) => setCardNum(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <button
                onClick={() => {
                  setPatient({ ...DEMO_PATIENT, province, healthCard: cardNum });
                  setOnboarded(true);
                  router.push("/patient");
                }}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
                style={{ background: "var(--color-primary)", boxShadow: "var(--shadow-lift)" }}
              >
                <Check className="h-4 w-4" /> {t("continue", lang)}
              </button>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {lang === "en"
            ? "Privacy by design. QR access expires in 24h. Every view is logged under the provider's number."
            : "Confidentialité par conception. L'accès QR expire en 24h. Chaque consultation est journalisée."}
        </p>
      </div>
    </AppShell>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.27c0-.86-.08-1.69-.22-2.49H12v4.72h5.92a5.07 5.07 0 0 1-2.19 3.32v2.76h3.54c2.07-1.91 3.23-4.72 3.23-8.31z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.54-2.76c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.31-1.94-6.18-4.55H2.16v2.85A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.82 14.09a6.6 6.6 0 0 1 0-4.18V7.06H2.16a11 11 0 0 0 0 9.88l3.66-2.85z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.16 7.06l3.66 2.85C6.69 7.32 9.13 5.38 12 5.38z"/>
    </svg>
  );
}
