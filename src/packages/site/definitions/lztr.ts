/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/lztr.me/config.json
 * @JackettIssue https://github.com/Jackett/Jackett/issues/13742
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * LzTr 是一个以原声带（OST）与古典音乐为主的私有 Gazelle 站点。
 * 注意：Jackett 未收录该站索引器（其请求 #13742 仍为 open），但站点本身仍在运行
 * （2026-09-19 复核首页与 login.php 均可访问），故此处按存活站点处理。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Gazelle";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "lztr",
  name: "LzTr",
  description: "LzTr is a Private site for Original Soundtracks and Classical Music（原声带与古典音乐）",
  tags: ["音乐"],

  collaborator: ["ylxb2016", "amorphobia"],

  type: "private",
  schema: "Gazelle",

  urls: ["https://lztr.me/"],

  search: {
    ...SchemaMetadata.search,
    // 站点结果不含 IMDb 信息
    advanceKeywordParams: {
      imdb: false,
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    // 站点使用 levelExtendInfo 接口补充做种/发布/完成数，沿用 PTPP 的 ajax 端点
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,
      seeding: {
        selector: "li:contains('Seeding:')",
        filters: [{ name: "parseNumber" }],
      },
      uploads: {
        selector: "li:contains('Uploaded:')",
        filters: [{ name: "parseNumber" }],
      },
      snatches: {
        selector: "li:contains('Snatched:')",
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      snatches: 1,
      privilege: "Can make requests, bookmarks, edit Collages, and can access the Top 10",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P2W",
      uploads: 5,
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Receives invites, can access notifications, create new collages, access power user & invites forums.",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P4W",
      uploads: 50,
      uploaded: "100GB",
      ratio: 1.05,
      privilege: "Top 10 filters",
    },
    {
      id: 4,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 200,
      uploaded: "200GB",
      ratio: 1.05,
      privilege: "Can invite users even when invites are closed, Can send unlimited invites",
    },
  ],
};
