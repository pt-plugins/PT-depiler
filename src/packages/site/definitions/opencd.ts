import { ETorrentStatus, type IElementQuery, type ITorrent, type ISiteMetadata } from "../types";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "../schemas/NexusPHP.ts";

// OpenCD 中的部分选择器和处理方法被其他站公用
export const selectorSearchProgress: IElementQuery = {
  selector: [".progress:eq(0) > div"],
  attr: "style",
  filters: [
    (query: string) => {
      const queryMatch = query.match(/width:([ \d.]+)%/);
      return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
    },
  ],
};

export const selectorSearchStatus: IElementQuery = {
  text: ETorrentStatus.unknown,
  selector: [".progress:eq(0) > div"],
  case: {
    ".progress_seeding": ETorrentStatus.seeding,
    ".progress_completed": ETorrentStatus.completed,
    ".progress_no_downloading": ETorrentStatus.inactive,
    ".progress_downloading": ETorrentStatus.downloading,
  },
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "opencd",
  name: "OpenCD",
  aka: ["皇后"],
  description: "皇后，专一的音乐类PT站，是目前国内最大的无损音乐PT",
  tags: ["音乐"],

  collaborator: ["*", "cnsunyour"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://bcra.pq/", "uggcf://jjj.bcra.pq/"],
  favicon: "./opencd.ico",

  category: [
    {
      name: "類型",
      key: "cat",
      options: [
        { name: "音乐(Music)", value: 408 },
        { name: "演唱会(Vocal Concert)", value: 402 },
        { name: "戏剧(Drama)", value: 405 },
        { name: "其他(Other)", value: 409 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "類別",
      key: "source",
      options: [
        { name: "流行(Pop)", value: 2 },
        { name: "古典(Classical)", value: 3 },
        { name: "器乐(Instrumental)", value: 11 },
        { name: "原声(OST)", value: 4 },
        { name: "摇滚(Rock)", value: 5 },
        { name: "爵士(Jazz)", value: 8 },
        { name: "新世纪(NewAge)", value: 12 },
        { name: "舞曲(Dance)", value: 13 },
        { name: "电子(Electronic)", value: 14 },
        { name: "民谣(Folk)", value: 15 },
        { name: "独立(Indie)", value: 16 },
        { name: "嘻哈(Hip Hop)", value: 17 },
        { name: "音乐剧(Musical)", value: 18 },
        { name: "乡村(Country)", value: 19 },
        { name: "另类(Alternative)", value: 20 },
        { name: "世界音乐(World)", value: 21 },
        { name: "其他(Others)", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { name: "CD", value: 1 },
        { name: "24KCD", value: 2 },
        { name: "DSD", value: 3 },
        { name: "LPCD", value: 4 },
        { name: "HDCD", value: 5 },
        { name: "SACD", value: 6 },
        { name: "SRCD", value: 7 },
        { name: "K2CD", value: 8 },
        { name: "DTS", value: 9 },
        { name: "DAT", value: 10 },
        { name: "Blu-ray", value: 11 },
        { name: "HD DVD", value: 12 },
        { name: "HDTV", value: 13 },
        { name: "DVD", value: 14 },
        { name: "HQCD", value: 16 },
        { name: "XRCD", value: 17 },
        { name: "SHM-CD", value: 18 },
        { name: "Blu-spec", value: 19 },
        { name: "Vinyl", value: 20 },
        { name: "Web", value: 21 },
        { name: "HI-RES", value: 22 },
        { name: "Other", value: 15 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "格式",
      key: "standard",
      options: [
        { name: "镜像(Mirror)", value: 1 },
        { name: "WAV", value: 2 },
        { name: "FLAC", value: 4 },
        { name: "DTS", value: 15 },
        { name: "DFF", value: 17 },
        { name: "DSF", value: 18 },
        { name: "DST", value: 19 },
        { name: "其它(Other)", value: 10 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "製作組",
      key: "team",
      options: [
        { name: "OpenCD", value: 7 },
        { name: "LLM", value: 8 },
        { name: "TSxD", value: 9 },
        { name: "KHQ", value: 6 },
        { name: "其他(Other)", value: 5 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "地区(Area)",
      key: "area",
      options: [
        { name: "大陆", value: 1 },
        { name: "欧美", value: 2 },
        { name: "港台", value: 3 },
        { name: "日韩", value: 4 },
        { name: "其它地区", value: 5 },
      ],
      cross: { mode: "append", key: "tag" },
    },
    {
      name: "风格(Style)",
      key: "style",
      options: [
        { name: "流行(Pop)", value: 6 },
        { name: "发烧(HiFi)", value: 7 },
        { name: "汽车(garage)", value: 8 },
        { name: "古典(Classical)", value: 9 },
        { name: "民族(National)", value: 10 },
        { name: "摇滚(rock)", value: 11 },
        { name: "原声(OST)", value: 12 },
        { name: "民间(Folk)", value: 13 },
        { name: "乡村(Country)", value: 14 },
        { name: "天籁(Soul)", value: 15 },
        { name: "新世纪(NewAge)", value: 16 },
        { name: "蓝调(Blues)", value: 17 },
        { name: "爵士(Jazz)", value: 18 },
        { name: "金属(Metal)", value: 19 },
        { name: "朋克(Punk)", value: 20 },
        { name: "电子(Electronic)", value: 21 },
        { name: "儿童(Children's)", value: 22 },
        { name: "宗教(Religion)", value: 23 },
        { name: "雷鬼(Reggae)", value: 24 },
        { name: "贝斯(Drum&Bass)", value: 25 },
        { name: "说唱(Rap)", value: 26 },
        { name: "音乐剧(Musical)", value: 27 },
      ],
      cross: { mode: "append", key: "tag" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "来源？",
      key: "boardid",
      options: [
        { name: "普通区", value: 1 },
        { name: "原抓区", value: 2 },
      ],
      cross: false,
    },
    {
      name: "掃圖？",
      key: "artwork",
      options: [
        { name: "全部", value: 0 },
        { name: "完整掃圖", value: 1 },
        { name: "非完整掃圖", value: 2 },
      ],
      cross: false,
    },
    {
      name: "Log？",
      key: "log",
      options: [
        { name: "全部", value: 0 },
        { name: "100分", value: 1 },
        { name: "非100分", value: 2 },
      ],
      cross: false,
    },
    {
      name: "只顯示我下載過的？",
      key: "option-torrents",
      options: [
        { name: "全部", value: 0 },
        { name: "我下載過的", value: 1 },
        { name: "我下載過，但未在做種的", value: 2 },
        { name: "正在做種的", value: 3 },
        { name: "有H&R可能性的", value: 4 },
        { name: "正在下載的", value: 5 },
        { name: "未下載過的", value: 6 },
        { name: "未完成的", value: 7 },
        { name: "已得到H&R的", value: 8 },
        { name: "已完成的", value: 9 },
        { name: "我发布的", value: 10 },
        { name: "我发布的，但未在做種", value: 11 },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    advanceKeywordParams: {
      imdb: false,
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [
        ...SchemaMetadata.search!.selectors!.tags!,
        { selector: "img[src*='pic/share_rule_1.gif']", name: "Excl.", color: "deep-orange-darken-1" }, // 禁转
      ],
    },
  },

  detail: {
    // 该站详情页为 /plugin_details.php?id=数字
    urlPattern: ["/plugin_details.php"],

    selectors: {
      id: {
        selector: ":self",
        elementProcess: (element: Document) => {
          // 从 URL 中获取 ID，例如 /plugin_details.php?id=179082
          const url = element.URL;
          const idMatch = url.match(/id=(\d+)/);
          if (idMatch && idMatch.length >= 2) {
            return idMatch[1];
          }
          return undefined;
        },
      },
      title: {
        // 音乐站title不适合作为搜索词
        selector: 'td.rowtitle:contains("專輯名稱：") + td',
        attr: "title",
      },
      link: {
        selector: ['a[href*="download.php?id="][href*="&passkey="]'],
        attr: "href",
      },
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      hnrUnsatisfied: {
        text: 0,
        selector: ["td.rowfollow > a[href*='torrents.php?option-torrents=8']"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "採女-正八品(User)",
      privilege: `新用户的默认级别；可以查看NFO/LOG文档。`,
    },
    {
      id: 2,
      name: "常在-正七品(Power User)",
      interval: "P5W",
      ratio: 1.5,
      alternative: [{ downloaded: "20GB" }, { uploads: 5 }],
      privilege:
        '得到一个邀请名额；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。',
    },
    {
      id: 3,
      name: "贵人-正六品(Elite User)",
      interval: "P10W",
      ratio: 2.0,
      alternative: [{ downloaded: "60GB" }, { uploads: 20 }],
      privilege:
        "得到两个邀请名额；贵人-正六品(Elite User)及以上用户封存账号后规定时间内不会被删除；发布三个种子后无需经过候选 可直接发布种子。",
    },
    {
      id: 4,
      name: "良媛-正五品(Crazy User)",
      interval: "P15W",
      ratio: 2.5,
      alternative: [{ downloaded: "200GB" }, { uploads: 50 }],
      privilege: "得到三个邀请名额；可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 5,
      name: "容华-正四品(Insane User)",
      interval: "P20W",
      ratio: 3.0,
      alternative: [{ downloaded: "400GB" }, { uploads: 100 }],
      privilege: "得到四个邀请名额；可以查看普通日志。",
    },
    {
      id: 6,
      name: "贵嫔-正三品(Veteran User)",
      interval: "P25W",
      ratio: 3.5,
      alternative: [{ downloaded: "600GB" }, { uploads: 200 }],
      privilege:
        "得到五个邀请名额；可以查看用户列表，可以查看其它用户的评论、帖子历史。贵嫔-正三品(Veteran User)及以上用户会永远保留账号。",
    },
    {
      id: 7,
      name: "淑仪-正二品(Extreme User)",
      interval: "P25W",
      ratio: 4.0,
      alternative: [{ downloaded: "1TB" }, { uploads: 300 }],
      privilege: "得到六个邀请名额；可以更新过期的外部信息。",
    },
    {
      id: 8,
      name: "贵妃-正一品(Ultimate User)",
      interval: "P30W",
      ratio: 4.5,
      alternative: [{ downloaded: "2TB" }, { uploads: 450 }],
      privilege: "得到七个邀请名额；查看种子文件的结构。",
    },
    {
      id: 9,
      name: "皇后(Nexus Master)",
      interval: "P30W",
      ratio: 5.0,
      alternative: [{ downloaded: "3TB" }, { uploads: 600 }],
      privilege: "得到十个邀请名额。",
    },
    { id: 100, name: "貴賓(VIP)", groupType: "vip" },
    { id: 101, name: "養老族", groupType: "vip" },
    { id: 201, name: "保種員", groupType: "manager" },
    { id: 202, name: "發布員", groupType: "manager" },
    { id: 203, name: "工作人員", groupType: "manager" },
    { id: 204, name: "管理员", groupType: "manager" },
    { id: 205, name: "論壇版主", groupType: "manager" },
    { id: 206, name: "總版主", groupType: "manager" },
    { id: 207, name: "維護開发員", groupType: "manager" },
  ],
};

export default class OpenCD extends NexusPHP {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    // 对 OpenCD 站点，种子详情页为 /plugin_details.php?id=123 的形式
    if (torrent.link && torrent.link.includes("/plugin_details.php")) {
      return torrent.link.replace(/plugin_details\.php\?id=(\d+)/, "download.php?id=$1").replace(/&hit=1/, ""); // hit=1 是为了统计下载次数
    }

    return super.getTorrentDownloadLink(torrent);
  }
}
