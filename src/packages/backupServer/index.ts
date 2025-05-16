import { nanoid } from "nanoid";
import { cloneDeep } from "es-toolkit";

import type AbstractBackupServer from "./AbstractBackupServer.ts";
import type { IBackupConfig, IBackupMetadata } from "./type";

export * from "./type";

interface backupServerEntity {
  default: AbstractBackupServer<IBackupConfig>;
  serverConfig: IBackupConfig;
  serverMetaData: IBackupMetadata<IBackupConfig>;
}

const requireContext = import.meta.glob<backupServerEntity>("./entity/*.ts");

export const entityList = Object.keys(requireContext).map((value: string) => {
  return value.replace(/^\.\/entity\//, "").replace(/\.ts$/, "");
}) as string[];

async function getServerModule(configType: string): Promise<backupServerEntity> {
  return await requireContext[`./entity/${configType}.ts`]();
}

export async function getBackupServerMetaData(configType: string): Promise<IBackupMetadata<IBackupConfig>> {
  return (await getServerModule(configType)).serverMetaData;
}

export async function getBackupServerDefaultConfig(configType: string): Promise<IBackupConfig> {
  const config = cloneDeep((await getServerModule(configType)).serverConfig);

  config.id = nanoid();

  return config;
}

export async function getBackupServer(config: IBackupConfig): Promise<AbstractBackupServer<IBackupConfig>> {
  const ServerClass = (await getServerModule(config.type)).default;

  // @ts-ignore
  return new ServerClass(config);
}
