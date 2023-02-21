// 此处存放一些全局相关的信息
import { EInstallType } from "@/shared/interfaces/enum";
import axios from "axios";

// 仓库相关
export const REPO_NAME = "pt-plugins/PT-depiler";
export const REPO_URL = `https://github.com/${REPO_NAME}`;
export const REPO_API = `https://api.github.com/repos/${REPO_NAME}`;

export const GROUP_TELEGRAM = "https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw";
export const GROUP_QQ = "https://jq.qq.com/?_wv=1027&k=7d6xEo0L";

// 环境相关
export const isProd = ["production", "prod"].includes(process.env.NODE_ENV!);
export const isDebug = !isProd;

// 插件相关
export const EXT_MANIFEST = chrome.runtime.getManifest();
export const EXT_BASEURL = chrome.runtime.getURL("");
export const EXT_VERSION =  "v" + EXT_MANIFEST.version;  // v2.0.0.2022

export const EXT_GIT = "git" in EXT_MANIFEST ? EXT_MANIFEST.git as { short: string, date: string, count: number, branch: string, message: string } : null;

interface IBuildInfo {
  buildAt: number,
  gitVersion: {
    short: string,
    long: string,
    date: string,
    count: number,
    branch: string
  },
  buildOs: {
    arch: string,
    platform: string,
    release: string,
    type: string,
  }
}

let buildInfo: IBuildInfo | null = null;
export async function getBuildInfo(): Promise<IBuildInfo> {
  if (buildInfo === null) {
    const {data} = await axios.get("/build_info.json");
    buildInfo = data;
  }
  return buildInfo as IBuildInfo;
}

export async function getInstallType(): Promise<EInstallType> {
  if ("update_url" in EXT_MANIFEST || EXT_MANIFEST.browser_specific_settings?.gecko?.update_url) {
    const update_url: string = EXT_MANIFEST.update_url ?? EXT_MANIFEST.browser_specific_settings?.gecko?.update_url ?? "";
    return update_url.includes("github") ? EInstallType.packed : EInstallType.normal;
  } else {
    const detail = await chrome.management.getSelf();
    return detail.installType as EInstallType.normal | EInstallType.development;
  }
}
