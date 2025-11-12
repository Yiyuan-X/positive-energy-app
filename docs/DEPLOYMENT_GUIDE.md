项目简介

本项目基于 React + Supabase + pnpm + Vercel，
包含以下模块：

💝 DailyGreeting / Love 系列系统

登录注册（Supabase Auth）

后台管理（兑换码 / 订单）

微信 H5 支付接口

积极语录与天赋测试模块

⚙️ 技术栈

React + Create React App

Supabase (Postgres + Auth + Edge Functions)

TailwindCSS + Shadcn UI

pnpm 包管理

Vercel 前端部署

📦 一、项目目录结构
DailyGreeting/
├── src/
│   ├── App.js                    # 主应用逻辑
│   ├── admin/                    # 管理后台模块
│   │   ├── LoveCodeAdmin.jsx
│   │   └── LoveOrdersAdmin.jsx
│   ├── components/               # 公共组件
│   │   ├── SiteHeader.jsx
│   │   ├── Footer.jsx
│   │   ├── RegisterForm.jsx
│   │   └── TalentTest.jsx
│   ├── data/                     # 静态数据文件
│   │   ├── positiveMessages.json
│   │   ├── fortuneMessages.json
│   │   └── specialMessages.json
│   ├── styles/                   # 样式文件
│   └── utils/                    # 工具方法
├── supabase/
│   ├── migrations/               # 数据库迁移 SQL
│   ├── functions/                # Edge Functions (如 sync-profile)
│   └── README_DB.md              # 数据库结构说明
├── public/
│   └── index.html
├── package.json
├── pnpm-lock.yaml
├── vercel.json                   # 部署配置
└── README.md

⚙️ 二、环境变量设置

在项目根目录创建 .env.local：

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...

# 微信支付（示例）
WECHAT_MCH_ID=xxxxx
WECHAT_API_KEY=xxxxx
WECHAT_NOTIFY_URL=https://yourdomain.com/api/wechat/notify

# 邮件通知（可选）
RESEND_API_KEY=re_xxxxxxxxxx


在 Vercel 仪表盘中：

⚙️ → Settings → Environment Variables
同样添加以上变量（scope: Production + Preview）

🧱 三、vercel.json（推荐版本）

确保 vercel.json 内容如下 👇：

{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "framework": "create-react-app",
  "buildCommand": "pnpm run build",
  "outputDirectory": "build",
  "cleanUrls": true,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}


✅ 不要再使用旧的 "builds" 字段，否则会触发
“packages field missing or empty” 错误。

🧰 四、本地开发命令
# 1️⃣ 安装依赖
pnpm install

# 2️⃣ 启动开发环境
pnpm start

# 3️⃣ 本地构建测试
pnpm run build

# 4️⃣ 推送到 GitHub
git add .
git commit -m "feat: update system"
git push origin main

☁️ 五、部署到 Vercel
方案 A（推荐）：本地构建后部署
pnpm run build
vercel --prebuilt --prod


✅ 跳过云端构建
✅ 使用本地 build/ 文件夹
✅ 避免 “builder dependencies install failed” 报错

方案 B：自动构建（从 GitHub）

打开 Vercel Dashboard

“Import Project” → 选择 Yiyuan-X/positive-energy-app

在 “Build Command” 填入：

pnpm run build


在 “Output Directory” 填入：

build


添加环境变量后 “Deploy”。

🪄 六、常见问题速查表
问题	解决方案
❌ “Invalid route destination segment”	检查 vercel.json 中 source 与 destination 参数名是否一致
❌ “packages field missing or empty”	删除 "builds" 字段，改用 "framework"
❌ “Failed to install builder dependencies”	使用 vercel --prebuilt 部署
❌ “Relation already exists”（SQL 错误）	Supabase 已存在表，可跳过迁移
⚠️ “npm install cannot read matches”	忽略，用 pnpm install 即可
📈 七、版本与依赖建议
模块	推荐版本
Node.js	20.x
pnpm	≥10.0.0
react-scripts	5.0.1
supabase-js	2.x
@vercel/cli	最新版
TailwindCSS	3.x（可选）
🧩 八、后续扩展计划（建议）

✅ 增加 Supabase Edge Function “sync-profile” 的 hook 自动触发；

✅ 接入 H5 微信支付（回调至 /api/wechat/notify）；

🔜 管理后台支持 Supabase RBAC 权限；

🔜 自动发送每日正能量语录（Resend / Email）。

✅ 九、一句话总结

本地使用 pnpm run build 成功
→ 再用 vercel --prebuilt --prod
= 永远 100% 构建成功 🚀