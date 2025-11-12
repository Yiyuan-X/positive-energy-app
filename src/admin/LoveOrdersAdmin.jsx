import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useSupabaseAuth from "../hooks/useSupabaseAuth";
import Login from "../pages/Login";
import "./LoveOrdersAdmin.css";

export default function LoveOrdersAdmin() {
  const { user, profile, loading, signOut } = useSupabaseAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // ✅ 仅管理员可访问
  if (loading) return <p style={{ textAlign: "center" }}>加载中...</p>;
  if (!user) return <Login />;
  if (profile?.role !== "admin") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🚫 无权访问</h2>
        <p>请使用管理员账号登录。</p>
        <button
          style={{
            marginTop: "20px",
            background: "#f6d365",
            border: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={signOut}
        >
          退出登录
        </button>
      </div>
    );
  }

  // ✅ 载入订单列表
  async function loadOrders() {
    setLoadingOrders(true);
    let query = supabase
      .from("love_orders")
      .select(
        `
        id,
        order_no,
        total_fee,
        status,
        pay_time,
        transaction_id,
        created_at,
        love_access_codes(code)
      `
      )
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);
    const { data, error } = await query;

    if (error) setMessage("❌ 加载失败：" + error.message);
    else setOrders(data || []);
    setLoadingOrders(false);
  }

  useEffect(() => {
    loadOrders();
  }, [filter]);

  // ✅ 搜索订单号
  const filtered = orders.filter((o) =>
    o.order_no.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ 导出 CSV
  const exportCSV = () => {
    const header = ["订单号", "金额(元)", "状态", "交易号", "兑换码", "支付时间"];
    const rows = filtered.map((o) => [
      o.order_no,
      (o.total_fee / 100).toFixed(2),
      o.status,
      o.transaction_id || "-",
      o.love_access_codes?.code || "-",
      o.pay_time ? new Date(o.pay_time).toLocaleString() : "-",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `love_orders_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // ✅ 后台主体
  return (
    <div className="love-orders-admin">
      <div className="admin-header">
        <h2>💳 支付订单管理后台</h2>
        <div className="admin-info">
          <span>管理员：{profile?.full_name || profile?.email}</span>
          <button onClick={signOut} className="logout-btn">退出登录</button>
        </div>
      </div>

      <div className="top-bar">
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">全部订单</option>
            <option value="pending">待支付</option>
            <option value="paid">已支付</option>
            <option value="failed">支付失败</option>
          </select>
          <input
            type="text"
            placeholder="🔍 搜索订单号"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="export-btn" onClick={exportCSV}>
          📤 导出 CSV
        </button>
      </div>

      {message && <p className="message">{message}</p>}
      {loadingOrders ? (
        <p>加载中...</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>金额</th>
              <th>状态</th>
              <th>交易号</th>
              <th>兑换码</th>
              <th>支付时间</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className={o.status}>
                <td>{o.order_no}</td>
                <td>¥{(o.total_fee / 100).toFixed(2)}</td>
                <td>
                  {o.status === "paid"
                    ? "✅ 已支付"
                    : o.status === "pending"
                    ? "⏳ 待支付"
                    : "❌ 失败"}
                </td>
                <td>{o.transaction_id || "-"}</td>
                <td>{o.love_access_codes?.code || "-"}</td>
                <td>{o.pay_time ? new Date(o.pay_time).toLocaleString() : "-"}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
