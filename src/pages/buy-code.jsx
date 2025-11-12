import { useState } from "react";

export default function BuyCode() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);

  // ✅ 生成订单号（防重复）
  const createOrderNo = () => {
    const now = Date.now();
    const rand = Math.floor(Math.random() * 10000);
    return `LOVE${now}${rand}`;
  };

  // ✅ 点击购买
  const handleBuy = async () => {
    setLoading(true);
    setStatus("正在创建订单...");

    try {
      const orderNo = createOrderNo();

      // 创建订单 + 调用微信统一下单接口
      const res = await fetch("/api/wechat-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderNo,
          totalFee: 99, // 单位：分（0.99元）
          description: "恋爱占有欲测试兑换码",
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.msg);

      setOrderInfo({ orderNo, mweb_url: data.mweb_url });
      setStatus("✅ 请在微信中完成支付");

      // ✅ 跳转到微信支付页
      window.location.href = data.mweb_url;
    } catch (e) {
      setStatus("❌ 下单失败：" + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>💘 恋爱占有欲测试兑换码购买</h2>
        <p>测试价格：<b>￥0.99</b>（原价￥10）</p>
        <p>支付完成后系统自动生成兑换码，并通过微信模板消息发送</p>

        <button style={styles.btn} disabled={loading} onClick={handleBuy}>
          {loading ? "处理中..." : "💳 立即支付"}
        </button>

        {status && <p style={styles.status}>{status}</p>}

        {orderInfo && (
          <div style={styles.infoBox}>
            <p>订单号：{orderInfo.orderNo}</p>
            <p>如支付中断，可稍后重新支付，系统会自动识别订单状态。</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff6b7, #f6416c)",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fffef8",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "420px",
  },
  btn: {
    background: "linear-gradient(135deg,#ffb347,#ffd452)",
    border: "none",
    padding: "14px 30px",
    borderRadius: "10px",
    fontSize: "18px",
    cursor: "pointer",
  },
  status: { marginTop: "15px", color: "#555" },
  infoBox: {
    background: "#fffbea",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "13px",
    marginTop: "15px",
  },
};
