import type { IBackupConfig, IBackupServer, IBackupMetadata } from "./type";
export * from "./type";

// @ts-ignore 动态生成支持列表
const requireContext = import.meta.webpackContext("./entity/", {
  regExp: /\.ts$/,
  chunkName: "lib/backupServer/[request]",
  mode: "lazy"
});

export const entityList = requireContext.keys().map((value: string) => {
  return value.replace(/^\.\//, "").replace(/\.ts$/, "");
});

async function getServerModule(configType: string): Promise<{
  default: IBackupServer<IBackupConfig>;
  serverConfig: IBackupConfig;
  serverMetaData: IBackupMetadata<IBackupConfig>;
}> {
  return await requireContext(`./${configType}.ts`);
}

export async function getBackupServerMetaData(
  configType: string
): Promise<IBackupMetadata<IBackupConfig>> {
  return (await getServerModule(configType)).serverMetaData;
}

export async function getBackupServerDefaultConfig(
  configType: string
): Promise<IBackupConfig> {
  return (await getServerModule(configType)).serverConfig;
}

const backupServerInstanceCache: Record<
  string,
  IBackupServer<IBackupConfig>
> = {};

export async function getBackupServer(
  config: IBackupConfig
): Promise<IBackupServer<IBackupConfig>> {
  if (typeof backupServerInstanceCache[config.id] === "undefined") {
    const ServerClass = (await getServerModule(config.type)).default;

    // @ts-ignore
    backupServerInstanceCache[config.id] = new ServerClass(config);
  }

  return backupServerInstanceCache[config.id];
}
