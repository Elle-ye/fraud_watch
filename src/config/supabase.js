import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
/** Prefer publishable key name; fall back to common Supabase tutorial name */
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[Supabase] Missing configuration. Set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) in .env at the project root, " +
      "then restart the Vite dev server (npm run dev).",
  );
}
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables.");
  }
  

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");
