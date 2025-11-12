-- ============================================================
-- 📘 DailyGreeting / Love 系列系统 - 初始化建表脚本
-- 作者: ChatGPT (GPT-5)
-- 日期: 2025-11-12
-- ============================================================

-- 扩展：随机 UUID 支持
create extension if not exists "pgcrypto";

-- ============================================================
-- 1️⃣ 用户档案表 profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

create index if not exists idx_profiles_email on public.profiles (email);

alter table public.profiles enable row level security;

create policy "用户可查看自己的资料"
  on public.profiles
  for select using (auth.uid() = id);

create policy "管理员可读取全部资料"
  on public.profiles
  for all
  using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============================================================
-- 2️⃣ 注册潜客表 contacts
-- ============================================================
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  message text,
  created_at timestamptz default now()
);

create index if not exists idx_contacts_email on public.contacts (email);

-- ============================================================
-- 3️⃣ 兑换码表 love_access_codes
-- ============================================================
create table if not exists public.love_access_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  price numeric(10,2) not null default 10.00,
  discount_price numeric(10,2) not null default 0.99,
  is_used boolean default false,
  used_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_love_codes_code on public.love_access_codes (code);
create index if not exists idx_love_codes_used on public.love_access_codes (is_used);

-- 自动设置使用时间
create or replace function set_used_at() returns trigger as $$
begin
  if new.is_used = true and old.is_used = false then
    new.used_at := now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_used_at
before update on public.love_access_codes
for each row
execute function set_used_at();

-- ============================================================
-- 4️⃣ 订单表 love_orders
-- ============================================================
create table if not exists public.love_orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  total_fee integer not null,  -- 单位: 分
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  transaction_id text,
  pay_time timestamptz,
  code_id uuid references public.love_access_codes (id),
  created_at timestamptz default now()
);

create index if not exists idx_love_orders_status on public.love_orders (status);
create index if not exists idx_love_orders_created on public.love_orders (created_at desc);

-- 支付成功后自动分配兑换码
create or replace function assign_code_on_paid() returns trigger as $$
declare
  available_code uuid;
begin
  if new.status = 'paid' and new.code_id is null then
    select id into available_code
    from public.love_access_codes
    where is_used = false
    order by created_at asc
    limit 1;

    if available_code is not null then
      update public.love_access_codes
      set is_used = true, used_at = now()
      where id = available_code;
      new.code_id := available_code;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_assign_code_on_paid
after update on public.love_orders
for each row
when (new.status = 'paid')
execute function assign_code_on_paid();

-- ============================================================
-- 5️⃣ 测试结果表 love_test_results
-- ============================================================
create table if not exists public.love_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  test_type text not null,  -- e.g. 'love_possessiveness', 'talent'
  score integer not null,
  result_type text,
  advice text,
  created_at timestamptz default now()
);

create index if not exists idx_love_test_user on public.love_test_results (user_id);
create index if not exists idx_love_test_type on public.love_test_results (test_type);

-- ============================================================
-- 🔒 启用安全访问控制
-- ============================================================
alter table public.love_orders enable row level security;
alter table public.love_access_codes enable row level security;
alter table public.love_test_results enable row level security;

create policy "admin_full_access_orders"
  on public.love_orders
  for all
  using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin_full_access_codes"
  on public.love_access_codes
  for all
  using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============================================================
-- 🧾 初始数据 (可选)
-- ============================================================
insert into public.profiles (id, email, role)
values
  ('00000000-0000-0000-0000-000000000001', 'melodyxu@163.com', 'admin')
on conflict do nothing;

insert into public.love_access_codes (code, price, discount_price)
values
  ('LOVE001', 10.00, 0.99),
  ('LOVE002', 10.00, 0.99),
  ('LOVE003', 10.00, 0.99)
on conflict do nothing;

-- ============================================================
-- ✅ 完成
-- ============================================================
