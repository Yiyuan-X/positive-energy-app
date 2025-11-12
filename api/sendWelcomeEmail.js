export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, name, message, redeemCode, dailyData, type } = req.body;
  if (!email) return res.status(400).json({ error: "缺少邮箱地址" });

  // ✅ 根据类型自动跳转
  let testLink = "https://positive-energy-app-six.vercel.app/";
  if (type === "love") testLink = "https://positive-energy-app-six.vercel.app/love-test";
  else if (type === "talent") testLink = "https://positive-energy-app-six.vercel.app/talent-test";
  else testLink = "https://positive-energy-app-six.vercel.app/";

  const displayName = name || "能量伙伴";
  const codeBlock = redeemCode
    ? `
      <div style="margin:24px 0;text-align:center;">
        <p style="font-size:16px;">🎁 你的专属兑换码：</p>
        <div style="display:inline-block;background:#fff4e6;padding:12px 24px;border-radius:8px;font-size:22px;font-weight:bold;color:#ff6600;">
          ${redeemCode}
        </div>
        <p style="color:#666;font-size:14px;margin-top:6px;">
          可用于解锁测试：${type === "love" ? "爱情占有欲测试 💞" : type === "talent" ? "天赋潜能测试 🌟" : "多项测试"}
        </p>
      </div>
    `
    : "";

  const dailyMsg =
    dailyData?.message ||
    "🌞 愿你今日保持温柔与力量，做最闪亮的自己。";

  // ✅ 邮件 HTML 模板
  const html = `
    <div style="font-family:'Microsoft YaHei',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fffaf5;border-radius:12px;overflow:hidden;border:1px solid #fce5cd;">
      <!-- Header -->
      <div style="background:#ffcc80;padding:24px;text-align:center;">
        <img src="https://positive-energy-app-six.vercel.app/logo.png" alt="CXK Logo" style="width:64px;height:64px;border-radius:50%;object-fit:cover;">
        <h1 style="margin:12px 0 0;font-size:22px;color:#fff;">CXK 能量社群</h1>
        <p style="color:#fff8e1;font-size:14px;">Daily Greeting • Love Energy • Inner Power</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;color:#333;">
        <h2 style="color:#ff6600;margin-bottom:12px;">💌 欢迎加入能量社群</h2>
        <p>亲爱的 <strong>${displayName}</strong>，</p>
        <p>感谢你加入我们的能量社群！我们每天都在为灵魂充电 ✨</p>
        ${codeBlock}

        <h3 style="color:#ff6600;margin-top:24px;">💡 今日能量寄语</h3>
        <blockquote style="margin:12px 0;padding:12px 16px;background:#fff3e0;border-left:4px solid #ffa94d;font-style:italic;">
          ${dailyMsg}
        </blockquote>

        ${
          message
            ? `<p style="margin-top:12px;">🗒️ 你留言了：<em>${message}</em></p>`
            : ""
        }

        <!-- 按钮部分 -->
        <div style="margin-top:28px;text-align:center;">
          <a href="${testLink}" target="_blank"
            style="background:#ff6600;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
            🌈 立即开始测试
          </a>
        </div>

        <hr style="margin:32px 0;border:none;border-top:1px dashed #ffd6a5;">

        <p style="font-size:14px;color:#777;text-align:center;">
          若兑换码无效，可回复邮件或联系微信 <strong>EnergyCoach</strong> 获取帮助 💬
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#fff3e0;text-align:center;padding:16px;font-size:13px;color:#999;">
        © 2025 CXKTech.top | 正能量・AI 赋能・灵感成长
      </div>
    </div>
  `;

  // ✅ 发送邮件
  try {
    const SEND_API_KEY = process.env.SEND_EMAIL_API_KEY;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CXK 能量社群 <noreply@cxktech.top>",
        to: [email],
        subject: "欢迎加入 CXK 能量社群 💛",
        html,
      }),
    });

    console.log(`✅ 邮件发送成功 → ${email}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ 邮件发送失败:", error);
    return res.status(500).json({ error: "邮件发送失败" });
  }
}
