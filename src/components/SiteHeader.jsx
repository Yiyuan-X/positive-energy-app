import React, { useState } from "react";
import "./SiteHeader.css";

/**
 * 🌞 顶部导航栏（带登录/注册 + 响应式菜单）
 */
export default function SiteHeader({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // 模拟登录状态
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "心灵旅人" });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* 🌞 Logo + 标题 */}
        <div className="logo" onClick={() => onNavigate?.("home")}>
          🌞 心灵能量站
        </div>

        {/* 🧭 桌面菜单 */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => onNavigate?.("home")}>首页</button>
          <button onClick={() => onNavigate?.("tests")}>测试专区</button>
          <button onClick={() => onNavigate?.("admin")}>后台管理</button>
          <button onClick={() => onNavigate?.("orders")}>订单记录</button>
        </nav>

        {/* 👤 登录注册区 */}
        <div className="auth-section">
          {user ? (
            <>
              <span className="welcome">你好，{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                退出
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() => {
                setIsLoginMode(true);
                setShowAuthModal(true);
              }}
            >
              登录 / 注册
            </button>
          )}
        </div>

        {/* 📱 汉堡菜单按钮 */}
        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 🔐 登录注册弹窗 */}
      {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-box">
            <h3>{isLoginMode ? "登录账号" : "注册账号"}</h3>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="邮箱" required />
              <input type="password" placeholder="密码" required />
              <button type="submit" className="btn-primary">
                {isLoginMode ? "登录" : "注册"}
              </button>
            </form>
            <p>
              {isLoginMode ? "还没有账号？" : "已有账号？"}{" "}
              <span
                className="switch-mode"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? "注册" : "去登录"}
              </span>
            </p>
            <button className="close-modal" onClick={() => setShowAuthModal(false)}>
              关闭
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
