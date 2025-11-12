import { createClient } from "@supabase/supabase-js";

// Support both CRA (REACT_APP_*) and Vite (VITE_*) env names
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Non-throwing fallback to keep UI usable when envs are missing
function createNoopSupabase() {
  const builder = {
    select: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: null }),
  };
  return {
    from: () => builder,
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}

if (!window.__supabaseClient__) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables.");
    window.__supabaseClient__ = createNoopSupabase();
  } else {
    console.log("🪄 Initializing Supabase Client once");
    window.__supabaseClient__ = createClient(supabaseUrl, supabaseAnonKey);
  }
}

export const supabase = window.__supabaseClient__;

