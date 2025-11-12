总览

本数据库服务于 DailyGreeting / Love 系列前端系统，涵盖：

用户认证与角色（profiles）

注册潜在客户（contacts）

兑换码管理（love_access_codes）

支付订单（love_orders）

测试结果（love_test_results）

数据库遵循 高内聚、可追溯、安全（RLS） 原则。

🧍‍♂️ 1. profiles — 用户档案表
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);


说明：

自动同步 auth.users 表的注册用户信息。

role 用于区分管理员与普通用户。

索引：

create index if not exists idx_profiles_email on public.profiles (email);


安全策略 (RLS)：

alter table public.profiles enable row level security;

create policy "用户可查看自己的资料" on public.profiles
  for select using (auth.uid() = id);

create policy "管理员可读取全部资料" on public.profiles
  for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

💌 2. contacts — 注册表单收集
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  message text,
  created_at timestamptz default now()
);


说明：

来自前端 RegisterForm.jsx。

存储访客填写的邮箱与留言。

索引：

create index if not exists idx_contacts_email on public.contacts (email);

🎟️ 3. love_access_codes — 兑换码表
create table if not exists public.love_access_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  price numeric(10,2) not null default 10.00,
  discount_price numeric(10,2) not null default 0.99,
  is_used boolean default false,
  used_at timestamptz,
  created_at timestamptz default now()
);


说明：

每个兑换码只能使用一次。

对应恋爱测试或其他付费内容。

索引：

create index if not exists idx_love_codes_code on public.love_access_codes (code);
create index if not exists idx_love_codes_used on public.love_access_codes (is_used);


触发器（选项）：

若需自动更新使用时间：

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

💳 4. love_orders — 支付订单表
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


说明：

微信支付成功回调后更新 status 与 pay_time。

若支付成功则绑定一个兑换码（code_id）。

索引：

create index if not exists idx_love_orders_status on public.love_orders (status);
create index if not exists idx_love_orders_created on public.love_orders (created_at desc);


触发器（选项）：

自动分配未使用兑换码：

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

💞 5. love_test_results — 测试结果表
create table if not exists public.love_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  test_type text not null,  -- e.g. 'love_possessiveness', 'talent'
  score integer not null,
  result_type text,
  advice text,
  created_at timestamptz default now()
);


说明：

存储测试得分与结果分析，方便用户回看历史记录或个性化推荐。

索引：

create index if not exists idx_love_test_user on public.love_test_results (user_id);
create index if not exists idx_love_test_type on public.love_test_results (test_type);

🔒 安全与权限策略（RLS）
-- 启用 RLS
alter table public.love_orders enable row level security;
alter table public.love_access_codes enable row level security;
alter table public.love_test_results enable row level security;

-- 管理员访问策略
create policy "admin_full_access_orders"
  on public.love_orders
  for all
  using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin_full_access_codes"
  on public.love_access_codes
  for all
  using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

🔍 查询示例
查看今日订单收入
select
  date_trunc('day', pay_time) as date,
  sum(total_fee) / 100 as revenue
from public.love_orders
where status = 'paid'
group by 1
order by 1 desc;

导出已使用兑换码
select code, used_at
from public.love_access_codes
where is_used = true
order by used_at desc;

查询用户测试历史
select test_type, score, result_type, created_at
from public.love_test_results
where user_id = '<<user_uuid>>'
order by created_at desc;

🧾 数据初始化脚本（可选）
insert into public.love_access_codes (code, price, discount_price)
values
  ('LOVE001', 10.00, 0.99),
  ('LOVE002', 10.00, 0.99),
  ('LOVE003', 10.00, 0.99);

insert into public.profiles (id, email, role)
values
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'admin');

🧠 后续扩展建议

增加 love_tests 表：用于定义不同测试类型与题库元数据。

建立 view_love_orders_summary 视图：聚合每日支付情况。

可将支付回调改为 Supabase Edge Function（签名验证 + 状态更新）。

可引入 resend_logs 表记录邮件发送状态。