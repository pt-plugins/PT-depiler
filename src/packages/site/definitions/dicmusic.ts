import { parseSizeString, type ISiteMetadata, IUserInfo, ITorrent } from "@ptd/site";
import GazelleJSONAPI, { SchemaMetadata, groupBrowseResult, groupTorrent } from "@ptd/site/schemas/GazelleJSONAPI.ts";


export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "dicmusic",
  name: "DICMusic",
  aka: ["DIC 海豚站", "海豚"],
  description: "DICMusic 是一个专注于音乐的中文 Gazelle 站点",
  tags: ["音乐"],
  timezoneOffset: "+0800",
  collaborator: [ 
    "ylxb2016",
    "enigmaz",
    "amorphobia",
    "Ljcbaby"
  ],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: [ "aHR0cHM6Ly9kaWNtdXNpYy5jb20v"],
  formerHosts: [ "aHR0cHM6Ly9kaWNtdXNpYy5jbHViLw==" ],

  category: [
    {
      name: "分类",
      key: "filter_cat",
      options: [
        { value: 1, name: "Music" },
        { value: 2, name: "Applications" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "编码",
      key: "encoding",
      options: [
        { value: "192", name: "192" },
        { value: "APS+%28VBR%29", name: "APS (VBR)" },
        { value: "V2+%28VBR%28", name: "V2 (VBR)" },
        { value: "V1+%28VBR%28", name: "V1 (VBR)" },
        { value: "q8.x+%28VBR%29", name: "q8.x (VBR)" },
        { value: "320", name: "320" },
        { value: "Lossless", name: "Lossless" },
        { value: "24bit+Lossless", name: "24bit Lossless" },
        { value: "Other", name: "Other" },
      ],
      cross: false,
    },
    {
      name: "格式",
      key: "format",
      options: [
        { value: "FLAC", name: "FLAC" },
        { value: "WAV", name: "WAV" },
        { value: "DSD", name: "DSD" },
        { value: "MP3", name: "MP3" },
        { value: "AAC", name: "AAC" },
        { value: "DTS", name: "DTS" },
        { value: "Lossless", name: "Lossless" },
        { value: "24bit+Lossless", name: "24bit Lossless" },
        { value: "Other", name: "Other" },
      ],
      cross: false,
    },
    {
      name: "媒介",
      key: "media",
      options: [
        { value: "CD", name: "CD" },
        { value: "DVD", name: "DVD" },
        { value: "Vinyl", name: "Vinyl" },
        { value: "Soundboard", name: "Soundboard" },
        { value: "SACD", name: "SACD" },
        { value: "Blu-ray", name: "Blu-ray" },
        { value: "DAT", name: "DAT" },
        { value: "Cassette", name: "Cassette" },
        { value: "WEB", name: "WEB" },
        { value: "Unknown+Media", name: "Unknown Media" },
      ],
      cross: false,
    },
    {
      name: "发行类别",
      key: "releasetype",
      options: [
        { value: "1", name: "专辑" },
        { value: "3", name: "原声" },
        { value: "5", name: "EP" },
        { value: "6", name: "精选" },
        { value: "7", name: "集锦" },
        { value: "9", name: "单曲专辑" },
        { value: "11", name: "重混音" },
        { value: "13", name: "重混音" },
        { value: "21", name: "未知" },  
      ],
      cross: false,
    },
    {
      name: "有 Log",
      key: "haslog",
      options: [
        { value: "1", name: "是" },
        { value: "0", name: "否" },
        { value: "100", name: "100% only" },
        { value: "-1", name: "<100%/Unscored" },
      ],
      cross: false,
    },
    {
      name: "有 Cue",
      key: "hascue",
      options: [
        { value: "1", name: "是" },
        { value: "0", name: "否" }, 
      ],
      cross: false,
    },
    {
      name: "免费选项",
      key: "freetorrent",
      options: [
        { value: "1", name: "免费种子" },
        { value: "2", name: "中性种子" },
        { value: "3", name: "上述两者" },
        { value: "0", name: "普通种子" },
      ],
      cross: false,
    },
    // 该站点还提供其他分类，考虑到设置搜索方案时与其他同类站点的一致性，仅提供以上分类
  ],

  search: {
    keywordPath: "params.searchstr",
    requestConfig: {
      url: "/ajax.php",
      responseType: "json",
      params: {
        action: "browse",
        // group_results: 0 时返回数据不完整
        searchsubmit: 1,
      },
    },
  },

  userInfo: {
    pickLast: ["id", "name", "joinTime"],
    ...SchemaMetadata.userInfo,
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege:
        "能够使用 RSS 订阅系统；具有论坛「茶话会」版块的阅读权限",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege:
        "发起求种；查看部分排行榜；完全访问「茶话会」版块",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploaded: "25GB",
      ratio: 1.05,
      uploads: 5,
      privilege:
        "免疫账号不活跃；发送邀请，赠送1枚永久邀请；佩戴1枚印记；创建1个私人合集；访问「求邀区」「发邀区」「Power User」版块；完全访问排行榜",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P4W",
      uploaded: "75GB",
      ratio: 1.05,
      uploads: 50,
      privilege:
        "首次赠送1枚永久邀请；佩戴2枚印记；创建2个私人合集；访问「Elite」版块；检查自己的种子；编辑所有种子；购买「自定义头衔（不允许 BBCode）」",
    },
    {
      id: 5,
      name: "Torrent Master",
      interval: "P8W",
      uploaded: "200GB",
      ratio: 1.05,
      uploads: 150,
      privilege:
        "首次赠送2枚永久邀请；每月获赠 1 枚临时邀请；佩戴3枚印记；创建3个私人合集；访问「Torrent Master」版块",
    },
    {
      id: 6,
      name: "Power Torrent Master",
      interval: "P8W",
      uploaded: "200GB",
      ratio: 1.05,
      uniqueGroups: 300,
      privilege:
        "首次赠送2枚永久邀请；每月获赠 2 枚临时邀请；佩戴4枚印记；创建4个私人合集；能够检查所有种子",
    },
    {
      id: 7,
      name: "Elite Torrent Master",
      interval: "P12W",
      uploaded: "600GB",
      ratio: 1.05,
      perfectFlacs: 500,
      privilege:
        "首次赠送3枚永久邀请；每月获赠 3 枚临时邀请；佩戴5枚印记；创建5个私人合集；访问「Elite Torrent Master」版块",
    },
    {
      id: 8,
      name: "Elite Torrent Master Plus",
      interval: "P12W",
      uploaded: "600GB",
      ratio: 1.05,
      perfectFlacs: 500,
      privilege:
        "首次赠送3枚永久邀请；每月获赠 3 枚临时邀请；能够在商城购买「自定义头衔（允许 BBCode）」",
    },
    {
      id: 9,
      name: "Guru",
      interval: "P16W",
      uploaded: "1319.41GB",
      ratio: 1.05,
      perfectFlacs: 1000,
      privilege:
        "拥有无限邀请；佩戴6枚印记；创建6个私人合集；访问「Guru」版块；查看种子检查日志",
    },
    {
      id: 100,
      name: "VIP",
      groupType: "vip",
      privilege:
        "对站点做过特殊贡献或特邀会员",
    },
    {
      id: 101,
      name: "传说",
      groupType: "vip",
      privilege:
        "对站点做出过杰出贡献的会员",
    },
    {
      id: 200,
      name: "一线支持 [FLS]",
      groupType: "manager",
      privilege:
        "协助站点日常工作，并在用户需要帮助时为他们提供支持",
    },
    {
      id: 201,
      name: "种子协管 [TI]",
      groupType: "manager",
      privilege:
        "协助 Torrent Moderator 的种子管理工作，并在用户需要帮助时为他们提供支持",
    },
    {
      id: 202,
      name: "邀请维护组 [TC]",
      groupType: "manager",
      privilege:
        "负责友站的邀请开设、维护方面的人员。并由管理人员授权",
    },
    {
      id: 203,
      name: "论坛版主 (Forum Moderator)",
      groupType: "manager",
      privilege:
        "监督和审核论坛和种子评论",
    },
    {
      id: 204,
      name: "种子版主 (Torrent Moderator)",
      groupType: "manager",
      privilege:
        "监督和完善种子",
    },
    {
      id: 205,
      name: "总版主 (Moderator)",
      groupType: "manager",
      privilege:
        "总管种子和网站一般内容。同时帮助和指导次用户等级成员",
    },
    {
      id: 206,
      name: "开发 (Developer)",
      groupType: "manager",
      privilege:
        "设计和编写站点代码",
    },
    {
      id: 207,
      name: "总管理员 (Administrator)",
      groupType: "manager",
      privilege:
        "一般站点管理和对其他工作人员的监督",
    },
    {
      id: 208,
      name: "SysOp",
      groupType: "manager",
      privilege:
        "一般站点管理和对其他工作人员的监督",
    },
  ],
};

export interface DicUserInfo extends IUserInfo {
  perfectFlacs?: number;
  uploads?: number;
  uniqueGroups?: number;
}

export interface DicGroupTorrent extends groupTorrent {
  jinzhuan: boolean;
}

export default class DICMusic extends GazelleJSONAPI {
  // 覆写以增加获取perfectFlacs, uploads, uniqueGroups
  protected override async getUserExtendInfo(userId: number): Promise<Partial<IUserInfo>> {
    const { data: apiUser } = await this.requestApi("user", {
      id: userId,
    });

    const extendInfo = this.getFieldsData(
      apiUser,
      ["joinTime", "seeding"],
      this.metadata.userInfo!.selectors!
    ) as Partial<IUserInfo>;

    const perfectFlacs = parseInt(apiUser.response.community?.perfectFlacs ?? 0);
    const uploads = parseInt(apiUser.response.community?.uploaded ?? 0);
    const uniqueGroups = parseInt(apiUser.response.community?.groups ?? 0);

    return {
      ...extendInfo,
      perfectFlacs,
      uploads,
      uniqueGroups,
    };
}

  // 重写以获取seedingSize, bonus, bonusPerHour
  protected override async getUserSeedingTorrents(userId: number): Promise<Partial<IUserInfo>> {
    const userSeedingTorrent: Partial<IUserInfo> = {
      seedingSize: 0,
      bonus: 0,
      bonusPerHour: 0
    };

    // 该站点提供积分速率页，可直接获取seedingSize, bonus, bonusPerHour
    const { data: TListDocument } = await this.request<Document>({
      url: "/bonus.php",
      params: { action: "bprates", userid: userId },
      responseType: "document"
    });

    // 提取总积分（在 header h3位置，例如 "总积分: 123,456"）
    const bonusElement = TListDocument.querySelector("h3");
    if (bonusElement) {
      const match = bonusElement.innerText?.match(/总积分[:：]?\s*([\d,\.]+)/);
      if (match?.[1]) {
        userSeedingTorrent.bonus = parseInt(match[1].replace(/,/g, '')) || "N/A"; // 移除逗号并转换为数字
      }
    }

    // 提取体积（在 #bprates_overview 表格中第二列）
    const seedingSizeCell = TListDocument.querySelector("#bprates_overview tbody tr td:nth-child(2)");
    userSeedingTorrent.seedingSize = parseSizeString(seedingSizeCell?.textContent?.trim() || "0 B");

    // 提取时积分（在 #bprates_overview 表格中第三列）
    const bonusPerHourCell = TListDocument.querySelector("#bprates_overview tbody tr td:nth-child(3)");
    if (bonusPerHourCell) {
      userSeedingTorrent.bonusPerHour = parseFloat(bonusPerHourCell?.textContent?.trim() || "0");
    }
    
    return userSeedingTorrent;
  }
  
  // 该站点提供禁转标签
  protected override async transformGroupTorrent(group: groupBrowseResult, torrent: DicGroupTorrent): Promise<ITorrent> {
    // 调用父类实现，复用绝大多数逻辑
    const basegroupTorrent = await super.transformGroupTorrent(group, torrent);

    if (torrent.jinzhuan) {
      basegroupTorrent.tags?.push({ name: "Excl.", color: "deep-orange darken-1" });
    }

    return basegroupTorrent;
  }
}