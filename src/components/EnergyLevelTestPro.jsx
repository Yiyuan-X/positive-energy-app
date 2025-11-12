import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import allQuestions from "../data/energyQuestionsPro.json";
import "./LovePossessivenessTestPro.css"; // 复用样式

// ✅ 随机抽题
function getRandomQuestions(count = 10) {
  return allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
}

// ✅ 结果逻辑
function getResultByScore(score) {
  if (score <= 18)
    return {
      level: "⚫ 低能区（羞愧/恐惧）",
      desc:
        "你的能量频率处于较低区间，容易受外界情绪波动影响。此阶段常伴随自我怀疑、恐惧或压抑。建议从小事开始恢复掌控感：规律作息、记录感恩、减少抱怨。试着对自己温柔一点，让自我接纳替代评判。当你学会理解内心的恐惧而非逃避，它会逐渐转化为力量。你并不需要立刻变得正面，只需持续地“选择爱”。",
    };
  if (score <= 26)
    return {
      level: "🟠 觉察区（勇气/中立）",
      desc:
        "你已开始觉察自己的情绪与反应，说明内在觉醒正在进行。此阶段代表勇气与自省，你能逐渐从‘他人评判’转向‘自我理解’。建议每天留出片刻静心，觉察呼吸与当下；学会接纳不完美的自己。稳定的中性心态能让你在压力中保持清晰。你正处于突破的门槛，持续练习觉察与感恩，能让能量更轻盈。",
    };
  if (score <= 33)
    return {
      level: "💛 成长区（愿意/接纳）",
      desc:
        "你的能量处于积极成长状态，能看到挑战背后的意义，并愿意承担责任。你在学习如何让情绪成为力量，而不是阻力。建议多培养“正向创造”的习惯：设立目标、行动计划、持续反馈。你越能保持开放、善意、真实，就越容易吸引同频的人与机会。你的觉知正在扩展，生命正向你敞开。",
    };
  return {
    level: "💖 高能区（爱/喜悦/平和）",
    desc:
      "你散发着高频能量的特质，能以爱、理解与平和的态度看待一切。你的情绪稳定、同理心强，身边人也容易被你疗愈。建议保持心灵锚点，如冥想、感恩日记或帮助他人。别担心偶尔的低潮，它只是频率调整。你已经成为光的载体——当你让世界更温柔时，也让自己更完整。",
  };
}

export default function EnergyLevelTestPro({ onFinish }) {
  const [unlocked, setUnlocked] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0];
    const cacheKey = `energyTest_${todayKey}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) setQuestions(JSON.parse(cached));
    else {
      const selected = getRandomQuestions(10);
      setQuestions(selected);
      localStorage.setItem(cacheKey, JSON.stringify(selected));
    }
  }, []);

  const handleAnswer = (val) => {
    const newScore = score + val;
    if (step + 1 < questions.length) {
      setScore(newScore);
      setStep(step + 1);
    } else {
      finalize(newScore);
    }
  };

  const finalize = async (finalScore) => {
    const r = getResultByScore(finalScore);
    setResult({ ...r, score: finalScore });

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      await supabase.from("energy_test_results").insert({
        user_email: user?.email || null,
        score: finalScore,
        level: r.level,
        description: r.desc,
      });
    } catch (e) {
      console.warn("⚠️ Supabase 写入失败", e.message);
    }
  };

  if (result)
    return (
      <div className="love-result">
        <h2>{result.level}</h2>
        <p>{result.desc}</p>
        <p>🌞 总分：{result.score} / 40</p>
        <button
          onClick={() =>
            onFinish ? onFinish("home") : (window.location.href = "/")
          }
        >
          返回主页
        </button>
      </div>
    );

  if (!unlocked)
    return (
      <div className="love-lock">
        <h2>🌞 专业正能量测试（霍金斯版）</h2>
        <p>输入兑换码开始测试：</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setUnlocked(true);
          }}
        >
          <input
            type="text"
            placeholder="输入兑换码"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "验证中…" : "🔓 开始测试"}
          </button>
        </form>
        <p className="hint">还没有兑换码？请联系管理员购买 💌</p>
        <button
          className="back-btn"
          onClick={() => (onFinish ? onFinish("home") : (window.location.href = "/"))}
        >
          返回
        </button>
      </div>
    );

  if (questions.length === 0) return <p>题目加载中...</p>;

  const q = questions[step];

  return (
    <div className="love-test">
      <h2>🌞 专业正能量测试</h2>
      <p>{q.question}</p>
      <div className="options">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt.value)}>
            {opt.text}
          </button>
        ))}
      </div>
      <p>进度：{step + 1} / {questions.length}</p>
    </div>
  );
}
