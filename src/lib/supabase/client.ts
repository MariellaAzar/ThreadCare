import { createBrowserClient } from "@supabase/ssr";

// Canadian data residency: Supabase project must be in ca-central-1 (Montreal)
// PHIPA/PIPEDA: all PHI stays within Canada
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
