-- ============================================================
-- 📘 CXKTech / DailyGreeting / Love 系列系统
-- 文件名: 20251112_auto_sync_profiles.sql
-- 作用: 自动在用户注册后同步创建 profiles 记录（兼容 Free Plan）
-- ============================================================

-- 1️⃣ 确保 profiles 表存在（若已存在则跳过）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2️⃣ 更新时间触发器（若不存在）
create or replace function public.set_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_profiles_updated_at();

-- ============================================================
-- 3️⃣ 自动同步 profiles，当有新用户注册时（核心逻辑）
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 若 profiles 表中不存在此用户，则自动创建
  if not exists (select 1 from public.profiles where id = new.id) then
    insert into public.profiles (id, email, role)
    values (
      new.id,
      new.email,
      case
        when new.email like '%@yourdomain.com' then 'admin'
        else 'user'
      end
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- 删除旧触发器以防重复
drop trigger if exists on_auth_user_created on auth.users;

-- 绑定到 auth.users 插入事件
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- ✅ 完成日志
-- ============================================================
comment on function public.handle_new_user() is
'自动同步 profiles，当有新用户注册时在 profiles 表创建记录';
comment on function public.set_profiles_updated_at() is
'更新 profiles.updated_at 时间戳';
