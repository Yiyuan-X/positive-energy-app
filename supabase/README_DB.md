# 🧭 DailyGreeting / Love 系列系统 — Supabase 数据库设计说明

本文档用于快速理解本项目的数据库结构、外键关系、触发器、以及后续维护扩展方案。  
适用于开发者在执行 `supabase db push` / `supabase db diff` / `supabase functions deploy` 之前查阅。

---

## 🏗️ 核心设计概览

- **数据库类型**：PostgreSQL（托管于 Supabase）
- **主要功能模块**：
  1. 用户与身份系统（`auth.users` + `profiles`）
  2. 用户注册与社群收集（`contacts`）
  3. 恋爱测试兑换码系统（`love_access_codes`）
  4. 微信支付订单系统（`love_orders`）
  5. 自动同步触发器（`sync-profile` Edge Function）

---

## 🧩 表结构与说明

### 1️⃣ `profiles`
> 用户档案表 — 与 `auth.users` 一对一绑定  
> 用于存储用户基本资料与角色（普通用户 / 管理员）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `uuid` | 外键 → `auth.users.id` |
| `email` | `text` | 用户邮箱 |
| `role` | `text` | 用户角色（`user` / `admin`）|
| `created_at` | `timestamp` | 创建时间 |
| `updated_at` | `timestamp` | 更新时间 |

**触发器：**
- `trg_profiles_updated_at`：自动更新时间戳  
- `sync-profile` Edge Function 在用户注册后创建 profile

---

### 2️⃣ `contacts`
> 用户提交注册表单、留言、或接收能量语录的记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `uuid` | 主键 |
| `name` | `text` | 姓名 |
| `email` | `text` | 邮箱（唯一索引）|
| `message` | `text` | 留言内容（可选）|
| `created_at` | `timestamp` | 创建时间 |

**用途：**
- 注册功能中由 `RegisterForm.jsx` 插入；
- 后续可扩展邮件欢迎系统 / Resend 自动化。

---

### 3️⃣ `love_access_codes`
> 恋爱测试兑换码表 — 管理访问测试权限与价格策略。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `uuid` | 主键 |
| `code` | `text` | 兑换码（唯一索引）|
| `price` | `numeric(10,2)` | 原价（单位：元）|
| `discount_price` | `numeric(10,2)` | 优惠价（单位：元）|
| `is_used` | `boolean` | 是否已被使用 |
| `used_at` | `timestamp` | 使用时间 |
| `created_at` | `timestamp` | 创建时间 |

**逻辑：**
- 前端 `LovePossessivenessTestPro.jsx` 输入兑换码后验证；
- Supabase 更新 `is_used=true`；
- 兑换码由后台 `/LoveOrdersAdmin.jsx` 管理生成。

---

### 4️⃣ `love_orders`
> 微信支付订单表 — 用于记录支付行为，防止重复回调。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `uuid` | 主键 |
| `order_no` | `text` | 系统生成订单号（唯一）|
| `total_fee` | `integer` | 金额（单位分）|
| `status` | `text` | 状态：`pending` / `paid` / `failed` |
| `transaction_id` | `text` | 微信交易号 |
| `pay_time` | `timestamp` | 支付完成时间 |
| `created_at` | `timestamp` | 创建时间 |
| `access_code_id` | `uuid` | 外键 → `love_access_codes.id` |

**逻辑与保护：**
- 每笔订单只能关联一个兑换码；
- Webhook 回调后更新状态；
- 管理员后台 `/LoveOrdersAdmin.jsx` 可导出 CSV。

---

## 🧠 触发器与函数

| 名称 | 类型 | 功能说明 |
|------|------|----------|
| `sync-profile` | Edge Function | 在 `After Sign Up` 时创建 `profiles` 记录 |
| `trg_profiles_updated_at` | Trigger | 更新档案时刷新 `updated_at` |
| （计划）`notify_payment_success` | Edge Function | 监听 `love_orders` 状态变更，发送模板通知 |

---

## 🧱 当前迁移文件

| 文件名 | 功能摘要 |
|---------|----------|
| `20251112_auto_sync_profiles.sql` | profiles 自动同步触发器与函数声明 |
| `20251112_init_love_system.sql` | Love 系统完整初始化（contacts、codes、orders）|

---

## 🔐 权限与安全策略（RLS）

| 表名 | 策略 |
|------|------|
| `profiles` | 仅本人可读写（管理员可全读） |
| `contacts` | 可公开插入，管理员可读 |
| `love_access_codes` | 仅管理员可插入、查询、更新 |
| `love_orders` | 用户仅可读写自己的订单，管理员可全查 |

---

## 🛠️ 运维与同步命令

| 操作 | 命令 |
|------|------|
| 同步到云端 | `supabase db push` |
| 从云端拉取 | `supabase db pull` |
| 生成迁移文件 | `supabase db diff -f new_feature.sql` |
| 查看函数列表 | `supabase functions list` |
| 部署 Edge Function | `supabase functions deploy sync-profile` |

---

## 🚀 后续扩展建议

- [ ] 增加支付 Webhook 处理函数 `/supabase/functions/wechat-payment/index.ts`  
- [ ] 增加用户打卡统计表 `energy_checkins`  
- [ ] 引入 `email_logs` 表，用于追踪邮件发送状态  
- [ ] 管理端加上 “生成兑换码” / “查看测试统计” 操作页  

---

> ✨ **提示**：  
> 每次修改 SQL 后，务必使用：
> ```bash
> supabase db diff -f 20251113_update_*.sql
> supabase db push
> ```
> 确保远程与本地结构一致。
