/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/bemaniso.ws/config.json
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/1225
 *
 * 站点使用 GazelleJSONAPI 引擎，以游戏原声与音乐（Bemani 系音游）资源为主。
 * 注意：Jackett 未收录该站索引器，但站点本身仍在运行（2026-09-19 复核首页与 login.php 均可访问），
 * 故此处按存活站点处理；个人数据需登录后获取。
 *
 * 该站的 JSON 信封不是标准 Gazelle 的 `response`，而是 `data`（错误信息同样在 `data`），
 * 由引擎 GazelleJSONAPI.fixJsonEnvelope 统一兼容；index 若不下发 userstats，
 * 个人数据会回落到 user.php 资料页统计块（见 #1225）。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "bemaniso",
  name: "Bemaniso",
  description: "Bemaniso is a Private Torrent Tracker for GAME MUSIC / BEMANI（音游原声）",
  tags: ["游戏", "音乐"],

  collaborator: ["ted423"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://bemaniso.ws/"],

  search: {
    ...SchemaMetadata.search,
    // 站点结果不含 IMDb 信息
    advanceKeywordParams: {
      imdb: false,
    },
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Member" },
    { id: 3, name: "Power User" },
  ],
};
