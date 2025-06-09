import type { ISearchInput, ISiteMetadata, ITorrent, ITorrentTag } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdarea",
  name: "HDArea",
  aka: ["高清视界"],
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://uqnern.pyho/"],

  category: [
    {
      name: "类型",
      key: "cat",
      options: [
        { name: "Movie UHD-4K", value: 300 },
        { name: "Movies Blu-ray", value: 401 },
        { name: "Movies REMUX", value: 415 },
        { name: "Movies 3D", value: 416 },
        { name: "Movies 1080p", value: 410 },
        { name: "Movies 720p", value: 411 },
        { name: "Movies DVD", value: 414 },
        { name: "Movies WEB-DL", value: 412 },
        { name: "Movies HDTV", value: 413 },
        { name: "Movies iPad", value: 417 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "Blu-ray", value: 1 },
        { name: "REMUX", value: 3 },
        { name: "Encode", value: 7 },
        { name: "WEB-DL", value: 9 },
        { name: "MiniBD", value: 4 },
        { name: "HDTV", value: 5 },
        { name: "HD DVD", value: 2 },
        { name: "DVDR", value: 6 },
        { name: "CD", value: 8 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "x264", value: 7 },
        { name: "MPEG-4", value: 1 },
        { name: "x265", value: 6 },
        { name: "MPEG-2", value: 4 },
        { name: "Xvid", value: 3 },
        { name: "VC-1", value: 2 },
        { name: "Other", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { name: "AAC", value: 6 },
        { name: "DD5.1/AC3", value: 5 },
        { name: "TrueHD", value: 7 },
        { name: "DTS", value: 3 },
        { name: "DTS-HD MA", value: 4 },
        { name: "LPCM", value: 8 },
        { name: "WAV", value: 9 },
        { name: "APE", value: 2 },
        { name: "FLAC", value: 1 },
        { name: "TrueHD Atmos", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "720p", value: 3 },
        { name: "1080p", value: 1 },
        { name: "SD", value: 4 },
        { name: "1080i", value: 2 },
        { name: "4K", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { name: "EPiC", value: 1 },
        { name: "HDArea", value: 2 },
        { name: "HDWING", value: 3 },
        { name: "WiKi", value: 4 },
        { name: "TTG", value: 5 },
        { name: "other", value: 6 },
        { name: "MTeam", value: 7 },
        { name: "HDApad", value: 8 },
        { name: "CHD", value: 9 },
        { name: "HDAccess", value: 10 },
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
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { name: "首发", selector: "img.first_publish", color: "#3887D7" },
        { name: "禁转", selector: "img.transfer_forbidden", color: "#5E14DA" },
      ],
    },
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "新用户的默认级别",
    },
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        '得到1个邀请名额；可以直接发布种子；可以查看NFO文档；；可以请求续种； 可以发送邀请（开放邀请权限时）； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    { id: 2, name: "Elite User", interval: "P8W", downloaded: "120GB", ratio: 3.0, privilege: "权限同上。" },
    {
      id: 3,
      name: "Crazy User",
      interval: "P10W",
      downloaded: "300GB",
      ratio: 3.5,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P12W",
      downloaded: "750GB",
      ratio: 4.0,
      privilege: "可以查看普通日志。Insane User及以上用户封存账号后不会被删除。",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P20W",
      downloaded: "1024GB",
      ratio: 4.5,
      privilege: "可以查看其它用户的评论、帖子历史。Veteran User及以上用户会永远保留账号。",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P25W",
      downloaded: "2TB",
      ratio: 5.0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P30W",
      downloaded: "5TB",
      ratio: 5.5,
      privilege: "得到1个邀请名额。",
    },
    { id: 8, name: "Nexus Master", interval: "P40W", downloaded: "10TB", ratio: 6.0, privilege: "得到2个邀请名额。" },
  ],
};

export default class HDArea extends NexusPHP {
  // 获取种子标签
  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element | Document,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    super.parseTorrentRowForTags(torrent, row, searchConfig);

    const customTags = row.querySelectorAll("font[class]");
    if (customTags.length > 0) {
      const tags: ITorrentTag[] = torrent.tags || [];
      customTags.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const tagName = htmlElement.textContent?.replace(/\s/g, "").replace("免费", "Free");
        if (tagName) {
          tags.push({ name: tagName });
        }
      });

      torrent.tags = tags;
    }

    return torrent;
  }
}
