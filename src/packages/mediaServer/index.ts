import { AbstractMediaServer, IMediaServerBaseConfig, IMediaServerMetadata } from "./types";
import { cloneDeep } from "es-toolkit";

export * from "./types";

interface MediaServerEntity {
  default: AbstractMediaServer;
  mediaServerConfig: IMediaServerBaseConfig;
  mediaServerMetaData: IMediaServerMetadata;
}

export const requireContext = import.meta.glob<MediaServerEntity>("./entity/*.ts");
export const entityList = Object.keys(requireContext).map((value: string) => {
  return value.replace(/^\.\/entity\//, "").replace(/\.ts$/, "");
}) as string[];

// 从 requireContext 中获取对应模块
export async function getMediaServerModule(configType: string): Promise<MediaServerEntity> {
  return await requireContext[`./entity/${configType}.ts`]();
}

export async function getMediaServerMetaData(type: string): Promise<IMediaServerMetadata> {
  console.log("getMediaServerMetaData", type, (await getMediaServerModule(type)).mediaServerMetaData);
  return cloneDeep((await getMediaServerModule(type)).mediaServerMetaData);
}

export async function getMediaServerDefaultConfig(type: string): Promise<IMediaServerBaseConfig> {
  const config = cloneDeep((await getMediaServerModule(type)).mediaServerConfig);
  // 填入/覆盖 缺失项

  return config;
}

export async function getMediaServer(config: IMediaServerBaseConfig): Promise<AbstractMediaServer> {
  const mediaServerClass = (await getMediaServerModule(config.type)).default;

  // @ts-ignore
  return new mediaServerClass(config);
}

export function getMediaServerIcon(type: string) {
  return `/icons/mediaServer/${type}.png`;
}
