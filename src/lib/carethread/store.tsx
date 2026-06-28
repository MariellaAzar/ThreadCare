"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AccessLogEntry, FollowUp, Lang, Patient } from "./types";
import { DEMO_PATIENT } from "./data";

interface State {
  lang: Lang;
  setLang: (l: Lang) => void;
  patient: Patient | null;
  setPatient: (p: Patient | null) => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  accessLog: AccessLogEntry[];
  logAccess: (e: Omit<AccessLogEntry, "id" | "at">) => void;
  followUps: FollowUp[];
  addFollowUp: (title: string, by: string) => void;
  toggleFollowUp: (id: string) => void;
  resetDemo: () => void;
}

const Ctx = createContext<State | null>(null);

const LS = "carethread:v1";

interface Persist {
  lang: Lang;
  patient: Patient | null;
  onboarded: boolean;
  accessLog: AccessLogEntry[];
  followUps: FollowUp[];
}

function load(): Persist {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(LS);
    if (!raw) return defaults();
    return { ...defaults(), ...JSON.parse(raw) };
  } catch {
    return defaults();
  }
}

function defaults(): Persist {
  return { lang: "en", patient: null, onboarded: false, accessLog: [], followUps: [] };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<Persist>(defaults);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(LS, JSON.stringify(state)); } catch {}
  }, [state, hydrated]);

  const value: State = {
    lang: state.lang,
    setLang: (l) => setState((s) => ({ ...s, lang: l })),
    patient: state.patient,
    setPatient: (p) => setState((s) => ({ ...s, patient: p })),
    onboarded: state.onboarded,
    setOnboarded: (v) => setState((s) => ({ ...s, onboarded: v })),
    accessLog: state.accessLog,
    logAccess: (e) => setState((s) => ({
      ...s,
      accessLog: [{ id: crypto.randomUUID(), at: new Date().toISOString(), ...e }, ...s.accessLog].slice(0, 50),
    })),
    followUps: state.followUps,
    addFollowUp: (title, by) => setState((s) => ({
      ...s,
      followUps: [{ id: crypto.randomUUID(), title, createdBy: by, createdAt: new Date().toISOString(), done: false }, ...s.followUps],
    })),
    toggleFollowUp: (id) => setState((s) => ({
      ...s,
      followUps: s.followUps.map((f) => f.id === id ? { ...f, done: !f.done } : f),
    })),
    resetDemo: () => setState({ ...defaults(), lang: state.lang, patient: DEMO_PATIENT, onboarded: true }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}
