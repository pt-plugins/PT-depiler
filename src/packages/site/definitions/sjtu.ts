import { ETorrentStatus, ISiteMetadata, IUserInfo } from "@ptd/site";
import NexusPHP, {
  CategoryInclbookmarked,
  CategoryIncldead,
  CategorySpstate,
  SchemaMetadata,
} from "@ptd/site/schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "sjtu",
  name: "葡萄",
  description: "Free Share, Join us",
  tags: ["教育网", "影视", "综合"],

  collaborator: ["Rhilip", "Yincircle"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://pt.sjtu.edu.cn/"],

  category: [
    {
      name: "类别",
      key: "cat",
      options: [
        { value: 401, name: "华语电影" },
        { value: 402, name: "欧美电影" },
        { value: 403, name: "亚洲电影" },
        { value: 406, name: "纪录片" },
        { value: 407, name: "港台电视剧" },
        { value: 408, name: "亚洲电视剧" },
        { value: 409, name: "大陆电视剧" },
        { value: 410, name: "欧美电视剧" },
        { value: 411, name: "大陆综艺节目" },
        { value: 412, name: "港台综艺节目" },
        { value: 413, name: "欧美综艺节目" },
        { value: 414, name: "日韩综艺节目" },
        { value: 420, name: "华语音乐" },
        { value: 421, name: "日韩音乐" },
        { value: 422, name: "欧美音乐" },
        { value: 423, name: "原声音乐" },
        { value: 425, name: "古典音乐" },
        { value: 426, name: "mp3合辑" },
        { value: 427, name: "Music Videos" },
        { value: 429, name: "游戏" },
        { value: 431, name: "动漫" },
        { value: 432, name: "体育" },
        { value: 434, name: "软件" },
        { value: 435, name: "学习" },
        { value: 440, name: "mac" },
        { value: 451, name: "校园原创" },
        { value: 450, name: "其他" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "H.264", value: 1 },
        { name: "VC-1", value: 2 },
        { name: "Xvid", value: 3 },
        { name: "MPEG-2", value: 4 },
        { name: "FLAC", value: 5 },
        { name: "APE", value: 6 },
        { name: "DTS", value: 7 },
        { name: "AC-3", value: 8 },
        { name: "其他", value: 9 },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { name: "1080p", value: 1 },
        { name: "1080i", value: 2 },
        { name: "720p", value: 3 },
        { name: "SD", value: 4 },
        { name: "其他", value: 5 },
        { name: "4k", value: 6 },
      ],
      cross: { mode: "append" },
    },
    CategoryIncldead,
    CategorySpstate,
    CategoryInclbookmarked,
    {
      name: "挑选种子",
      key: "picktype",
      options: [
        { value: 0, name: "全部" },
        { value: 1, name: "热门" },
        { value: 2, name: "经典" },
        { value: 3, name: "推荐" },
        { value: 4, name: "普通" },
        { value: 5, name: "保种中" },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search!.selectors,
      progress: {
        selector: ["td.snatched_no_yes, td.snatched_yes_yes", "td.snatched_no_no, td.snatched_yes_no"],
        attr: "class",
        filters: [
          (query: string) => {
            switch (true) {
              case /snatched_(no|yes)_yes/.test(query):
                return 100;
              case /snatched_(no|yes)_no/.test(query):
              default:
                return 0;
            }
          },
        ],
      },
      status: {
        selector: ["td.snatched_no_yes, td.snatched_yes_yes", "td.snatched_no_no, td.snatched_yes_no"],
        attr: "class",
        filters: [
          (query: string) => {
            switch (true) {
              case /snatched_(no|yes)_yes/.test(query):
                return ETorrentStatus.seeding;
              case /snatched_(no|yes)_no/.test(query):
                return ETorrentStatus.inactive;
              default:
                return ETorrentStatus.unknown;
            }
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Power User",
      interval: "P4W",
      downloaded: "50GB",
      ratio: 1.05,
      privilege:
        "可以查看NFO文档; 可以查看用户列表; 可以请求续种; 可以在求种补种区发主题帖;可以查看友站邀请专区;" +
        '可以查看排行榜; 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强"); ' +
        "可以在魔力值系统购买更多邀请名额.可以同时下载5个种子.",
    },
    {
      id: 2,
      name: "Elite User",
      interval: "P8W",
      downloaded: "120GB",
      ratio: 1.55,
      privilege: "Elite User及以上用户Park后不会被删除帐号;可以直接上传种子.可以同时下载8个种子.",
    },
    {
      id: 3,
      name: "Crazy User",
      interval: "P15W",
      downloaded: "300GB",
      ratio: 2.05,
      privilege: "得到一个邀请名额; 可以发送邀请; 可以在做种/下载/上传的时候选择匿名模式.可以同时下载10个种子.",
    },
    {
      id: 4,
      name: "Insane User",
      interval: "P25W",
      downloaded: "500GB",
      ratio: 2.55,
      privilege: "得到一个邀请名额; 可以查看普通日志.同时下载种子线程无限制.",
    },
    {
      id: 5,
      name: "Veteran User",
      interval: "P40W",
      downloaded: "750GB",
      ratio: 3.05,
      privilege: "可以查看其它用户的评论、帖子历史;Veteran User及以上用户会永远保留账号.",
    },
    {
      id: 6,
      name: "Extreme User",
      interval: "P60W",
      downloaded: "1TB",
      ratio: 3.55,
      privilege: "得到一个邀请名额; 可以更新过期的外部信息.",
    },
    {
      id: 7,
      name: "Ultimate User",
      interval: "P80W",
      downloaded: "1.5TB",
      ratio: 4.05,
      privilege: "可以查看种子文件结构.",
    },
    {
      id: 8,
      name: "Nexus Master",
      interval: "P100W",
      downloaded: "3TB",
      ratio: 4.55,
      privilege: "得到一个邀请名额.",
    },
    {
      id: 100,
      name: "VIP",
      groupType: "vip",
      privilege: "和Nexus Master拥有相同权限并被认为是精英成员. 免除自动降级.",
    },
    {
      id: 200,
      name: "Warehouse",
      groupType: "manager",
      privilege: "保种组组员.可以查看保种组页面,可以选择/取消要保种的种子;免除自动降级.",
    },
    {
      id: 201,
      name: "Uploader",
      groupType: "manager",
      privilege: "专注的上传者.",
    },
    {
      id: 202,
      name: "Helper",
      groupType: "manager",
      privilege: "保种组各小组小组长,可以挑选/取消需要保种的种子,可以删除保种组页面列表里保种组组员的名单.",
    },
    {
      id: 203,
      name: "Forummod",
      groupType: "manager",
      privilege: "论坛版主.可以封禁用户的POST权限,可以警告用户;可以管理对应版面的帖子.",
    },
    {
      id: 204,
      name: "Coder",
      groupType: "manager",
      privilege: "网站的维护开发组成员.",
    },
    {
      id: 205,
      name: "Moderator",
      groupType: "manager",
      privilege:
        "可以查看管理组信箱、举报信箱; 管理趣味盒内容、投票内容; 可以编辑或删除任何上传的种子; 可以管理候选;" +
        "可以管理论坛帖子、用户评论; 可以查看机密日志; 可以删除任何字幕; 可以管理日志中的代码、史册; 可以查看用户的邀请记录;" +
        "可以管理用户帐号的一般信息. 不能管理友情链接、最近消息、论坛版块; 不能删除账号.",
    },
    {
      id: 206,
      name: "Administrator",
      groupType: "manager",
      privilege: "除了不能改变站点设定、管理捐赠外, 可以做任何事.",
    },
    {
      id: 207,
      name: "Sysop",
      groupType: "manager",
      privilege: "网站开发/维护人员, 可以改变站点设定, 不能管理捐赠.",
    },
    {
      id: 208,
      name: "Staff Leader",
      groupType: "manager",
      privilege: "网站主管, 可以做任何事.",
    },
  ],
};

export default class sjtu extends NexusPHP {
  // SJTU 不返回正在做种的种子信息
  protected override async parseUserInfoForSeedingStatus(
    flushUserInfo: Partial<IUserInfo>,
  ): Promise<Partial<IUserInfo>> {
    return flushUserInfo;
  }

  // SJTU 不返回用户上传的种子信息
  protected override async parseUserInfoForUploads(flushUserInfo: Partial<IUserInfo>): Promise<Partial<IUserInfo>> {
    return flushUserInfo;
  }
}
