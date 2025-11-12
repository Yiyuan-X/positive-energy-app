import fs from "fs";
import path from "path";

const file = "src/App.js";
const content = fs.readFileSync(file, "utf8");
const regex = /import .* from ["'](.+)["']/g;

let match;
const root = path.resolve();

console.log("🔍 检查 App.js 引用文件是否存在...\n");

while ((match = regex.exec(content)) !== null) {
  const rel = match[1];
  if (rel.startsWith(".")) {
    const fullPath = path.resolve("src", rel);
    const exists =
      fs.existsSync(fullPath) ||
      fs.existsSync(fullPath + ".js") ||
      fs.existsSync(fullPath + ".jsx") ||
      fs.existsSync(fullPath + ".json");
    if (!exists) console.error("❌ 找不到:", rel);
    else console.log("✅ 存在:", rel);
  }
}
