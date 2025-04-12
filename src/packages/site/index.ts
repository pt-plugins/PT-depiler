import { cloneDeep } from "es-toolkit";

export * from "./types";
export * from "./utils";

import type { ISiteMetadata, ISiteUserConfig, TSiteID, TSiteFullUrl } from "./types";
import BittorrentSite from "./schemas/AbstractBittorrentSite";
import PrivateSite from "./schemas/AbstractPrivateSite";

export { BittorrentSite, PrivateSite };

interface schemaEntity {
  default: TSite;
  SchemaMetadata: Partial<ISiteMetadata>;
}

interface definitionEntity {
  default?: TSite;
  siteMetadata: ISiteMetadata & Required<Pick<ISiteMetadata, "schema">>;
}

const schemaContent = import.meta.glob<schemaEntity>("./schemas/*.ts");
const definitionContent = import.meta.glob<definitionEntity>("./definitions/*.ts");

function transContent(value: string) {
  return value.replace(/^\.\/(schemas|definitions)\//, "").replace(/\.ts$/, "");
}

export const schemaList: string[] = Object.keys(schemaContent).map(transContent);
export const definitionList: string[] = Object.keys(definitionContent).map(transContent);

export type TSite = PrivateSite | BittorrentSite;

export async function getSchemaModule(schema: string): Promise<schemaEntity> {
  return await schemaContent[`./schemas/${schema}.ts`]();
}

async function getDefinitionModule(definition: string): Promise<definitionEntity> {
  const module = await definitionContent[`./definitions/${definition}.ts`]();

  // 补全缺失字段（此处补影响站点meta构造的内容，其余内容在 getDefinedSiteConfig 里面构造）
  module.siteMetadata.schema ??=
    module.siteMetadata.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite";

  return module;
}

function restoreSecureLink(url: string): TSiteFullUrl {
  return (url.startsWith("aHR0c") ? atob(url) : url) as TSiteFullUrl;
}

export async function getDefinedSiteMetadata(definition: string): Promise<ISiteMetadata> {
  const { siteMetadata: definedSiteMetadata } = await getDefinitionModule(definition);

  const siteMetadata = cloneDeep(definedSiteMetadata);

  // 解密url加密过的站点
  siteMetadata.urls = siteMetadata.urls!.map(restoreSecureLink);

  // 补全一些可以缺失字段
  siteMetadata.tags ??= [];
  siteMetadata.host ??= new URL(siteMetadata.urls[0]).host;
  siteMetadata.timezoneOffset ??= siteMetadata.schema === "NexusPHP" ? "+0800" : "+0000";

  return siteMetadata;
}

export async function getSite<TYPE extends "private" | "public">(
  siteId: TSiteID,
  userConfig: ISiteUserConfig = {},
): Promise<TYPE extends "private" ? PrivateSite : BittorrentSite> {
  let SiteClass,
    siteMetadata = {};

  if (definitionList.includes(siteId!)) {
    siteMetadata = await getDefinedSiteMetadata(siteId);
    const DefinitionClass = (await getDefinitionModule(siteId!)).default;
    if (DefinitionClass) {
      SiteClass = DefinitionClass;
    }
  } else {
    // FIXME 部分用户自定义的站点（此时在 js/site 目录中不存在对应模块），不能进行 dynamicImport 的情况，对此应该直接从 schema 中导入
    throw new Error(`siteMetadata ${siteId} not found in build, skip creating siteInstance`);
  }

  /**
   * 如果该模块没有导出 default class，那么我们认为我们需要从基类继承
   * 并覆写基类的的 siteMetaData 信息
   */
  if (!SiteClass) {
    // @ts-ignore
    const schemaModule = await getSchemaModule(siteMetadata.schema!);
    SiteClass = schemaModule.default;
  }

  // 补全 userConfig 中可能缺失的内容
  userConfig.allowSearch ??= Object.hasOwn(siteMetadata, "search");
  userConfig.allowQueryUserInfo ??= Object.hasOwn(siteMetadata, "userInfo");
  userConfig.showMessageCount ??= Object.hasOwn(siteMetadata, "userInfo");

  // @ts-ignore
  return new SiteClass(siteMetadata, userConfig);
}
