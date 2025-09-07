/**
 * @JackettIssue https://github.com/Jackett/Jackett/issues/14816
 */
import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Unit3D";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "bitporn",
  version: 1,
  name: "BitPorn",
  tags: ["成人"],
  timezoneOffset: "+0200",
  collaborator: ["hyuan280"],

  type: "private",
  schema: "Unit3D",

  urls: ["uggcf://ovgcbea.rh/"],

  category: [
    {
      name: "类别",
      key: "categoryIds",
      options: [
        { name: "Amateur", value: "4" },
        { name: "Anal", value: "5" },
        { name: "Asian", value: "6" },
        { name: "BBW", value: "7" },
        { name: "BDSM", value: "8" },
        { name: "Big Ass", value: "9" },
        { name: "Big Tits", value: "10" },
        { name: "Black", value: "11" },
        { name: "Cartoon", value: "12" },
        { name: "Casting", value: "13" },
        { name: "Classic", value: "14" },
        { name: "Collection", value: "15" },
        { name: "Creampie", value: "16" },
        { name: "Cumshot", value: "17" },
        { name: "Deepthroat", value: "18" },
        { name: "Extreme", value: "19" },
        { name: "Fansite", value: "20" },
        { name: "Family", value: "21" },
        { name: "Feature", value: "22" },
        { name: "Fetish", value: "23" },
        { name: "Fisting", value: "24" },
        { name: "Gangbang", value: "25" },
        { name: "Game", value: "26" },
        { name: "Gay / Bi", value: "27" },
        { name: "Hair", value: "28" },
        { name: "Hardcore", value: "29" },
        { name: "HiddenCam", value: "30" },
        { name: "Homemade", value: "31" },
        { name: "Interracial", value: "32" },
        { name: "Lesbian", value: "33" },
        { name: "Magyar", value: "34" },
        { name: "Masturbation", value: "35" },
        { name: "Mature", value: "36" },
        { name: "Milf", value: "37" },
        { name: "Old and Young", value: "38" },
        { name: "Parody", value: "39" },
        { name: "Pictures", value: "40" },
        { name: "Pissing", value: "41" },
        { name: "POV", value: "42" },
        { name: "Pregnant", value: "43" },
        { name: "Public", value: "44" },
        { name: "Shemale", value: "45" },
        { name: "Softcore", value: "46" },
        { name: "Squirt", value: "47" },
        { name: "Straight", value: "48" },
        { name: "Teen", value: "49" },
        { name: "Threesome", value: "50" },
        { name: "VR", value: "51" },
        { name: "Uncategorized", value: "52" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "分辨率",
      key: "resolutionIds",
      options: [
        { name: "Other", value: "11" },
        { name: "SD", value: "12" },
        { name: "720p", value: "17" },
        { name: "1080p", value: "13" },
        { name: "2048p (2K)", value: "14" },
        { name: "2160p (4K)", value: "18" },
        { name: "3160p (6K)", value: "15" },
        { name: "4320p (8K)", value: "16" },
      ],
      cross: { mode: "brackets" },
    },
    {
      name: "优惠",
      key: "free",
      options: [
        { name: "0% Freeleech", value: "0" },
        { name: "25% Freeleech", value: "25" },
        { name: "50% Freeleech", value: "50" },
        { name: "75% Freeleech", value: "75" },
        { name: "100% Freeleech", value: "100" },
        { name: "Double Upload", value: "doubleup" }, // 双倍上传
        { name: "Featured", value: "featured" }, // 精选
        { name: "Refundable", value: "refundable" }, //可退还的
      ],
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        const params: Record<string, any> = { free: [] };
        (selectedOptions as Array<number | string>).forEach((value) => {
          if (value === "doubleup" || value === "featured" || value === "refundable") {
            params[value] = 1; // 双倍上传和精选使用 1 来表示
          } else {
            params.free.push(value); // 其他优惠使用 free 数组
          }
        });
        return { requestConfig: { params } };
      },
    },
    {
      name: "标签",
      key: "tags",
      options: [
        { name: "内部组", value: "internal" },
        { name: "个人发布", value: "personalRelease" },
        { name: "Trumpable", value: "trumpable" },
        { name: "高速", value: "highspeed" },
        { name: "收藏", value: "bookmarked" },
        { name: "想要", value: "wished" },
      ],
      cross: { mode: "append", key: "" }, //  站点构造为  &exclusive=true ，但实际上与  &exclusive=1 相同
    },
    {
      name: "活跃度",
      key: "health",
      options: [
        { name: "存活", value: "alive" },
        { name: "Dying", value: "dying" },
        { name: "Dead", value: "dead" },
        { name: "坟场", value: "graveyard" },
      ],
      cross: { mode: "append", key: "" },
    },
    {
      name: "记录",
      key: "record",
      options: [
        { name: "Not Downloaded", value: "notDownloaded" },
        { name: "Downloaded", value: "downloaded" },
        { name: "Seeding", value: "seeding" },
        { name: "Leeching", value: "leeching" },
        { name: "Incomplete", value: "incomplete" },
      ],
      cross: { mode: "append", key: "" },
    },
  ],
  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      subTitle: {
        selector: ["td.torrent-search--list__overview div[style]"],
        elementProcess: (element: any) => {
          if (!element) return 0;

          // 查找所有span元素
          const spans = element.querySelectorAll("span[style]");

          // 提取所有span元素中的文本内容
          const allText = Array.from(spans)
            .map((span: any) => (span.textContent || span.innerText || "").trim())
            .filter((text) => text.length > 0)
            .join(", ");

          return allText;
        },
      },
      tags: [
        {
          name: "Free",
          selector: "span[title*='feature'], span[title*='100% Freeleech'], i.fa-globe",
          color: "blue",
        },
        {
          name: "2xUp",
          selector: "span[title*='feature'], i.fa-chevron-double-up",
          color: "lime",
        },
        {
          name: "75%",
          selector: "span[title*='75% Freeleech']",
          color: "lime-darken-3",
        },
        {
          name: "50%",
          selector: "span[title*='50% Freeleech']",
          color: "deep-orange-darken-1",
        },
        {
          name: "25%",
          selector: "span[title*='25% Freeleech']",
          color: "blue",
        },
        {
          name: "置顶",
          selector: "i.fa-thumbtack",
          color: "red",
        },
        {
          name: "可退款",
          selector: "i.fa-percentage",
          color: "gray",
        },
        {
          name: "内部组发布",
          selector: "i.torrent-icons__internal",
          color: "purple",
        },
        {
          name: "个人发布",
          selector: "i.torrent-icons__personal-release",
          color: "purple",
        },
        {
          name: "高速",
          selector: "i.torrent-icons__highspeed",
          color: "red",
        },
        {
          name: "可升级的",
          selector: "i.torrent-icons__torrent-trump",
          color: "red",
        },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      uploads: {
        selector: ["h2:contains('Torrent Count') + dl"],
        elementProcess: (element: any) => {
          if (!element) return 0;

          // 查找所有包含总发布数信息的div元素
          const divs = element.querySelectorAll("div.key-value__group");

          // 提取所有div元素中的文本内容
          const allText = Array.from(divs)
            .map((div: any) => div.textContent || div.innerText || "")
            .join(" ");

          // 使用正则表达式匹配数字，并去除逗号
          const queryMatch = String(allText || "")
            .replace(/,/g, "")
            .match(/\d+/g);

          if (!queryMatch) return 0;

          // 根据匹配到的数字进行特定的加总处理
          const totalReleases = parseInt(queryMatch[0]) + parseInt(queryMatch[1]);

          return totalReleases;
        },
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "新用户默认等级；下载队列5个，可以发布种子",
    },
    {
      id: 2,
      name: "PowerUser",
      uploaded: "1TiB",
      interval: "P1M",
      privilege: "下载队列10个，可以发布种子，可以寄出邀请",
    },
    {
      id: 3,
      name: "SuperUser",
      uploaded: "5TiB",
      interval: "P2M",
      privilege: "下载队列20个，可以发布种子，可以寄出邀请",
    },
    {
      id: 4,
      name: "ExtremeUser",
      uploaded: "20TiB",
      interval: "P3M",
      privilege: "下载队列30个，直接发布种子，可以寄出邀请",
    },
    {
      id: 5,
      name: "InsaneUser",
      uploaded: "50TiB",
      interval: "P6M",
      privilege: "下载队列40个，直接发布种子，可以寄出邀请",
    },
    {
      id: 6,
      name: "Veteran",
      uploaded: "100TiB",
      interval: "P12M",
      privilege: "下载队列50个，全局免费，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 7,
      name: "Seeder",
      seedingSize: "5TiB",
      interval: "P1M",
      averageSeedingTime: "P1M",
      privilege: "下载队列80个，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 8,
      name: "Archivist",
      seedingSize: "10TiB",
      interval: "P3M",
      averageSeedingTime: "P2M",
      privilege: "下载队列无限，全局免费，直接发布种子，可以寄出邀请，可以无视H&R",
    },
    {
      id: 9,
      name: "Wizard",
      seedingSize: "500TiB",
      ratio: 20,
      interval: "P3Y",
      averageSeedingTime: "P3M19DT12H",
      privilege: "下载队列无限，全局免费，直接发布种子，可以寄出邀请，可以无视H&R，双倍上传",
    },
  ],
};
