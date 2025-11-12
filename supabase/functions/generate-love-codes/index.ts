import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return (
    "LOVE-" +
    Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
}

serve(async (req) => {
  try {
    const { count = 10 } = await req.json();
    const codes = Array.from({ length: count }, () => ({
      code: generateCode(),
      price: 10,
      discount_price: 0.99,
    }));

    const { data, error } = await supabase.from("love_access_codes").insert(codes).select("*");
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400 });
  }
});
