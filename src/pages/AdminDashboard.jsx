import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "../lib/supabaseClient";
import LoveFeelingCodeAdmin from "../admin/LoveFeelingCodeAdmin"; // 💞 新增喜欢测试兑换码管理页

// 原有模块延迟加载
const LoveCodeAdmin = lazy(() => import("../admin/LoveCodeAdmin"));
const LoveOrdersAdmin = lazy(() => import("../admin/LoveOrdersAdmin"));

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("codes");

  // ✅ 检查登录与管理员权限
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        alert("请先登录");
        window.location.href = "/";
        return;
      }

      // 查询用户角色
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (error) {
        console.error("❌ 获取用户角色失败：", error.message);
      }

      if (profile?.role !== "admin") {
        alert("❌ 您没有访问后台的权限");
        window.location.href = "/";
        return;
      }

      setUser(data.user);
    })();
  }, []);

  if (!user) return <p style={{ textAlign: "center" }}>正在验证权限...</p>;

  // ✅ 页面主体
  return (
    <div className="admin-dashboard">
      <h2>💼 管理后台</h2>

      {/* -----------------------------
      🧭 后台导航标签
      ------------------------------ */}
      <div className="tabs">
        <button
          className={tab === "codes" ? "active" : ""}
          onClick={() => setTab("codes")}
        >
          🎁 占有欲测试兑换码
        </button>

        <button
          className={tab === "loveFeelingCodes" ? "active" : ""}
          onClick={() => setTab("loveFeelingCodes")}
        >
          💞 喜欢测试兑换码
        </button>

        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          📦 订单管理
        </button>
      </div>

      {/* -----------------------------
      🧩 内容区（懒加载组件）
      ------------------------------ */}
      <Suspense fallback={<p style={{ textAlign: "center" }}>加载中...</p>}>
        {tab === "codes" && <LoveCodeAdmin />}
        {tab === "loveFeelingCodes" && <LoveFeelingCodeAdmin />}
        {tab === "orders" && <LoveOrdersAdmin />}
      </Suspense>
    </div>
  );
}
