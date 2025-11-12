import crypto from "crypto";
import xml2js from "xml2js";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const config = {
  appid: process.env.WECHAT_APPID,
  mch_id: process.env.WECHAT_MCH_ID,
  api_key: process.env.WECHAT_API_KEY,
  notify_url: process.env.WECHAT_NOTIFY_URL,
};

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function createSign(params) {
  const str = Object.keys(params)
    .filter((k) => params[k])
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&") + `&key=${config.api_key}`;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

function toXml(obj) {
  const builder = new xml2js.Builder({ rootName: "xml", headless: true, cdata: true });
  return builder.buildObject(obj);
}

export default async function handler(req, res) {
  try {
    const { orderId, description, totalFee } = await req.json();

    // ✅ 创建订单记录
    await supabase.from("love_orders").insert({
      order_no: orderId,
      total_fee: totalFee,
      description,
      status: "pending",
    });

    const params = {
      appid: config.appid,
      mch_id: config.mch_id,
      nonce_str: crypto.randomBytes(16).toString("hex"),
      body: description,
      out_trade_no: orderId,
      total_fee: totalFee,
      spbill_create_ip: "127.0.0.1",
      notify_url: config.notify_url,
      trade_type: "MWEB",
      scene_info: JSON.stringify({
        h5_info: { type: "Wap", wap_url: "https://positive-energy-app-six.vercel.app/", wap_name: "心理测试中心" },
      }),
    };
    params.sign = createSign(params);

    const xmlData = toXml(params);
    const resp = await fetch("https://api.mch.weixin.qq.com/pay/unifiedorder", {
      method: "POST",
      body: xmlData,
    });
    const text = await resp.text();
    const parsed = await xml2js.parseStringPromise(text, { explicitArray: false });

    if (parsed.xml.return_code === "SUCCESS" && parsed.xml.result_code === "SUCCESS") {
      res.status(200).json({
        success: true,
        mweb_url: parsed.xml.mweb_url,
      });
    } else {
      res.status(400).json({ success: false, msg: parsed.xml.return_msg });
    }
  } catch (e) {
    res.status(500).json({ success: false, msg: e.message });
  }
}
