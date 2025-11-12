import './RegisterForm.css';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RegisterForm({ onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return alert("请填写邮箱");
    setIsSubmitting(true);

    // ✅ 检查是否已注册
    const { data: existing } = await supabase
      .from('contacts')
      .select('email')
      .eq('email', formData.email)
      .maybeSingle();

    if (existing) {
      setIsSubmitting(false);
      return alert("📩 该邮箱已注册过，请勿重复提交。");
    }

    // ✅ 插入联系人
    const { error } = await supabase.from('contacts').insert([{
      name: formData.name || null,
      email: formData.email,
      message: formData.message || null,
    }]);

    if (error) {
      setIsSubmitting(false);
      return alert("❌ 注册失败：" + error.message);
    }

    // ✅ 自动生成通用兑换码（community_free）
    const code = 'FREE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    await supabase.from('redeem_codes').insert([
      {
        code,
        email: formData.email,
        used: false,
        type: 'community_free', // 通用型，可用于任意测试
        note: '加入能量社群赠送兑换码',
      },
    ]);

    // ✅ 邮件通知（可选）
    try {
      await fetch('/api/sendWelcomeEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          message: formData.message,
          redeemCode: code,
          dailyData: JSON.parse(localStorage.getItem('dailyData') || '{}'),
        }),
      });
    } catch (err) {
      console.error("邮件发送失败：", err);
    }

    alert(`🎉 感谢加入能量社群！\n这是你的专属兑换码：${code}\n可用于解锁爱情测试或天赋测试。`);
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="register-overlay">
      <div className="register-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>🌞 加入能量社群</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="姓名（可选）"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="邮箱地址"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <textarea
            placeholder="留言（可选）"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : "✨ 注册并领取兑换码"}
          </button>
        </form>

        <div className="community-section">
          <h3>👥 加入能量社群</h3>
          <p>添加微信或扫码加入社群，即可领取免费兑换码 🎁</p>
          <div className="wechat-section">
           <img src="/wechat-qr.jpg" alt="扫码加入能量社群" className="wechat-qr" />
            <p>或添加微信：<strong>HSTS08</strong></p>
          </div>
        </div>

        <p className="register-hint">
          我们会为你送上每日的正能量问候 💛
        </p>
      </div>
    </div>
  );
}
