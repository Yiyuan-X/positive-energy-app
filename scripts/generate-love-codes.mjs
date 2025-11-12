import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 生成随机兑换码（例如 LOVE-AB12CD34）
function generateCode() {
  return (
    "LOVE-" +
    randomBytes(4).toString("hex").toUpperCase().replace(/(.{4})/g, "$1-").slice(0, -1)
  );
}

async function main(count = 20) {
  const codes = Array.from({ length: count }, () => ({
    code: generateCode(),
    price: 10.0,
    discount_price: 0.99,
  }));

  const { data, error } = await supabase.from("love_access_codes").insert(codes);
  if (error) console.error("❌ 插入失败：", error);
  else console.log(`✅ 成功生成 ${data.length} 个兑换码`);
}

main(20);
