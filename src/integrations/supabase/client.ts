import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_') || value.startsWith('sb_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // Opaque sb_ keys are not JWTs, so they must not be sent as a bearer token.
    // BUT the signed-in user's access token MUST be kept, otherwise every request
    // hits PostgREST/Storage as `anon` and RLS (is_admin(auth.uid())) fails.
    if (isNewSupabaseApiKey(supabaseKey)) {
      const auth = headers.get('Authorization') ?? headers.get('authorization');
      if (!auth || auth === `Bearer ${supabaseKey}` || auth === supabaseKey) {
        headers.delete('Authorization');
        headers.delete('authorization');
      }
    }


    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseClient() {
  const SUPABASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env['VITE_SUPABASE_URL'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'] : undefined) ||
    'https://placeholder.supabase.co';

  const SUPABASE_PUBLISHABLE_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_PUBLISHABLE_KEY'] || process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    'placeholder-key';

  if (SUPABASE_URL === 'https://placeholder.supabase.co') {
    console.warn('[Supabase] Missing VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY environment variables in Vercel settings.');
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
