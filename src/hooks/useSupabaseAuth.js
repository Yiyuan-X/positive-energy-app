import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * ✅ 全局通用 Hook：Supabase 登录 / 角色 / 登出 管理
 *
 * 用法：
 * const { user, profile, loading, signOut } = useSupabaseAuth();
 *
 * 可在任意页面判断：
 *   if (profile?.role === 'admin') { ... }
 */
export default function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 加载当前 Session
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);

      if (sessionUser) {
        await loadProfile(sessionUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    init();

    // 监听登录状态变化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) loadProfile(currentUser.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 从 profiles 表加载角色等信息
  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, full_name, role, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    } else {
      console.warn("⚠️ 无法加载用户资料：", error?.message);
    }
  }

  // 登出函数
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return { user, profile, loading, signOut };
}
