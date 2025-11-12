import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./TestsGrid.css";

// Catalog of available tests
const ALL_TESTS = [
  {
    key: "talent",
    title: "天赋潜能测试",
    desc: "10 题速测你的天赋类型与优势。",
    to: "/talent-test",
    tags: ["天赋", "职业", "优势"],
  },
  {
    key: "love-possess",
    title: "爱情占有欲测试（专业版）",
    desc: "评估情感安全感与依恋倾向。",
    to: "/love-test",
    tags: ["恋爱", "依恋", "安全感"],
  },
  {
    key: "love-feeling",
    title: "爱情心动值测试（专业版）",
    desc: "用 10 题量化你的心动直觉。",
    to: "/love-feeling-test",
    tags: ["恋爱", "心动", "直觉"],
  },
  {
    key: "energy",
    title: "能量状态测试（专业版）",
    desc: "了解当下身心能量与恢复建议。",
    to: "/energy-test",
    tags: ["情绪", "能量", "恢复"],
  },
];

export default function TestsGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const [q, setQ] = useState(qParam);

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  const list = useMemo(() => {
    const kw = (qParam || "").trim().toLowerCase();
    if (!kw) return ALL_TESTS;
    return ALL_TESTS.filter((t) =>
      [t.title, t.desc, ...(t.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(kw)
    );
  }, [qParam]);

  const applySearch = (term) => {
    const next = term.trim();
    if (next) setSearchParams({ q: next });
    else setSearchParams({});
  };

  return (
    <div className="tests-grid">
      <h2>精选测试</h2>
      <p className="subtitle">每天 3 分钟，了解自己一点点</p>

      <div className="local-search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索：天赋 / 恋爱 / 能量 ..."
        />
        <button onClick={() => applySearch(q)}>搜索</button>
      </div>

      <div className="test-list">
        {list.map((t) => (
          <Link key={t.key} to={t.to} className="test-card">
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            {t.tags?.length ? (
              <div className="tags">
                {t.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      {list.length === 0 && <p className="no-result">未找到相关测试</p>}
    </div>
  );
}

