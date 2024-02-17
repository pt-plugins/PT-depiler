import { ISiteMetadata, ETorrentStatus } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "HDSky",
  schema: "NexusPHP",
  type: "private",
  url: "https://hdsky.me/",
  description: "高清发烧友后花园PT",
  tags: ["影视", "纪录片", "综合"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "Movies/电影" },
      { value: 404, name: "Documentaries/纪录片" },
      { value: 410, name: "iPad/iPad影视" },
      { value: 405, name: "Animations/动漫" },
      { value: 402, name: "TV Series/剧集" },
      { value: 403, name: "TV Shows/综艺" },
      { value: 406, name: "Music Videos/音乐MV" },
      { value: 407, name: "Sports/体育" },
      { value: 408, name: "HQ Audio/无损音乐" },
      { value: 409, name: "Misc/其他" },
    ],
    cross: { mode: "append" },
  },
  search: {
    selectors: {
      id: {
        selector: 'form[action*="download.php"]:first',
        attr: "action",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      url: {
        selector: 'form[action*="download.php"]:first',
        attr: "action",
        filters: [{ name: "querystring", args: ["id"] }, {name: "perpend", args: ["/details.php?id="]}],
      },
      link: {
        selector: 'form[action*="download.php"]:first',
        attr: "action",
      },
      progress: {
        selector: ["div.progressseeding, div.progressfinished, div.progressdownloading, div.progressdownloaded"],
        attr: "style",
        filters: [
          (query: string | undefined) => {
            query = query || "";
            const queryMatch = query.match(/width:([ \d.]+)%/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          },
        ],
      },
      status: {
        text: ETorrentStatus.unknown,
        selector: ['div[class^="progress"]'],
        case: {
          ".progressseeding": ETorrentStatus.seeding,
          ".progressdownloading": ETorrentStatus.downloading,
          ".progressfinished": ETorrentStatus.completed,
          ".progressdownloaded": ETorrentStatus.inactive,
        },
      },
    },
  },
};
