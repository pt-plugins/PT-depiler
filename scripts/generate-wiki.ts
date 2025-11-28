#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const wikiDir = path.join(rootDir, "wiki");

if (!fs.existsSync(wikiDir)) fs.mkdirSync(wikiDir, { recursive: true });

function getSites() {
  const dir = path.join(rootDir, "src/packages/site/definitions");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(".ts", ""));
}

function getEntities(type: string) {
  const dir = path.join(rootDir, `src/packages/${type}/entity`);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(".ts", ""));
}

console.log("🚀 Generating PT-depiler Wiki Documentation...\n");

// Home page
fs.writeFileSync(
  path.join(wikiDir, "Home.md"),
  `# PT-depiler Wiki

欢迎来到 PT-depiler 的用户文档！

## 📖 关于 PT-depiler

PT-depiler 是基于浏览器最新的 Manifest v3 标准开发的浏览器插件，可以提升 PT 站点使用效率。

## 🚀 快速开始

1. [安装指南](Installation)
2. [基础配置](Basic-Configuration)
3. [常见问题](FAQ)

## �� 功能文档

- [站点配置](config-site) - 配置和管理 PT 站点
- [下载器配置](config-download-client) - 配置下载客户端
- [备份服务器配置](config-backup-server) - 配置数据备份服务

## 📑 参考文档

- [支持的站点列表](Supported-Sites)

## 💬 社区与支持

- Telegram: https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw
- QQ 群: https://jq.qq.com/?_wv=1027&k=7d6xEo0L
- GitHub Issues: https://github.com/pt-plugins/PT-depiler/issues
`,
);
console.log("✓ Generated Home.md");

// Supported Sites
const sites = getSites();
fs.writeFileSync(
  path.join(wikiDir, "Supported-Sites.md"),
  `# 支持的站点列表 (Supported Sites)

PT-depiler 目前支持 **${sites.length}** 个 PT 站点。

## 📋 站点列表

${sites.map((s, i) => `${i + 1}. \`${s}\``).join("\n")}

## 📝 说明

### 站点架构类型

- **NexusPHP**: 最常见的 PT 站点架构
- **Unit3D**: 现代化的 PT 站点架构
- **Gazelle**: 主要用于音乐站点的架构

### 站点类型

- **private**: 私有站点，需要注册和邀请
- **public**: 公开站点，无需注册即可使用

## ❓ 添加新站点

如果您想添加新的站点支持，请参阅 [站点配置指南](config-site)。
`,
);
console.log(`✓ Generated Supported-Sites.md (${sites.length} sites)`);

// Download Client Config
const downloaders = getEntities("downloader");
fs.writeFileSync(
  path.join(wikiDir, "config-download-client.md"),
  `# 下载器配置 (Download Client Configuration)

PT-depiler 支持多种下载客户端，可以实现一键推送种子到下载器。

## 🎯 支持的下载器

${downloaders.map((d) => `- **${d}**`).join("\n")}

## ⚙️ 通用配置步骤

1. 在 PT-depiler 选项页面中，进入"设置" → "下载器"
2. 点击"添加"按钮
3. 选择您使用的下载器类型
4. 填写下载器的连接信息

## 🔧 配置说明

每个下载器通常需要配置：
- **名称**: 自定义名称
- **地址**: 下载器 WebUI 或 RPC 地址
- **用户名/密码**: 认证信息

## ❓ 常见问题

**Q: 连接测试失败？**
A: 请检查地址、用户名密码是否正确，以及 WebUI/RPC 服务是否已启用。
`,
);
console.log(`✓ Generated config-download-client.md (${downloaders.length} downloaders)`);

// Backup Server Config
const backups = getEntities("backupServer");
fs.writeFileSync(
  path.join(wikiDir, "config-backup-server.md"),
  `# 备份服务器配置 (Backup Server Configuration)

PT-depiler 支持多种备份服务，可以将配置、Cookie 等数据同步到云端。

## 🎯 支持的备份服务

${backups.map((b) => `- **${b}**`).join("\n")}

## 📋 配置说明

### WebDAV

WebDAV 是一个开放的网络协议，许多网盘都支持。

**支持的服务：**
- 坚果云
- Nextcloud
- ownCloud
- 群晖 NAS WebDAV

### 其他服务

每个备份服务都有其特定的配置要求，请参考相应服务的文档。

## ⚠️ 注意事项

- 备份数据包含敏感信息，请确保使用安全的服务
- 建议使用端对端加密的备份服务
`,
);
console.log(`✓ Generated config-backup-server.md (${backups.length} backup services)`);

// Installation Guide
fs.writeFileSync(
  path.join(wikiDir, "Installation.md"),
  `# 安装指南 (Installation Guide)

## 📦 从浏览器扩展商店安装（推荐）

### Chrome Web Store
访问 [Chrome Web Store](https://chromewebstore.google.com/detail/pt-depiler/iloddidemhbedaopmipajgclofjocogb) 安装

### Firefox Add-ons
访问 [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/pt-depiler/) 安装

### Microsoft Edge Add-ons
访问 [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pt-depiler/kbijhmckhndmeckonoikakdfdlbnlkde) 安装

## 🔧 从源码构建

\`\`\`bash
git clone https://github.com/pt-plugins/PT-depiler.git
cd PT-depiler
pnpm install
pnpm build:dist  # Chrome版本
pnpm build:dist-firefox  # Firefox版本
\`\`\`

## 🔗 下一步

- [基础配置](Basic-Configuration)
- [站点配置](config-site)
`,
);
console.log("✓ Generated Installation.md");

// Basic Configuration
fs.writeFileSync(
  path.join(wikiDir, "Basic-Configuration.md"),
  `# 基础配置 (Basic Configuration)

安装 PT-depiler 后，需要进行一些基础配置。

## 🚀 快速开始

### 第一步：添加站点

1. 访问您常用的 PT 站点并登录
2. PT-depiler 会自动识别并提示添加
3. 或在选项页面手动添加站点

详细说明请参阅 [站点配置](config-site)。

### 第二步：配置下载器

1. 在选项页面进入"设置" → "下载器"
2. 添加您使用的下载客户端
3. 填写连接信息并测试

详细说明请参阅 [下载器配置](config-download-client)。

### 第三步：开始使用

配置完成后，您可以：
- 在站点页面直接推送种子到下载器
- 使用聚合搜索功能搜索种子
- 查看站点统计信息

## ⚙️ 界面设置

PT-depiler 支持：
- 简体中文 / English
- 浅色 / 深色主题
- 界面密度调整

## 🔒 隐私与安全

- 所有数据存储在本地
- 建议使用加密的备份服务
- 定期备份配置
`,
);
console.log("✓ Generated Basic-Configuration.md");

// Site Config
fs.writeFileSync(
  path.join(wikiDir, "config-site.md"),
  `# 站点配置 (Site Configuration)

## 📝 添加站点

### 方法一：自动识别（推荐）
1. 访问并登录 PT 站点
2. PT-depiler 会自动识别并提示添加

### 方法二：手动添加
1. 打开 PT-depiler 选项页面
2. 进入"设置" → "站点"
3. 点击"添加站点"
4. 选择站点类型并填写信息

## ⚙️ 站点设置

- **基本设置**: 站点名称、网站地址、Cookie
- **高级设置**: 搜索超时、搜索间隔、User Agent
- **Cookie 管理**: 自动获取或手动设置

## 🎯 搜索方案

创建搜索方案来自定义搜索哪些站点：
1. 进入"设置" → "搜索方案"
2. 创建新方案并选择站点
3. 设置为默认方案（可选）

## 📊 站点统计

PT-depiler 会显示：
- 上传量 / 下载量
- 分享率
- 用户等级
- 魔力值 / 积分

## ⚠️ 常见问题

**Q: 站点无法添加？**
A: 检查站点是否在[支持列表](Supported-Sites)中，确保已登录站点。

**Q: Cookie 频繁过期？**
A: 在站点设置中勾选"记住我"，使用备份服务同步 Cookie。
`,
);
console.log("✓ Generated config-site.md");

// FAQ
fs.writeFileSync(
  path.join(wikiDir, "FAQ.md"),
  `# 常见问题 (FAQ)

## 📦 安装与使用

### Q: PT-depiler 支持哪些浏览器？
A: Chrome, Edge, Firefox 及其他 Chromium 浏览器。

### Q: 如何更新 PT-depiler？
A: 从扩展商店安装的版本会自动更新，手动安装需要重新下载安装。

### Q: PT-depiler 和 PT-Plugin-Plus 有什么区别？
A: PT-depiler 基于 Manifest v3，更安全稳定，性能更好，支持更多特性。

## 🔐 安全与隐私

### Q: PT-depiler 会收集我的数据吗？
A: 不会。所有数据都存储在本地，不会上传任何信息。

### Q: 我的 Cookie 安全吗？
A: Cookie 存储在浏览器本地存储中，建议使用加密的备份服务。

## 🔧 功能相关

### Q: 为什么搜索不到结果？
A: 可能原因：Cookie 过期、站点无法访问、搜索限制。

### Q: 为什么无法推送到下载器？
A: 检查下载器配置、服务是否运行、防火墙设置。

### Q: 如何实现多设备同步？
A: 配置备份服务（WebDAV、Gist 等）。

## 🆘 获取帮助

- Telegram 群组: https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw
- QQ 群: https://jq.qq.com/?_wv=1027&k=7d6xEo0L  
- GitHub Issues: https://github.com/pt-plugins/PT-depiler/issues
`,
);
console.log("✓ Generated FAQ.md");

console.log("\n✅ Wiki generation completed!");
console.log(`📁 Generated files in: ${wikiDir}`);
