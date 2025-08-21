import Sizzle from "sizzle";
import { buildCategoryOptions, parseSizeString, parseTimeWithZone, tryToNumber } from "../utils";
import {
  EResultParseStatus,
  ETorrentStatus,
  IAdvanceKeywordSearchConfig,
  ISearchEntryRequestConfig,
  ISearchInput,
  ISearchResult,
  ISiteMetadata,
  ITorrent,
  IUserInfo,
  NeedLoginError,
  NoTorrentsError,
} from "../types";
import Gazelle, { SchemaMetadata } from "../schemas/Gazelle.ts";
import { toMerged } from "es-toolkit";
import type { AxiosRequestConfig } from "axios";
import { isEmpty, set } from "es-toolkit/compat";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "greatposterwall",
  name: "GreatPosterWall",
  aka: ["海豹", "GPW"],
  description:
    "GPW 全名 Great Poster Wall，结合了长城（the Great Wall）、海报墙（Poster Wall）两个词，同时，「海报」谐音「海豹」，所以大家可以在 Logo 上看到一只萌萌的小海豹",
  tags: ["电影"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://terngcbfgrejnyy.pbz/"],

  category: [
    {
      name: "国语配音",
      key: "chinesedubbed",
      options: [{ name: "是", value: "1" }],
    },
    {
      name: "特效字幕",
      key: "specialsub",
      options: [{ name: "是", value: "1" }],
    },
    {
      name: "自制",
      key: "diy",
      options: [{ name: "是", value: "2" }],
    },
    {
      name: "自购",
      key: "buy",
      options: [{ name: "是", value: "2" }],
    },
    {
      name: "语言",
      key: "language",
      options: buildCategoryOptions([
        ["英语", "日语", "韩语", "阿拉伯语", "巴西葡萄牙语", "保加利亚语", "克罗地亚语", "捷克语", "丹麦语", "荷兰语"],
        ["爱沙尼亚语", "芬兰语", "法语", "德语", "希腊语", "希伯来语", "印地语", "匈牙利语", "冰岛语", "印度尼西亚语"],
        ["意大利语", "拉脱维亚语", "立陶宛语", "挪威语", "波斯语", "波兰语", "葡萄牙语", "罗马尼亚语", "俄语"],
        ["塞尔威亚语", "斯洛伐克语", "斯洛文尼亚语", "西班牙语", "瑞典语", "泰语", "土耳其语", "乌克兰语", "越南语"],
        ["普通话", "粤语", "闽南语", "日本手语", "汉语", "加泰隆语"],
      ]),
      cross: { mode: "comma" },
    },
    {
      name: "字幕",
      key: "subtitles",
      options: buildCategoryOptions([
        ["简体", "繁体", "英语", "日语", "韩语", "阿拉伯语", "巴西葡萄牙语", "保加利亚语", "克罗地亚语", "捷克语"],
        ["丹麦语", "荷兰语", "爱沙尼亚语", "芬兰语", "法语", "德语", "希腊语", "希伯来语", "印地语", "匈牙利语"],
        ["冰岛语", "印度尼西亚语", "意大利语", "拉脱维亚语", "立陶宛语", "挪威语", "波斯语", "波兰语", "葡萄牙语"],
        ["罗马尼亚语", "俄语", "塞尔威亚语", "斯洛伐克语", "斯洛文尼亚语", "西班牙语", "瑞典语", "泰语", "土耳其语"],
        ["乌克兰语", "越南语"],
      ]),
      cross: { mode: "comma" },
    },
    {
      name: "国家和地区",
      key: "region",
      options: buildCategoryOptions([
        ["阿富汗", "奥兰群岛", "阿尔巴尼亚", "阿尔及利亚", "美属萨摩亚", "安道尔", "安哥拉", "安圭拉"],
        ["安提瓜和巴布达", "阿根廷", "亚美尼亚", "阿鲁巴", "澳大利亚", "奥地利", "阿塞拜疆", "孟加拉", "巴林"],
        ["巴哈马", "巴巴多斯", "白俄罗斯", "比利时", "伯利兹", "贝宁", "百慕大", "不丹", "玻利维亚"],
        ["波斯尼亚和黑塞哥维那", "博茨瓦纳", "布维岛", "巴西", "文莱", "保加利亚", "布基纳法索", "布隆迪", "柬埔寨"],
        ["喀麦隆", "加拿大", "佛得角", "中非", "乍得", "智利", "圣诞岛", "科科斯（基林）群岛"],
        ["哥伦比亚", "科摩罗", "刚果（金）", "刚果", "库克群岛", "哥斯达黎加", "科特迪瓦", "中国", "克罗地亚", "古巴"],
        ["捷克", "塞浦路斯", "丹麦", "吉布提", "多米尼加", "厄瓜多尔", "埃及", "赤道几内亚", "厄立特里亚", "爱沙尼亚"],
        ["埃塞俄比亚", "法罗群岛", "斐济", "芬兰", "法国", "法国大都会", "法属圭亚那", "法属波利尼西亚", "加蓬"],
        ["冈比亚", "格鲁吉亚", "德国", "加纳", "直布罗陀", "希腊", "格林纳达", "瓜德罗普岛", "关岛", "危地马拉"],
        ["根西岛", "几内亚比绍", "几内亚", "圭亚那", "海地", "洪都拉斯", "匈牙利", "冰岛", "印度", "印度尼西亚"],
        ["伊朗", "伊拉克", "爱尔兰", "马恩岛", "以色列", "意大利", "牙买加", "日本", "泽西岛", "约旦", "哈萨克斯坦"],
        ["肯尼亚", "基里巴斯", "韩国", "朝鲜", "科威特", "吉尔吉斯斯坦", "老挝", "拉脱维亚", "黎巴嫩", "莱索托"],
        ["利比亚", "列支敦士登", "立陶宛", "卢森堡", "马其顿", "马拉维", "马来西亚", "马达加斯加", "马尔代夫"],
        ["马里", "马耳他", "马绍尔群岛", "马提尼克岛", "毛里塔尼亚", "毛里求斯", "马约特", "墨西哥", "密克罗尼西亚"],
        ["摩尔多瓦", "摩纳哥", "蒙古", "黑山", "蒙特塞拉特", "摩洛哥", "莫桑比克", "缅甸", "纳米比亚", "瑙鲁"],
        ["尼泊尔", "荷兰", "新喀里多尼亚", "新西兰", "尼加拉瓜", "尼日尔", "尼日利亚", "纽埃", "诺福克岛", "挪威"],
        ["阿曼", "巴基斯坦", "帕劳", "巴勒斯坦", "巴拿马", "巴布亚新几内亚", "秘鲁", "菲律宾", "皮特凯恩群岛"],
        ["波兰", "葡萄牙", "波多黎各", "卡塔尔", "留尼汪岛", "罗马尼亚", "卢旺达", "俄罗斯", "圣赫勒拿"],
        ["圣基茨和尼维斯", "圣卢西亚", "圣文森特和格林纳丁斯", "萨尔瓦多", "萨摩亚", "圣马力诺", "圣多美和普林西比"],
        ["沙特阿拉伯", "塞内加尔", "塞舌尔", "塞拉利昂", "新加坡", "塞尔维亚", "斯洛伐克", "斯洛文尼亚", "所罗门群岛"],
        ["索马里", "南非", "西班牙", "斯里兰卡", "苏丹", "苏里南", "斯威士兰", "瑞典", "瑞士", "叙利亚", "塔吉克斯坦"],
        ["坦桑尼亚", "泰国", "特立尼达和多巴哥", "东帝汶", "多哥", "托克劳", "汤加", "突尼斯", "土耳其", "土库曼斯坦"],
        ["图瓦卢", "乌干达", "乌克兰", "阿拉伯联合酋长国", "英国", "美国", "乌拉圭", "乌兹别克斯坦", "瓦努阿图"],
        ["梵蒂冈", "委内瑞拉", "越南", "瓦利斯群岛和富图纳群岛", "西撒哈拉", "也门", "南斯拉夫", "赞比亚"],
        ["津巴布韦", "中国台湾", "中国香港", "中国澳门", "苏联"],
      ]),
      cross: { mode: "comma" },
    },
    {
      name: "发行类别",
      key: "releasetype",
      options: [
        { name: "长片", value: "1" },
        { name: "短片", value: "2" },
        { name: "现场演出", value: "5" },
        { name: "电影集", value: "6" },
      ],
    },
    {
      name: "促销方案",
      key: "freetorrent",
      options: [
        { name: "免费种子", value: "1" },
        { name: "-25%", value: "11" },
        { name: "-50%", value: "12" },
        { name: "-75%", value: "13" },
        { name: "中性种子", value: "2" },
      ],
    },
    {
      name: "片源",
      key: "source",
      options: buildCategoryOptions(["VHS", "DVD", "HD-DVD", "TV", "HDTV", "WEB", "Blu-ray", "Other"]),
    },
    {
      name: "编码",
      key: "codec",
      options: buildCategoryOptions(["DivX", "XviD", "x264", "H.264", "x265", "H.265", "Other"]),
    },
    {
      name: "容器",
      key: "container",
      options: buildCategoryOptions(["AVI", "MPG", "MP4", "MKV", "VOB IFO", "ISO", "m2ts", "Other"]),
    },
    {
      name: "分辨率",
      key: "resolution",
      options: buildCategoryOptions(["NTSC", "PAL", "480p", "576p", "720p", "1080i", "1080p", "2160p", "Other"]),
    },
    {
      name: "处理",
      key: "processing",
      options: buildCategoryOptions(["Encode", "Remux", "DIY", "Untouched"]),
    },
    {
      name: "标签",
      key: "taglist",
      options: buildCategoryOptions([
        ["动作", "成人", "冒险", "动画", "艺术", "亚洲", "传记", "喜剧", "犯罪", "邪典", "纪录片", "剧情", "实验"],
        ["家庭", "奇幻", "黑色电影", "历史", "恐怖", "lgbt", "武侠", "音乐", "音乐剧", "悬疑", "演出", "政治", "爱情"],
        ["科幻", "短片", "默片", "体育", "惊悚", "video.art", "战争", "西部"],
      ]),
      cross: { mode: "comma" },
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: { searchsubmit: 1, action: "basic" },
    },
    advanceKeywordParams: {
      imdb: { enabled: true },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: { selector: "#torrent_table .TableTorrent-rowTitle" },
      title: { selector: "a[href*='torrents.php?id=']", attr: "data-tooltip" },
      link: {
        selector: "a[href*='torrents.php?action=download']:first",
        attr: "href",
      },
      time: {
        selector: ".TableTorrent-cellStatTime span[data-tooltip]",
        attr: "data-tooltip",
        filters: [
          (query: string) => {
            return query ? new Date(query).getTime() : null;
          },
        ],
      },
      size: { selector: ".TableTorrent-cellStatSize" },
      completed: { selector: ".TableTorrent-cellStatSnatches" },
      seeders: { selector: ".TableTorrent-cellStatSeeders" },
      leechers: { selector: ".TableTorrent-cellStatLeechers" },

      progress: {
        selector: [".TorrentTitle"],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("TorrentSeeding")) {
            // 做种中
            return 100;
          } else if (element.classList.contains("TorrentSnatched")) {
            // 无法实现获取 已完成 未做种 进度
            return 100;
          } else if (element.classList.contains("TorrentDownloading")) {
            // 无法实现获取 下载中 进度
            return 0;
          }
          return 0;
        },
      },
      status: {
        selector: [".TorrentTitle"],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains("TorrentSeeding")) {
            // 做种中
            return ETorrentStatus.seeding;
          } else if (element.classList.contains("TorrentSnatched")) {
            // 已完成 未做种
            return ETorrentStatus.completed;
          } else if (element.classList.contains("TorrentDownloading")) {
            // 下载中
            return ETorrentStatus.downloading;
          }
          return ETorrentStatus.unknown;
        },
      },

      tags: [
        { selector: ".TorrentTitle-item.tl_free", name: "Free", color: "#05f" },
        { selector: ".TorrentTitle-item.two_fourth_off", name: "50%", color: "#8d4b44" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      // "page": "/index.php",
      id: {
        selector: ["#header-username-value"],
        attr: "href",
        filters: [{ name: "querystring", args: ["id"] }],
      },
      name: {
        selector: ["#header-username-value"],
      },
      // "page": "/user.php?id=$user.id$",
      levelName: {
        selector: "#class-value",
        attr: "data-value",
      },
      uploaded: {
        selector: "#uploaded-value",
        attr: "data-value",
      },
      downloaded: {
        selector: "#downloaded-value",
        attr: "data-value",
      },
      bonus: {
        selector: "#bp-value",
        attr: "data-value",
      },
      bonusPerHour: {
        selector: "#bp-value span[data-tooltip*='积分速率']",
        attr: "data-tooltip",
        filters: [
          (query: string) => {
            return query ? parseFloat(query.match(/积分速率: (\d+)/)?.[1] ?? "") : 0;
          },
        ],
      },
      joinTime: {
        selector: "#join-date-value",
        attr: "data-value",
        filters: [{ name: "parseTime" }],
      },
      trueDownloaded: {
        selector: [".SidebarItemUserNextClass li:contains('下载量:')"],
        filters: [
          (query: string) => {
            const queryMatch = query?.match(/下载量:[\s\n]*([\d.\s,ZEPTGMKiB]+) \//);
            return queryMatch && queryMatch.length > 1 ? parseSizeString(queryMatch[1]) : 0;
          },
        ],
      },
      uploads: {
        selector: "#upload-count-value",
        attr: "data-value",
      },
    },
    process: [
      ...SchemaMetadata.userInfo!.process!.filter((item) => item.requestConfig.url !== "/user.php"),
      {
        requestConfig: { url: "/user.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: [
          "levelName",
          "uploaded",
          "downloaded",
          "bonus",
          "bonusPerHour",
          "joinTime",
          "trueDownloaded",
          "uploads",
        ],
      },
    ],
  },

  levelRequirements: [
    {
      id: 0,
      name: "User",
      privilege: "所有新用户的默认等级；能够使用 RSS 订阅系统；具有论坛「茶话会」版块的阅读权限",
    },
    {
      id: 1,
      name: "Member",
      interval: "P1W",
      trueDownloaded: "80GB",
      ratio: 0.8,
      privilege: "发起求种；查看部分排行榜；完全访问「茶话会」版块",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P2W",
      uploads: 1,
      trueDownloaded: "200GB",
      ratio: 1.2,
      privilege: "免疫账号不活跃；发送邀请；赠送1枚邀请；访问论坛的「求邀区」「发邀区」「Power User」",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P4W",
      uploads: 25,
      trueDownloaded: "500GB",
      ratio: 1.2,
      privilege: "赠送1枚邀请；访问论坛的「Elite」；检查自己发布的种子；编辑所有种子",
    },
    {
      id: 4,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 100,
      trueDownloaded: "1TB",
      ratio: 1.2,
      privilege: "赠送2枚邀请；每月获赠1枚临时邀请；访问论坛的「Torrent Master」",
    },
    {
      id: 5,
      name: "Power Torrent Master",
      interval: "P12W",
      uploads: 250,
      trueDownloaded: "2TB",
      ratio: 1.2,
      privilege: "赠送2枚邀请；每月获赠2枚临时邀请；检查所有种子",
    },
    {
      id: 6,
      name: "Elite Torrent Master",
      interval: "P16W",
      uploads: 500,
      trueDownloaded: "5TB",
      ratio: 1.2,
      privilege: "赠送3枚邀请；每月获赠3枚临时邀请；访问论坛的「Elite Torrent Master」",
    },
    {
      id: 7,
      name: "Guru",
      interval: "P20W",
      uploads: 1000,
      trueDownloaded: "10TB",
      ratio: 1.2,
      privilege: "无限邀请；访问论坛的「Guru」；查看种子检查日志",
    },
  ],
};

export default class GreatPosterWall extends Gazelle {
  private async getUserTorrentList(userId: number, page: number = 0, type: string = "seeding"): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: "/torrents.php",
      params: { userid: userId, page, type },
      responseType: "document",
    });
    return TListDocument;
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    const flushUserInfo = await super.getUserInfoResult(lastUserInfo);

    if (flushUserInfo.id) {
      let seeding = 0;
      let seedingSize = 0;

      const pageInfo = { count: 0, current: 0 }; // 生成页面信息
      for (; pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const TListDocument = await this.getUserTorrentList(flushUserInfo.id as number, pageInfo.current);
        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TListDocument, {
            selector: ["a[href*='torrents.php?page=']:contains('Last'):last"],
            attr: "href",
            filters: [
              (query: string) => {
                let pageId = "-1";
                try {
                  pageId = new URL(query).searchParams.get("page") ?? "-1";
                } catch (e) {}
                return parseInt(pageId);
              },
            ],
          });
        }

        seeding = Sizzle(this.metadata.search?.selectors?.rows?.selector!, TListDocument).length;
        const sizeEleList = Sizzle(".TableTorrent-rowTitle .TableTorrent-cellStatSize", TListDocument);
        sizeEleList.forEach((element) => {
          seedingSize += parseSizeString((element as HTMLElement).innerText!.trim());
        });
      }

      // 更新做种信息
      flushUserInfo.seeding = seeding;
      flushUserInfo.seedingSize = seedingSize;
    }
    return flushUserInfo;
  }

  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    const result: ISearchResult = {
      data: [],
      status: EResultParseStatus.unknownError,
    };

    // 0. 检查该站点是否允许搜索
    if (!this.allowSearch) {
      result.status = EResultParseStatus.passParse;
      return result;
    }

    // 1. 形成搜索入口，默认情况下需要合并 this.config.search
    // 如果传入了 id，说明需要首先与 metadata.searchEntry 中对应id的搜索配置的合并
    if (searchEntry.id) {
      searchEntry = toMerged(this.metadata.searchEntry?.[searchEntry.id] ?? {}, searchEntry)!;
    }

    // 继续检查 searchEntry， 如果为空，或者没有显示设置 merge 为 false，则进一步在 this.metadata.search 的基础上进行合并
    if (isEmpty(searchEntry) || searchEntry.merge !== false) {
      searchEntry = toMerged(this.metadata.search!, searchEntry)!;
    }

    // 检查该搜索入口是否设置为禁用
    if (searchEntry.enabled === false) {
      result.status = EResultParseStatus.passParse;
      return result;
    }

    // 2. 生成对应站点的基础 requestConfig
    let requestConfig: AxiosRequestConfig = toMerged(
      { url: "/", responseType: "document", params: {}, data: {} },
      searchEntry.requestConfig || {},
    );

    // 3. 预检查 keywords 是否为高级搜索词，如果是，则查找对应的 searchEntry.advanceKeywordParams[*] 并改写 keywords
    let advanceKeywordType: string | undefined;
    let advanceKeywordConfig: IAdvanceKeywordSearchConfig | false = false;
    if (keywords && searchEntry.advanceKeywordParams) {
      for (const [advanceField, advanceConfig] of Object.entries(searchEntry.advanceKeywordParams)) {
        if (keywords.startsWith(`${advanceField}|`)) {
          // 检查是否跳过
          if (advanceConfig === false || advanceConfig.enabled === false) {
            result.status = EResultParseStatus.passParse;
            return result;
          }
          // 改写 keywords 并缓存 transformer
          keywords = keywords?.replace(`${advanceField}|`, "");
          advanceKeywordType = advanceField;
          advanceKeywordConfig = advanceConfig;
          break;
        }
      }
    }

    if (!advanceKeywordConfig) {
      // 非高级搜索 走默认搜索实现
      return super.getSearchResult(keywords, searchEntry);
    }

    if (keywords) {
      set(requestConfig, searchEntry.keywordPath || "params.keywords", keywords || "");
    }

    try {
      const response = await this.request(requestConfig);
      result.data = await this.transformGroupPage(response.data, { keywords, searchEntry, requestConfig });
      result.status = EResultParseStatus.success;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e);
      }
      result.status = EResultParseStatus.parseError;

      if (e instanceof NeedLoginError) {
        result.status = EResultParseStatus.needLogin;
      } else if (e instanceof NoTorrentsError) {
        result.status = EResultParseStatus.noResults;
      }
    }
    return result;
  }

  public async transformGroupPage(doc: Document | object | any, searchConfig: ISearchInput): Promise<ITorrent[]> {
    const { searchEntry, requestConfig } = searchConfig;

    // 获取媒体基本信息
    let subTitle = Sizzle(".MovieInfo-subTitle", doc)[0].textContent;
    let year = Sizzle(".MovieInfo-year", doc)[0].textContent!.match(/(\d+)/)?.[1];
    const titlePrefix = subTitle + " " + year;

    // 获取种子行
    let rows = Sizzle("#torrent_details .TableTorrent-rowTitle", doc);
    if (rows.length === 0) {
      throw new NoTorrentsError();
    }
    const torrents: ITorrent[] = [];
    const titleSelectors = [
      ".resolution",
      ".processing",
      ".codec",
      ".source",
      ".remaster_dolby_atmos",
      ".remaster_dolby_vision",
      ".remaster_hdr10",
      ".tl_chi",
      ".tl_cn_dub",
      ".tl_se_sub",
      ".is-releaseGroup",
    ];

    for (const row of rows) {
      let torrent = {} as ITorrent;

      torrent.site ??= this.metadata.id;
      torrent.id = row.getAttribute("id")?.match(/torrent(\d+)/)?.[1]!;

      let titleEle = Sizzle(".TorrentTitle", row)[0];
      let title = titlePrefix;
      for (const selector of titleSelectors) {
        title = (title +
          " " +
          this.getFieldData(titleEle, {
            selector: selector,
            elementProcess: (element: HTMLElement) => {
              if (element.classList.contains("remaster_dolby_atmos")) {
                return "Atoms";
              } else if (element.classList.contains("remaster_dolby_vision")) {
                return "Dolby Vision";
              } else if (element.classList.contains("remaster_hdr10")) {
                return "HDR10";
              }
              return element.textContent!.trim();
            },
          })) as string;
      }
      torrent.title = title;

      torrent.url = this.getFieldData(row, { selector: "a[href*='torrents.php?torrentid=']", attr: "href" });
      torrent.link = this.getFieldData(row, this.metadata.search!.selectors!.link!);
      torrent.url && (torrent.url = this.fixLink(torrent.url as string, requestConfig!));
      torrent.link && (torrent.link = this.fixLink(torrent.link as string, requestConfig!));

      let detailRow = Sizzle("#torrent_detail_" + torrent.id, doc)[0];
      torrent.time = this.getFieldData(detailRow, {
        ...this.metadata.search!.selectors!.time!,
        selector: ".TorrentDetail-uploaderInfo span[data-tooltip]",
      });
      // 仅当设置了时区偏移时，才进行转换
      if (this.metadata.timezoneOffset) {
        torrent.time = parseTimeWithZone(torrent.time as unknown as string, this.metadata.timezoneOffset);
      }

      torrent.size = parseSizeString(this.getFieldData(row, this.metadata.search!.selectors!.size!));
      torrent.completed = tryToNumber(this.getFieldData(row, { selector: ".TableTorrent-cellStat:nth-child(3)" }));
      torrent.seeders = tryToNumber(this.getFieldData(row, { selector: ".TableTorrent-cellStat:nth-child(4)" }));
      torrent.leechers = tryToNumber(this.getFieldData(row, { selector: ".TableTorrent-cellStat:nth-child(5)" }));
      torrent.progress = this.getFieldData(row, this.metadata.search!.selectors!.progress!);
      torrent.status = tryToNumber(this.getFieldData(row, this.metadata.search!.selectors!.status!));

      torrent = this.parseTorrentRowForTags(torrent, row, searchConfig) as ITorrent;

      torrents.push(torrent);
    }
    return torrents;
  }
}
