import { AbstractBittorrentClient, type DownloaderBaseConfig, type TorrentClientMetaData } from "./types";
import { cloneDeep } from "es-toolkit";
import { nanoid } from "nanoid";

export * from "./types";
export { getRemoteTorrentFile } from "./utils";

interface downloaderEntity {
  default: AbstractBittorrentClient;
  clientConfig: DownloaderBaseConfig;
  clientMetaData: TorrentClientMetaData;
}

export const requireContext = import.meta.glob<downloaderEntity>("./entity/*.ts");
export const entityList = Object.keys(requireContext).map((value: string) => {
  return value.replace(/^\.\/entity\//, "").replace(/\.ts$/, "");
}) as string[];

// 从 requireContext 中获取对应模块
export async function getDownloaderModule(configType: string): Promise<downloaderEntity> {
  return await requireContext[`./entity/${configType}.ts`]();
}

export async function getDownloaderDefaultConfig(type: string): Promise<DownloaderBaseConfig> {
  const config = cloneDeep((await getDownloaderModule(type)).clientConfig);
  // 填入/覆盖 缺失项
  config.id = nanoid();
  config.feature ??= { DefaultAutoStart: false };

  return config;
}

export async function getDownloaderMetaData(type: string): Promise<TorrentClientMetaData> {
  return cloneDeep((await getDownloaderModule(type)).clientMetaData);
}

const clientInstanceCache: Record<string, AbstractBittorrentClient> = {};

export async function getDownloader(
  config: DownloaderBaseConfig,
  flush: boolean = false,
): Promise<AbstractBittorrentClient> {
  if (flush || typeof clientInstanceCache[config.id!] === "undefined") {
    const DownloaderClass = (await getDownloaderModule(config.type)).default;

    // @ts-ignore
    clientInstanceCache[config.id] = new DownloaderClass(config);
  }

  return clientInstanceCache[config.id!];
}

export function getDownloaderIcon(type: string) {
  return `/icons/downloader/${type}.png`;
}
