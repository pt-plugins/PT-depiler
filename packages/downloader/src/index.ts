import {
  AbstractBittorrentClient,
  BittorrentClientBaseConfig,
  TorrentClientMetaData,
} from "./types";
export * from "./types";
export { getRemoteTorrentFile } from "./utils";
import { copy } from "@ptpp/util/filter";

const requireContext = import.meta.webpackContext!("./entity/", {
  regExp: /\.ts$/,
  chunkName: "lib/downloader/[request]",
  mode: "eager"
});

export const entityList = requireContext.keys().map((value: string) => {
  return value.replace(/^\.\//, "").replace(/\.ts$/, "");
});

// 从 requireContext 中获取对应模块
export async function getDownloaderModule(configType: string): Promise<{
  default: AbstractBittorrentClient;
  clientConfig: BittorrentClientBaseConfig;
  clientMetaData: TorrentClientMetaData;
}> {
  return await requireContext(`./${configType}.ts`);
}

export async function getDownloaderDefaultConfig(type: string): Promise<BittorrentClientBaseConfig> {
  return copy((await getDownloaderModule(type)).clientConfig);
}

export async function getDownloaderMetaData(type: string): Promise<TorrentClientMetaData> {
  return copy((await getDownloaderModule(type)).clientMetaData);
}

const downloaderIconContext = import.meta.webpackContext!("./icons/", {
  regExp: /\.png$/,
  mode: "sync"
});

export  function getDownloaderIcon(configType: string):string {
  return downloaderIconContext(`./${configType}.png`);
}

const clientInstanceCache: Record<string, AbstractBittorrentClient> = {};

export async function getDownloader(config: BittorrentClientBaseConfig): Promise<AbstractBittorrentClient> {
  if (typeof clientInstanceCache[config.id!] === "undefined") {
    const DownloaderClass = (await getDownloaderModule(config.type)).default;

    // @ts-ignore
    clientInstanceCache[config.id] = new DownloaderClass(config);
  }

  return clientInstanceCache[config.id!];
}
