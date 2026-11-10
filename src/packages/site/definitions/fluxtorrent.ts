import type { ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/FluxTorrent.ts";

/**
 * FluxTorrent（通用 PT 建站系统）自建站
 *
 * FluxTorrent 是可自部署的建站系统，没有唯一的公共地址，因此这里的 `urls` 只是
 * 本机默认地址；请在「站点设置 → 地址」里把它改成自己部署的站点地址，
 * 并在「开放 API」页面签发 Token（`fxo_` 开头）填入。
 *
 * 兼容层与开放 API 的契约见 `schemas/FluxTorrent.ts`。
 */
export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "fluxtorrent",
  name: "FluxTorrent",
  description: "FluxTorrent 是通用 PT 建站系统，本条目用于自建站，请在站点设置中把地址改为自己的站点地址。",
  tags: ["综合"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "FluxTorrent",
  urls: ["http://localhost:3000/"],
};
