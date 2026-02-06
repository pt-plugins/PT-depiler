import { type ISiteMetadata, ETorrentStatus, type ISearchInput, type ITorrent, type ITorrentTag } from "../types";
import { buildCategoryOptionsFromList } from "../utils";
import { siteMetadata as GPWSiteMetadata, attrMap } from "./greatposterwall";
import Gazelle, { GazelleUtils, SchemaMetadata, commonPagesList, detailPageList } from "../schemas/Gazelle";

const tagKeywords = ["HR", "可替代", "已报告", "FREE", "xUP"];
const extractTags = (tags: string) => GazelleUtils.extractTags(tags, tagKeywords);

const detailPageSelectors = {
  ...detailPageList.selectors!,
  keywords: { selector: "span.MovieInfo-title" },
  title: { selector: "span.MovieInfo-title" },

  rows: {
    ...detailPageList.selectors!.rows!,
    selector: ".TableContainer .Table-row",
  },
  completed: { selector: ".TableTorrent-cellSnatches" },
  seeders: { selector: ".TableTorrent-cellSeeders" },
  leechers: { selector: ".TableTorrent-cellLeechers" },
  time: {
    text: 0,
    selector: "+tr .Username + span",
    filters: [{ name: "parseTime", args: ["yy-MM-dd HH:mm:ss"] }],
  },
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "mooko",
  name: "MooKo",
  description: "MooKo is a CHINESE Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "Gazelle", // GazellePW

  urls: ["uggcf://zbbxb.bet/"],

  category: [
    {
      name: "搜索入口",
      key: "#url",
      options: [
        { name: "电影", value: "/torrents.php" },
        { name: "剧集", value: "/series.php" },
      ],
    },
    {
      name: "发行类别",
      key: "releasetype",
      options: [
        { name: "电影", value: "1" },
        { name: "剧集", value: "3" },
      ],
    },
    {
      name: "标签",
      key: "taglist",
      options: buildCategoryOptionsFromList([
        ["动作", "青涩", "冒险", "动画", "传记", "喜剧", "犯罪", "纪录片", "剧情", "家庭", "奇幻", "历史"],
        ["恐怖", "音乐", "歌舞", "悬疑", "真人秀", "爱情", "科幻", "短片", "运动", "惊悚", "战争", "西部"],
      ]),
      cross: { mode: "comma" },
    },
    ...(GPWSiteMetadata.category?.filter((c) => c.key !== "releasetype" && c.key !== "taglist") || []),
  ],

  search: {
    ...SchemaMetadata.search!,
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: { selector: "#torrent_table .Table-row" },
      title: {
        ...SchemaMetadata.search!.selectors!.title!,
        elementProcess: (el: HTMLElement) => {
          const groupYear = el.querySelector("span.TableTorrent-movieInfoYear")?.textContent;

          const baseTitle = GazelleUtils.genTitleElementProcess({
            tdSelector: ".TableTorrent-movieInfoContent",
          })(el);

          return `${baseTitle}${groupYear ? ` ${groupYear}` : ""}`;
        },
      },
      subTitle: {
        selector: ":self",
        elementProcess: (el: HTMLElement) => {
          const season = el.querySelector(".SeriesBadge--season")?.textContent;

          const attrs = Object.keys(attrMap);
          const props = Array.from(
            el.querySelectorAll<HTMLElement>(".TorrentTitle > span[class~='TorrentTitle-item'][class*=' ']"),
          );
          const filteredProps = props.filter((e) => !attrs.some((attr) => e.classList.contains(`remaster_${attr}`)));
          return extractTags([season, ...filteredProps.map((e) => e.textContent)].filter(Boolean).join(" / "));
        },
      },
      category: { selector: ["span[data-tooltip='片种']", "span[data-tooltip='Movie type']"] },
      time: {
        text: 0,
        selector: ".TableTorrent-cellStatTime span[data-tooltip]",
        attr: "data-tooltip",
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
        text: ETorrentStatus.unknown,
        selector: [".TorrentTitle"],
        case: {
          ".TorrentSeeding": ETorrentStatus.seeding, // 做种中
          ".TorrentSnatched": ETorrentStatus.completed, // 已完成 未做种
          ".TorrentDownloading": ETorrentStatus.downloading, // 下载中
        },
      },
      tags: [
        { selector: ".TorrentTitle-item.tl_free.free", name: "Free", color: "#05f" },
        { selector: ".TorrentTitle-item.tl_free:contains('HR')", name: "H&R", color: "red" },
        { selector: ".TorrentTitle-item.upload_multiplier:contains('3xUP')", name: "3xUP", color: "#00bc8c" },
        { selector: ".TorrentTitle-item.upload_multiplier:contains('5xUP')", name: "5xUP", color: "#00bc8c" },
      ],

      ext_imdb: { selector: "a[href^='https://www.imdb.com/title/']", attr: "href", filters: [{ name: "extImdbId" }] },
    },
  },

  searchEntry: {
    area_movies: { name: "电影", requestConfig: { url: "/torrents.php" } },
    area_series: { name: "剧集", enabled: false, requestConfig: { url: "/series.php" } },
  },

  list: [
    {
      ...commonPagesList,
      urlPattern: [...commonPagesList.urlPattern!, "/movies.php", "/series.php"],
    },
    {
      ...detailPageList,
      selectors: detailPageSelectors,
    },
    // Top 10 不显示种子
  ],

  userInfo: {
    pickLast: ["id"],
    process: [
      {
        requestConfig: { url: "/ajax.php", params: { action: "index" }, responseType: "json" },
        fields: [
          "id",
          "name",
          "levelName",
          "messageCount",
          "uploaded",
          "downloaded",
          "ratio",
          "seeding",
          "seedingSize",
          "bonus",
          "bonusPerHour",
        ],
      },
      {
        requestConfig: { url: "/user.php", responseType: "document" },
        assertion: { id: "params.id" },
        fields: ["joinTime", "lastAccessAt", "uploads", "trueDownloaded"],
      },
    ],
    selectors: {
      ...GPWSiteMetadata.userInfo!.selectors!,
      seeding: { selector: "response.userstats.seedingCount" },
      joinTime: { selector: "#join-date-value", data: "value", filters: [{ name: "parseTime" }] },
      lastAccessAt: { selector: "#last-access-date-value", data: "value", filters: [{ name: "parseTime" }] },
      uploads: { selector: "#upload-count-value", data: "value" },
    },
  },

  // 没有说明
  // levelRequirements: [],

  userInputSettingMeta: [
    {
      name: "note",
      label: "点我（不需要填）",
      hint: "需要将 搜索结果显示 改为 列表视图 才能正常使用搜索功能！如果需要搜索剧集，需要启用 剧集 搜索入口！",
      required: false,
    },
  ],
};

export default class MooKo extends Gazelle {
  protected override get torrentClasses(): Record<"group" | "unGroupTorrent", string[]> {
    return {
      ...super.torrentClasses,
      group: ["TableTorrent-rowMovieInfo"],
    };
  }

  // 适配高级搜索跳转详情页
  public override transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    const parsedListPageUrl = doc.URL || location.href;
    if (!!detailPageList.urlPattern!.some((pattern) => new RegExp(pattern, "i").test(parsedListPageUrl))) {
      searchConfig = {
        ...searchConfig,
        searchEntry: {
          ...searchConfig.searchEntry!,
          selectors: { ...searchConfig.searchEntry!.selectors!, ...detailPageSelectors },
        },
      };
    }

    return super.transformSearchPage(doc, searchConfig);
  }

  protected override getTorrentGroupInfo(group: HTMLTableRowElement, searchConfig: ISearchInput): Partial<ITorrent> {
    return this.getFieldsData(group, searchConfig.searchEntry!.selectors!, ["title", "category", "ext_imdb"]);
  }

  protected override parseTorrentRowForTags(
    torrent: Partial<ITorrent>,
    row: Element,
    searchConfig: ISearchInput,
  ): Partial<ITorrent> {
    const partTorrent = super.parseTorrentRowForTags(torrent, row, searchConfig);

    const remasterTags: ITorrentTag[] = [];
    for (const [title, tag] of Object.entries(attrMap)) {
      if (!!row.querySelector(`span[class~='remaster_${title}']`)) {
        remasterTags.push(tag);
      }
    }

    partTorrent.tags = (partTorrent.tags || []).concat(remasterTags);
    return partTorrent;
  }
}
