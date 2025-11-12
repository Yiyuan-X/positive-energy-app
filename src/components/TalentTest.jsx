import { useState } from "react";
import questions from "../data/talentQuestions.json";
import "./TalentTest.css";

export default function TalentTest({ onFinish }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (type) => {
    setScores((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      generateResult();
    }
  };

  const generateResult = () => {
    const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const summaries = {
      "创造力": "🌈 你是天生的灵感制造机！创意无穷、点子无限。",
      "逻辑力": "🧠 你的大脑像精密计算机，善于分析与策略。",
      "领导力": "🔥 你天生具备号召力，是鼓舞他人的引导者。",
      "共情力": "💞 你能理解他人的感受，是治愈系的温暖存在。"
    };
    const resultText = summaries[topType] || "✨ 你拥有多方面的天赋，等待进一步开发！";
    setResult({ type: topType, description: resultText });
    localStorage.setItem("talentResult", JSON.stringify({ type: topType, date: new Date() }));
  };

  if (result) {
    return (
      <div className="talent-result">
        <h2>🧬 你的天赋类型：{result.type}</h2>
        <p>{result.description}</p>
        <button onClick={onFinish}>返回主页</button>
      </div>
    );
  }

  return (
    <div className="talent-test">
      <h2>🌟 超强天赋测试</h2>
      <p>{questions[step].question}</p>
      <div className="options">
        {questions[step].options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt.type)}>
            {opt.text}
          </button>
        ))}
      </div>
      <p>进度：{step + 1} / {questions.length}</p>
    </div>
  );
}
