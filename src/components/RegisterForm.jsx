import './RegisterForm.css';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RegisterForm({ onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return alert("请填写邮箱");

    // 检查是否已注册
    const { data: existing } = await supabase
      .from('contacts')
      .select('email')
      .eq('email', formData.email)
      .maybeSingle();

    if (existing) return alert("📩 该邮箱已注册过，请勿重复提交。");

    // 插入新联系人
    const { error } = await supabase.from('contacts').insert([{
      name: formData.name || null,
      email: formData.email,
      message: formData.message || null
    }]);

    if (error) return alert("❌ 注册失败：" + error.message);

    // ✅ 注册成功后调用邮件 API
    try {
      await fetch('/api/sendWelcomeEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          message: formData.message,
          dailyData: JSON.parse(localStorage.getItem('dailyData') || '{}'),
        }),
      });
    } catch (err) {
      console.error("邮件发送失败：", err);
    }

    alert("🎉 感谢注册！你已加入能量社群，稍后会收到能量邮件！");
    setFormData({ name: '', email: '', message: '' });
    onClose();
  };

  return (
    <div className="register-overlay">
      <div className="register-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>🍌 加入能量社群</h2>
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
          <button type="submit" className="submit-btn">✨ 注册并接收能量</button>
        </form>
        <p className="register-hint">我们会为你送上每日的正能量问候 💛</p>
      </div>
    </div>
  );
}
