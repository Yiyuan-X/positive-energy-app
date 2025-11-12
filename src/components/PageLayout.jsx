import React from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import "./PageLayout.css";

/**
 * ✅ 页面布局组件（统一 Header + Footer）
 * 自动包含：
 * - 顶部导航（SiteHeader）
 * - 内容居中容器
 * - 底部 Footer
 */
export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      {/* 🧭 顶部导航 */}
      <SiteHeader />

      {/* 🌞 页面主内容 */}
      <div className="page-content">
        {children}
      </div>

      {/* 📦 底部 Footer */}
      <Footer />
    </div>
  );
}
