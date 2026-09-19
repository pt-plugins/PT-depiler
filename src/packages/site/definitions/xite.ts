/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/x-ite.me/config.json
 * @JackettIssue https://github.com/Jackett/Jackett/issues/16573
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "xite",
  name: "x·ite.me",
  description: "x·ite.me 是一个综合类私有种子站点",
  tags: ["影视", "综合"],

  collaborator: ["davidxuang"],

  type: "private",

  urls: ["https://x-ite.me/"],

  // refs: https://github.com/Jackett/Jackett/issues/16573 （2026-03-12 确认 tracker 离线）
  // 站点域名仍解析、首页可访问，但仅返回 "We Will Be Back!" 落地页，tracker 未恢复服务，
  // 因此在 tracker 恢复前按死亡站点处理。
  isDead: true,
};
