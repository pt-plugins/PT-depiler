import { cloneDeep } from "es-toolkit";

export * from "./types";
export * from "./utils";

import { getHostFromUrl, restoreSecureLink } from "./utils/html.ts";
import type { ISiteMetadata, ISiteUserConfig, TSiteID } from "./types";
import type BittorrentSite from "./schemas/AbstractBittorrentSite";
import type PrivateSite from "./schemas/AbstractPrivateSite";

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

export async function getDefinedSiteMetadata(definition: string): Promise<ISiteMetadata> {
  const { siteMetadata: definedSiteMetadata } = await getDefinitionModule(definition);

  const siteMetadata = cloneDeep(definedSiteMetadata);

  // 解密url加密过的站点
  siteMetadata.urls = siteMetadata.urls!.map(restoreSecureLink);
  if (siteMetadata.legacyUrls?.length) {
    siteMetadata.legacyUrls = siteMetadata.legacyUrls.map(restoreSecureLink);
  }

  // 补全一些可以缺失字段
  siteMetadata.tags ??= [];
  siteMetadata.timezoneOffset ??= siteMetadata.schema === "NexusPHP" ? "+0800" : "+0000";

  return siteMetadata;
}

export function checkSiteMetadataAllow(siteMetadata: ISiteMetadata, key: keyof ISiteMetadata): boolean {
  if (key === "search" || key === "userInfo") {
    return !!(siteMetadata[key] && Object.keys(siteMetadata[key]).length > 0);
  }
  return !!siteMetadata[key];
}

export async function getSite<TYPE extends "private" | "public">(
  siteId: TSiteID,
  userConfig: ISiteUserConfig = {},
): Promise<TYPE extends "private" ? PrivateSite : BittorrentSite> {
  let SiteClass,
    siteMetadata = {} as ISiteMetadata;

  if (definitionList.includes(siteId!)) {
    siteMetadata = await getDefinedSiteMetadata(siteId);
    const DefinitionClass = (await getDefinitionModule(siteId!)).default;
    if (DefinitionClass) {
      SiteClass = DefinitionClass;
    }
  } else {
    throw new Error(`siteMetadata ${siteId} not found in build, skip creating siteInstance`);
  }

  /**
   * 如果该模块没有导出 default class，那么我们认为我们需要从基类继承
   * 并覆写基类的的 siteMetaData 信息
   */
  if (!SiteClass) {
    let siteSchema = siteMetadata.schema!;
    // 如果schema有声明，但是没有对应的实现（ schemas/*.ts 或者 definitions/site.ts 中的 default class ），则根据 type 回落
    if (!schemaList.includes(siteSchema)) {
      siteSchema = siteMetadata.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite";
    }

    const schemaModule = await getSchemaModule(siteSchema);
    SiteClass = schemaModule.default;
  }

  // 补全 userConfig 中可能缺失的内容
  userConfig.allowSearch ??= checkSiteMetadataAllow(siteMetadata, "search");
  userConfig.allowQueryUserInfo ??= checkSiteMetadataAllow(siteMetadata, "userInfo");
  userConfig.showMessageCount ??= checkSiteMetadataAllow(siteMetadata, "userInfo");

  // @ts-ignore
  return new SiteClass(siteMetadata, userConfig);
}
