import { mergeWith } from "lodash-es";

export * from "./types";
export * from "./utils";

import type { ISiteMetadata } from "./types";
import BittorrentSite from "./schema/AbstractBittorrentSite";
import PrivateSite from "./schema/AbstractPrivateSite";
import { fullUrl } from "./types";

export { BittorrentSite, PrivateSite };

const schemaContent = import.meta.webpackContext!("./schema/", {
  regExp: /\.ts$/,
  chunkName: "lib/site/schema/[request]",
  mode: "eager"
});

const definitionContent = import.meta.webpackContext!("./definitions/", {
  regExp: /\.ts$/,
  chunkName: "lib/site/definitions/[request]",
  mode: "eager"
});

function transContent (value: string) {
  return value.replace(/^\.\//, "").replace(/\.ts$/, "");
}

function restoreSecureLink (url: string): fullUrl {
  return (url.startsWith("aHR0c") ? atob(url) : url) as fullUrl;
}

export const schemaList: string[] = schemaContent.keys().map(transContent);
export const definitionList: string[] = definitionContent.keys().map(transContent);

export type TSite = PrivateSite | BittorrentSite;

export async function getSchemaModule (
  schema: string
): Promise<{ default: TSite, SchemaMetadata: Partial<ISiteMetadata> }> {
  return await schemaContent(`./${schema}.ts`);
}

async function getDefinitionModule (definition: string): Promise<{
  default?: TSite;
  siteMetadata: ISiteMetadata & Required<Pick<ISiteMetadata, "id" | "schema" | "isOffline">>;
}> {
  const module = await definitionContent(`./${definition}.ts`);

  // 补全缺失字段（此处补影响站点mete构造的内容，其余内容在 getDefinedSiteConfig 里面构造）
  module.siteMetadata.id ??= definition;
  module.siteMetadata.schema ??= module.siteMetadata.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite";

  return module;
}

/**
 * 使用 lodash 的 mergeWith 来合并站点配置和模板配置
 * 注意：此时未合并对应站点的用户配置！！！
 */
export async function getDefinedSiteConfig (definition: string): Promise<ISiteMetadata> {
  const { siteMetadata: definedSiteConfig} = await getDefinitionModule(definition);
  const { SchemaMetadata: definedSchemaConfig } = await getSchemaModule(definedSiteConfig.schema!);

  const siteConfig = mergeWith(
    {},  // use empty dict at first place since _.mergeWith will rewrite object
    definedSchemaConfig,
    definedSiteConfig,
    (objValue, srcValue, key) => {
      if (Array.isArray(objValue) || Array.isArray(srcValue)) {
        if (["filters", "switchFilters"].includes(key)) {
          // 不合并 filters，每次都用最后并入的
          return srcValue;
        } else {
          return ([] as any[])
            .concat(srcValue, objValue)   // 保证后并入的配置优先
            .filter((x) => typeof x !== "undefined");
        }
      }
    }) as ISiteMetadata;

  // 解密url加密过的站点
  siteConfig.url = restoreSecureLink(siteConfig.url);
  if (siteConfig.legacyUrls) {
    siteConfig.legacyUrls = siteConfig.legacyUrls.map(restoreSecureLink);
  }

  // 补全一些可以缺失字段
  siteConfig.isOffline ??= false;
  siteConfig.tags ??= [];
  siteConfig.activateUrl ??= siteConfig.url;
  siteConfig.host ??= new URL(siteConfig.url).host;
  siteConfig.allowSearch ??= Object.hasOwn(siteConfig, "search");
  siteConfig.allowQueryUserInfo ??= Object.hasOwn(siteConfig, "userInfo");
  siteConfig.timezoneOffset ??= siteConfig.schema === "NexusPHP" ? "+0800" : "+0000";

  if (siteConfig.category && siteConfig.search) {
    siteConfig.search.categories = ([] as any[]).concat(
      {
        name: "Category",
        ...siteConfig.category,
      },
      siteConfig.search.categories
    );
  }

  return siteConfig;
}

// FIXME 部分用户自定义的站点（此时在 js/site 目录中不存在对应模块），不能进行 dynamicImport 的情况，对此应该直接从 schema 中导入
export async function getSite (siteMetadata: ISiteMetadata): Promise<TSite> {
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
  return new SiteClass(siteMetadata);
}
