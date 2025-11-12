import React, { useState, useEffect } from "react";
import positiveMessages from "./data/positiveMessages.json";
import fortuneMessages from "./data/fortuneMessages.json";
import specialMessages from "./data/specialMessages.json";
import RegisterForm from "./components/RegisterForm";
import TalentTest from "./components/TalentTest";
import LoveCodeAdmin from "./admin/LoveCodeAdmin";
import LoveOrdersAdmin from "./admin/LoveOrdersAdmin";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  // ======================
  // 🧠 状态管理
  // ======================
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentFortune, setCurrentFortune] = useState(null);
  const [activeTab, setActiveTab] = useState("greeting");
  const [clickCount, setClickCount] = useState(0);
  const [fortuneCount, setFortuneCount] = useState(0);
  const [energyDays, setEnergyDays] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [name, setName] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showTalentTest, setShowTalentTest] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrdersAdmin, setShowOrdersAdmin] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState("");

  // ======================
  // 🎨 实用函数
  // ======================
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getLuckyColor = () =>
    ["红色", "橙色", "黄色", "绿色", "蓝色", "紫色", "粉色", "金色"][
      Math.floor(Math.random() * 8)
    ];
  const getLuckyNumber = () => Math.floor(Math.random() * 9) + 1;
  const getRandomChallenge = () =>
    [
      "对一个陌生人微笑 😊",
      "写下三件让你感恩的事 🙏",
      "发一条正能量朋友圈 📱",
      "喝八杯水 💧",
      "早点睡觉 😴",
    ][Math.floor(Math.random() * 5)];

  const todayKey = new Date().toLocaleDateString("zh-CN");

  // ======================
  // 🗓 初始化每日语录
  // ======================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyData") || "{}");
    if (!saved.date || saved.date !== todayKey) {
      const newData = {
        date: todayKey,
        message: getRandomItem(positiveMessages),
        fortune: getRandomItem(fortuneMessages),
        luckyColor: getLuckyColor(),
        luckyNumber: getLuckyNumber(),
        challenge: getRandomChallenge(),
      };
      localStorage.setItem("dailyData", JSON.stringify(newData));
      setCurrentMessage(newData.message);
      setCurrentFortune(newData.fortune);
    } else {
      setCurrentMessage(saved.message);
      setCurrentFortune(saved.fortune);
    }
    setEnergyDays(Number(localStorage.getItem("energyDays") || 0));
  }, []);

  // ======================
  // 🎁 彩蛋检测
  // ======================
  const checkEasterEgg = (days) => {
    if (days === 7 || days === 30) {
      const msg =
        days === 7 ? "🎁 连续打卡 7 天成就达成！" : "🏆 能量大师降临！";
      setEasterEggMessage(`${msg}\n${getRandomItem(specialMessages)}`);
      setShowEasterEgg(true);
    }
  };

  const handleEnergyCheckin = () => {
    const newDays = energyDays + 1;
    setEnergyDays(newDays);
    localStorage.setItem("energyDays", newDays);
    checkEasterEgg(newDays);
  };

  const handleNewMessage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setClickCount((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleFortuneTelling = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setFortuneCount((prev) => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "深夜好";
    if (hour < 12) return "早上好";
    if (hour < 14) return "中午好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  const dailyData = JSON.parse(localStorage.getItem("dailyData") || "{}");

  const festivalMsg = (() => {
    const date = new Date();
    const m = date.getMonth() + 1,
      d = date.getDate();
    if (m === 1 && d === 1) return `🎆 新年快乐！${getRandomItem(specialMessages)}`;
    if (m === 12 && d === 25) return `🎄 圣诞快乐！${getRandomItem(specialMessages)}`;
    return "";
  })();

  // ======================
  // 🔀 页面切换逻辑
  // ======================
  if (showTalentTest) return <TalentTest onFinish={() => setShowTalentTest(false)} />;
  if (showAdmin) return <LoveCodeAdmin />;
  if (showOrdersAdmin) return <LoveOrdersAdmin />;

  // ======================
  // 🧩 页面主体
  // ======================
  return (
    <>
      <SiteHeader
        onNavigate={(dest) => {
          if (dest === "test") setShowTalentTest(true);
          if (dest === "home") {
            setShowTalentTest(false);
            setShowAdmin(false);
            setShowOrdersAdmin(false);
          }
        }}
      />

      <div className={`app ${showEasterEgg ? "bg-celebration" : ""}`}>
        <div className="container">
          {showEasterEgg && <div className="easter-egg">{easterEggMessage}</div>}

          <div className="header">
            <h1>
              {activeTab === "greeting" ? "🌞 心灵能量站 🌞" : "🔮 运势指南针 🔮"}
            </h1>
            <p>
              {getTimeGreeting()}！今天是 {todayKey}
            </p>
            {festivalMsg && <p className="festival">{festivalMsg}</p>}
          </div>

          <div className="tabs">
            <button
              onClick={() => setActiveTab("greeting")}
              className={activeTab === "greeting" ? "active" : ""}
            >
              💫 正能量语录
            </button>
            <button
              onClick={() => setActiveTab("fortune")}
              className={activeTab === "fortune" ? "active" : ""}
            >
              🔮 运势预测
            </button>
          </div>

          <div className="content">
            {activeTab === "greeting" ? (
              <p className="message">{currentMessage}</p>
            ) : (
              <div className="fortune">
                {currentFortune ? (
                  <>
                    <div
                      className="fortune-box"
                      style={{ background: currentFortune.bgColor }}
                    >
                      <h2>{currentFortune.fortune}</h2>
                    </div>
                    <p>{currentFortune.message}</p>
                    <p className="fortune-extra">
                      🎨 幸运色：{dailyData.luckyColor}　🔢 幸运数字：
                      {dailyData.luckyNumber}
                    </p>
                  </>
                ) : (
                  <p className="placeholder">点击下方按钮查看今日运势 🔮</p>
                )}
              </div>
            )}
          </div>

          <div className="actions">
            {activeTab === "greeting" ? (
              <button onClick={handleNewMessage} className="btn-primary">
                ✨ 换一句正能量
              </button>
            ) : (
              <button onClick={handleFortuneTelling} className="btn-secondary">
                🔮 查看今日运势
              </button>
            )}
          </div>

          <div className="name-test">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入名字测试今日能量指数 🔮"
            />
            {name && <p>{name} 的今日能量指数：{name.charCodeAt(0) % 100}%</p>}
          </div>

          <div className="challenge">
            <p>🌿 今日能量挑战：{dailyData.challenge}</p>
            <button onClick={handleEnergyCheckin}>
              ✅ 能量打卡（已打卡 {energyDays} 天）
            </button>
          </div>

          <div className="register">
            <button onClick={() => setShowRegister(true)}>
              ✉️ 加入能量社群
            </button>
            <button onClick={() => setShowTalentTest(true)}>
              🧬 开启天赋测试
            </button>
            <button onClick={() => setShowAdmin(true)}>🛠️ 兑换码后台</button>
            <button onClick={() => setShowOrdersAdmin(true)}>💳 订单后台</button>
          </div>

          {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
