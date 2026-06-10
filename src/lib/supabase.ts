import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

if (!url || !anonKey) {
  // Surfaces a clear message during dev if env vars are missing.
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
    "Add them to .env locally and to Environment Variables in Vercel.",
  );
}

// Guard: createClient throws when url is an empty string / undefined.
// Using a syntactically-valid placeholder keeps the app alive (data won't
// load, but at least the page renders and shows loading/error states).
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "kp-admin-auth",
    },
  },
);
