import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const PRESET_SUGGESTIONS = ["恋爱", "天赋", "性格", "能量", "积极", "心理测试"];

  // ✅ 恢复登录状态
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) setUser(savedUser);
  }, []);

  // ✅ 恢复历史记录
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(saved);
  }, []);

  // ✅ 点击外部隐藏下拉框
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 登录逻辑
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value.trim();
    const name = email.split("@")[0];
    const isAdmin = email === "admin@love.com";

    const loggedInUser = { name, email, isAdmin };
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setShowAuthModal(false);
  };

  // ✅ 登出逻辑
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ 搜索逻辑
  const handleSearch = (term) => {
    if (!term.trim()) return;
    // 保存历史（只保留最近 5 条）
    const newHistory = [term, ...history.filter((h) => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    navigate(`/tests?q=${encodeURIComponent(term.trim())}`);
    setShowDropdown(false);
    setMenuOpen(false);
  };

  // ✅ 实时建议过滤
  useEffect(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) {
      setSuggestions([]);
      return;
    }
    const match = PRESET_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(kw)
    );
    setSuggestions(match);
  }, [searchTerm]);

  // ✅ 高亮路由
  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="header-container">
        {/* 🌞 Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          🌞 心灵能量站
        </div>

        {/* 🧭 菜单导航 */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link className={isActive("/") ? "active" : ""} to="/">
            首页
          </Link>
          <Link className={isActive("/tests") ? "active" : ""} to="/tests">
            测试专区
          </Link>
          {user?.isAdmin && (
            <Link className={isActive("/admin") ? "active" : ""} to="/admin">
              后台管理
            </Link>
          )}
        </nav>

        {/* 🔍 搜索栏 */}
        <div className="search-wrapper" ref={dropdownRef}>
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchTerm);
            }}
          >
            <input
              type="text"
              placeholder="搜索测试、语录..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <button type="submit">🔍</button>
          </form>

          {/* 🔮 搜索建议 & 历史 */}
          {showDropdown && (
            <div className="search-dropdown">
              {searchTerm ? (
                suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((s, i) => (
                      <li key={i} onClick={() => handleSearch(s)}>
                        🔮 {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-suggestion">没有匹配的建议</p>
                )
              ) : history.length > 0 ? (
                <>
                  <div className="history-header">
                    <span>🕘 最近搜索</span>
                    <button
                      onClick={() => {
                        localStorage.removeItem("searchHistory");
                        setHistory([]);
                      }}
                    >
                      清除
                    </button>
                  </div>
                  <ul>
                    {history.map((h, i) => (
                      <li key={i} onClick={() => handleSearch(h)}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="no-suggestion">暂无历史记录</p>
              )}
            </div>
          )}
        </div>

        {/* 👤 登录区 */}
        <div className="auth-section">
          {user ? (
            <>
              <span className="welcome">
                你好，{user.name}
                {user.isAdmin && <span className="admin-tag">（管理员）</span>}
              </span>
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

        {/* 📱 汉堡菜单 */}
        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 🔐 登录弹窗 */}
      {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-box">
            <h3>{isLoginMode ? "登录账号" : "注册账号"}</h3>
            <form onSubmit={handleLogin}>
              <input name="email" type="email" placeholder="邮箱" required />
              <input name="password" type="password" placeholder="密码" required />
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
