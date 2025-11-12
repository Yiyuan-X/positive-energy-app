import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TestsGrid.css";

/**
 * ✅ 测试专区主页面
 * - 支持从 URL 参数读取 q= 搜索关键字
 * - 支持实时本地搜索过滤
 */
export default function TestsGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [tests, setTests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // ✅ 所有测试项目（可自由扩展）
  const ALL_TESTS = [

    {
      id: 1,
      title: "🌟 天赋类型测试",
      desc: "发现你隐藏的天赋潜能，找到最适合的方向。",
      route: "/talent-test",
      tags: ["天赋", "潜能", "性格"],
    },
    {
      id: 2,
      title: "🌞 专业正能量测试（霍金斯版）",
      desc: "根据 Hawkins 能量等级模型，测出你的意识频率水平。",
      route: "/energy-test",
      tags: ["能量", "觉察", "平和", "心理"],
    },
    {
      id: 3,
      title: "💞 他/她喜欢你吗？",
      desc: "从心理学角度分析他/她的行为信号，测测TA的心动程度！",
      route: "/love-feeling-test", // ✅ 新增路由
      tags: ["恋爱", "情感", "喜欢", "心理"],
    },
      {
      id: 4,
      title: "💘 恋爱占有欲测试（专业版）",
      desc: "测测你在爱情中的依恋类型，了解自己的情感模式。",
      route: "/love-test",
      tags: ["恋爱", "依恋", "心理", "情感"],
    },
    
  ];

  // ✅ 读取 URL 参数（例如 /tests?q=恋爱）
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setQuery(q);
  }, [location.search]);

  // ✅ 初始化数据
  useEffect(() => {
    setTests(ALL_TESTS);
    setFiltered(ALL_TESTS);
  }, []);

  // ✅ 根据搜索关键字实时过滤
  useEffect(() => {
    const kw = query.trim().toLowerCase();
    if (!kw) {
      setFiltered(ALL_TESTS);
      return;
    }

    const result = ALL_TESTS.filter(
      (t) =>
        t.title.toLowerCase().includes(kw) ||
        t.desc.toLowerCase().includes(kw) ||
        t.tags.some((tag) => tag.toLowerCase().includes(kw))
    );

    setFiltered(result);
  }, [query]);

  // ✅ 本地搜索框事件（页面内）
  const handleLocalSearch = (e) => {
    e.preventDefault();
    navigate(`/tests?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="tests-grid">
      <h2>心灵测试专区</h2>

      {/* 🔍 本地搜索框 */}
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
