// 此处放置一些全局都可以用的助手函数、常量定义

// 仓库相关
export const REPO_NAME = "pt-plugins/PT-depiler";
export const REPO_URL = `https://github.com/${REPO_NAME}`;
export const REPO_API = `https://api.github.com/repos/${REPO_NAME}`;

export const GROUP_TELEGRAM = "https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw";
export const GROUP_QQ = "https://jq.qq.com/?_wv=1027&k=7d6xEo0L";

// 环境相关
export const isProd = import.meta.env.PROD;
export const isDebug = !isProd;

// 插件相关

export const EXT_BASEURL = chrome.runtime?.getURL("");

export const buildInfo = {
  buildAt: __BUILD_TIME__,
  gitVersion: __GIT_VERSION__,
};

export const log = (...args: any[]) => isDebug && console.log(...args);
export const error = (...args: any[]) => console.error(...args);
export const warn = (...args: any[]) => console.warn(...args);

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
