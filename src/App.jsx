import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";

import PageLayout from "./components/PageLayout";
import RegisterForm from "./components/RegisterForm";
import ErrorBoundary from "./components/ErrorBoundary";
import positiveMessages from "./data/positiveMessages.json";
import fortuneMessages from "./data/fortuneMessages.json";
import specialMessages from "./data/specialMessages.json";
import { seo as siteSeo } from "./lib/seoConfig";
import LoveFeelingTestPro from "./components/LoveFeelingTestPro";
import EnergyLevelTestPro from "./components/EnergyLevelTestPro";
import "./App.css";

/* ✅ 懒加载主要页面组件 */
const TestsGrid = lazy(() => import("./components/TestsGrid"));
const TalentTest = lazy(() => import("./components/TalentTest"));
const LovePossessivenessTestPro = lazy(() =>
  import("./components/LovePossessivenessTestPro")
);
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

/**
 * 🧭 动态 SEO Hook：根据当前路由自动更新标题 & 描述
 */
function useDynamicSEO() {
  const location = useLocation();
  const [meta, setMeta] = useState({
    title: siteSeo.title,
    description: siteSeo.description,
  });

  useEffect(() => {
    const path = location.pathname;
    let title = "🌞 心灵能量站";
    let desc = "每日正能量语录与心灵能量测试";

    switch (path) {
      case "/tests":
        title = "🧠 心灵测试专区 | 心灵能量站";
        desc = "探索各类心理测试与成长方向，发现更好的自己。";
        break;
      case "/love-test":
        title = "💘 恋爱占有欲测试 | 心灵能量站";
        desc = "测测你的爱情依恋类型，了解爱的模式与内心需求。";
        break;
      case "/talent-test":
        title = "🌟 天赋类型测试 | 心灵能量站";
        desc = "挖掘你的独特天赋与潜能，找到最适合你的方向。";
        break;
      case "/admin":
        title = "💼 管理后台 | 心灵能量站";
        desc = "系统管理中心，仅管理员可访问。";
        break;
      default:
        title = siteSeo.title;
        desc = siteSeo.description;
    }

    setMeta({ title, description: desc });
  }, [location]);

  return meta;
}

/**
 * 🌞 首页组件
 */
function HomePage({
  tab,
  setTab,
  currentMessage,
  currentFortune,
  setCurrentMessage,
  setCurrentFortune,
  energyDays,
  setEnergyDays,
  festivalMsg,
  showRegister,
  setShowRegister,
}) {
  return (
    <main className="container">
      <h1 className="text-3xl font-bold mb-2">🌞 心灵能量站</h1>
      <p>今天是 {new Date().toLocaleDateString("zh-CN")}</p>
      {festivalMsg && <p className="festival">{festivalMsg}</p>}

      {/* 🔀 标签切换 */}
      <div className="tabs">
        <button
          onClick={() => setTab("greeting")}
          className={tab === "greeting" ? "active" : ""}
        >
          💫 正能量语录
        </button>
        <button
          onClick={() => setTab("fortune")}
          className={tab === "fortune" ? "active" : ""}
        >
          🔮 今日运势
        </button>
      </div>

      {/* 🌞 内容区 */}
      {tab === "greeting" ? (
        <section>
          <p className="message">{currentMessage}</p>
          <button
            className="btn-primary"
            onClick={() =>
              setCurrentMessage(
                positiveMessages[
                  Math.floor(Math.random() * positiveMessages.length)
                ]
              )
            }
          >
            ✨ 换一句正能量
          </button>
        </section>
      ) : (
        <section>
          <p className="message">
            {currentFortune?.fortune || "点击刷新查看今日运势"}
          </p>
          <p className="fortune-line">
            🎨 幸运色：
            <span
              className="color-box"
              style={{
                backgroundColor: currentFortune?.color || "gold",
              }}
            ></span>
            <span className="color-text">
              {currentFortune?.color || "金色"}
            </span>
            &nbsp;&nbsp;🔢 幸运数字：
            {currentFortune?.number || 8}
          </p>
          <button
            className="btn-secondary"
            onClick={() =>
              setCurrentFortune(
                fortuneMessages[
                  Math.floor(Math.random() * fortuneMessages.length)
                ]
              )
            }
          >
            🔮 刷新今日运势
          </button>
        </section>
      )}

      {/* 🔋 能量打卡 */}
      <section className="challenge">
        <p>🌿 今日能量挑战：每天保持积极心态！</p>
        <button
          onClick={() => {
            const newDays = energyDays + 1;
            setEnergyDays(newDays);
            localStorage.setItem("energyDays", newDays);
          }}
        >
          ✅ 能量打卡（已打卡 {energyDays} 天）
        </button>
      </section>

      {/* 🧬 加入社群 */}
      <section className="register">
        <button onClick={() => setShowRegister(true)}>✉️ 加入能量社群</button>
      </section>

      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
    </main>
  );
}

/**
 * 🧠 主应用内容（带 Router + Routes）
 */
function AppContent() {
  const [tab, setTab] = useState("greeting");
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentFortune, setCurrentFortune] = useState(null);
  const [energyDays, setEnergyDays] = useState(0);
  const [festivalMsg, setFestivalMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // ✅ 初始化每日数据
  useEffect(() => {
    const todayKey = new Date().toLocaleDateString("zh-CN");
    const saved = JSON.parse(localStorage.getItem("dailyData") || "{}");
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (!saved.date || saved.date !== todayKey) {
      const newData = {
        date: todayKey,
        message: getRandom(positiveMessages),
        fortune: getRandom(fortuneMessages),
      };
      localStorage.setItem("dailyData", JSON.stringify(newData));
      setCurrentMessage(newData.message);
      setCurrentFortune(newData.fortune);
    } else {
      setCurrentMessage(saved.message);
      setCurrentFortune(saved.fortune);
    }

    setEnergyDays(Number(localStorage.getItem("energyDays") || 0));

    const d = new Date();
    const m = d.getMonth() + 1;
    const dd = d.getDate();
    if (m === 1 && dd === 1) setFestivalMsg(getRandom(specialMessages));
    if (m === 12 && dd === 25) setFestivalMsg(getRandom(specialMessages));
  }, []);

  // ✅ 权限保护
  const ProtectedRoute = ({ children }) =>
    user?.isAdmin ? children : <Navigate to="/" replace />;

  // ✅ 动态 SEO
  const meta = useDynamicSEO();

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <PageLayout>
        <Suspense fallback={<div className="loading">🌞 页面加载中...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  tab={tab}
                  setTab={setTab}
                  currentMessage={currentMessage}
                  currentFortune={currentFortune}
                  setCurrentMessage={setCurrentMessage}
                  setCurrentFortune={setCurrentFortune}
                  energyDays={energyDays}
                  setEnergyDays={setEnergyDays}
                  festivalMsg={festivalMsg}
                  showRegister={showRegister}
                  setShowRegister={setShowRegister}
                />
              }
            />
            <Route path="/tests" element={<TestsGrid />} />
            <Route path="/talent-test" element={<TalentTest />} />
            <Route path="/love-test" element={<LovePossessivenessTestPro />} />
            <Route path="/love-feeling-test" element={<LoveFeelingTestPro />} />
            <Route path="/energy-test" element={<EnergyLevelTestPro />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageLayout>
    </>
  );
}

/**
 * 🚀 最外层 Router 包裹
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}
