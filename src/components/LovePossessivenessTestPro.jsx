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
    const todayKey = new Date().toISOString().split("T")[0];
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

  // 💞 生成结果（已扩充为200字详细解读）
  const generateResult = (finalScore) => {
    let type = "",
      desc = "",
      advice = "";

    if (finalScore <= 12) {
      type = "🍃 安全依恋（低占有欲）";
      desc =
        "你在感情中能保持信任与独立，说明你拥有良好的安全感与自我价值。你懂得在爱中尊重彼此空间，也愿意真诚表达需求。你相信亲密不是占有，而是自由中的连接。继续保持沟通与自信，不因顺利的关系而忽略经营。定期分享情绪、表达感激，将让你们的关系更深更稳。";
      advice = "继续培养自信与沟通，让爱在自由中流动。";
    } else if (finalScore <= 20) {
      type = "🌸 焦虑依恋（中度占有欲）";
      desc =
        "你渴望被关注和回应，对伴侣的情绪变化很敏感。当对方冷淡或迟回复时，你容易陷入不安。这说明你在意情感连接，但也可能过度担心失去。建议你学会分辨真实的情绪与假想的恐惧，多建立内在安全感。当你学会独立感受快乐时，爱将更轻盈、更有力量。";
      advice = "信任自己，也信任关系的韧性。";
    } else if (finalScore <= 27) {
      type = "🔥 回避依恋（高占有欲）";
      desc =
        "你表面独立理性，但内心害怕失控或被伤害，所以会下意识拉开距离。你可能以控制或冷静的方式保护自己。建议你逐步练习表达真实感受，允许他人靠近。亲密并不意味着失去自由，而是让两人都更完整。试着接纳脆弱，它是连接的起点。";
      advice = "尝试放下防备，让温柔进入你的生活。";
    } else {
      type = "💘 混乱依恋（超高占有欲）";
      desc =
        "你在关系中常陷入拉扯：渴望靠近又害怕受伤。爱对你来说既是救赎也是考验。你可能经历过忽冷忽热的情感体验，使你在依赖与退缩间徘徊。建议你先从自我疗愈开始，理解恐惧背后的需求，建立内在安全。只有当你能温柔地爱自己，才能稳稳地去爱别人。";
      advice = "先疗愈自己，再去温柔地靠近他人。";
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
        <button onClick={onFinish} className="back-btn">
          返回
        </button>
      </div>
    );
  }

  // 🧠 测试完成界面
  if (result) {
    return (
      <div className="love-result">
        <h2>{result.type}</h2>
        <p className="desc">{result.desc}</p>
        <pre className="advice">{result.advice}</pre>
        <button
          onClick={() =>
            onFinish ? onFinish("home") : (window.location.href = "/")
          }
        >
          返回主页
        </button>
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
