import React from "react";
import "./Footer.css";
import "./Footer.css";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* 左侧信息 */}
        <div className="footer-left">
          <p>🌈 CXK 能量社群 · 每日灵感与正能量</p>
          <p style={{ fontSize: "13px", color: "#888" }}>
            © {year} CXKTech.top | All Rights Reserved
          </p>
          <p className="footer-links">
            <a href="mailto:support@cxktech.top">📩 联系我们</a> |{" "}
            <a href="https://www.cxktech.top" target="_blank" rel="noreferrer">
              官方网站
            </a>
          </p>
        </div>

        {/* 右侧二维码 */}
        <div className="footer-qr">
          <img src="/wechat-qr.jpg" alt="加入能量社群" />
          <p>扫码加入社群 💛</p>
        </div>
      </div>
    </footer>
  );
}
