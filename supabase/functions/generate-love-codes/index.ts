// 📦 Edge Function: 批量生成兑换码
// 路径: supabase/functions/generate-love-codes/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ 初始化 Supabase（使用 Service Role Key）
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// 🎯 生成兑换码
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return (
    "LOVE-" +
    Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")
  );
}

serve(async (req) => {
  const start = performance.now();

  // ✅ 跨域头设置
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  try {
    // ✅ 解析 body
    const body = (await req.json()) || {};
    const count = Number(body.count) || 10; // 默认生成 10 个

    if (count > 1000) {
      return new Response(
        JSON.stringify({ success: false, error: "超出批量上限（最多1000）" }),
        { status: 400, headers }
      );
    }

    const codes = Array.from({ length: count }, () => ({
      code: generateCode(),
      price: 10,
      discount_price: 0.99,
      is_used: false,
    }));

    // ✅ 写入数据库
    const { data, error } = await supabase
      .from("love_access_codes")
      .insert(codes)
      .select("*");

    if (error) throw error;

    const duration = (performance.now() - start).toFixed(1);

    return new Response(
      JSON.stringify({
        success: true,
        count: data.length,
        duration: `${duration}ms`,
        data,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "未知错误",
      }),
      { status: 400, headers }
    );
  }
});
