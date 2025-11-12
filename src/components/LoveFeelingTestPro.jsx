import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import allQuestions from "../data/loveFeelingQuestionsPro.json";
import "./LovePossessivenessTestPro.css"; // 复用已有样式

// 随机抽题
function pickRandom(arr, n = 10) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// 结果文案（200 字左右）
function buildResultText(score) {
  // 10题、每题 1~4 分，总分 10~40
  if (score >= 32) {
    return {
      type: "❤️ 深度喜欢",
      desc:
        "他/她对你的关注、回应与身体语言都表现出明显的情感投入。从互动频率、眼神交流到情绪共鸣，都能看出对方已把你放在心里。TA不仅记得你的细节，还愿意为你付出时间与能量。这种状态下，对方很可能在观察你的态度与边界。若你也有好感，建议保持真诚与稳定的节奏，创造更多高质量的线下互动（如共同完成一件小事、深入聊各自的价值观）。切记不过度试探或情绪化推动，让连接在安全感中自然升温；当双方确认彼此的重视与投入，你们的关系将进入稳定发展的阶段。"
    };
  }
  if (score >= 24) {
    return {
      type: "💗 有好感",
      desc:
        "对方对你存在明确兴趣，但仍保持谨慎与观察。在部分情境中会靠近你、回应你，也会偶尔退回到安全距离。这通常与个人节奏、确定感与过往关系经验相关。建议此阶段以“低压力高质量”的互动为主：增加真实场景的共处（而非只聊消息）、逐步分享更立体的自己、用行动建立彼此的信任感。请避免高频确认与情绪拉扯，让对方在舒适区里感受到你的稳定、可靠与温柔。当信任累积到一定程度，关系会自然迈向更亲密的层次。"
    };
  }
  if (score >= 16) {
    return {
      type: "💛 一般关系",
      desc:
        "目前更多停留在友好与日常互动层面，尚未出现持续、明确的情感投入信号。对方愿意沟通与配合，但主动性、深度与稳定性不足。若你希望推进关系，建议先评估两点：一是你们是否拥有足够的共同时间与经历；二是对方是否具备进一步靠近的意愿与空间。可尝试创造“轻松但不浅薄”的互动场景（小型线下活动、协作完成简单任务），并在过程中展示自己真实的兴趣与边界。如果对方在这些情境中仍缺乏投入，那就理性看待，将注意力放回自我成长。"
    };
  }
  return {
    type: "💔 暂无特别感觉",
    desc:
      "从当前信号看，对方的互动多为礼貌或社交惯性，情感投入与主动靠近较少。请不要过度自我否定，喜欢并非努力的线性结果，而是由时机、匹配度与个人阶段共同决定。与其围着对方转，不如先把重心放回自己：提升生活质感、夯实边界感、拓展社交半径。当你更自信与从容，真正适合的人会被你自然吸引。若仍想确认现实反馈，可在减少主动的同时观察对方是否会感知并补位；若没有，体面抽离也是成熟的选择。"
  };
}

export default function LoveFeelingTestPro({ onFinish }) {
  // 兑换与题目
  const [unlocked, setUnlocked] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [priceInfo, setPriceInfo] = useState({ price: 9.9, discount: 4.9 });

  // 作答
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  // 结果 & 状态
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 当天缓存题目（避免刷新换题）
  useEffect(() => {
    const dayKey = new Date().toISOString().split("T")[0];
    const cacheKey = `loveFeeling_${dayKey}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setQuestions(JSON.parse(cached));
    } else {
      const selected = pickRandom(allQuestions, 10);
      setQuestions(selected);
      localStorage.setItem(cacheKey, JSON.stringify(selected));
      // 清理旧缓存
      Object.keys(localStorage)
        .filter((k) => k.startsWith("loveFeeling_") && k !== cacheKey)
        .forEach((k) => localStorage.removeItem(k));
    }
  }, []);

  // 兑换码验证
  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const codeStr = enteredCode.trim().toUpperCase();
      const { data: code, error } = await supabase
        .from("love_feeling_access_codes")
        .select("*")
        .eq("code", codeStr)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!code) {
        alert("❌ 兑换码无效或不存在");
        return;
      }
      if (code.is_used) {
        alert("⚠️ 此兑换码已被使用，请更换");
        return;
      }

      setPriceInfo({ price: code.price, discount: code.discount_price });
      setUnlocked(true);

      // 标记已使用
      const { error: uErr } = await supabase
        .from("love_feeling_access_codes")
        .update({ is_used: true, used_at: new Date() })
        .eq("code", code.code);
      if (uErr) console.warn("更新兑换码状态失败：", uErr.message);
    } catch (err) {
      console.error("兑换码验证失败：", err);
      alert("数据库异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 作答
  const handleAnswer = (val) => {
    const newScore = score + Number(val || 0);
    setScore(newScore);
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
    } else {
      finalize(newScore);
    }
  };

  // 出结果 + 写库
  const finalize = async (finalScore) => {
    const r = buildResultText(finalScore);
    setResult({ ...r, score: finalScore });

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      await supabase.from("love_feeling_results").insert({
        user_email: user?.email || null,
        score: finalScore,
        type: r.type,
        description: r.desc
      });
    } catch (e) {
      console.warn("结果写入失败（不影响展示）：", e.message);
    }
  };

  // ====== UI ======
  // 未解锁
  if (!unlocked) {
    return (
      <div className="love-lock">
        <h2>💞 他/她喜欢你吗？（专业版）</h2>
        <p>请输入兑换码解锁测试（随机 10 题）：</p>
        <form onSubmit={handleUnlock} className="unlock-form">
          <input
            type="text"
            placeholder="输入兑换码"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "验证中…" : "🔓 解锁测试"}
          </button>
        </form>
        <div className="price-info">
          原价：¥{priceInfo.price}　限时优惠：<b>¥{priceInfo.discount}</b>
        </div>
        <p className="hint">还没有兑换码？请联系管理员购买 💌</p>
        <button
          className="back-btn"
          onClick={() => (onFinish ? onFinish("home") : (window.location.href = "/"))}
        >
          返回
        </button>
      </div>
    );
  }

  // 结果
  if (result) {
    return (
      <div className="love-result">
        <h2>{result.type}</h2>
        <p className="desc">{result.desc}</p>
        <p className="score-line">本次得分：{result.score} / 40</p>
        <button
          onClick={() => (onFinish ? onFinish("home") : (window.location.href = "/"))}
        >
          返回主页
        </button>
      </div>
    );
  }

  // 题目进行中
  if (!questions || questions.length === 0) {
    return <p style={{ textAlign: "center" }}>题目加载中…</p>;
  }
  const q = questions[step];

  return (
    <div className="love-test">
      <h2>💞 他/她喜欢你吗？测试</h2>
      <p className="progress">进度：{step + 1} / {questions.length}</p>
      <p className="question">{q.question}</p>
      <div className="options">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt.value)}>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
