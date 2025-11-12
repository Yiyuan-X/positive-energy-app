import { useState, useEffect } from "react";
import fullQuestions from "../data/lovePossessivenessQuestionsPro.json";
import { supabase } from "../lib/supabaseClient";
import "./LovePossessivenessTestPro.css";

// ✅ 随机抽题函数
function getRandomQuestions(count = 10) {
  return fullQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function LovePossessivenessTestPro({ onFinish }) {
  // 🎯 状态管理
  const [questions, setQuestions] = useState([]);
  const [enteredCode, setEnteredCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceInfo, setPriceInfo] = useState({ price: 10, discount: 0.99 });

  // ✅ 自动缓存当天的随机题目
  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0]; // e.g. 2025-11-12
    const cacheKey = `loveTest_${todayKey}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setQuestions(JSON.parse(cached));
    } else {
      const selected = getRandomQuestions(10);
      setQuestions(selected);
      localStorage.setItem(cacheKey, JSON.stringify(selected));
      Object.keys(localStorage)
        .filter((k) => k.startsWith("loveTest_") && k !== cacheKey)
        .forEach((oldKey) => localStorage.removeItem(oldKey));
    }
  }, []);

  // 🧾 验证兑换码
  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: code, error } = await supabase
      .from("love_access_codes")
      .select("*")
      .eq("code", enteredCode.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      alert("数据库错误：" + error.message);
      setLoading(false);
      return;
    }

    if (!code) {
      alert("❌ 兑换码无效，请重试。");
      setLoading(false);
      return;
    }

    if (code.is_used) {
      alert("⚠️ 此兑换码已被使用，请购买新码。");
      setLoading(false);
      return;
    }

    setPriceInfo({
      price: code.price,
      discount: code.discount_price,
    });
    setUnlocked(true);
    setLoading(false);

    // ✅ 更新兑换码状态为已使用
    await supabase
      .from("love_access_codes")
      .update({ is_used: true, used_at: new Date() })
      .eq("code", code.code);
  };

  // 🧩 答题逻辑
  const handleAnswer = (value) => {
    setScore((prev) => prev + value);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      generateResult(score + value);
    }
  };

  // 💞 生成结果
  const generateResult = (finalScore) => {
    let type = "", desc = "", advice = "";

    if (finalScore <= 12) {
      type = "🍃 安全依恋（低占有欲）";
      desc = "你在关系中能保持信任与独立。";
      advice = "继续培养自信与沟通，爱要自由又温暖。";
    } else if (finalScore <= 20) {
      type = "🌸 焦虑依恋（适中占有欲）";
      desc = "你渴望被关注，也容易感到不安。";
      advice = "表达情绪，而非压抑；安全感来自内在。";
    } else if (finalScore <= 27) {
      type = "🔥 回避依恋（强占有欲）";
      desc = "你怕被伤害，因此更容易控制与防御。";
      advice = "尝试接纳脆弱，放下防备让爱流动。";
    } else {
      type = "💘 混乱依恋（超强占有欲）";
      desc = "你的爱炽热、深沉，但也容易失去自我。";
      advice = "学会爱自己，再去爱别人。你值得被温柔对待。";
    }

    setResult({ type, desc, advice });
  };

  // 🔒 未解锁界面
  if (!unlocked) {
    return (
      <div className="love-lock">
        <h2>💘 恋爱占有欲测试（专业版）</h2>
        <p>输入兑换码即可开始测试：</p>
        <form onSubmit={handleUnlock}>
          <input
            type="text"
            placeholder="请输入兑换码"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "验证中..." : "🔓 解锁测试"}
          </button>
        </form>
        <div className="price-info">
          原价：¥{priceInfo.price}　限时优惠：<b>¥{priceInfo.discount}</b>
        </div>
        <p className="hint">还没有兑换码？请联系管理员购买 💌</p>
        <button onClick={onFinish} className="back-btn">返回</button>
      </div>
    );
  }

  // 🧠 测试完成界面
  if (result) {
    return (
      <div className="love-result">
        <h2>{result.type}</h2>
        <p>{result.desc}</p>
        <pre>{result.advice}</pre>
        <button onClick={onFinish}>返回主页</button>
      </div>
    );
  }

  // 🧩 答题中
  if (questions.length === 0) return <p>题目加载中...</p>;

  const q = questions[step];

  return (
    <div className="love-test">
      <h2>💘 恋爱占有欲测试</h2>
      <p>{q.question}</p>
      <div className="options">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt.value)}>
            {opt.text}
          </button>
        ))}
      </div>
      <p>进度：{step + 1}/{questions.length}</p>
    </div>
  );
}
