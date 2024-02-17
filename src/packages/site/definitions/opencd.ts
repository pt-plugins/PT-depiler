import type { ISiteMetadata } from "../types";
import {
  selectorSearchProgress,
  selectorSearchStatus,
  selectorUserInfoSeeding,
  selectorUserInfoSeedingSize,
} from "./hdchina";

export const siteMetadata: ISiteMetadata = {
  name: "OpenCD",
  timezoneOffset: "+0800",
  description: "皇后，专一的音乐类PT站，是目前国内最大的无损音乐PT",
  url: "https://open.cd/",
  tags: ["音乐"],
  schema: "NexusPHP",
  type: "private",
  search: {
    advanceKeyword: {
      imdb: {
        skip: true
      }
    },
    categories: [
      {
        name: "来源",
        key: "boardid",
        options: [
          { name: "普通区", value: 1 },
          { name: "原抓区", value: 2 },
        ],
      },
      {
        name: "類別",
        key: "source",
        options: [
          { value: 2, name: "流行(Pop)" },
          { value: 3, name: "古典(Classical)" },
          { value: 11, name: "器乐(Instrumental)" },
          { value: 4, name: "原声(OST)" },
          { value: 5, name: "摇滚(Rock)" },
          { value: 8, name: "爵士(Jazz)" },
          { value: 12, name: "新世纪(NewAge)" },
          { value: 13, name: "舞曲(Dance)" },
          { value: 14, name: "电子(Electronic)" },
          { value: 15, name: "民谣(Folk)" },
          { value: 16, name: "独立(Indie)" },
          { value: 17, name: "嘻哈(Hip Hop)" },
          { value: 9, name: "其他(Others)" },
        ],
        cross: { mode: "append" },
      },
    ],
    selectors: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [
        { selector: "img[src*='pic/share_rule_1.gif']", name: "Excl." }, // 禁转
      ],
    },
  },
  userInfo: {
    selectors: {
      // 如果页面能直接获取到的话
      seeding: selectorUserInfoSeeding,
      seedingSize: selectorUserInfoSeedingSize,
    },
  },
};
