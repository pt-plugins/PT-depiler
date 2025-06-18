import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "ccfbits",
  name: "CCFBits",
  tags: ["影视", "剧集", "综合"],
  collaborator: ["Rhilip"],

  type: "private",
  schema: "TBSource",

  urls: ["https://ccfbits.org/"],

  isDead: true,

  levelRequirements: [
    { id: 1, name: "初级会员", interval: "P4W", uploaded: "25GB", ratio: 1.05 },
    { id: 2, name: "中级会员", interval: "P8W", downloaded: "50GB", uploaded: "200GB", ratio: 1.1 },
    { id: 3, name: "高级会员", interval: "P12W", downloaded: "100GB", uploaded: "500GB", ratio: 1.2 },
    { id: 4, name: "超级会员", interval: "P24W", downloaded: "200GB", uploaded: "1TB", ratio: 1.3 },
    { id: 5, name: "支柱会员", interval: "P32W", downloaded: "300GB", uploaded: "5TB", ratio: 2 },
  ],
};
