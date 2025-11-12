import React, { useState, useEffect } from "react";
import TalentTest from "./TalentTest";
import LovePossessivenessTestPro from "./LovePossessivenessTestPro";
import LoveCodeAdmin from "../admin/LoveCodeAdmin";
import LoveOrdersAdmin from "../admin/LoveOrdersAdmin";
import "./TestsGrid.css";

export default function TestsGrid() {
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const components = [
    { name: "🧠 天赋测试", comp: <TalentTest /> },
    { name: "💘 恋爱占有欲测试", comp: <LovePossessivenessTestPro /> },
    { name: "🛠️ 兑换码后台", comp: <LoveCodeAdmin /> },
    { name: "📦 订单管理", comp: <LoveOrdersAdmin /> },
  ];

  // ✅ 手机一页一测
  if (isMobile) {
    return (
      <div className="test-mobile">
        <h2>{components[page].name}</h2>
        <div className="test-box">{components[page].comp}</div>
        <div className="nav-buttons">
          <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            ◀ 上一个
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, components.length - 1))}
            disabled={page === components.length - 1}
          >
            下一个 ▶
          </button>
        </div>
      </div>
    );
  }

  // ✅ 桌面：多卡片并列
  return (
    <div className="test-grid">
      {components.map((c, i) => (
        <div key={i} className="test-card">
          <h2>{c.name}</h2>
          {c.comp}
        </div>
      ))}
    </div>
  );
}
