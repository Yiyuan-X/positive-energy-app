export async function analyzePossessiveness(type, desc) {
  // 可替换为 OpenAI / Gemini / Supabase Edge Function
  const res = await fetch("https://api.example.com/relationship/insight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, desc })
  });
  if (!res.ok) throw new Error("API 请求失败");
  const data = await res.json();
  return data.advice || null;
}
