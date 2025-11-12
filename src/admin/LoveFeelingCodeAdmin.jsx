import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./LoveCodeAdmin.css"; // ✅ 可复用同样样式

export default function LoveFeelingCodeAdmin() {
  const [codes, setCodes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [newCount, setNewCount] = useState(10);
  const [message, setMessage] = useState("");

  async function loadCodes() {
    try {
      setLoading(true);
      let query = supabase
        .from("love_feeling_access_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter === "unused") query = query.eq("is_used", false);
      if (filter === "used") query = query.eq("is_used", true);

      const { data, error } = await query;

      if (error) {
        console.error("❌ Supabase 查询失败:", error.message);
        setMessage("⚠️ 权限不足或加载失败：" + error.message);
        setCodes([]);
      } else {
        setCodes(data || []);
      }
    } catch (err) {
      console.error("💥 异常:", err);
      setMessage("💥 加载出错：" + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCodes();
  }, [filter]);

  async function generateCodes() {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-love-feeling-codes", {
        body: JSON.stringify({ count: newCount }),
      });

      if (error) {
        console.error("❌ 生成失败:", error.message);
        setMessage("❌ 生成失败：" + error.message);
      } else {
        setMessage(`✅ 已生成 ${newCount} 个喜欢测试兑换码`);
        await loadCodes();
      }
    } catch (err) {
      console.error("💥 调用函数失败:", err);
      setMessage("💥 网络或函数错误：" + err.message);
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const csv = [
      ["code", "price", "discount_price", "is_used", "used_at"].join(","),
      ...codes.map((c) =>
        [c.code, c.price, c.discount_price, c.is_used, c.used_at || ""].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "love_feeling_access_codes.csv";
    link.click();
  }

  return (
    <div className="love-admin">
      <h2>💞 喜欢测试兑换码管理</h2>

      <div className="actions">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">全部</option>
          <option value="unused">未使用</option>
          <option value="used">已使用</option>
        </select>

        <input
          type="number"
          min="1"
          max="100"
          value={newCount}
          onChange={(e) => setNewCount(Number(e.target.value))}
        />
        <button onClick={generateCodes} disabled={loading}>
          ⚡ 生成兑换码
        </button>
        <button onClick={exportCSV}>📤 导出 CSV</button>
      </div>

      {message && <p className="message">{message}</p>}
      {loading && <p>加载中...</p>}

      {!loading && codes.length > 0 && (
        <table className="code-table">
          <thead>
            <tr>
              <th>兑换码</th>
              <th>原价</th>
              <th>优惠价</th>
              <th>状态</th>
              <th>使用时间</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.code} className={c.is_used ? "used" : "unused"}>
                <td>{c.code}</td>
                <td>{c.price}</td>
                <td>{c.discount_price}</td>
                <td>{c.is_used ? "✅ 已用" : "🕓 未用"}</td>
                <td>{c.used_at ? new Date(c.used_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
