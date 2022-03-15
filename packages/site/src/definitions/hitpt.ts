import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "百川PT",
  description: "校内10兆高速下载，优质高清资源共享！",
  url: "https://www.hitpt.com/",
  tags: ["教育网", "影视", "综合"],
  schema: "NexusPHP",
  type: "private",
  host: "www.hitpt.com",
  formerHosts: ["pt.ghtt.net"],
  collaborator: "tongyifan",
  category: {
    key: "cat",
    options: [
      // 影视分区
      { value: 401, name: "影视/高清电影" },
      { value: 402, name: "影视/高清剧集" },
      { value: 403, name: "影视/抢鲜或标清" },
      { value: 405, name: "影视/动漫" },
      { value: 407, name: "影视/体育" },
      { value: 413, name: "影视/纪录片" },
      { value: 416, name: "影视/综艺" },
      { value: 415, name: "影视/MV" },
      // 综合分区
      { value: 411, name: "综合/电子文档" },
      { value: 406, name: "综合/音乐" },
      { value: 408, name: "综合/工程软件" },
      { value: 404, name: "综合/教学视频" },
      { value: 410, name: "综合/游戏" },
      { value: 409, name: "综合/其他" },
    ],
  },
  search: {
    categories: [
      {
        name: "分区",
        key: "#changePath",
        options: [
          { name: "影视", value: "/torrents.php" },
          { name: "综合", value: "/music.php" /* 太NB了 */ },
        ],
      },
    ],
  },
};
