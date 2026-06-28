import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// PHIPA/PIPEDA: This endpoint receives PHI (patient data) to draft referral letters.
// - PHI is not logged or persisted by this handler
// - Anthropic processes the data; ensure your BAA / DPA with Anthropic covers this use case
// - For Canadian data residency requirements, consider self-hosting an LLM or using a
//   provider with a Canadian/EU data processing agreement
const Input = z.object({
  patientName: z.string(),
  age: z.number(),
  sex: z.string(),
  conditions: z.array(z.string()),
  medications: z.array(z.string()),
  allergies: z.array(z.string()),
  referralTo: z.string(),
  reason: z.string(),
  lang: z.enum(["en", "fr"]),
});

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI referral drafting is not configured. Add an ANTHROPIC_API_KEY to your environment variables." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const data = Input.parse(body);

    const sys =
      data.lang === "fr"
        ? "Vous êtes un médecin de famille canadien. Rédigez une lettre de référence concise, professionnelle, en français, au format lettre clinique standard. Pas de markdown."
        : "You are a Canadian family physician. Draft a concise, professional referral letter in standard clinical letter format. Plain text, no markdown.";

    const prompt =
      data.lang === "fr"
        ? `Rédigez une lettre de référence à ${data.referralTo}.
Patient : ${data.patientName}, ${data.age} ans, ${data.sex}
Motif : ${data.reason}
Conditions : ${data.conditions.join(", ") || "aucune"}
Médicaments : ${data.medications.join(", ") || "aucun"}
Allergies : ${data.allergies.join(", ") || "aucune"}
Incluez en-tête, salutation, contexte clinique (3-4 phrases), question clinique précise, ce qui a déjà été essayé, et la salutation finale "Cordialement, Dr. M. Chen, ON-44119".`
        : `Draft a referral letter to ${data.referralTo}.
Patient: ${data.patientName}, age ${data.age}, ${data.sex}
Reason: ${data.reason}
Conditions: ${data.conditions.join(", ") || "none"}
Medications: ${data.medications.join(", ") || "none"}
Allergies: ${data.allergies.join(", ") || "none"}
Include header, greeting, clinical context (3-4 sentences), specific clinical question, what has been tried, and closing "Sincerely, Dr. M. Chen, Provider ON-44119".`;

    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: sys,
      prompt,
    });

    return NextResponse.json({ letter: text });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Referral draft error:", error);
    return NextResponse.json({ error: "Failed to generate referral" }, { status: 500 });
  }
}
