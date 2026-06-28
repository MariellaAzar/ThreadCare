export type Lang = "en" | "fr";
export type Province = "QC" | "ON";
export type Status = "ok" | "due" | "overdue";

export interface Patient {
  id: string;
  name: string;
  dob: string; // ISO
  sex: "F" | "M";
  province: Province;
  healthCard: string; // RAMQ or OHIP
  email: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
}

export interface Screening {
  key: string;
  nameEn: string;
  nameFr: string;
  ageMin: number;
  ageMax: number;
  sex?: "F" | "M";
  intervalMonths: number;
  lastDone?: string; // ISO date or undefined
  category: "child" | "teen" | "young" | "adult" | "senior";
}

export interface VisitEvent {
  id: string;
  date: string;
  providerName: string;
  providerNumber: string;
  clinic: string;
  reason: string;
  notes: string;
  type: "visit" | "lab" | "imaging" | "referral" | "vaccine";
}

export interface AccessLogEntry {
  id: string;
  providerName: string;
  providerNumber: string;
  clinic: string;
  at: string;
  fieldsViewed: string[];
}

export interface FollowUp {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  due?: string;
  done: boolean;
}
