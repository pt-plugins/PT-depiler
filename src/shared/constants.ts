import { browser } from 'webextension-polyfill-ts';

export const REPO_NAME = 'ronggang/PT-Plugin-Plus';
export const REPO_URL = `https://github.com/${REPO_NAME}`;
export const REPO_API = `https://api.github.com/repos/${REPO_NAME}`;

type dotVersion = `v${number}.${number}.${number}`
type dotHashVersion = `${dotVersion}.${string}`
type TVersion = dotVersion | dotHashVersion

export interface VersionDetail {
  full:TVersion,
  main: dotVersion,
  hash: string
}

export async function getFullVersion (): Promise<VersionDetail> {
  /**
   * 由于 webextension-polyfill-ts 的问题，此处暂时不能使用
   * browser.runtime.getManifest() ，先用 browser.management.getSelf() 替代
   * refs: https://github.com/Lusito/webextension-polyfill-ts/issues/64
   */
  const detail = await browser.management.getSelf();
  const fullVersion = 'v' + (detail.versionName || detail.version) as TVersion; // v2.0.0.b3f0a76

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
