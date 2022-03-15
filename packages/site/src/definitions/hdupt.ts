import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDU",
  type: "private",
  schema: "NexusPHP",
  url: "https://pt.hdupt.com/",
  legacyUrl: ["https://pt.upxin.net/"],
  tags: ["影视", "综合"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "Movies/电影" },
      { value: 402, name: "TV Series/电视剧" },
      { value: 403, name: "TV Shows/综艺" },
      { value: 404, name: "Documentaries/纪录片" },
      { value: 405, name: "Animations/动画" },
      { value: 406, name: "Music Videos/音乐 MV" },
      { value: 407, name: "Sports/体育" },
      { value: 408, name: "HQ Audio/无损音乐" },
      { value: 411, name: "Misc/其他" },
      { value: 410, name: "Games/游戏" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      progress: {
        selector: ["td.embedded[style*='color: blue;font-weight: bold']"],
        filters: [
          (query: string) => {
            return /\d+%/.test(query) ? parseFloat(query) : 0;
          },
        ],
      },
      // TODO status
    },
  },
  userInfo: {
    selectors: {
      bonus: {
        selector: ["td.rowhead:contains('魔力值') + td"],
      },
    },
  },
};
