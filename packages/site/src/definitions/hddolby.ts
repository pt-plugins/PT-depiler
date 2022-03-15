import type { ISiteMetadata } from "../types";
import { selectorSearchProgress, selectorSearchStatus } from "./hdhome";

export const siteMetadata: ISiteMetadata = {
  name: "HD Dolby",
  schema: "NexusPHP",
  type: "private",
  url: "https://www.hddolby.com/",
  description: "高清杜比",
  tags: ["影视", "综合"],
  collaborator: ["iceyuamao0510", "tongyifan"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "Movies电影" },
      { value: 402, name: "TV Series电视剧" },
      { value: 404, name: "Documentaries纪录片" },
      { value: 405, name: "Animations动漫" },
      { value: 403, name: "TV Shows综艺" },
      { value: 406, name: "Music Videos" },
      { value: 407, name: "Sports体育" },
      { value: 408, name: "HQ Audio音乐" },
      { value: 410, name: "Games游戏" },
      { value: 411, name: "Study学习" },
      { value: 409, name: "Others其他" },
    ],
  },
  search: {
    selectors: {
      // FIXME 先从HDHOME中抄一下，没测试过
      // 但两个站的 sysop 基本是同一人，应该和我一样会偷懒的吧
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      // FIXME 先从HDHOME中抄一下，没测试过
      tags: [
        { selector: "img.hitandrun", name: "H&R", color: "#000" },
        { selector: "span.tgf", name: "官方", color: "#06c" },
        { selector: "span.tyc", name: "原创", color: "#085" },
        { selector: "span.tgz", name: "官字", color: "#530" },
        { selector: "span.tdb", name: "Dolby Vision", color: "#358" },
        { selector: "span.thdr10", name: "HDR10", color: "#9a3" },
        { selector: "span.thdrm", name: "HDR10+", color: "#9b5" },
        { selector: "span.tgy", name: "国配", color: "#f96" },
        { selector: "span.tyy", name: "粤配", color: "#f66" },
        { selector: "span.tzz", name: "中字", color: "#9c0" },
        { selector: "span.tjz", name: "Excl." }, // 禁转
        { selector: "span.txz", name: "限转", color: "#c03" },
        { selector: "span.tdiy", name: "DIY", color: "#993" },
        { selector: "span.tsf", name: "首发", color: "#339" },
        { selector: "span.tyq", name: "应求", color: "#f90" },
        { selector: "span.tm0", name: "零魔", color: "#096" },
      ],
    },
  },
};
