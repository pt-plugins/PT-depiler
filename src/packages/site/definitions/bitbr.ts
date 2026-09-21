/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/bitbr/config.json
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 */
import { type ISiteMetadata } from "../types";
import { parseSizeString } from "../utils";
import { CategoryIncldead, CategorySpstate, SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "bitbr",
  name: "bitbr",
  description: "bitbr 是一个葡萄牙语综合类私有种子站点",
  tags: ["综合", "成人"],

  type: "private",
  schema: "NexusPHP",
  timezoneOffset: "-0300",

  urls: ["uggcf://ovgoe.pp/"],

  // PTPP 未提供分类表，此处沿用 NexusPHP 的通用分类参数与状态筛选
  category: [CategoryIncldead, CategorySpstate],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors,

      // 站点把上传量/下载量/分享率集中在一个 span.medium 里，需整体取出后再拆分。
      // 注意：elementProcess 返回 undefined 才会继续尝试下一个 selector，返回 "" 会被当成命中。
      uploaded: {
        selector: "span.medium",
        elementProcess: (element: HTMLElement) => {
          const match = (element.textContent ?? "").match(/Uploaded:\s*(.*?)\s+Downloaded/);
          return match ? parseSizeString(match[1]) : undefined;
        },
      },
      downloaded: {
        selector: "span.medium",
        elementProcess: (element: HTMLElement) => {
          const match = (element.textContent ?? "").match(/Downloaded:\s*(.*?)\s+Torrents/);
          return match ? parseSizeString(match[1]) : undefined;
        },
      },
      ratio: {
        selector: "span.medium",
        elementProcess: (element: HTMLElement) => {
          const match = (element.textContent ?? "").match(/Ratio:\s*(.*?)\s+Uploaded:/);
          return match ? match[1].replace(/,/g, "").trim() : undefined;
        },
      },

      // 葡语站点：等级为 "Classe"，魔力为 "Pontos Karma"
      levelName: {
        selector: "table.main tbody tbody td:contains(Classe)",
        elementProcess: (element: HTMLElement) => {
          const row = element.closest("tr");
          const target = row?.querySelectorAll("td")[1];
          const img = target?.querySelector("img");
          return (img?.getAttribute("title") ?? target?.textContent ?? "").trim() || undefined;
        },
      },
      bonus: {
        selector: "table.main tbody tbody td:contains(Pontos Karma)",
        elementProcess: (element: HTMLElement) => {
          const row = element.closest("tr");
          return (row?.querySelectorAll("td")[1]?.textContent ?? "").trim() || undefined;
        },
        filters: [{ name: "parseNumber" }],
      },
      joinTime: {
        selector: "table.main tbody tbody tr:nth-child(3) td:nth-child(2)",
        filters: [
          (value: string) => {
            const match = value.match(/\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{1,2}:\d{2}/);
            return match ? match[0] : value;
          },
          { name: "parseTime", args: ["yyyy-MM-dd HH:mm:ss"] },
        ],
      },
    },
  },

  levelRequirements: [
    { id: 1, name: "User" },
    { id: 2, name: "Power User" },
  ],
};
