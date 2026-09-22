/**
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/femdomcult.org/config.json
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/femdomcult.yml
 * @Issue https://github.com/pt-plugins/PT-depiler/issues/143
 *
 * 站点使用 Luminance 源码（Gazelle 的分支）。Jackett 注释指出：其 ajax.php API 需要额外的
 * auth=<authkey> 参数，且 API 缺少海报图等信息，因此 Jackett 选择网页抓取而非走 API。
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromDict } from "../utils";

const categoryMap: Record<number, string> = {
  0: "其他",
  58: "业余/主流",
  59: "Femdom",
  60: "动漫漫画",
  61: "音频",
  62: "Femdom VIP",
  63: "恋物癖",
  64: "Gts-Vore-Crush",
  65: "Scat",
  66: "Transdom",
  68: "恋物癖 VIP",
  69: "Lezdom",
  70: "POV",
  71: "Strapon",
  72: "图片",
  73: "亚洲 Femdom",
  74: "女性肌肉",
  75: "虚拟现实",
  76: "游戏",
  77: "未知与低质量",
  78: "电子书",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "femdomcult",
  name: "Femdomcult",
  description: "Femdomcult is a Private Torrent Tracker for FETISH 3X",
  tags: ["成人", "XXX"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://srzqbzphyg.bet/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "appendQuote" },
    },
    {
      name: "优惠",
      key: "filter_freeleech",
      options: [{ name: "仅免费", value: 1 }],
    },
  ],

  search: {
    ...SchemaMetadata!.search!,
    requestConfig: {
      ...SchemaMetadata!.search!.requestConfig!,
      params: {
        order_by: "time",
        order_way: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata!.search!.selectors!,
      category: {
        selector: "td.cats_col > div",
        attr: "title",
        filters: [(title: string) => title?.trim() || undefined],
      },
    },
  },

  levelRequirements: [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Perv", interval: "P4W" },
    { id: 3, name: "Member" },
    { id: 4, name: "Power Perv" },
    { id: 5, name: "Guru" },
  ],
};
