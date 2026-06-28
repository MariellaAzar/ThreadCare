import type { Patient, Screening, VisitEvent } from "./types";

export const DEMO_PATIENT: Patient = {
  id: "p_marie",
  name: "Marie Tremblay",
  dob: "1986-04-12",
  sex: "F",
  province: "QC",
  healthCard: "TREM 8604 1242",
  email: "marie.tremblay@example.ca",
  conditions: ["Adolescent-onset scoliosis (mild)", "Vitamin D deficiency"],
  medications: ["Ibuprofen 400mg PRN", "Vitamin D3 2000 IU daily"],
  allergies: ["Penicillin (rash)"],
};

export const DEMO_VISITS: VisitEvent[] = [
  {
    id: "v1", date: "2024-11-02", providerName: "Dr. A. Lemieux",
    providerNumber: "QC-19422", clinic: "Walk-in Hull",
    reason: "Lower back pain", notes: "Prescribed NSAIDs. No imaging ordered.",
    type: "visit",
  },
  {
    id: "v2", date: "2025-03-19", providerName: "Dr. P. Singh",
    providerNumber: "QC-29103", clinic: "Clinique Gatineau",
    reason: "Recurring back pain", notes: "Recommended physio. No prior chart available.",
    type: "visit",
  },
  {
    id: "v3", date: "2025-08-10", providerName: "Dr. M. Chen",
    providerNumber: "ON-44119", clinic: "Ottawa Walk-In",
    reason: "Persistent back pain", notes: "Considered MSK referral. Patient unsure of prior workup.",
    type: "visit",
  },
  {
    id: "v4", date: "2026-02-14", providerName: "Dr. M. Chen",
    providerNumber: "ON-44119", clinic: "Ottawa Walk-In",
    reason: "Back pain + posture change", notes: "Ordered scoliosis series X-ray. Follow-up pending.",
    type: "imaging",
  },
  {
    id: "v5", date: "2024-06-01", providerName: "Lab Biron",
    providerNumber: "LAB-001", clinic: "Lab Biron",
    reason: "Annual bloodwork", notes: "Vitamin D low (28 nmol/L). Recommend supplementation.",
    type: "lab",
  },
];

const monthsAgo = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
};

export const SCREENINGS: Screening[] = [
  { key: "scoliosis", nameEn: "Scoliosis screening", nameFr: "Dépistage de la scoliose",
    ageMin: 10, ageMax: 99, intervalMonths: 12, lastDone: monthsAgo(26), category: "teen" },
  { key: "pap", nameEn: "Cervical cancer (Pap)", nameFr: "Cancer du col (Pap test)",
    ageMin: 21, ageMax: 70, sex: "F", intervalMonths: 36, lastDone: monthsAgo(41), category: "young" },
  { key: "mammo", nameEn: "Mammogram", nameFr: "Mammographie",
    ageMin: 40, ageMax: 74, sex: "F", intervalMonths: 24, lastDone: undefined, category: "adult" },
  { key: "bp", nameEn: "Blood pressure", nameFr: "Tension artérielle",
    ageMin: 18, ageMax: 99, intervalMonths: 24, lastDone: monthsAgo(8), category: "young" },
  { key: "lipids", nameEn: "Cholesterol panel", nameFr: "Bilan lipidique",
    ageMin: 35, ageMax: 99, intervalMonths: 60, lastDone: monthsAgo(72), category: "adult" },
  { key: "colon", nameEn: "Colorectal screening (FIT)", nameFr: "Dépistage colorectal (RSOSi)",
    ageMin: 50, ageMax: 74, intervalMonths: 24, lastDone: undefined, category: "senior" },
  { key: "skin", nameEn: "Skin check", nameFr: "Examen cutané",
    ageMin: 35, ageMax: 99, intervalMonths: 24, lastDone: monthsAgo(14), category: "adult" },
  { key: "vitd", nameEn: "Vitamin D level", nameFr: "Niveau de vitamine D",
    ageMin: 18, ageMax: 99, intervalMonths: 12, lastDone: monthsAgo(18), category: "young" },
  { key: "dental", nameEn: "Dental exam", nameFr: "Examen dentaire",
    ageMin: 0, ageMax: 99, intervalMonths: 12, lastDone: monthsAgo(20), category: "adult" },
];

export const SYMPTOM_WATCH = [
  { conditionEn: "Scoliosis", conditionFr: "Scoliose",
    watchEn: ["Uneven shoulders or hips", "Visible spinal curve", "Worsening back pain", "Shortness of breath on exertion"],
    watchFr: ["Épaules ou hanches inégales", "Courbure visible", "Douleur dorsale qui empire", "Essoufflement à l'effort"] },
  { conditionEn: "Breast cancer risk", conditionFr: "Risque de cancer du sein",
    watchEn: ["New lump or thickening", "Skin dimpling or redness", "Nipple discharge", "Persistent breast pain"],
    watchFr: ["Nouvelle masse ou épaississement", "Peau capitonnée ou rouge", "Écoulement du mamelon", "Douleur persistante au sein"] },
  { conditionEn: "Vitamin D deficiency", conditionFr: "Carence en vitamine D",
    watchEn: ["Bone or muscle pain", "Fatigue", "Low mood", "Frequent infections"],
    watchFr: ["Douleur osseuse ou musculaire", "Fatigue", "Humeur basse", "Infections fréquentes"] },
];

export function computeAge(dob: string): number {
  const b = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--;
  return age;
}

export function screeningStatus(s: Screening, ageNow: number, sex: "F" | "M"): "ok" | "due" | "overdue" | "n/a" {
  if (ageNow < s.ageMin || ageNow > s.ageMax) return "n/a";
  if (s.sex && s.sex !== sex) return "n/a";
  if (!s.lastDone) return "overdue";
  const months = monthsBetween(new Date(s.lastDone), new Date());
  if (months <= s.intervalMonths) return "ok";
  if (months <= s.intervalMonths + 3) return "due";
  return "overdue";
}

export function monthsBetween(a: Date, b: Date) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}
