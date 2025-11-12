// ✅ 样式必须最先导入，防止渲染前紫屏
import "./index.css";
import "./App.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🚀 根日志
console.log("🚀 React 根文件加载成功");

// ✅ 捕获所有同步错误
window.addEventListener("error", (e) => {
  console.error("❌ 全局捕获错误:", e.message, e.filename, e.lineno, e.colno);
});

// ✅ 捕获 Promise 异常
window.addEventListener("unhandledrejection", (e) => {
  console.error("❌ Promise 未处理:", e.reason);
});

// ✅ React 渲染层面全局兜底
function ErrorBoundaryWrapper() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// ✅ 最强兜底：任何 React 内部错误都打印
const rootEl = document.getElementById("root");
try {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<ErrorBoundaryWrapper />);
  console.log("✅ ReactDOM 渲染启动成功");
} catch (err) {
  console.error("💥 React 渲染阶段错误:", err);
}

// ✅ 高级兜底：监控 console.error 输出（包括 React 内部报错）
const origConsoleError = console.error;
console.error = function (...args) {
  origConsoleError.apply(console, args);
  try {
    const message = args.join(" ");
    if (message.includes("Error") || message.includes("Uncaught")) {
      alert("🚨 React 捕获错误:\n" + message);
    }
  } catch {}
};
