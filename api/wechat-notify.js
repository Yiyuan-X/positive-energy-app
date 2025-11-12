import xml2js from "xml2js";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const api_key = process.env.WECHAT_API_KEY;

function checkSign(params) {
  const sign = params.sign;
  delete params.sign;
  const str = Object.keys(params)
    .filter((k) => params[k])
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&") + `&key=${api_key}`;
  const calcSign = crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
  return sign === calcSign;
}

export default async function handler(req, res) {
  const xml = await new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });

  const json = await xml2js.parseStringPromise(xml, { explicitArray: false });
  const params = json.xml;

  if (params.return_code === "SUCCESS" && checkSign(params)) {
    const order_no = params.out_trade_no;
    const transaction_id = params.transaction_id;

    // ✅ 避免重复处理
    const { data: existing } = await supabase
      .from("love_orders")
      .select("status")
      .eq("order_no", order_no)
      .maybeSingle();

    if (existing?.status !== "paid") {
      // ✅ 更新订单状态
      await supabase
        .from("love_orders")
        .update({
          status: "paid",
          pay_time: new Date(),
          transaction_id,
          notify_data: params,
        })
        .eq("order_no", order_no);

      // ✅ 生成兑换码
      const code = "LOVE-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: newCode } = await supabase
        .from("love_access_codes")
        .insert([{ code, price: 10, discount_price: 0.99, is_used: false }])
        .select()
        .single();

      await supabase.from("love_orders").update({ code_id: newCode.id }).eq("order_no", order_no);

      // ✅ 模板通知（可选）
      await fetch("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=YOUR_ACCESS_TOKEN", {
        method: "POST",
        body: JSON.stringify({
          touser: params.openid,
          template_id: "your-template-id",
          data: {
            thing1: { value: "恋爱占有欲测试兑换码" },
            number2: { value: code },
            date3: { value: new Date().toLocaleString() },
            thing4: { value: "支付成功，祝你测试愉快 💘" },
          },
        }),
      });
    }

    res.setHeader("Content-Type", "text/xml");
    res.send(`<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>`);
  } else {
    res.send(`<xml><return_code>FAIL</return_code><return_msg>签名验证失败</return_msg></xml>`);
  }
}
