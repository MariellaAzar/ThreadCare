import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// ClerkProvider is only mounted when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set.
// Without it the app runs in demo/localStorage mode — no real auth, no Supabase.
// Add .env.local from .env.local.example to enable Clerk + Supabase.
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareThread — One health story. Every provider.",
  description:
    "Patient-held health record. Doctor scans a QR. Admin writes itself. Built for the 1 in 5 Canadians without a family doctor.",
  openGraph: {
    title: "CareThread — One health story. Every provider.",
    description:
      "Patient-held health record. Doctor scans a QR. Admin writes itself. Built for the 1 in 5 Canadians without a family doctor.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareThread — One health story. Every provider.",
    description:
      "Patient-held health record. Doctor scans a QR. Admin writes itself. Built for the 1 in 5 Canadians without a family doctor.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const inner = (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );

  if (hasClerk) {
    const { ClerkProvider } = await import("@clerk/nextjs");
    return <ClerkProvider>{inner}</ClerkProvider>;
  }

  return inner;
}
