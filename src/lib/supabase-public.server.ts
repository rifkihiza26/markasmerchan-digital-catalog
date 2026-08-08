import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_") || value.startsWith("sb_");
}

/**
 * Read-only Supabase client for public (anon) content used during SSR.
 * Never used for writes — RLS restricts anon to active/published rows.
 */
export function createPublicClient() {
  const url =
    (typeof process !== "undefined" ? process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] : undefined) ||
    import.meta.env?.VITE_SUPABASE_URL ||
    "https://placeholder.supabase.co";

  const key =
    (typeof process !== "undefined" ? process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] : undefined) ||
    import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "placeholder-key";

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (isNewSupabaseApiKey(key)) {
          headers.delete("Authorization");
          headers.delete("authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
