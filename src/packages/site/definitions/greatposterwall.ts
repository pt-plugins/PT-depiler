import { buildCategoryOptionsFromList, parseTimeWithZone, extractContent } from "../utils";
import { ISiteMetadata, ITorrent, ITorrentTag, IUserInfo } from "../types";
import GazelleJSONAPI, { groupBrowseResult, groupTorrent, SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";

interface gpwBrowseResult extends groupBrowseResult {
  groupSubName: string;
  imdbId: string;
  doubanId: string;
}

interface gpwTorrent extends groupTorrent {
  jinzhuan: boolean;
  freeType: string;
  remasterCustomTitle: string;
  resolution: string;
  source: string;
  codec: string;
  container: string;
  processing: string;
  chineseDubbed: string;
}

const freeTypeMap: Record<string, ITorrentTag> = {
  "11": { name: "75%" },
  "12": { name: "50%" },
  "13": { name: "25%" },
  "1": { name: "Free" },
  "2": { name: "Neutral", color: "cyan" },
};

// https://github.com/Mosasauroidea/GazellePW/raw/86c4bedf727691b5a97af42a4864869d18446449/src/locales/zh-Hans/zh-Hans.yaml
export const attrMap: Record<string, ITorrentTag> = {
  "10_bit": { name: "10-bit", color: "orange" },
  "2_disc_set": { name: "双碟套装", color: "cyan" },
  "2_in_1": { name: "二合一", color: "cyan" },
  "2d_3d_edition": { name: "2D/3D版", color: "cyan" },
  "3d_anaglyph": { name: "红蓝3D", color: "cyan" },
  "3d_full_sbs": { name: "全宽3D", color: "cyan" },
  "3d_half_ou": { name: "半高3D", color: "cyan" },
  "3d_half_sbs": { name: "半宽3D", color: "cyan" },
  "4k_remaster": { name: "4K重制版", color: "blue" },
  "4k_restoration": { name: "4K修复版", color: "blue" },
  collections: { name: "珍藏集", color: "purple" },
  director_s_cut: { name: "导演剪辑版", color: "purple" },
  dolby_atmos: { name: "杜比全景声", color: "orange" },
  dolby_vision: { name: "杜比视界", color: "orange" },
  dts_x: { name: "DTS:X", color: "orange" },
  dual_audio: { name: "双音轨", color: "purple" },
  editions: { name: "版本", color: "cyan" },
  english_dub: { name: "英语配音", color: "purple" },
  extended_edition: { name: "加长版", color: "purple" },
  extras: { name: "额外内容", color: "purple" },
  features: { name: "特点", color: "cyan" },
  hdr10: { name: "HDR10", color: "orange" },
  hdr10plus: { name: "HDR10+", color: "orange" },
  masters_of_cinema: { name: "电影大师", color: "purple" },
  remaster: { name: "重制版", color: "blue" },
  remux: { name: "Remux", color: "blue" },
  rifftrax: { name: "RiffTrax", color: "purple" },
  the_criterion_collection: { name: "标准收藏", color: "purple" },
  theatrical_cut: { name: "影院版", color: "purple" },
  uncut: { name: "未删减版", color: "purple" },
  unrated: { name: "未分级版", color: "purple" },
  warner_archive_collection: { name: "华纳档案馆", color: "purple" },
  with_commentary: { name: "评论音轨", color: "purple" },
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 2,
  id: "greatposterwall",
  name: "GreatPosterWall",
  aka: ["海豹", "GPW"],
  description:
    "GPW 全名 Great Poster Wall，结合了长城（the Great Wall）、海报墙（Poster Wall）两个词，同时，「海报」谐音「海豹」，所以大家可以在 Logo 上看到一只萌萌的小海豹",
  tags: ["电影"],
  timezoneOffset: "+0800",

  collaborator: ["zhuweitung"],

  type: "private",
  schema: "GazelleJSONAPI",

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
      options: buildCategoryOptionsFromList([
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
      options: buildCategoryOptionsFromList([
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
      options: buildCategoryOptionsFromList([
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
      options: buildCategoryOptionsFromList(["VHS", "DVD", "HD-DVD", "TV", "HDTV", "WEB", "Blu-ray", "Other"]),
    },
    {
      name: "编码",
      key: "codec",
      options: buildCategoryOptionsFromList(["DivX", "XviD", "x264", "H.264", "x265", "H.265", "Other"]),
    },
    {
      name: "容器",
      key: "container",
      options: buildCategoryOptionsFromList(["AVI", "MPG", "MP4", "MKV", "VOB IFO", "ISO", "m2ts", "Other"]),
    },
    {
      name: "分辨率",
      key: "resolution",
      options: buildCategoryOptionsFromList([
        "NTSC",
        "PAL",
        "480p",
        "576p",
        "720p",
        "1080i",
        "1080p",
        "2160p",
        "Other",
      ]),
    },
    {
      name: "处理",
      key: "processing",
      options: buildCategoryOptionsFromList(["Encode", "Remux", "DIY", "Untouched"]),
    },
    {
      name: "标签",
      key: "taglist",
      options: buildCategoryOptionsFromList([
        ["动作", "成人", "冒险", "动画", "艺术", "亚洲", "传记", "喜剧", "犯罪", "邪典", "纪录片", "剧情", "实验"],
        ["家庭", "奇幻", "黑色电影", "历史", "恐怖", "lgbt", "武侠", "音乐", "音乐剧", "悬疑", "演出", "政治", "爱情"],
        ["科幻", "短片", "默片", "体育", "惊悚", "video.art", "战争", "西部"],
      ]),
      cross: { mode: "comma" },
    },
  ],

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      trueDownloaded: {
        selector: ["#downloaded-value span[data-tooltip]"],
        attr: "data-tooltip",
        filters: [{ name: "split", args: [",", 1] }, { name: "parseSize" }],
      },
    },
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
      nameAka: ["Power TM"],
      interval: "P12W",
      uploads: 250,
      trueDownloaded: "2TB",
      ratio: 1.2,
      privilege: "赠送2枚邀请；每月获赠2枚临时邀请；检查所有种子",
    },
    {
      id: 6,
      name: "Elite Torrent Master",
      nameAka: ["Elite TM"],
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

export default class GreatPosterWall extends GazelleJSONAPI {
  protected override async transformGroupTorrent(group: gpwBrowseResult, torrent: gpwTorrent): Promise<ITorrent> {
    const { authkey, passkey } = await this.getAuthKey();

    const tags: ITorrentTag[] = [];
    if (torrent.isPersonalFreeleech) {
      tags.push({ name: "Free", color: "blue" });
    } else if (freeTypeMap[torrent.freeType]) {
      tags.push(freeTypeMap[torrent.freeType]);
    }

    const attrs = torrent.remasterTitle.split("/").map((s) => s.trim());
    attrs.forEach((a) => {
      if (attrMap[a]) {
        tags.push(attrMap[a]);
      }
    });

    if (torrent.jinzhuan) {
      tags.push({ name: "禁转", color: "deep-orange-darken-1" });
    }

    const trTitle = [extractContent(group.groupSubName), extractContent(group.groupName)].filter(Boolean).join(" / ");

    return {
      site: this.metadata.id, // 补全种子的 site 属性
      id: torrent.torrentId,
      title: `${trTitle} [${group.groupYear}] [${group.releaseType}]`,
      subTitle:
        `${torrent.resolution} / ${torrent.codec} / ${torrent.source} / ${torrent.container}` +
        (torrent.remasterYear ? ` / ${torrent.remasterYear}` : "") +
        (torrent.remasterCustomTitle ? ` / ${extractContent(torrent.remasterCustomTitle)}` : "") +
        (torrent.scene ? " / Scene" : ""),
      url: `${this.url}torrents.php?id=${group.groupId}&torrentid=${torrent.torrentId}`,
      link: `${this.url}torrents.php?action=download&id=${torrent.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(torrent.time, this.metadata.timezoneOffset),
      size: torrent.size,
      author: "",
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      completed: torrent.snatches,
      category: group.releaseType || "",
      tags,
      ext_imdb: group.imdbId,
      ext_douban: group.doubanId !== "0" ? group.doubanId : null,
    } as ITorrent;
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo = await super.getUserInfoResult(lastUserInfo);

    if (!flushUserInfo.id) {
      return flushUserInfo;
    }
    flushUserInfo.trueDownloaded = await this.getUserTrueDownloaded(flushUserInfo.id!);
    return flushUserInfo;
  }

  private async getUserTrueDownloaded(userid: string | number): Promise<number> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: document } = await this.request<Document>(
      {
        url: `/user.php?id=${userid}`,
        responseType: "document",
      },
      true,
    );

    return this.getFieldData(document, this.metadata.userInfo?.selectors?.trueDownloaded!) || 0;
  }
}
