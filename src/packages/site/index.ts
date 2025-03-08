import { cloneDeep } from "es-toolkit";

export * from "./types";
export * from "./utils";

import type { ISiteMetadata, ISiteUserConfig } from "./types";
import BittorrentSite from "./schemas/AbstractBittorrentSite";
import PrivateSite from "./schemas/AbstractPrivateSite";
import { type TSiteFullUrl } from "./types";

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
  const { siteMetadata: definedSiteConfig } = await getDefinitionModule(definition);

  const siteConfig = cloneDeep(definedSiteConfig);

  // 解密url加密过的站点
  siteConfig.urls = siteConfig.urls!.map(restoreSecureLink);

  // 补全一些可以缺失字段
  siteConfig.tags ??= [];
  siteConfig.host ??= new URL(siteConfig.urls[0]).host;
  siteConfig.timezoneOffset ??= siteConfig.schema === "NexusPHP" ? "+0800" : "+0000";

  return siteConfig;
}

// FIXME 部分用户自定义的站点（此时在 js/site 目录中不存在对应模块），不能进行 dynamicImport 的情况，对此应该直接从 schema 中导入
export async function getSite<TYPE extends "private" | "public">(
  siteMetadata: ISiteMetadata,
  userConfig: ISiteUserConfig = {},
): Promise<TYPE extends "private" ? PrivateSite : BittorrentSite> {
  const { id: SiteId } = siteMetadata;

  let SiteClass;
  if (definitionList.includes(SiteId!)) {
    const DefinitionClass = (await getDefinitionModule(SiteId!)).default;
    if (DefinitionClass) {
      SiteClass = DefinitionClass;
    }
  }

  /**
   * 如果该模块没有导出 default class，那么我们认为我们需要从基类继承
   * 并覆写基类的的 siteMetaData 信息
   */
  if (!SiteClass) {
    const schemaModule = await getSchemaModule(siteMetadata.schema!);
    SiteClass = schemaModule.default;
  }

  // @ts-ignore
  return new SiteClass(siteMetadata, userConfig);
}
