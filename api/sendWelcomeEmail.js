import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, message, dailyData } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const subject = `欢迎加入【心灵能量站】，${name || ''}`;
  const html = `
    <div style="font-family:Arial, sans-serif; color:#2d3436;">
      <h1>欢迎 ${name || '朋友'}！</h1>
      <p>你已加入我们的每日正能量旅程。</p>
      <hr />
      <h2>🌞 今日正能量语录：</h2>
      <p style="font-size:18px; font-weight:500;">${dailyData.message}</p>
      <h2>🔮 今日幸运元素：</h2>
      <p>幸运色 ： <strong>${dailyData.luckyColor}</strong></p>
      <p>幸运数字 ： <strong>${dailyData.luckyNumber}</strong></p>
      <p>发送给你的留言 ： ${message || '无'} </p>
      <p style="margin-top:20px;">祝你每一天都能更精彩！💛</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: '能量站 <no-reply@yourdomain.com>',
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ id: data.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
