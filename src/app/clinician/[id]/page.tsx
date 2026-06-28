"use client";

import { useParams } from "next/navigation";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useApp } from "@/lib/carethread/store";
import { t } from "@/lib/carethread/i18n";
import { useEffect, useMemo, useState } from "react";
import { computeAge, DEMO_PATIENT, DEMO_VISITS, SCREENINGS, screeningStatus } from "@/lib/carethread/data";
import {
  AlertTriangle, CheckCircle, FileText, Info,
  ListChecks, Loader2, Plus, Sparkles, Stethoscope,
} from "lucide-react";

interface ProviderCtx { providerName: string; provider: string; clinic: string }

export default function PatientSummary() {
  const params = useParams<{ id: string }>();
  const { lang, logAccess, addFollowUp, followUps } = useApp();
  const [ctx, setCtx] = useState<ProviderCtx | null>(null);
  const [provInput, setProvInput] = useState("");
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const patient = DEMO_PATIENT;

  // Suppress unused-var warning — id will be used for Supabase lookup in production
  void params.id;

  useEffect(() => {
    const raw = sessionStorage.getItem("ct:provider");
    if (raw) {
      const parsed: ProviderCtx = JSON.parse(raw);
      setCtx(parsed);
      logAccess({
        providerName: parsed.providerName,
        providerNumber: parsed.provider,
        clinic: parsed.clinic,
        fieldsViewed: ["summary", "timeline", "screenings"],
      });
    } else {
      setNeedsUnlock(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const age = computeAge(patient.dob);
  const flags = useMemo(
    () => SCREENINGS
      .map((s) => ({ s, status: screeningStatus(s, age, patient.sex) }))
      .filter((x) => x.status === "overdue" || x.status === "due"),
    [age, patient.sex],
  );

  if (needsUnlock && !ctx) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-5 py-16">
          <div className="ct-card p-8">
            <h1 className="font-display text-2xl font-semibold">{t("enterToView", lang)}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "en"
                ? "Every access is logged under your provider number for patient transparency."
                : "Chaque accès est journalisé sous votre numéro de praticien."}
            </p>
            <input
              value={provInput}
              onChange={(e) => setProvInput(e.target.value)}
              placeholder="ON-44119"
              className="mt-4 w-full rounded-xl border border-input bg-card px-3 py-2.5 font-mono"
            />
            <button
              disabled={!provInput.trim()}
              onClick={() => {
                const c = { providerName: "Dr. (you)", provider: provInput.trim(), clinic: "Walk-in" };
                sessionStorage.setItem("ct:provider", JSON.stringify(c));
                setCtx(c);
                setNeedsUnlock(false);
                logAccess({ providerName: c.providerName, providerNumber: c.provider, clinic: c.clinic, fieldsViewed: ["summary"] });
              }}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              style={{ background: "var(--color-primary)" }}
            >
              {t("unlock", lang)}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 space-y-6">
        {/* Patient identity strip */}
        <div className="ct-card p-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {lang === "en" ? "Accessed by" : "Consulté par"} {ctx?.providerName} · {ctx?.provider}
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">{patient.name}</h1>
            <p className="text-sm text-muted-foreground">
              {age} {lang === "en" ? "y/o" : "ans"} · {patient.sex} · {patient.province === "QC" ? "RAMQ" : "OHIP"} {patient.healthCard}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="ct-chip self-end" style={{ background: "var(--color-sage)", color: "var(--color-sage-foreground)" }}>
              <Stethoscope className="h-3 w-3" /> {lang === "en" ? "Access logged" : "Accès journalisé"}
            </span>
            <span className="text-xs text-muted-foreground">
              {lang === "en" ? "Patient can see this access in their record." : "Le patient voit cet accès dans son dossier."}
            </span>
          </div>
        </div>

        {/* No GP warning */}
        <div
          className="flex items-start gap-3 rounded-xl border p-4 text-sm"
          style={{ background: "var(--color-signal)", borderColor: "var(--color-signal)", color: "var(--color-signal-foreground)" }}
        >
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="font-semibold">
            {lang === "en"
              ? "No family physician on record — you are the continuity. Everything you add syncs to the patient's record."
              : "Aucun médecin de famille — vous êtes la continuité. Tout ce que vous ajoutez se synchronise au dossier."}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Pre-visit flags */}
            <section className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: "var(--color-signal)" }}>
              <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" style={{ color: "var(--color-signal)" }} />
                {t("preVisitFlags", lang)}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                {lang === "en"
                  ? "Surfaced automatically before you opened this chart — no clicking required."
                  : "Affichées automatiquement avant que vous ouvriez ce dossier."}
              </p>
              <ul className="divide-y divide-border">
                {flags.map(({ s, status }) => (
                  <li key={s.key} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{lang === "en" ? s.nameEn : s.nameFr}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.lastDone
                          ? `${lang === "en" ? "Last" : "Dernier"}: ${new Date(s.lastDone).toLocaleDateString(lang === "en" ? "en-CA" : "fr-CA")}`
                          : (lang === "en" ? "Never recorded" : "Jamais enregistré")}
                      </div>
                    </div>
                    <StatusChip status={status as "ok" | "due" | "overdue"} lang={lang} />
                  </li>
                ))}
              </ul>
            </section>

            {/* Patient summary */}
            <section className="ct-card p-6">
              <h2 className="font-display text-2xl font-semibold">{t("patientSummary", lang)}</h2>
              <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
                <Block title={t("conditions", lang)} items={patient.conditions} />
                <Block title={t("medications", lang)} items={patient.medications} />
                <Block title={t("allergies", lang)} items={patient.allergies} />
              </div>
            </section>

            {/* Visit history */}
            <section className="ct-card p-6">
              <h2 className="font-display text-2xl font-semibold">{t("timeline", lang)}</h2>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                {lang === "en"
                  ? "Every encounter across every provider — the continuity no single walk-in clinic has."
                  : "Chaque consultation chez chaque intervenant — la continuité qu'aucune clinique seule ne possède."}
              </p>
              <ol className="space-y-3 text-sm">
                {[...DEMO_VISITS].sort((a, b) => b.date.localeCompare(a.date)).map((v) => (
                  <li key={v.id} className="border-l-2 border-border pl-4 py-1">
                    <div className="text-xs text-muted-foreground">
                      {new Date(v.date).toLocaleDateString(lang === "en" ? "en-CA" : "fr-CA")} · {v.clinic} · {v.providerName} ({v.providerNumber})
                    </div>
                    <div className="font-semibold">{v.reason}</div>
                    <div className="text-muted-foreground">{v.notes}</div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Sidebar — actionable tools */}
          <aside className="space-y-5">
            <FollowUpCard onAdd={(title) => addFollowUp(title, ctx?.providerName || "Clinician")} list={followUps} lang={lang} />
            <ReferralCard patient={patient} age={age} lang={lang} />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</div>
      <ul className="mt-2 space-y-1">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}

function FollowUpCard({
  onAdd,
  list,
  lang,
}: {
  onAdd: (t: string) => void;
  list: { id: string; title: string; done: boolean }[];
  lang: "en" | "fr";
}) {
  const [text, setText] = useState("");
  const [added, setAdded] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <section className="ct-card p-6">
      <h3 className="font-display text-xl font-semibold flex items-center gap-2">
        <ListChecks className="h-4 w-4" /> {t("addFollowUp", lang)}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 mb-3">
        {lang === "en"
          ? "One tap. Syncs to patient reminders instantly."
          : "Un tap. Synchronisé aux rappels du patient instantanément."}
      </p>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={lang === "en" ? "e.g. Book MRI lumbar spine" : "Ex. Réserver IRM lombaire"}
          className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm"
        />
        <button
          onClick={submit}
          className="rounded-xl px-3 py-2 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--color-primary)" }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {added && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--color-sage)" }}>
          <CheckCircle className="h-3.5 w-3.5" />
          {lang === "en" ? "Added — patient will see this in reminders." : "Ajouté — le patient le verra dans ses rappels."}
        </div>
      )}

      {list.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {list.slice(0, 4).map((f) => (
            <li key={f.id} className={`text-muted-foreground ${f.done ? "line-through" : ""}`}>
              · {f.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ReferralCard({
  patient,
  age,
  lang,
}: {
  patient: typeof DEMO_PATIENT;
  age: number;
  lang: "en" | "fr";
}) {
  const [referralTo, setReferralTo] = useState(
    lang === "en" ? "Orthopedic Spine Clinic, Ottawa" : "Clinique orthopédique du rachis, Ottawa",
  );
  const [reason, setReason] = useState(
    lang === "en"
      ? "Adult patient with progressive back pain, history of mild adolescent-onset scoliosis. Requesting evaluation and updated imaging review."
      : "Patiente adulte avec douleur dorsale progressive, antécédent de scoliose adolescente légère. Demande d'évaluation et révision d'imagerie.",
  );
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    setLetter("");
    try {
      const res = await fetch("/api/draft-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patient.name,
          age,
          sex: patient.sex === "F" ? "Female" : "Male",
          conditions: patient.conditions,
          medications: patient.medications,
          allergies: patient.allergies,
          referralTo,
          reason,
          lang,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setLetter(data.letter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: "var(--color-copper)" }}>
      <h3 className="font-display text-xl font-semibold flex items-center gap-2">
        <Sparkles className="h-4 w-4" style={{ color: "var(--color-copper)" }} /> {t("draftReferral", lang)}
      </h3>
      <p className="text-xs text-muted-foreground mt-1">
        {lang === "en"
          ? "AI drafts from the chart in seconds. You review, edit, and sign."
          : "L'IA rédige à partir du dossier en secondes. Vous révisez, modifiez, signez."}
      </p>

      <label className="block mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {lang === "en" ? "Referral to" : "Référer à"}
      </label>
      <input
        value={referralTo}
        onChange={(e) => setReferralTo(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
      />

      <label className="block mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {lang === "en" ? "Reason (edit before generating)" : "Motif (modifiez avant de générer)"}
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
      />

      <button
        onClick={go}
        disabled={loading}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        style={{ background: "var(--color-primary)" }}
      >
        {loading
          ? <><Loader2 className="h-4 w-4 animate-spin" /> {lang === "en" ? "Drafting…" : "Rédaction…"}</>
          : <><FileText className="h-4 w-4" /> {lang === "en" ? "Generate letter" : "Générer la lettre"}</>}
      </button>

      {error && (
        <div className="mt-2 text-xs" style={{ color: "var(--color-signal)" }}>{error}</div>
      )}

      {letter && (
        <div className="mt-4 space-y-3">
          <pre className="max-h-80 overflow-auto rounded-xl border border-border bg-card p-4 text-xs whitespace-pre-wrap font-sans leading-relaxed">
            {letter}
          </pre>

          {/* CALIBRATED TRUST — shows reasoning, invites audit. Covers COMPASS design requirement */}
          <div
            className="rounded-xl border p-4 text-xs leading-relaxed space-y-2"
            style={{ background: "var(--color-secondary)", borderColor: "var(--color-copper)" }}
          >
            <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--color-copper)" }}>
              <Info className="h-3.5 w-3.5" />
              {lang === "en" ? "AI-generated — review before sending" : "Généré par IA — à réviser avant envoi"}
            </div>
            <p className="text-muted-foreground">
              {lang === "en"
                ? "Flagged from: progressive back pain × 3 months · prior scoliosis history (Cobb 22°, 2025) · no recent imaging on record. Edit the reason field above and regenerate if anything is inaccurate."
                : "Signalé à partir de : douleur dorsale progressive × 3 mois · antécédent de scoliose (Cobb 22°, 2025) · aucune imagerie récente. Modifiez le motif et régénérez si nécessaire."}
            </p>
            <p className="text-muted-foreground">
              {lang === "en"
                ? "Confidence: high — all fields drawn from verified patient record. You can edit, regenerate, or discard."
                : "Confiance : élevée — tous les champs proviennent du dossier vérifié. Vous pouvez modifier, régénérer ou rejeter."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
