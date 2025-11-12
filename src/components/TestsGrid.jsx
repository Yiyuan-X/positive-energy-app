import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TestsGrid.css";

/**
 * ✅ 心灵测试专区页面
 * - 支持搜索过滤
 * - 风格统一为橙金主调
 */
export default function TestsGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  // ✅ 测试列表
  const ALL_TESTS = [
    {
      id: 1,
      title: "💘 恋爱占有欲测试（专业版）",
      desc: "测测你在爱情中的依恋类型，了解自己的情感模式。",
      route: "/love-test",
      tags: ["恋爱", "依恋", "心理", "情感"],
    },
    {
      id: 2,
      title: "🌟 超强天赋测试",
      desc: "探索你的思维优势与天赋方向，找到最适合你的道路。",
      route: "/talent-test",
      tags: ["天赋", "性格", "潜能"],
    },
    {
      id: 3,
      title: "💞 他/她喜欢你吗？",
      desc: "通过10道心理直觉题，看清TA的真实心意与互动能量。",
      route: "/love-feeling-test",
      tags: ["恋爱", "直觉", "关系"],
    },
    {
      id: 4,
      title: "🔮 正能量值测验",
      desc: "测测你的每日心灵能量等级，了解当下振动频率。",
      route: "/energy-test",
      tags: ["能量", "心态", "意识"],
    },
  ];

  // ✅ 读取 URL 参数
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setQuery(q);
  }, [location.search]);

  // ✅ 过滤
  useEffect(() => {
    const kw = query.trim().toLowerCase();
    if (!kw) setFiltered(ALL_TESTS);
    else {
      setFiltered(
        ALL_TESTS.filter(
          (t) =>
            t.title.toLowerCase().includes(kw) ||
            t.desc.toLowerCase().includes(kw) ||
            t.tags.some((tag) => tag.toLowerCase().includes(kw))
        )
      );
    }
  }, [query]);

  // ✅ 本地搜索框事件
  const handleLocalSearch = (e) => {
    e.preventDefault();
    navigate(`/tests?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="tests-grid">
      <h2>心灵测试专区</h2>
      <p className="subtitle">探索你的潜能与情感能量，了解更完整的自己 🌞</p>

      {/* 🔍 搜索框 */}
      <form className="local-search" onSubmit={handleLocalSearch}>
        <input
          type="text"
          placeholder="搜索测试关键字..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">搜索</button>
      </form>

      {/* 🧩 测试卡片 */}
      <div className="test-list">
        {filtered.length > 0 ? (
          filtered.map((test) => (
            <div
              key={test.id}
              className="test-card"
              onClick={() => navigate(test.route)}
            >
              <h3>{test.title}</h3>
              <p>{test.desc}</p>
              <div className="tags">
                {test.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-result">😔 未找到相关测试，请尝试其他关键词。</p>
        )}
      </div>
    </div>
  );
}
