"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/carethread/store";
import { useState } from "react";
import { DEMO_PATIENT } from "@/lib/carethread/data";
import { QrCode, ScanLine, Stethoscope } from "lucide-react";

export default function ClinicianHome() {
  const { lang } = useApp();
  const router = useRouter();
  const [provider, setProvider] = useState("ON-44119");
  const [providerName, setProviderName] = useState("Dr. M. Chen");
  const [clinic, setClinic] = useState("Ottawa Walk-In");

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
        <div className="ct-card p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--color-secondary)", color: "var(--color-primary)" }}>
              <Stethoscope className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {lang === "en" ? "No login. No EMR integration." : "Aucune connexion. Aucun DME."}
              </div>
              <h1 className="font-display text-3xl font-semibold">{lang === "en" ? "Scan a patient's QR" : "Scannez le QR d'un patient"}</h1>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <Field label={lang === "en" ? "Your name" : "Votre nom"} value={providerName} onChange={setProviderName} />
            <Field label={lang === "en" ? "Provider #" : "N° de praticien"} value={provider} onChange={setProvider} mono />
            <Field label={lang === "en" ? "Clinic" : "Clinique"} value={clinic} onChange={setClinic} className="sm:col-span-2" />
          </div>

          <button
            onClick={() => {
              sessionStorage.setItem("ct:provider", JSON.stringify({ providerName, provider, clinic }));
              router.push(`/clinician/${DEMO_PATIENT.id}`);
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
            style={{ background: "var(--color-primary)", boxShadow: "var(--shadow-lift)" }}
          >
            <ScanLine className="h-4 w-4" /> {lang === "en" ? "Simulate scan of Marie Tremblay's QR" : "Simuler le scan du QR de Marie Tremblay"}
          </button>

          <div className="mt-6 flex items-start gap-3 rounded-xl p-4 text-xs leading-relaxed" style={{ background: "var(--color-secondary)", color: "var(--color-secondary-foreground)" }}>
            <QrCode className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              {lang === "en"
                ? "In production, you'd scan with your phone or webcam. The patient's QR carries a short-lived token. Every view is logged under your provider number."
                : "En production, vous scannez avec votre téléphone. Le QR du patient porte un jeton à courte durée. Chaque consultation est journalisée."}
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, className = "", mono = false }: { label: string; value: string; onChange: (v: string) => void; className?: string; mono?: boolean }) {
  return (
    <label className={`block ${className}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${mono ? "font-mono tracking-wider" : ""}`}
      />
    </label>
  );
}
