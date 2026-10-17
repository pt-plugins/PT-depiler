import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";

import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const FILES_DIR = "build";

// Telegram Bot API 域名固定；token 形态校验后拼接，避免任意值直接进入请求 URL
const TELEGRAM_API_BASE = "https://api.telegram.org";
if (!BOT_TOKEN || !/^\d+:[A-Za-z0-9_-]{30,}$/.test(BOT_TOKEN)) {
  throw new Error("TELEGRAM_BOT_TOKEN 缺失或形态非法");
}

function getCommitInfo() {
  try {
    const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
    const author = execSync('git log -1 --pretty=format:"%an"').toString().trim();
    const message = execSync('git log -1 --pretty=format:"%s"').toString().trim();
    const moreMessage = execSync('git log -1 --pretty=format:"%b"').toString().trim();
    const timestamp = execSync('git log -1 --pretty=format:"%cd" --date=format:"%Y-%m-%d %H:%M:%S"').toString().trim();

    return { commitHash, author, message, moreMessage, timestamp };
  } catch (err) {
    console.error("获取 commit 信息失败:", err);
    return {
      commitHash: "unknown",
      author: "unknown",
      message: "unknown",
      timestamp: new Date().toISOString(),
    };
  }
}

function escapeLegacyMarkdown(text: string): string {
  return text.replace(/([*_])/g, "\\$1"); // 转义星号和下划线
}

async function main() {
  if (!CHAT_ID) {
    console.error("缺少 TELEGRAM_CHAT_ID 环境变量");
    process.exit(1);
  }

  const triggerInfo = {
    runId: process.env.GITHUB_RUN_ID || "unknown",
    eventName: process.env.GITHUB_EVENT_NAME || "unknown",
    workflow: process.env.GITHUB_WORKFLOW || "unknown",
    actor: process.env.GITHUB_ACTOR || "unknown",
    repository: process.env.GITHUB_REPOSITORY || "unknown",
    ref: process.env.GITHUB_REF || "unknown",
  };
  const commitInfo = getCommitInfo();
  let buildVersion = process.env.BUILD_VERSION || "unknown";

  const repoUrl = `https://github.com/${triggerInfo.repository}`; // 获取 GitHub 仓库基础 URL
  const commitUrl = `${repoUrl}/commit/${commitInfo.commitHash}`; // 构建 Commit 链接
  const actionRunUrl = `${repoUrl}/actions/runs/${triggerInfo.runId}`; // 构建 GitHub Action 运行链接

  let message = `
#${triggerInfo.eventName} #${commitInfo.author} #${commitInfo.commitHash}

\`\`\`
${escapeLegacyMarkdown(commitInfo.message)}
|$|moreMessage|$|
\`\`\`

🔢 \`v${buildVersion}\`
📅 \`${commitInfo.timestamp}\`
🔖 Commit: [${commitInfo.commitHash}](${commitUrl})
⚙️ Workflow: [${triggerInfo.runId}](${actionRunUrl})
📦 *由 GitHub Action 自动构建*
`;

  message = message.replace(
    "|$|moreMessage|$|",
    commitInfo.moreMessage
      ? `
${escapeLegacyMarkdown(commitInfo.moreMessage)}`
      : "",
  );

  console.log(message);

  const files = fs
    .readdirSync(FILES_DIR)
    .map((fileName: string) => path.join(FILES_DIR, fileName))
    .filter((filePath: string) => fs.statSync(filePath).isFile());

  if (files.length === 0) {
    console.error(`目录为空: ${FILES_DIR}`);
    process.exit(1);
  }

  const formData = new FormData();
  formData.append("chat_id", CHAT_ID);

  const mediaJson = files.map((filePath, index) => ({
    type: "document",
    media: `attach://file${index}`,
  }));

  // @ts-expect-error 为最后一个文件添加 caption
  mediaJson.at(-1).caption = message;
  // @ts-expect-error 为最后一个文件添加 parse_mode
  mediaJson.at(-1).parse_mode = "Markdown";

  formData.append("media", JSON.stringify(mediaJson));

  files.forEach((filePath, index) => {
    formData.append(
      `file${index}`,
      new Blob([fs.readFileSync(filePath)], { type: "application/octet-stream" }),
      path.basename(filePath),
    );
  });

  const response = await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMediaGroup`, formData);

  if (!response.data.ok) {
    throw new Error(`Telegram API 错误: ${response.status}`);
  }
}

// noinspection JSIgnoredPromiseFromCall
main();
