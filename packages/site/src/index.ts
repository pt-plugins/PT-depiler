export * from "./types";
export * from "./utils";

import type { ISiteMetadata } from "./types";
import favicon from "./utils/favicon";
import BittorrentSite from "./schema/AbstractBittorrentSite";
import PrivateSite from "./schema/AbstractPrivateSite";

export { BittorrentSite, PrivateSite, favicon };

const schemaContent = import.meta.webpackContext!("./schema/", {
  regExp: /\.ts$/,
  chunkName: "lib/site/schema/[request]",
  mode: "lazy"
});

const definitionContent = import.meta.webpackContext!("./definitions/", {
  regExp: /\.ts$/,
  chunkName: "lib/site/definitions/[request]",
  mode: "lazy"
});

function transContent (value: string) {
  return value.replace(/^\.\//, "").replace(/\.ts$/, "");
}

export const schemaList = schemaContent.keys().map(transContent);
export const definitionList = definitionContent.keys().map(transContent);

export type TSite = PrivateSite | BittorrentSite;

export async function getSchemaModule (
  schema: string
): Promise<{ default: TSite }> {
  return await schemaContent(`./${schema}.ts`);
}

export async function getDefinitionModule (definition: string): Promise<{
  default?: TSite;
  siteMetadata: ISiteMetadata;
}> {
  return await definitionContent(`./${definition}.ts`);
}

const siteInstanceCache: Record<string, TSite> = {};

// FIXME 部分用户自定义的站点（此时在 js/site 目录中不存在对应模块），不能进行 dynamicImport 的情况，对此应该直接从 schema 中导入
export async function getSite (
  siteName: string,
  userConfig: Partial<ISiteMetadata> = {}
): Promise<TSite> {
  if (typeof siteInstanceCache[siteName] === "undefined") {
    let {
      // eslint-disable-next-line prefer-const
      siteMetadata: siteMetaData,
      default: SiteClass
    } = await getDefinitionModule(siteName);

    // 补全缺失字段（此处补影响站点mete构造的内容，其余内容在 config 里面构造）
    siteMetaData.id ??= siteName;
    siteMetaData.schema ??= siteMetaData.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite";

    /**
     * 如果该模块没有导出 default class，那么我们认为我们需要从基类继承
     * 并覆写基类的的 siteMetaData 信息
     */
    if (!SiteClass) {
      const schemaModule = await getSchemaModule(siteMetaData.schema);
      SiteClass = schemaModule.default;
    }

    // @ts-ignore
    siteInstanceCache[siteName] = new SiteClass(userConfig, siteMetaData);
  }

  return siteInstanceCache[siteName];
}
