import React, { useState, useEffect } from 'react';
import positiveMessages from './data/positiveMessages.json';
import fortuneMessages from './data/fortuneMessages.json';
import specialMessages from './data/specialMessages.json';

function App() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentFortune, setCurrentFortune] = useState(null);
  const [activeTab, setActiveTab] = useState('greeting');
  const [clickCount, setClickCount] = useState(0);
  const [fortuneCount, setFortuneCount] = useState(0);
  const [energyDays, setEnergyDays] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [name, setName] = useState('');
  const [testShown, setTestShown] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState('');


  

  // 🎨 实用函数
  const getLuckyColor = () => ["红色","橙色","黄色","绿色","蓝色","紫色","粉色","金色"][Math.floor(Math.random() * 8)];
  const getLuckyNumber = () => Math.floor(Math.random() * 9) + 1;
  const getRandomChallenge = () => [
    "对一个陌生人微笑 😊","写下三件让你感恩的事 🙏",
    "发一条正能量朋友圈 📱","喝八杯水 💧","早点睡觉 😴"
  ][Math.floor(Math.random() * 5)];
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const todayKey = new Date().toLocaleDateString('zh-CN');

  // 🗓️ 初始化每日一签
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('dailyData') || '{}');
    if (!saved.date || saved.date !== todayKey) {
      const newData = {
        date: todayKey,
        message: getRandomItem(positiveMessages),
        fortune: getRandomItem(fortuneMessages),
        luckyColor: getLuckyColor(),
        luckyNumber: getLuckyNumber(),
        challenge: getRandomChallenge(),
      };
      localStorage.setItem('dailyData', JSON.stringify(newData));
      setCurrentMessage(newData.message);
      setCurrentFortune(newData.fortune);
    } else {
      setCurrentMessage(saved.message);
      setCurrentFortune(saved.fortune);
    }
    const days = localStorage.getItem('energyDays') || 0;
    setEnergyDays(Number(days));
  }, []);

  // 🧠 能量类型测试
  useEffect(() => {
    if (clickCount >= 5 && !testShown) {
      const types = [
        { title: "🌞 阳光积极型", desc: "你是鼓励别人的小太阳！" },
        { title: "🌙 温柔治愈型", desc: "温暖细腻，能量柔而不弱。" },
        { title: "🔥 冲劲满满型", desc: "敢拼敢闯的实干家！" },
        { title: "🌈 创意灵感型", desc: "点子不断的灵感源泉！" },
      ];
      const random = getRandomItem(types);
      alert(`🌀 今日能量类型测试结果\n${random.title}\n${random.desc}`);
      setTestShown(true);
    }
  }, [clickCount, testShown]);

  // ✨ 检测节日彩蛋
  const checkFestival = () => {
  const date = new Date();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 1 && d === 1) {
    const special = specialMessages[Math.floor(Math.random() * specialMessages.length)];
    return `🎆 新年快乐！${special}`;
  }
  if (m === 12 && d === 25) {
    const special = specialMessages[Math.floor(Math.random() * specialMessages.length)];
    return `🎄 圣诞快乐！${special}`;
  }
  return "";
};


  // 🧧 检测打卡彩蛋
  const checkEasterEgg = (days) => {
    if (days === 7) {
      setEasterEggMessage("🎁 恭喜你连续打卡 7 天！解锁特别能量语录：『坚持是最强大的魔法』✨");
      setShowEasterEgg(true);
    } else if (days === 30) {
      setEasterEggMessage("🏆 你已成为『能量大师』！感谢你用正能量点亮生活！🌈");
      setShowEasterEgg(true);
    }
  };

  // ⚙️ 按钮逻辑
  const handleEnergyCheckin = () => {
    const newDays = energyDays + 1;
    setEnergyDays(newDays);
    localStorage.setItem('energyDays', newDays);
    const checkEasterEgg = (days) => {
  if (days === 7) {
    const special = specialMessages[Math.floor(Math.random() * specialMessages.length)];
    setEasterEggMessage(`🎁 连续打卡 7 天成就达成！\n${special}`);
    setShowEasterEgg(true);
  } else if (days === 30) {
    const special = specialMessages[Math.floor(Math.random() * specialMessages.length)];
    setEasterEggMessage(`🏆 能量大师降临！\n${special}`);
    setShowEasterEgg(true);
  }
};

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
    if (hour < 6) return '深夜好';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const dailyData = JSON.parse(localStorage.getItem('dailyData') || '{}');
  const festivalMsg = checkFestival();

  return (
    <div style={{
      minHeight: '100vh',
      background: showEasterEgg
        ? 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      transition: 'background 1s ease',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '520px', margin: '0 auto', background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px', padding: '40px 30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative'
      }}>

        {/* ✨ 彩蛋提示 */}
        {showEasterEgg && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, padding: '20px',
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            color: 'white', borderRadius: '24px 24px 0 0', animation: 'fadeIn 2s ease'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{easterEggMessage}</h3>
          </div>
        )}

        {/* 标题区 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontSize: '28px', fontWeight: '700', marginBottom: '6px'
          }}>
            {activeTab === 'greeting' ? '🌞 心灵能量站 🌞' : '🔮 运势指南针 🔮'}
          </h1>
          <p style={{ color: '#636e72' }}>
            {getTimeGreeting()}！今天是 {todayKey}
          </p>
          {festivalMsg && <p style={{ color: '#e17055', fontWeight: '600' }}>{festivalMsg}</p>}
        </div>

        {/* 选项卡 */}
        <div style={{ display: 'flex', background: '#f8f9fa', borderRadius: '50px', padding: '6px', marginBottom: '25px' }}>
          <button onClick={() => setActiveTab('greeting')}
            style={{
              flex: 1, padding: '12px', fontWeight: '600',
              background: activeTab === 'greeting' ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
              color: activeTab === 'greeting' ? '#fff' : '#636e72', border: 'none', borderRadius: '50px', cursor: 'pointer'
            }}>💫 正能量语录</button>
          <button onClick={() => setActiveTab('fortune')}
            style={{
              flex: 1, padding: '12px', fontWeight: '600',
              background: activeTab === 'fortune' ? 'linear-gradient(135deg,#f093fb,#f5576c)' : 'transparent',
              color: activeTab === 'fortune' ? '#fff' : '#636e72', border: 'none', borderRadius: '50px', cursor: 'pointer'
            }}>🔮 运势预测</button>
        </div>

        {/* 内容 */}
        <div style={{
          background: '#fff', borderRadius: '20px', padding: '30px', minHeight: '180px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transition: '0.3s'
        }}>
          {activeTab === 'greeting' ? (
            <p style={{ fontSize: '20px', color: '#2d3436', textAlign: 'center' }}>{currentMessage}</p>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {currentFortune ? (
                <>
                  <div style={{
                    background: currentFortune.bgColor,
                    color: 'white', padding: '10px 30px', borderRadius: '50px', marginBottom: '15px'
                  }}>
                    <h2>{currentFortune.fortune}</h2>
                  </div>
                  <p style={{ color: '#2d3436' }}>{currentFortune.message}</p>
                  <p style={{ marginTop: '10px', color: '#636e72' }}>
                    🎨 幸运色：{dailyData.luckyColor}　🔢 幸运数字：{dailyData.luckyNumber}
                  </p>
                </>
              ) : <p style={{ color: '#b2bec3' }}>点击下方按钮查看今日运势 🔮</p>}
            </div>
          )}
        </div>

        {/* 按钮 */}
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          {activeTab === 'greeting' ? (
            <button onClick={handleNewMessage}
              style={{ padding: '15px 35px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff' }}>
              ✨ 换一句正能量
            </button>
          ) : (
            <button onClick={handleFortuneTelling}
              style={{ padding: '15px 35px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#f093fb,#f5576c)', color: '#fff' }}>
              🔮 查看今日运势
            </button>
          )}
        </div>

        {/* 名字测试 */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入名字测试今日能量指数 🔮"
            style={{ padding: '10px', borderRadius: '10px', width: '80%', border: '1px solid #ccc' }}
          />
          {name && (
            <p style={{ marginTop: '10px', color: '#2d3436', fontWeight: '500' }}>
              {name} 的今日能量指数：{(name.charCodeAt(0) % 100)}%
            </p>
          )}
        </div>

        {/* 打卡与挑战 */}
        <div style={{
          background: 'linear-gradient(135deg,#a8edea,#fed6e3)',
          borderRadius: '16px', padding: '20px', marginTop: '30px', textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px', color: '#2d3436' }}>🌿 今日能量挑战：{dailyData.challenge}</p>
          <button onClick={handleEnergyCheckin}
            style={{ padding: '10px 25px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#55efc4,#00cec9)', color: '#fff' }}>
            ✅ 能量打卡（已打卡 {energyDays} 天）
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
