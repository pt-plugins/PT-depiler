import type {IBackupConfig, IBackupServer, IBackupMetadata} from "./type.ts";
import {copy} from "@ptd/util/filter";
import {nanoid} from "nanoid";

export * from "./type.ts";

interface backupServerEntity {
  default: IBackupServer<IBackupConfig>;
  serverConfig: IBackupConfig;
  serverMetaData: IBackupMetadata<IBackupConfig>;
}

const requireContext = import.meta.glob<backupServerEntity>('./entity/*.ts')

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
  const config = copy((await getServerModule(configType)).serverConfig);

  config.id = nanoid();

  return config;
}

const backupServerInstanceCache: Record<string, IBackupServer<IBackupConfig>> = {};

export async function getBackupServer(config: IBackupConfig): Promise<IBackupServer<IBackupConfig>> {
  if (typeof backupServerInstanceCache[config.id!] === "undefined") {
    const ServerClass = (await getServerModule(config.type)).default;

    // @ts-ignore
    backupServerInstanceCache[config.id] = new ServerClass(config);
  }

  return backupServerInstanceCache[config.id!];
}
