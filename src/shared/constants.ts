// 此处存放一些全局相关的信息
import browser from 'webextension-polyfill';
import UAParser from 'ua-parser-js';
import { EInstallType } from '@/shared/interfaces/enum';

// 仓库相关
export const REPO_NAME = 'ronggang/PT-Plugin-Plus';
export const REPO_URL = `https://github.com/${REPO_NAME}`;
export const REPO_API = `https://api.github.com/repos/${REPO_NAME}`;

export const GROUP_TELEGRAM = 'https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw';
export const GROUP_QQ = 'https://jq.qq.com/?_wv=1027&k=7d6xEo0L';

// 插件相关
export const MANIFEST = browser.runtime.getManifest();

// 浏览器相关
export const UAPARSER = UAParser();

// 版本相关
type dotVersion = `v${number}.${number}.${number}`
type dotHashVersion = `${dotVersion}.${string}`
type TVersion = dotVersion | dotHashVersion

export interface VersionDetail {
  full: TVersion,
  main: dotVersion,
  hash: string
}

export function getFullVersion (): VersionDetail {
  /**
   * 由于 webextension-polyfill-ts 的问题，此处暂时不能使用
   * browser.runtime.getManifest() ，先用 browser.management.getSelf() 替代
   * refs: https://github.com/Lusito/webextension-polyfill-ts/issues/64
   */
  // @ts-ignore
  const fullVersion = 'v' + (MANIFEST.versionName || MANIFEST.version_name || MANIFEST.version) as TVersion; // v2.0.0.b3f0a76

  let version; let versionHash = '';
  const mainVersionMatch = fullVersion.match(/(v\d+\.\d+\.\d+)\.?(.*)/);
  if (mainVersionMatch && mainVersionMatch[1]) {
    version = mainVersionMatch[1]; // v2.0.0
    versionHash = mainVersionMatch[2]; // b3f0a76
  } else {
    version = fullVersion;
  }

  return { full: fullVersion, main: version as dotVersion, hash: versionHash };
}

// 环境相关
export const isProd = ['production', 'prod'].includes(process.env.NODE_ENV!);
export const isDebug = !isProd;

export async function getInstallType (): Promise<EInstallType> {
  const detail = await browser.management.getSelf();
  if (detail?.updateUrl?.includes(REPO_NAME)) {
    return EInstallType.packed;
  } else {
    return detail.installType as EInstallType.normal | EInstallType.development;
  }
}
