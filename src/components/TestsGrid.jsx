import { createClient } from "@supabase/supabase-js";

// ✅ 从环境变量中读取
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// ✅ 打印调试信息
console.log("🔍 Supabase URL check:", supabaseUrl);

// ✅ 定义变量占位
let supabase;

// ✅ fallback 防止白屏
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase ENV vars. Using fallback empty client.");
  supabase = {
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// ✅ 顶层导出（必须在 if 外）
export { supabase };
