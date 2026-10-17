import { execSync } from "node:child_process";

/**
 * 构建期需要的 git 信息。
 *
 * 以前用 `git-rev-sync` 拿这几个值 —— 为此要多背一个依赖、一个 `patches/` 补丁、
 * 一条 pnpm `overrides`（`git-rev-sync>shelljs`）以及对应的 `allowBuilds` 条目，
 * 而实际只用到这里 5 个值。改成直接调 git（`vite/sendToTgChannel.ts` 早就是这个写法）。
 *
 * ⚠️ 取不到 git 信息时**不能**让构建失败：开发者机器上可能没装 git，当前目录也可能没有 `.git`
 * （典型如从 GitHub 下载 source zip 解压后构建）。此时退化为占位值，见 {@link getGitInfo}。
 */
export interface IGitInfo {
  /** `git rev-list --count HEAD`；取不到 git 时为 0 */
  count: number;
  /** 短 hash（固定 7 位，与 `git-rev-sync` 的 `short()` 一致：取长 hash 前 7 位）；取不到 git 时为 `GITHUB_SHA` 前 7 位或 `unknown` */
  short: string;
  /** 完整 hash；取不到 git 时为 `GITHUB_SHA` 或 `unknown` */
  long: string;
  /** 最后一次提交的**作者时间**（毫秒时间戳）；取不到 git 时为构建时刻 */
  date: number;
  /** 当前分支名；分离头指针时形如 `Detached: <hash>`（与 git-rev-sync 的输出形态一致）；取不到 git 时为 `GITHUB_REF_NAME` 或 `unknown` */
  branch: string;
}

/**
 * 跑一条 git 命令并去掉首尾空白；**取不到就返回 undefined（不抛）**。
 *
 * 需要容忍的情况：
 * - 机器上没装 git（`execSync` 抛 ENOENT）；
 * - 目录里没有 `.git`，例如从 GitHub 的 source zip 解压后构建；
 * - 其它 git 报错，例如 CI 容器里的 `detected dubious ownership`。
 *
 * stderr 丢弃：非 git 目录时 git 会往 stderr 打 `fatal: not a git repository`，别污染构建日志。
 */
function tryGit(args: string, cwd: string): string | undefined {
  try {
    const out = execSync(`git ${args}`, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

export function getGitInfo(cwd: string = process.cwd()): IGitInfo {
  const long = tryGit("rev-parse HEAD", cwd);

  if (long) {
    const authorDate = tryGit('log --no-color -n 1 --pretty=format:"%ad"', cwd);
    const branch = tryGit("rev-parse --abbrev-ref HEAD", cwd);

    return {
      count: parseInt(tryGit("rev-list --count HEAD", cwd) ?? "", 10) || 0,
      short: long.substring(0, 7),
      long,
      // 与 git-rev-sync 的 `git log --no-color -n 1 --pretty=format:"%ad"` 取值口径一致（作者时间）
      date: authorDate ? +new Date(authorDate) : Date.now(),
      branch: !branch || branch === "HEAD" ? `Detached: ${long}` : branch,
    };
  }

  // 回退：没有 git 或没有 .git（如 source zip 构建）。优先用 CI 注入的环境变量，最后才是占位值。
  const envSha = process.env.GITHUB_SHA?.trim();
  const info: IGitInfo = {
    count: 0,
    short: envSha ? envSha.substring(0, 7) : "unknown",
    long: envSha || "unknown",
    date: Date.now(),
    branch: process.env.GITHUB_REF_NAME?.trim() || "unknown",
  };

  console.warn(
    `[PTD] 未取到 git 信息（没装 git，或当前目录没有 .git，例如从 source zip 构建）：版本信息退化为 ${info.short}` +
      (envSha ? "" : "；可用 GITHUB_SHA / GITHUB_REF_NAME 环境变量提供"),
  );

  return info;
}
