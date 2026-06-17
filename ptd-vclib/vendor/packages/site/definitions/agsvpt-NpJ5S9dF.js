import { SchemaMetadata as e } from "../schemas/NexusPHP-BNC4SlPA.js";
import { a3 as a } from "../index-COeZNva1.js";
import "../../../es-toolkit/toMerged-Be-qf92q.js";
import "../../../es-toolkit/isPlainObject-3NY8ex7Q.js";
import "../schemas/AbstractPrivateSite-kkMcHSoo.js";
import "../../../es-toolkit/intersection-CiePrUGh.js";
import "../../../es-toolkit/pascalCase-BZA_Th-x.js";
import "../../../es-toolkit/has-CpNzJTaW.js";
import "../schemas/AbstractBittorrentSite-YCyl9e_L.js";
import "../types/base-Dy_28wGT.js";
import "../types/torrent-BvvY2NbA.js";
import "../utils/datetime-DQxMK7bP.js";
import "../../../date-fns/sub-D9RLuzs0.js";
import "../../../date-fns/subDays-DlPNbvmn.js";
import "../../../date-fns/format-b1gG6cM7.js";
import "../utils/filesize-D_1hx4u8.js";
import "../utils/filter-Dko2hrfF.js";
import "../utils/helper-OCngMtkv.js";
import "../utils/level-ChrMpKO_.js";
import "../../../date-fns/intervalToDuration-DvSvSXE3.js";
import "../../../date-fns/normalizeInterval-DC3nt56b.js";
import "../../../date-fns/differenceInYears-C2HS2Spv.js";
const W = {
  ...e,
  version: 1,
  id: "agsvpt",
  name: "AGSVPT",
  aka: ["末日种子库"],
  description: "Arctic Global Seed Vault",
  tags: ["综合", "短剧", "影视"],
  timezoneOffset: "+0800",
  collaborator: ["0X0000005"],
  type: "private",
  schema: "NexusPHP",
  urls: ["uggcf://cg.ntficg.pa/", "uggcf://jjj.ntficg.pbz/", "uggcf://arj.ntficg.pa/"],
  officialGroupPattern: [/AGSV(PT|E|WEB|REMUX|Rip|TV|DIY|MUS)?$/i],
  search: {
    ...e.search,
    selectors: {
      ...e.search.selectors,
      subTitle: {
        selector: ["div.torrent_title_desc"],
        elementProcess: (t) => {
          const r = t.cloneNode(!0);
          return (r.querySelectorAll("span").forEach((i) => i.remove()), a(r.innerHTML).trim());
        },
      },
    },
  },
  userInfo: {
    ...e.userInfo,
    selectors: {
      ...e.userInfo.selectors,
      bonus: {
        selector: ["td.rowhead:contains('冰晶') + td, td.rowhead:contains('Karma Points') + td"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },
  levelRequirements: [
    { id: 0, name: "User", privilege: "新用户的默认级别。只能在每周六中午12点至每周日晚上11点59分发布种子。" },
    {
      id: 1,
      name: "Power User",
      nameAka: ["北冰珍珠熊"],
      downloaded: "50GB",
      ratio: 1.05,
      seedingBonus: 4e4,
      privilege: "可以进入银行贷款",
    },
    {
      id: 2,
      name: "Elite User",
      nameAka: ["深渊蔚蓝熊"],
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      seedingBonus: 8e4,
      privilege: "可以得到一个邀请名额；Elite User及以上用户封存账号后不会被删除。  ",
    },
    {
      id: 3,
      name: "Crazy User",
      nameAka: ["翡翠森林熊"],
      interval: "P12W",
      downloaded: "300GB",
      ratio: 2.05,
      seedingBonus: 15e4,
      privilege: "可以在做种/下载/发布的时候选择匿名模式。",
    },
    {
      id: 4,
      name: "Insane User",
      nameAka: ["神秘紫晶熊"],
      interval: "P20W",
      downloaded: "500GB",
      ratio: 2.55,
      seedingBonus: 4e5,
      privilege: "查看普通日志",
    },
    {
      id: 5,
      name: "Veteran User",
      nameAka: ["寒冰白金熊"],
      interval: "P28W",
      downloaded: "750GB",
      ratio: 4.05,
      seedingBonus: 8e5,
      isKept: !0,
      privilege: "永远保留账号；查看其它用户的评论、帖子历史",
    },
    {
      id: 6,
      name: "Extreme User",
      nameAka: ["皇家金辉熊"],
      interval: "P40W",
      downloaded: "1TB",
      ratio: 5.05,
      seedingBonus: 14e5,
      isKept: !0,
      privilege: "可以更新过期的外部信息；可以查看Extreme User论坛。  ",
    },
    {
      id: 7,
      name: "Ultimate User",
      nameAka: ["永恒铂金熊"],
      interval: "P52W",
      downloaded: "1.5TB",
      ratio: 6.05,
      seedingBonus: 22e5,
      isKept: !0,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
    {
      id: 8,
      name: "Nexus Master",
      nameAka: ["钻石之冠北极熊"],
      interval: "P70W",
      downloaded: "3TB",
      ratio: 7.05,
      seedingBonus: 32e5,
      isKept: !0,
      privilege: "首次升级至此等级的用户将获得2个邀请名额。",
    },
  ],
};
export { W as siteMetadata };
