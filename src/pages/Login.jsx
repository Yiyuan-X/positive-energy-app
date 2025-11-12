import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ 登录失败：" + error.message);
    } else {
      setMessage("✅ 登录成功，正在进入后台...");
      setTimeout(() => onLogin(data.user), 1000);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>🔐 后台登录</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
        {message && <p className="login-msg">{message}</p>}
      </div>
    </div>
  );
}
