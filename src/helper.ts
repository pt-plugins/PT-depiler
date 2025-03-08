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
export const EXT_MANIFEST = chrome.runtime?.getManifest();
export const EXT_VERSION = "v" + EXT_MANIFEST.version; // v2.0.0.2022

export const EXT_BASEURL = chrome.runtime?.getURL("");

export const buildInfo = {
  buildAt: __BUILD_TIME__,
  gitVersion: __GIT_VERSION__,
};

export const decodeUrl = (url: string) => unescape(encodeURIComponent(url));
export const encodeUrl = (url: string) => decodeURIComponent(escape(url));

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const unique = <T = any>(arr: T[]): T[] => [...new Set(arr)];

export const decodeDataUri = (dataUri: string) => {
  let data;
  data = dataUri.split(",")[0].includes("base64") ? atob(dataUri.split(",")[1]) : unescape(dataUri.split(",")[1]);
  const mimeType = dataUri.split(",")[0].split(":")[1].split(";")[0];
  const buffer = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buffer[i] = data.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeType });
};

export const readAsDataUrl = (blob: Blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target ? event.target.result : undefined;
      resolve(result);
    };
    reader.readAsDataURL(blob);
  });

export const readBlob = async (blob: Blob, encoding?: string) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result || "");
    };
    reader.onerror = (error) => {
      resolve("");
    };
    if (encoding) {
      reader.readAsText(blob, encoding);
    } else {
      reader.readAsArrayBuffer(blob);
    }
  });
