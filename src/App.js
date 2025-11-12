import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import positiveMessages from "./data/positiveMessages.json";
import fortuneMessages from "./data/fortuneMessages.json";
import specialMessages from "./data/specialMessages.json";
import PageLayout from "./components/PageLayout";
import RegisterForm from "./components/RegisterForm";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import TalentTest from "./components/TalentTest";
import LovePossessivenessTestPro from "./components/LovePossessivenessTestPro";
import LoveCodeAdmin from "./admin/LoveCodeAdmin";
import LoveOrdersAdmin from "./admin/LoveOrdersAdmin";
import TestsGrid from "./components/TestsGrid";
import { seo as siteSeo } from "./lib/seoConfig";

console.log("✅ App 已加载");
window.addEventListener("error", (e) => {
  console.error("❌ 全局错误捕获:", e.message, e.filename, e.lineno);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("❌ 未处理的 Promise:", e.reason);
});

function App() {
  const [tab, setTab] = useState("greeting");
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentFortune, setCurrentFortune] = useState(null);
  const [energyDays, setEnergyDays] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showTalentTest, setShowTalentTest] = useState(false);
  const [showLoveTest, setShowLoveTest] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrdersAdmin, setShowOrdersAdmin] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [festivalMsg, setFestivalMsg] = useState("");

  // 📅 初始化每日语录 + 运势
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

  return (
    <ErrorBoundary>
      <Helmet>
        <html lang="zh-CN" />
        <title>{siteSeo.title}</title>
        <meta name="description" content={siteSeo.description} />
        <meta name="keywords" content={siteSeo.keywords.join(",")} />
        <link rel="canonical" href={siteSeo.canonical} />
      </Helmet>

      {/* ✅ PageLayout 始终包裹所有页面 */}
      <PageLayout>
        {showTalentTest ? (
          <TalentTest onFinish={() => setShowTalentTest(false)} />
        ) : showLoveTest ? (
          <LovePossessivenessTestPro onFinish={() => setShowLoveTest(false)} />
        ) : showAdmin ? (
          <LoveCodeAdmin />
        ) : showOrdersAdmin ? (
          <LoveOrdersAdmin />
        ) : showTests ? (
          <TestsGrid />
        ) : (
          <>
            <main className="container">
              <h1 className="text-3xl font-bold mb-2">🌞 心灵能量站</h1>
              <p>今天是 {new Date().toLocaleDateString("zh-CN")}</p>
              {festivalMsg && <p className="festival">{festivalMsg}</p>}

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

              {tab === "greeting" ? (
                <section>
                  <p className="message">{currentMessage}</p>
                  <button
                    className="btn-primary"
                    onClick={() =>
                      setCurrentMessage(
                        positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
                      )
                    }
                  >
                    ✨ 换一句正能量
                  </button>
                </section>
              ) : (
                <section>
                  <p className="message">{currentFortune?.fortune || "点击刷新查看今日运势"}</p>
                  <p>
                    🎨 幸运色：{currentFortune?.color || "金色"}　🔢 幸运数字：
                    {currentFortune?.number || 8}
                  </p>
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      setCurrentFortune(
                        fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)]
                      )
                    }
                  >
                    🔮 刷新今日运势
                  </button>
                </section>
              )}

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

              <section className="register">
                <button onClick={() => setShowRegister(true)}>✉️ 加入能量社群</button>
                <button onClick={() => setShowTests(true)}>🧠 查看所有测试</button>
              </section>

              {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
            </main>
          </>
        )}
      </PageLayout>
    </ErrorBoundary>
  );
}

export default App;
