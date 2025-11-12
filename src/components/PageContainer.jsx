import React from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";

export default function PageContainer({ children }) {
  return (
    <div className="page-wrapper">
      {/* 顶部导航 */}
      <SiteHeader />

      {/* 页面主体内容 */}
      <main className="container">{children}</main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}
