import React from "react";

export default function HomePage({ onNavigate }) {
  return (
    <main style={{ textAlign: "center", padding: "40px" }}>
      <h1>🌞 欢迎来到心灵能量站</h1>
      <p>这里有正能量语录、运势解读与心理测试 💖</p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => onNavigate("tests")}
          style={{
            background: "linear-gradient(135deg, #ffd452, #ffb347)",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          🧠 进入测试专区
        </button>
      </div>
    </main>
  );
}
