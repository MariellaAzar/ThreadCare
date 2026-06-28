"use client";

import { useRouter } from "next/navigation";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useApp } from "@/lib/carethread/store";
import { t } from "@/lib/carethread/i18n";
import { useEffect, useState } from "react";
import { computeAge, DEMO_VISITS, SCREENINGS, SYMPTOM_WATCH, screeningStatus } from "@/lib/carethread/data";
import QRCode from "qrcode";
import {
  Bell, Calendar, Eye, FileText, QrCode as QrIcon,
  Stethoscope, Activity, Shield, FlaskConical, Syringe, ClipboardList,
} from "lucide-react";

type Tab = "overview" | "screenings" | "timeline" | "symptoms" | "share";

export default function PatientHome() {
  const { patient, lang, onboarded, accessLog, followUps, toggleFollowUp } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!onboarded) router.push("/onboarding");
  }, [onboarded, router]);

  if (!patient) return <AppShell><div className="p-12 text-center text-muted-foreground">…</div></AppShell>;

  const age = computeAge(patient.dob);
  const sex = patient.sex;
  const screenings = SCREENINGS
    .map((s) => ({ s, status: screeningStatus(s, age, sex) }))
    .filter((x) => x.status !== "n/a");
  const overdue = screenings.filter((x) => x.status === "overdue");
  const due = screenings.filter((x) => x.status === "due");
  const ok = screenings.filter((x) => x.status === "ok");
  const topNudge = overdue[0] ?? due[0];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {patient.province === "QC" ? "RAMQ" : "OHIP"} · {patient.healthCard}
            </div>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              {lang === "en" ? `Hi, ${patient.name.split(" ")[0]}` : `Bonjour, ${patient.name.split(" ")[0]}`}
            </h1>
            <p className="text-muted-foreground text-sm">
              {age} {lang === "en" ? "years old" : "ans"} · {sex === "F" ? (lang === "en" ? "Female" : "Femme") : (lang === "en" ? "Male" : "Homme")}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {([
              ["overview", t("overview", lang), Activity],
              ["screenings", t("screenings", lang), Shield],
              ["timeline", t("timeline", lang), Calendar],
              ["symptoms", t("symptoms", lang), Eye],
              ["share", t("share", lang), QrIcon],
            ] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition border ${
                  tab === key ? "border-transparent text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
                style={tab === key ? { background: "var(--color-primary)" } : {}}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </header>

        {tab === "overview" && (
          <div className="mt-8 grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              {topNudge && (
                <div className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: topNudge.status === "overdue" ? "var(--color-signal)" : "var(--color-copper)" }}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Bell className="h-3.5 w-3.5" /> {t("dailyNudge", lang)}
                  </div>
                  <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">
                    {lang === "en"
                      ? `Your ${topNudge.s.nameEn.toLowerCase()} is overdue.`
                      : `Votre ${topNudge.s.nameFr.toLowerCase()} est en retard.`}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lang === "en"
                      ? "We've pre-filled what your next provider needs to know. Show your QR at the visit."
                      : "Nous avons préparé l'information pour votre prochain médecin. Montrez votre QR à la visite."}
                  </p>
                  <button
                    onClick={() => setTab("share")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <QrIcon className="h-3.5 w-3.5" /> {t("showQr", lang)}
                  </button>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3">
                <StatCard label={lang === "en" ? "Overdue" : "En retard"} value={overdue.length} color="var(--color-signal)" />
                <StatCard label={lang === "en" ? "Due soon" : "À prévoir"} value={due.length} color="var(--color-copper)" />
                <StatCard label={lang === "en" ? "Up to date" : "À jour"} value={ok.length} color="var(--color-sage)" />
              </div>

              <section className="ct-card p-6">
                <h3 className="font-display text-2xl font-semibold">{lang === "en" ? "Your health snapshot" : "Aperçu de santé"}</h3>
                <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
                  <SnapshotList title={t("conditions", lang)} items={patient.conditions} />
                  <SnapshotList title={t("medications", lang)} items={patient.medications} />
                  <SnapshotList title={t("allergies", lang)} items={patient.allergies} />
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="ct-card p-6">
                <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> {t("reminders", lang)}
                </h3>
                <ul className="mt-3 space-y-2">
                  {followUps.length === 0 && (
                    <li className="text-sm text-muted-foreground">{lang === "en" ? "Nothing pending. Nice." : "Rien en attente. Bravo."}</li>
                  )}
                  {followUps.map((f) => (
                    <li key={f.id} className="flex items-start gap-2 text-sm">
                      <input type="checkbox" checked={f.done} onChange={() => toggleFollowUp(f.id)} className="mt-1" />
                      <div className={f.done ? "line-through text-muted-foreground" : ""}>
                        <div>{f.title}</div>
                        <div className="text-xs text-muted-foreground">{lang === "en" ? "From" : "De"} {f.createdBy}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="ct-card p-6">
                <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" /> {t("accessLog", lang)}
                </h3>
                {accessLog.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">{t("noAccessYet", lang)}</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    {accessLog.slice(0, 5).map((a) => (
                      <li key={a.id} className="border-l-2 pl-2" style={{ borderColor: "var(--color-sage)" }}>
                        <div className="font-medium">{a.providerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.clinic} · {new Date(a.at).toLocaleString(lang === "en" ? "en-CA" : "fr-CA")}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        )}

        {tab === "screenings" && (
          <div className="mt-8 ct-card p-6">
            <h2 className="font-display text-3xl font-semibold">{t("screenings", lang)}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "en" ? `Recommended for ${sex === "F" ? "female" : "male"}, age ${age}.` : `Recommandé pour ${sex === "F" ? "femme" : "homme"}, ${age} ans.`}
            </p>
            <ul className="mt-5 divide-y divide-border">
              {screenings.map(({ s, status }) => (
                <li key={s.key} className="py-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold">{lang === "en" ? s.nameEn : s.nameFr}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.lastDone
                        ? `${lang === "en" ? "Last done" : "Dernier"}: ${new Date(s.lastDone).toLocaleDateString(lang === "en" ? "en-CA" : "fr-CA")}`
                        : (lang === "en" ? "Never recorded" : "Jamais enregistré")}
                      {" · "}
                      {lang === "en" ? "Every" : "Tous les"} {s.intervalMonths} {lang === "en" ? "months" : "mois"}
                    </div>
                  </div>
                  <StatusChip status={status as "ok" | "due" | "overdue"} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "timeline" && (
          <div className="mt-8 ct-card p-6">
            <h2 className="font-display text-3xl font-semibold">{t("timeline", lang)}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "en" ? "Every visit, lab, and image — across every provider." : "Chaque visite, labo, et imagerie — chez tous les médecins."}
            </p>
            <ol className="mt-6 relative border-l-2 border-border pl-6 space-y-6">
              {[...DEMO_VISITS].sort((a, b) => b.date.localeCompare(a.date)).map((v) => (
                <li key={v.id} className="relative">
                  <span
                    className="absolute -left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full text-primary-foreground"
                    style={{ background: typeColor(v.type) }}
                  >
                    {typeIcon(v.type)}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {new Date(v.date).toLocaleDateString(lang === "en" ? "en-CA" : "fr-CA", { dateStyle: "medium" })} · {v.clinic}
                  </div>
                  <div className="font-display text-lg font-semibold">{v.reason}</div>
                  <div className="text-sm text-muted-foreground">{v.providerName} · {v.providerNumber}</div>
                  <p className="mt-1 text-sm">{v.notes}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === "symptoms" && (
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {SYMPTOM_WATCH.map((w) => (
              <div key={w.conditionEn} className="ct-card ct-rail p-6" style={{ ["--rail-color" as never]: "var(--color-copper)" }}>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {lang === "en" ? "Watch for" : "Surveiller"}
                </div>
                <h3 className="mt-1 font-display text-2xl font-semibold">{lang === "en" ? w.conditionEn : w.conditionFr}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {(lang === "en" ? w.watchEn : w.watchFr).map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--color-copper)" }} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {tab === "share" && <SharePanel />}
      </div>
    </AppShell>
  );
}

function SharePanel() {
  const { lang, patient } = useApp();
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!patient) return;
    const target = `${window.location.origin}/clinician/${patient.id}`;
    QRCode.toDataURL(target, { width: 320, margin: 1, color: { dark: "#1a2b22", light: "#fbf7e9" } }).then(setDataUrl);
  }, [patient]);

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-5 items-start">
      <div className="ct-card p-6 text-center">
        <h2 className="font-display text-3xl font-semibold">{t("showQr", lang)}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("qrExpires", lang)}</p>
        <div className="mt-6 inline-block rounded-2xl p-4" style={{ background: "var(--color-bone)" }}>
          {dataUrl
            ? <img src={dataUrl} alt="QR code linking to your health record" className="h-64 w-64" />
            : <div className="h-64 w-64 bg-muted rounded-xl" />}
        </div>
        <p className="mt-4 text-xs text-muted-foreground font-mono">
          {patient?.province === "QC" ? "RAMQ" : "OHIP"} · {patient?.healthCard}
        </p>
      </div>
      <div className="ct-card p-6">
        <h3 className="font-display text-2xl font-semibold">{lang === "en" ? "What the doctor will see" : "Ce que le médecin verra"}</h3>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            lang === "en" ? "Conditions, medications, allergies" : "Conditions, médicaments, allergies",
            lang === "en" ? "Full timeline across all providers" : "Parcours complet entre tous les médecins",
            lang === "en" ? "Overdue and due-soon screenings" : "Dépistages en retard et à prévoir",
            lang === "en" ? "Symptom flags you've reported" : "Symptômes que vous avez signalés",
          ].map((s) => (
            <li key={s} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--color-primary)" }} />
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-4 p-4 rounded-xl text-xs leading-relaxed" style={{ background: "var(--color-secondary)", color: "var(--color-secondary-foreground)" }}>
          {lang === "en"
            ? "The doctor's provider number is recorded with every access. You can see, and revoke, the trail anytime."
            : "Le numéro de praticien est enregistré à chaque accès. Vous voyez et révoquez l'historique à tout moment."}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="ct-card p-4">
      <div className="font-display text-4xl font-semibold" style={{ color }}>{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function SnapshotList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</div>
      <ul className="mt-2 space-y-1">
        {items.length === 0 ? <li className="text-muted-foreground">—</li> : items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

function typeColor(type: string) {
  return ({
    visit: "var(--color-primary)",
    lab: "var(--color-copper)",
    imaging: "var(--color-signal)",
    referral: "var(--color-sage)",
    vaccine: "var(--color-sage)",
  } as Record<string, string>)[type] ?? "var(--color-primary)";
}

function typeIcon(type: string) {
  const cls = "h-3.5 w-3.5";
  if (type === "lab") return <FlaskConical className={cls} />;
  if (type === "imaging") return <FileText className={cls} />;
  if (type === "vaccine") return <Syringe className={cls} />;
  return <Stethoscope className={cls} />;
}
