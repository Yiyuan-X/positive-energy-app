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
你是天生的灵感制造机，能在日常中发现新奇与意义。你的想象力敏锐，思维跳跃，喜欢打破框架与规则，探索不同的可能性。  
你适合从事内容创作、艺术设计、创新营销、发明开发等需要灵感的领域。  
不过，你也可能在执行阶段分心或缺乏耐心。建议学会为灵感建立“结构”，设定阶段目标，将创意落地为成果。  
当你能平衡自由与聚焦，你的创造力将成为世界稀缺的灵魂资产。`,

    "逻辑力": `🧠 **逻辑分析型**  
你拥有冷静而精准的思维系统，是理性与效率的代言人。你擅长推理、分析与总结，能在混乱中建立秩序，快速识别问题本质。  
适合领域包括科技工程、编程、金融分析、战略规划等需要判断力的方向。  
需要注意的是，理性若缺乏柔软，会让关系变得疏离。建议你让“逻辑”与“感受”并行，学会聆听内心。  
当理智融入温度，你的智慧会更具力量与影响力。`,

    "领导力": `🔥 **领导驱动型**  
你具备强大的号召力与目标导向思维，善于带领他人、凝聚力量并实现目标。你擅长制定方向与激励团队，是天生的引领者。  
你在危机中仍能保持清晰，勇于决策与承担责任。  
但领导并非控制，而是让他人也能闪光。建议你多练习倾听，理解他人的节奏与情感。  
当你用信任代替命令，用愿景代替指令，你会成为让人心悦诚服的“赋能型领导者”。`,

    "共情力": `💞 **共情治愈型**  
你情感丰富、感受力细腻，能轻易察觉他人情绪，是天生的“心灵镜子”。  
你擅长支持、倾听与安抚他人，在心理、教育、艺术、辅导等领域会大放异彩。  
但要记得：共情不是牺牲。过度感受他人痛苦可能让你情绪耗竭。  
学会设定界限、照顾自己，是持续给予的前提。  
当你既柔软又稳固时，你的能量能治愈身边所有人。`,

    "多元融合型": `💫 **多元融合型天赋**  
你兼具理性、创造、情感与洞察，是复合型思维者。你不容易被单一角色定义，而擅长在跨界中找到独特价值。  
你可能同时拥有“逻辑力 + 创造力”或“共情力 + 领导力”等特质。  
你的学习与成长方式像螺旋上升，通过多维度体验逐渐整合成深层智慧。  
建议你持续探索，不急于定型，让多重天赋互相滋养。  
当你能整合它们服务于清晰目标，你将成为真正的“跨界创造者”。`,
  };

  return descMap[type] || descMap["多元融合型"];
}

export default function TalentTest({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  // ✅ 初始化题库（每日随机缓存）
  useEffect(() => {
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
  }, []);

  // ✅ 答题逻辑
  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(newScores);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      generateResult(newScores); // ✅ 确保使用最新分数
    }
  };

  // ✅ 生成结果（合并版）
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

    // ✅ 写入 Supabase 数据库
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

  // ✅ 渲染结果
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

  // ✅ 加载中提示
  if (questions.length === 0) return <p>题目加载中...</p>;

  // ✅ 当前题目
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
