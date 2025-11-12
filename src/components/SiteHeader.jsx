import React from "react";
import "./SiteHeader.css";

export default function SiteHeader({ onNavigate }) {
  return (
    <header className="site-header">
      <div className="site-logo" onClick={() => onNavigate("home")}>
        🌞 DailyGreeting / Love 系列
      </div>

      <nav className="site-nav">
        <button onClick={() => onNavigate("home")}>🏠 首页</button>
        <button onClick={() => onNavigate("test")}>🧬 天赋测试</button>
        <button onClick={() => onNavigate("love")}>💘 恋爱测试</button>
        <button onClick={() => onNavigate("about")}>📖 关于</button>
      </nav>
    </header>
  );
}
