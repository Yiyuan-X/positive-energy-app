import React, { useState, useEffect } from 'react';

function App() {
  // 正能量问候语库
  const positiveMessages = [
    "今天又是崭新的一天，加油！💪",
    "你的潜力无限，相信自己！✨",
    "每一天都是改变生活的机会！🌞",
    "保持微笑，世界会因你而美好！😊",
    "小小的进步也是进步，继续前进！🚀",
    "你是独一无二的，做最棒的自己！🌟",
    "困难只是暂时的，你能克服一切！🌈",
    "今天也要全力以赴哦！🔥",
    "感恩当下，珍惜拥有！🙏",
    "你的努力终将开花结果！🌼",
    "保持积极，好事自然来！🎉",
    "今天是你余生中最年轻的一天！🎯",
    "每一步都在接近梦想！💫",
    "你是生活的冠军！🏆",
    "散发正能量，感染身边的人！⚡"
  ];

  // 算命预测语库
  const fortuneMessages = [
    { 
      fortune: "大吉大利 🍀", 
      message: "今天运气爆棚！适合尝试新事物，会有意外收获！", 
      color: "#e74c3c",
      bgColor: "linear-gradient(135deg, #ff6b6b, #ee5a24)"
    },
    { 
      fortune: "心想事成 🌟", 
      message: "你的愿望即将实现，保持积极心态迎接好运！", 
      color: "#f39c12",
      bgColor: "linear-gradient(135deg, #fdcb6e, #e17055)"
    },
    { 
      fortune: "贵人相助 👥", 
      message: "今天会遇到帮助你的人，记得表达感谢！", 
      color: "#3498db",
      bgColor: "linear-gradient(135deg, #74b9ff, #0984e3)"
    },
    { 
      fortune: "财运亨通 💰", 
      message: "财务方面有好消息，但要理性消费哦！", 
      color: "#27ae60",
      bgColor: "linear-gradient(135deg, #00b894, #00a085)"
    },
    { 
      fortune: "桃花朵朵 🌸", 
      message: "感情运势不错，单身者有机会遇到心仪对象！", 
      color: "#e84393",
      bgColor: "linear-gradient(135deg, #fd79a8, #e84393)"
    },
    { 
      fortune: "学业进步 📚", 
      message: "学习效率很高，考试运也不错，加油！", 
      color: "#9b59b6",
      bgColor: "linear-gradient(135deg, #a29bfe, #6c5ce7)"
    },
    { 
      fortune: "健康平安 💚", 
      message: "身体状况良好，记得保持规律作息！", 
      color: "#2ecc71",
      bgColor: "linear-gradient(135deg, #55efc4, #00b894)"
    },
    { 
      fortune: "事业上升 📈", 
      message: "工作上有新机遇，勇敢接受挑战！", 
      color: "#34495e",
      bgColor: "linear-gradient(135deg, #636e72, #2d3436)"
    },
    { 
      fortune: "旅行运佳 ✈️", 
      message: "适合规划短途旅行，放松心情！", 
      color: "#0984e3",
      bgColor: "linear-gradient(135deg, #81ecec, #00cec9)"
    },
    { 
      fortune: "创意无限 🎨", 
      message: "灵感爆棚的一天，适合创作和表达！", 
      color: "#6c5ce7",
      bgColor: "linear-gradient(135deg, #dabae8, #a29bfe)"
    }
  ];

  // 使用useState管理状态
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentFortune, setCurrentFortune] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [fortuneCount, setFortuneCount] = useState(0);
  const [activeTab, setActiveTab] = useState('greeting');
  const [isAnimating, setIsAnimating] = useState(false);

  // 随机选择一条问候语
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * positiveMessages.length);
    return positiveMessages[randomIndex];
  };

  // 随机选择一条算命预测
  const getRandomFortune = () => {
    const randomIndex = Math.floor(Math.random() * fortuneMessages.length);
    return fortuneMessages[randomIndex];
  };

  // 组件加载时显示第一条问候语
  useEffect(() => {
    setCurrentMessage(getRandomMessage());
  }, []);

  // 处理获取新问候语的函数
  const handleNewMessage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMessage(getRandomMessage());
      setClickCount(prevCount => prevCount + 1);
      setIsAnimating(false);
    }, 300);
  };

  // 处理算命函数
  const handleFortuneTelling = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const newFortune = getRandomFortune();
      setCurrentFortune(newFortune);
      setFortuneCount(prevCount => prevCount + 1);
      setIsAnimating(false);
    }, 500);
  };

  // 获取当前时间问候
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '深夜好';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '40px 30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* 头部 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#2d3436',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {activeTab === 'greeting' ? '🌞 心灵能量站 🌞' : '🔮 运势指南针 🔮'}
          </h1>
          
          <p style={{ 
            color: '#636e72',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '5px'
          }}>
            {getTimeGreeting()}！今天是 {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* 选项卡切换 */}
        <div style={{
          display: 'flex',
          background: '#f8f9fa',
          borderRadius: '50px',
          padding: '6px',
          marginBottom: '30px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setActiveTab('greeting')}
            style={{
              flex: 1,
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              background: activeTab === 'greeting' 
                ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                : 'transparent',
              color: activeTab === 'greeting' ? 'white' : '#636e72',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeTab === 'greeting' ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            💫 正能量语录
          </button>
          <button
            onClick={() => setActiveTab('fortune')}
            style={{
              flex: 1,
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              background: activeTab === 'fortune' 
                ? 'linear-gradient(135deg, #f093fb, #f5576c)' 
                : 'transparent',
              color: activeTab === 'fortune' ? 'white' : '#636e72',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeTab === 'fortune' ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            🔮 运势预测
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          minHeight: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          opacity: isAnimating ? 0.7 : 1,
          transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          {activeTab === 'greeting' ? (
            // 正能量语录区域
            <p style={{
              fontSize: '20px',
              color: '#2d3436',
              lineHeight: '1.6',
              margin: 0,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {currentMessage}
            </p>
          ) : (
            // 算命预测区域
            <div style={{ textAlign: 'center', width: '100%' }}>
              {currentFortune ? (
                <>
                  <div style={{
                    background: currentFortune.bgColor,
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '50px',
                    display: 'inline-block',
                    marginBottom: '20px',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                  }}>
                    <h2 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      margin: 0
                    }}>
                      {currentFortune.fortune}
                    </h2>
                  </div>
                  <p style={{
                    fontSize: '18px',
                    color: '#2d3436',
                    lineHeight: '1.6',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {currentFortune.message}
                  </p>
                </>
              ) : (
                <div style={{ color: '#b2bec3', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔮</div>
                  <p style={{ fontSize: '16px', margin: 0 }}>
                    点击下方按钮开启今日运势预测...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 按钮区域 */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          {activeTab === 'greeting' ? (
            <button 
              onClick={handleNewMessage}
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                transform: isAnimating ? 'scale(0.95)' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = isAnimating ? 'scale(0.95)' : 'scale(1)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
              }}
            >
              ✨ 换一句正能量
            </button>
          ) : (
            <button 
              onClick={handleFortuneTelling}
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(245, 87, 108, 0.3)',
                transform: isAnimating ? 'scale(0.95)' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 12px 25px rgba(245, 87, 108, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = isAnimating ? 'scale(0.95)' : 'scale(1)';
                e.target.style.boxShadow = '0 8px 20px rgba(245, 87, 108, 0.3)';
              }}
            >
              🔮 查看今日运势
            </button>
          )}
        </div>

        {/* 统计信息 */}
        <div style={{
          textAlign: 'center',
          color: '#b2bec3',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '30px'
        }}>
          {activeTab === 'greeting' 
            ? `今日已获取 ${clickCount} 条正能量语录`
            : `今日已进行 ${fortuneCount} 次运势预测`
          }
        </div>

        {/* 温馨提示 */}
        <div style={{
          background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#636e72',
            fontSize: '14px',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            {activeTab === 'greeting' 
              ? '💫 小贴士：每天给自己一些积极的心理暗示，会让生活更美好！'
              : '✨ 温馨提示：运势预测仅供娱乐，真正的运气来自你的努力和坚持！'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;