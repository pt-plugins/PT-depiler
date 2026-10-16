import { execSync } from "node:child_process";

/**
 * 构建期需要的 git 信息。
 *
 * 以前用 `git-rev-sync` 拿这几个值 —— 为此要多背一个依赖、一个 `patches/` 补丁、
 * 一条 pnpm `overrides`（`git-rev-sync>shelljs`）以及对应的 `allowBuilds` 条目，
 * 而实际只用到这里 5 个值。改成直接调 git（`vite/sendToTgChannel.ts` 早就是这个写法）。
 */
export interface IGitInfo {
  /** `git rev-list --count HEAD` */
  count: number;
  /** 短 hash（固定 7 位，与 `git-rev-sync` 的 `short()` 一致：取长 hash 前 7 位） */
  short: string;
  /** 完整 hash */
  long: string;
  /** 最后一次提交的**作者时间**（毫秒时间戳） */
  date: number;
  /** 当前分支名；分离头指针时形如 `Detached: <hash>`（与 git-rev-sync 的输出形态保持一致） */
  branch: string;
}

/** 跑一条 git 命令并去掉首尾空白；失败会直接抛出（构建期拿不到版本信息应该立刻失败） */
function git(args: string, cwd: string): string {
  return execSync(`git ${args}`, { cwd, encoding: "utf8" }).trim();
}

export function getGitInfo(cwd: string = process.cwd()): IGitInfo {
  const long = git("rev-parse HEAD", cwd);

  return {
    count: parseInt(git("rev-list --count HEAD", cwd), 10),
    short: long.substring(0, 7),
    long,
    // 与 git-rev-sync 的 `git log --no-color -n 1 --pretty=format:"%ad"` 取值口径一致（作者时间）
    date: +new Date(git('log --no-color -n 1 --pretty=format:"%ad"', cwd)),
    branch: (() => {
      const name = git("rev-parse --abbrev-ref HEAD", cwd);
      return name === "HEAD" ? `Detached: ${long}` : name;
    })(),
  };
}
