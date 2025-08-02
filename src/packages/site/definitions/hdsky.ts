import urlJoin from "url-join";
import { omit } from "es-toolkit";

import {
  ETorrentStatus,
  type ILevelRequirement,
  type ISearchInput,
  type ISiteMetadata,
  type ITorrent,
  type ITorrentTag,
  IUserInfo,
  TLevelId,
} from "../types";
import { guessUserLevelId, store } from "../utils";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
  subTitleRemoveExtraElement,
} from "../schemas/NexusPHP.ts";

// 2025年3月1日起加入的用户使用新的用户等级要求
const newUserLevelRequirements: ILevelRequirement[] = [
  {
    id: 1,
    name: "User",
    privilege: `新用户的默认级别。`,
  },
  {
    id: 2,
    name: "Power User",
    interval: "P5W",
    downloaded: "200GB",
    ratio: 2.0,
    bonus: 600000,
    privilege: "NFO文档；请求续种；查看其它用户的种子历史；删除自己上传的字幕",
  },
  {
    id: 3,
    name: "Elite User",
    interval: "P10W",
    downloaded: "500GB",
    ratio: 2.5,
    bonus: 800000,
    privilege: "查看邀请区",
  },
  {
    id: 4,
    name: "Crazy User",
    interval: "P15W",
    downloaded: "1TB",
    ratio: 3.0,
    bonus: 1000000,
    privilege: "在做种/下载/发布的时候选择匿名模式",
  },
  {
    id: 5,
    name: "Insane User",
    interval: "P20W",
    downloaded: "2TB",
    ratio: 3.5,
    bonus: 1500000,
    privilege: "查看普通日志",
  },
  {
    id: 6,
    name: "Veteran User",
    interval: "P25W",
    downloaded: "4TB",
    ratio: 4.0,
    bonus: 2000000,
    privilege: "封存账号后不会被删除；查看其它用户的评论、帖子历史",
  },
  {
    id: 7,
    name: "Extreme User",
    interval: "P30W",
    downloaded: "6TB",
    ratio: 4.5,
    bonus: 2500000,
    privilege: "更新过期的外部信息；查看Extreme User论坛",
  },
  {
    id: 8,
    name: "Ultimate User",
    interval: "P45W",
    downloaded: "8TB",
    ratio: 5.0,
    bonus: 3500000,
    privilege: "永远保留账号",
  },
  {
    id: 9,
    name: "Nexus Master",
    interval: "P65W",
    downloaded: "10TB",
    ratio: 5.5,
    bonus: 5000000,
    privilege: "直接发布种子；可以查看排行榜；在网站开放邀请期间发送邀请",
  },
];

const oldUserLevelRequirements = newUserLevelRequirements.map((level) => {
  return omit(level, ["bonus"]);
}) as ILevelRequirement[];

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdsky",
  name: "HDSky",
  description: "高清发烧友后花园PT",
  tags: ["影视", "纪录片", "综合"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://hdsky.me/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "Movies/电影" },
        { value: 404, name: "Documentaries/纪录片" },
        { value: 410, name: "iPad/iPad影视" },
        { value: 405, name: "Animations/动漫" },
        { value: 402, name: "TV Series/剧集(分集）" },
        { value: 411, name: "TV Series/剧集(合集）" },
        { value: 403, name: "TV Shows/综艺" },
        { value: 406, name: "Music Videos/音乐MV" },
        { value: 407, name: "Sports/体育" },
        { value: 408, name: "HQ Audio/无损音乐" },
        { value: 409, name: "Misc/其他" },
        { value: 412, name: "TV Series/海外剧集(分集）" },
        { value: 413, name: "TV Series/海外剧集(合集）" },
        { value: 414, name: "TV Shows/海外综艺(分集）" },
        { value: 415, name: "TV Shows/海外综艺(合集）" },
        { value: 416, name: "Shortplay/短剧" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 1, name: "UHD Blu-ray" },
        { value: 14, name: "UHD Blu-ray/DIY" },
        { value: 12, name: "Blu-ray/DIY" },
        { value: 3, name: "Remux" },
        { value: 7, name: "Encode" },
        { value: 5, name: "HDTV" },
        { value: 6, name: "DVDR" },
        { value: 8, name: "CD" },
        { value: 4, name: "MiniBD" },
        { value: 9, name: "Track" },
        { value: 11, name: "WEB-DL" },
        { value: 15, name: "SACD" },
        { value: 2, name: "HD DVD" },
        { value: 16, name: "3D Blu-ray" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264/AVC" },
        { value: 13, name: "x265" },
        { value: 10, name: "x264" },
        { value: 12, name: "HEVC" },
        { value: 2, name: "VC-1" },
        { value: 4, name: "MPEG-2" },
        { value: 3, name: "Xvid" },
        { value: 11, name: "Other" },
        { value: 14, name: "MVC" },
        { value: 15, name: "ProRes" },
        { value: 17, name: "VP9" },
        { value: 16, name: "AV1" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 10, name: "DTS-HDMA" },
        { value: 16, name: "DTS-HDMA:X 7.1" },
        { value: 17, name: "TrueHD Atmos" },
        { value: 19, name: "PCM" },
        { value: 11, name: "TrueHD" },
        { value: 3, name: "DTS" },
        { value: 13, name: "LPCM" },
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 4, name: "MP3" },
        { value: 5, name: "OGG" },
        { value: 6, name: "AAC" },
        { value: 12, name: "AC3/DD" },
        { value: 7, name: "Other" },
        { value: 14, name: "DTS-HD HR" },
        { value: 15, name: "WAV" },
        { value: 18, name: "DSD" },
        { value: 22, name: "Opus" },
        { value: 20, name: "E-AC3" },
        { value: 21, name: "DDP with Dolby Atmos" },
        { value: 23, name: "ALAC" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 5, name: "4K/2160p" },
        { value: 1, name: "2K/1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
        { value: 6, name: "8K/4320P" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 6, name: "HDSky/原盘DIY小组" },
        { value: 1, name: "HDS/重编码及remux小组" },
        { value: 28, name: "HDS3D/3D重编码小组" },
        { value: 9, name: "HDSTV/电视录制小组" },
        { value: 31, name: "HDSWEB/网络视频小组" },
        { value: 18, name: "HDSPad/移动视频小组" },
        { value: 22, name: "HDSCD/无损音乐小组" },
        { value: 34, name: "HDSpecial|稀缺资源" },
        { value: 24, name: "Original/自制原创资源" },
        { value: 27, name: "Other/其他制作组或转发资源" },
        { value: 26, name: "Autoseed/自动发布机器人" },
        { value: 30, name: "BMDru小组" },
        { value: 25, name: "AREA11/韩剧合作小组" },
        { value: 33, name: "Request/应求发布资源" },
        { value: 35, name: "HDSWEB/(网络视频小组合集专用)" },
        { value: 36, name: "HDSAB/有声书小组" },
        { value: 37, name: "HDSWEB/(补档专用)" },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      id: {
        selector: 'form[action*="download.php"]:first',
        attr: "action",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      url: {
        selector: 'form[action*="download.php"]:first',
        attr: "action",
        filters: [
          { name: "querystring", args: ["id"] },
          { name: "prepend", args: ["/details.php?id="] },
        ],
      },
      subTitle: {
        text: "",
        selector: ["a[href*='hit'][title]", "a[href*='hit']:has(b)"],
        elementProcess: (element) => {
          const noTagSubTitle = subTitleRemoveExtraElement(["span.optiontag"], true)(element);

          // 移除 [优惠剩余时间：17时50分] [ promotion will end in 23 hours 16 mins] [優惠剩餘時間：23時16分] 内容
          return noTagSubTitle.replace(/\[(优惠剩余时间| ?promotion will end in |優惠剩餘時間).*\]/g, "").trim();
        },
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

      ext_douban: { selector: ["a[href*='douban.com']"], attr: "href", filters: [{ name: "extDoubanId" }] },
      ext_imdb: { selector: ["a[href*='imdb.com']"], attr: "href", filters: [{ name: "extImdbId" }] },
    },
  },

  detail: {
    ...(SchemaMetadata.detail ?? {}),
    selectors: {
      ...(SchemaMetadata.detail?.selectors ?? {}),
      link: {
        selector: 'form[action*="download.php"]:first',
        attr: "action",
      },
    },
  },

  levelRequirements: newUserLevelRequirements,
};

export default class Hdsky extends NexusPHP {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (torrent.link) {
      const linkCreatedTime = this.runQueryFilters(torrent.link, [{ name: "querystring", args: ["t"] }]) as string;

      const currentTimestamp = Date.now() / 1000;
      const expiredTimestamp = parseInt(linkCreatedTime || "0") + 10 * 60; // 这里假定下载链接有效期10分钟（具体不明）

      if (currentTimestamp < expiredTimestamp) {
        return torrent.link;
      } else {
        delete torrent.link; // 删除过期链接属性，以便重新获取
      }
    }

    // 为 content-script 的 drag 生成 url，以免 super 无法获取到 torrent.url 进而无法生成 link
    if (torrent.id && !torrent.url) {
      torrent.url = urlJoin(this.url, `/details.php?id=${torrent.id}`);
    }

    return super.getTorrentDownloadLink(torrent);
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    super.parseTorrentRowForTags(torrent, row, searchConfig);

    const customTags = row.querySelectorAll("span.optiontag[style*='background-color'][style*='color']");
    if (customTags.length > 0) {
      const tags: ITorrentTag[] = torrent.tags || [];
      customTags.forEach((element) => {
        const tagName = (element as HTMLElement).textContent;
        const tagColor = (element as HTMLElement).style.backgroundColor;
        if (tagName && tagColor) {
          tags.push({ name: tagName, color: tagColor });
        }
      });

      torrent.tags = tags;
    }

    return torrent;
  }

  protected override guessUserLevelId(userInfo: IUserInfo): TLevelId {
    // 优先使用新用户等级要求
    let judgeLevelRequirements = newUserLevelRequirements;

    if (this.userConfig.merge?.levelRequirements) {
      // 如果用户配置中有自定义的等级要求，则使用自定义的等级要求
      judgeLevelRequirements = this.userConfig.merge.levelRequirements;
    } else {
      if (userInfo.joinTime && userInfo.joinTime < 1740787200000) {
        // 如果用户加入时间在 2025年3月1日之前，则使用旧的用户等级要求
        judgeLevelRequirements = oldUserLevelRequirements;

        // 将旧的用户等级要求存储到 metadataStore.sites.hdsky.merge.levelRequirements 中，以便于展示
        store(this.metadata.id, "levelRequirements", judgeLevelRequirements, "merge").catch();
      }
    }

    return guessUserLevelId(userInfo, judgeLevelRequirements);
  }
}
