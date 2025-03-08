import { ISiteMetadata, ETorrentStatus } from "../types";
import { SchemaMetadata } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ourbits",
  name: "OurBits",
  schema: "NexusPHP",
  type: "private",
  urls: ["https://ourbits.club/"],
  description: "综合性网站，有分享率要求",
  tags: ["影视", "动漫", "纪录片", "综艺"],
  collaborator: ["Rhilip"],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      ext_imdb: { selector: "label.imdb_rate", data: "imdbid" },
      ext_douban: { selector: "label.douban_rate", data: "doubanid" },
      progress: {
        selector: "div.progressBar > div",
        attr: "style",
        filters: [
          (query: string) => {
            const progressMatch = query.match(/width:.?(\d.+)%/);
            return progressMatch && progressMatch.length >= 2 ? parseFloat(progressMatch[1]) : 0;
          },
        ],
      },
      status: {
        selector: "div.progressBar > div",
        attr: "title",
        filters: [
          (query: string) => {
            const progressStatusMatch = query.match(/(\d.+)% (进行中|未开始)/);
            if (progressStatusMatch && progressStatusMatch.length >= 3) {
              const progress = parseFloat(progressStatusMatch[1]);
              const status = progressStatusMatch[2];

              if (status === "进行中") {
                return progress < 100 ? ETorrentStatus.downloading : ETorrentStatus.seeding;
              } else {
                // if (status === '未开始')
                return progress < 100 ? ETorrentStatus.inactive : ETorrentStatus.completed;
              }
            }
            return ETorrentStatus.unknown;
          },
        ],
      },
      tags: [
        { selector: ".tag.tag-gf", name: "官方" },
        { selector: ".tag.tag-diy", name: "DIY" },
        { selector: ".tag.tag-sf", name: "首发" },
        { selector: ".tag.tag-gy", name: "国语" },
        { selector: ".tag.tag-zz", name: "中字" },
        { selector: ".tag.tag-yq", name: "应求" },
        { selector: ".tag.tag-jz", name: "Excl." }, // 禁转
        { selector: ".tag.tag-bd", name: "蓝光" }, // 不明，这个标签已经不做使用
        { selector: ".tag.tag-db", name: "杜比视界" },
        { selector: ".tag.tag-hdr10", name: "HDR10" },
        { selector: ".tag.tag-hdr10p", name: "HDR10+" },
        { selector: ".tag.tag-hlg", name: "HLG" },
      ],
    },
  },
};
