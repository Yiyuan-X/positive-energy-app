import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import fullQuestions from "../data/talentQuestions.json";
import "./TalentTest.css";

// ✅ 随机抽题
function getRandomQuestions(count = 10) {
  return fullQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
}

// ✅ 天赋类型说明
function getTalentDescription(type) {
  const descMap = {
    "创造力": `🌈 **创造力型**  
你是天生的灵感制造机...（以下省略相同内容）`,
    "逻辑力": `🧠 **逻辑分析型**  
你拥有冷静而精准的思维系统...`,
    "领导力": `🔥 **领导驱动型**  
你具备强大的号召力...`,
    "共情力": `💞 **共情治愈型**  
你情感丰富、感受力细腻...`,
    "多元融合型": `💫 **多元融合型天赋**  
你兼具理性、创造、情感与洞察...`,
  };
  return descMap[type] || descMap["多元融合型"];
}

export default function TalentTest({ onFinish }) {
  // ✅ 新增兑换码相关状态
  const [redeemCode, setRedeemCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  // ✅ 核验兑换码
  const handleVerify = async () => {
    if (!redeemCode.trim()) return setError("请输入兑换码");
    setChecking(true);
    setError("");

    const { data, error } = await supabase
      .from("redeem_codes")
      .select("id, used, type")
      .eq("code", redeemCode.trim())
      .maybeSingle();

    setChecking(false);

    if (error) return setError("服务器错误，请稍后再试");
    if (!data) return setError("兑换码无效");
    if (data.used) return setError("该兑换码已被使用");
    if (data.type && data.type !== "talent" && data.type !== "community_free")
      return setError("该兑换码不能用于此测试");

    // ✅ 验证成功后标记兑换码为已使用
    await supabase.from("redeem_codes").update({ used: true }).eq("code", redeemCode.trim());

    setIsVerified(true);
    alert("🎉 验证成功！已解锁天赋潜能测试。");
  };

  // ✅ 初始化题库（验证成功后再加载）
  useEffect(() => {
    if (!isVerified) return;
    const todayKey = new Date().toISOString().split("T")[0];
    const cacheKey = `talentTest_${todayKey}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setQuestions(JSON.parse(cached));
    } else {
      const selected = getRandomQuestions(10);
      setQuestions(selected);
      localStorage.setItem(cacheKey, JSON.stringify(selected));
    }
  }, [isVerified]);

  // ✅ 答题逻辑
  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(newScores);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      generateResult(newScores);
    }
  };

  // ✅ 生成结果并写入 Supabase
  const generateResult = async (finalScores) => {
    const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const topType = sorted[0]?.[0] || "多元融合型";
    const topScore = sorted[0]?.[1] ?? 0;
    const second = sorted[1]?.[0];
    const totalScore = Object.values(finalScores).reduce((a, b) => a + b, 0);

    let typeLabel = topType;
    if (second && topScore - finalScores[second] <= 1)
      typeLabel = `${topType} + ${second} 复合型`;

    const description = getTalentDescription(topType);
    const finalResult = { type: typeLabel, score: totalScore, description };
    setResult(finalResult);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      await supabase.from("talent_test_results").insert({
        user_email: user?.email || null,
        type: typeLabel,
        score: totalScore,
        description,
      });
    } catch (err) {
      console.error("⚠️ 数据写入失败", err);
    }
  };

  // ✅ Step 1: 输入兑换码界面
  if (!isVerified) {
    return (
      <div className="redeem-container">
        <h2>🌟 天赋潜能测试</h2>
        <p>请输入兑换码以解锁测试：</p>
        <input
          type="text"
          placeholder="输入兑换码"
          value={redeemCode}
          onChange={(e) => setRedeemCode(e.target.value)}
        />
        <button onClick={handleVerify} disabled={checking}>
          {checking ? "验证中..." : "立即解锁"}
        </button>
        {error && <p className="error-text">{error}</p>}
        <p className="hint">
          没有兑换码？<br />
          <a
            href="#"
            onClick={() =>
              alert("请前往能量社群注册或添加微信HSTS08 获取免费兑换码 🎁")
            }
          >
            加入能量社群免费领取 →
          </a>
        </p>
      </div>
    );
  }

  // ✅ Step 2: 显示结果
  if (result) {
    return (
      <div className="talent-result">
        <h2>🧬 关于你的天赋类型：{result.type}</h2>
        <p className="talent-desc">{result.description}</p>
        <p className="talent-score">🎯 测试得分：{result.score} / 10</p>
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

  // ✅ Step 3: 答题过程
  if (questions.length === 0) return <p>题目加载中...</p>;

  const q = questions[step];

  return (
    <div className="talent-test">
      <h2>🌟 超强天赋测试</h2>
      <p>{q.question}</p>
      <div className="options">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt.type)}>
            {opt.text}
          </button>
        ))}
      </div>
      <p>进度：{step + 1} / {questions.length}</p>
    </div>
  );
}
