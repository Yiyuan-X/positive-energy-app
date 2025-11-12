// ============================================================
// 🧩 Supabase Edge Function: sync-profile
// 文件路径: /supabase/functions/sync-profile/index.ts
// 作用: 用户登录/注册时自动同步 profiles 表
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { event, user } = await req.json();

    // 仅处理新注册或登录事件
    if (!user) {
      return new Response(JSON.stringify({ error: "No user payload" }), {
        status: 400,
      });
    }

    // 检查是否已有 profile
    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) throw selectError;

    // 若不存在则创建
    if (!existing) {
      const role = user.email?.endsWith("@yourdomain.com") ? "admin" : "user";

      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        role,
      });

      if (insertError) throw insertError;

      console.log(`✅ Profile created for ${user.email} (${role})`);
    } else {
      console.log(`ℹ️ Profile already exists for ${user.email}`);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("❌ sync-profile error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
