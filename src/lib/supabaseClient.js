import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables.");
}

/**
 * ✅ 全局单例 Supabase 客户端
 * 通过 window.__supabaseClient__ 确保全局唯一
 */
if (!window.__supabaseClient__) {
  console.log("🪄 Initializing Supabase Client once");
  window.__supabaseClient__ = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = window.__supabaseClient__;
