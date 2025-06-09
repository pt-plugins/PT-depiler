import Sizzle from "sizzle";
import { parseSizeString, parseTimeWithZone, tryToNumber } from "../utils";
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
      options: [
        { name: "英语", value: "英语" },
        { name: "日语", value: "日语" },
        { name: "韩语", value: "韩语" },
        { name: "阿拉伯语", value: "阿拉伯语" },
        { name: "巴西葡萄牙语", value: "巴西葡萄牙语" },
        { name: "保加利亚语", value: "保加利亚语" },
        { name: "克罗地亚语", value: "克罗地亚语" },
        { name: "捷克语", value: "捷克语" },
        { name: "丹麦语", value: "丹麦语" },
        { name: "荷兰语", value: "荷兰语" },
        { name: "爱沙尼亚语", value: "爱沙尼亚语" },
        { name: "芬兰语", value: "芬兰语" },
        { name: "法语", value: "法语" },
        { name: "德语", value: "德语" },
        { name: "希腊语", value: "希腊语" },
        { name: "希伯来语", value: "希伯来语" },
        { name: "印地语", value: "印地语" },
        { name: "匈牙利语", value: "匈牙利语" },
        { name: "冰岛语", value: "冰岛语" },
        { name: "印度尼西亚语", value: "印度尼西亚语" },
        { name: "意大利语", value: "意大利语" },
        { name: "拉脱维亚语", value: "拉脱维亚语" },
        { name: "立陶宛语", value: "立陶宛语" },
        { name: "挪威语", value: "挪威语" },
        { name: "波斯语", value: "波斯语" },
        { name: "波兰语", value: "波兰语" },
        { name: "葡萄牙语", value: "葡萄牙语" },
        { name: "罗马尼亚语", value: "罗马尼亚语" },
        { name: "俄语", value: "俄语" },
        { name: "塞尔威亚语", value: "塞尔威亚语" },
        { name: "斯洛伐克语", value: "斯洛伐克语" },
        { name: "斯洛文尼亚语", value: "斯洛文尼亚语" },
        { name: "西班牙语", value: "西班牙语" },
        { name: "瑞典语", value: "瑞典语" },
        { name: "泰语", value: "泰语" },
        { name: "土耳其语", value: "土耳其语" },
        { name: "乌克兰语", value: "乌克兰语" },
        { name: "越南语", value: "越南语" },
        { name: "普通话", value: "普通话" },
        { name: "粤语", value: "粤语" },
        { name: "闽南语", value: "闽南语" },
        { name: "日本手语", value: "日本手语" },
        { name: "汉语", value: "汉语" },
        { name: "加泰隆语", value: "加泰隆语" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "字幕",
      key: "subtitles",
      options: [
        { name: "简体", value: "简体" },
        { name: "繁体", value: "繁体" },
        { name: "英语", value: "英语" },
        { name: "日语", value: "日语" },
        { name: "韩语", value: "韩语" },
        { name: "阿拉伯语", value: "阿拉伯语" },
        { name: "巴西葡萄牙语", value: "巴西葡萄牙语" },
        { name: "保加利亚语", value: "保加利亚语" },
        { name: "克罗地亚语", value: "克罗地亚语" },
        { name: "捷克语", value: "捷克语" },
        { name: "丹麦语", value: "丹麦语" },
        { name: "荷兰语", value: "荷兰语" },
        { name: "爱沙尼亚语", value: "爱沙尼亚语" },
        { name: "芬兰语", value: "芬兰语" },
        { name: "法语", value: "法语" },
        { name: "德语", value: "德语" },
        { name: "希腊语", value: "希腊语" },
        { name: "希伯来语", value: "希伯来语" },
        { name: "印地语", value: "印地语" },
        { name: "匈牙利语", value: "匈牙利语" },
        { name: "冰岛语", value: "冰岛语" },
        { name: "印度尼西亚语", value: "印度尼西亚语" },
        { name: "意大利语", value: "意大利语" },
        { name: "拉脱维亚语", value: "拉脱维亚语" },
        { name: "立陶宛语", value: "立陶宛语" },
        { name: "挪威语", value: "挪威语" },
        { name: "波斯语", value: "波斯语" },
        { name: "波兰语", value: "波兰语" },
        { name: "葡萄牙语", value: "葡萄牙语" },
        { name: "罗马尼亚语", value: "罗马尼亚语" },
        { name: "俄语", value: "俄语" },
        { name: "塞尔威亚语", value: "塞尔威亚语" },
        { name: "斯洛伐克语", value: "斯洛伐克语" },
        { name: "斯洛文尼亚语", value: "斯洛文尼亚语" },
        { name: "西班牙语", value: "西班牙语" },
        { name: "瑞典语", value: "瑞典语" },
        { name: "泰语", value: "泰语" },
        { name: "土耳其语", value: "土耳其语" },
        { name: "乌克兰语", value: "乌克兰语" },
        { name: "越南语", value: "越南语" },
      ],
      cross: { mode: "comma" },
    },
    {
      name: "国家和地区",
      key: "region",
      options: [
        { name: "阿富汗", value: "阿富汗" },
        { name: "奥兰群岛", value: "奥兰群岛" },
        { name: "阿尔巴尼亚", value: "阿尔巴尼亚" },
        { name: "阿尔及利亚", value: "阿尔及利亚" },
        { name: "美属萨摩亚", value: "美属萨摩亚" },
        { name: "安道尔", value: "安道尔" },
        { name: "安哥拉", value: "安哥拉" },
        { name: "安圭拉", value: "安圭拉" },
        { name: "安提瓜和巴布达", value: "安提瓜和巴布达" },
        { name: "阿根廷", value: "阿根廷" },
        { name: "亚美尼亚", value: "亚美尼亚" },
        { name: "阿鲁巴", value: "阿鲁巴" },
        { name: "澳大利亚", value: "澳大利亚" },
        { name: "奥地利", value: "奥地利" },
        { name: "阿塞拜疆", value: "阿塞拜疆" },
        { name: "孟加拉", value: "孟加拉" },
        { name: "巴林", value: "巴林" },
        { name: "巴哈马", value: "巴哈马" },
        { name: "巴巴多斯", value: "巴巴多斯" },
        { name: "白俄罗斯", value: "白俄罗斯" },
        { name: "比利时", value: "比利时" },
        { name: "伯利兹", value: "伯利兹" },
        { name: "贝宁", value: "贝宁" },
        { name: "百慕大", value: "百慕大" },
        { name: "不丹", value: "不丹" },
        { name: "玻利维亚", value: "玻利维亚" },
        { name: "波斯尼亚和黑塞哥维那", value: "波斯尼亚和黑塞哥维那" },
        { name: "博茨瓦纳", value: "博茨瓦纳" },
        { name: "布维岛", value: "布维岛" },
        { name: "巴西", value: "巴西" },
        { name: "文莱", value: "文莱" },
        { name: "保加利亚", value: "保加利亚" },
        { name: "布基纳法索", value: "布基纳法索" },
        { name: "布隆迪", value: "布隆迪" },
        { name: "柬埔寨", value: "柬埔寨" },
        { name: "喀麦隆", value: "喀麦隆" },
        { name: "加拿大", value: "加拿大" },
        { name: "佛得角", value: "佛得角" },
        { name: "中非", value: "中非" },
        { name: "乍得", value: "乍得" },
        { name: "智利", value: "智利" },
        { name: "圣诞岛", value: "圣诞岛" },
        { name: "科科斯（基林）群岛", value: "科科斯（基林）群岛" },
        { name: "哥伦比亚", value: "哥伦比亚" },
        { name: "科摩罗", value: "科摩罗" },
        { name: "刚果（金）", value: "刚果（金）" },
        { name: "刚果", value: "刚果" },
        { name: "库克群岛", value: "库克群岛" },
        { name: "哥斯达黎加", value: "哥斯达黎加" },
        { name: "科特迪瓦", value: "科特迪瓦" },
        { name: "中国", value: "中国" },
        { name: "克罗地亚", value: "克罗地亚" },
        { name: "古巴", value: "古巴" },
        { name: "捷克", value: "捷克" },
        { name: "塞浦路斯", value: "塞浦路斯" },
        { name: "丹麦", value: "丹麦" },
        { name: "吉布提", value: "吉布提" },
        { name: "多米尼加", value: "多米尼加" },
        { name: "厄瓜多尔", value: "厄瓜多尔" },
        { name: "埃及", value: "埃及" },
        { name: "赤道几内亚", value: "赤道几内亚" },
        { name: "厄立特里亚", value: "厄立特里亚" },
        { name: "爱沙尼亚", value: "爱沙尼亚" },
        { name: "埃塞俄比亚", value: "埃塞俄比亚" },
        { name: "法罗群岛", value: "法罗群岛" },
        { name: "斐济", value: "斐济" },
        { name: "芬兰", value: "芬兰" },
        { name: "法国", value: "法国" },
        { name: "法国大都会", value: "法国大都会" },
        { name: "法属圭亚那", value: "法属圭亚那" },
        { name: "法属波利尼西亚", value: "法属波利尼西亚" },
        { name: "加蓬", value: "加蓬" },
        { name: "冈比亚", value: "冈比亚" },
        { name: "格鲁吉亚", value: "格鲁吉亚" },
        { name: "德国", value: "德国" },
        { name: "加纳", value: "加纳" },
        { name: "直布罗陀", value: "直布罗陀" },
        { name: "希腊", value: "希腊" },
        { name: "格林纳达", value: "格林纳达" },
        { name: "瓜德罗普岛", value: "瓜德罗普岛" },
        { name: "关岛", value: "关岛" },
        { name: "危地马拉", value: "危地马拉" },
        { name: "根西岛", value: "根西岛" },
        { name: "几内亚比绍", value: "几内亚比绍" },
        { name: "几内亚", value: "几内亚" },
        { name: "圭亚那", value: "圭亚那" },
        { name: "海地", value: "海地" },
        { name: "洪都拉斯", value: "洪都拉斯" },
        { name: "匈牙利", value: "匈牙利" },
        { name: "冰岛", value: "冰岛" },
        { name: "印度", value: "印度" },
        { name: "印度尼西亚", value: "印度尼西亚" },
        { name: "伊朗", value: "伊朗" },
        { name: "伊拉克", value: "伊拉克" },
        { name: "爱尔兰", value: "爱尔兰" },
        { name: "马恩岛", value: "马恩岛" },
        { name: "以色列", value: "以色列" },
        { name: "意大利", value: "意大利" },
        { name: "牙买加", value: "牙买加" },
        { name: "日本", value: "日本" },
        { name: "泽西岛", value: "泽西岛" },
        { name: "约旦", value: "约旦" },
        { name: "哈萨克斯坦", value: "哈萨克斯坦" },
        { name: "肯尼亚", value: "肯尼亚" },
        { name: "基里巴斯", value: "基里巴斯" },
        { name: "韩国", value: "韩国" },
        { name: "朝鲜", value: "朝鲜" },
        { name: "科威特", value: "科威特" },
        { name: "吉尔吉斯斯坦", value: "吉尔吉斯斯坦" },
        { name: "老挝", value: "老挝" },
        { name: "拉脱维亚", value: "拉脱维亚" },
        { name: "黎巴嫩", value: "黎巴嫩" },
        { name: "莱索托", value: "莱索托" },
        { name: "利比里亚", value: "利比里亚" },
        { name: "利比亚", value: "利比亚" },
        { name: "列支敦士登", value: "列支敦士登" },
        { name: "立陶宛", value: "立陶宛" },
        { name: "卢森堡", value: "卢森堡" },
        { name: "马其顿", value: "马其顿" },
        { name: "马拉维", value: "马拉维" },
        { name: "马来西亚", value: "马来西亚" },
        { name: "马达加斯加", value: "马达加斯加" },
        { name: "马尔代夫", value: "马尔代夫" },
        { name: "马里", value: "马里" },
        { name: "马耳他", value: "马耳他" },
        { name: "马绍尔群岛", value: "马绍尔群岛" },
        { name: "马提尼克岛", value: "马提尼克岛" },
        { name: "毛里塔尼亚", value: "毛里塔尼亚" },
        { name: "毛里求斯", value: "毛里求斯" },
        { name: "马约特", value: "马约特" },
        { name: "墨西哥", value: "墨西哥" },
        { name: "密克罗尼西亚", value: "密克罗尼西亚" },
        { name: "摩尔多瓦", value: "摩尔多瓦" },
        { name: "摩纳哥", value: "摩纳哥" },
        { name: "蒙古", value: "蒙古" },
        { name: "黑山", value: "黑山" },
        { name: "蒙特塞拉特", value: "蒙特塞拉特" },
        { name: "摩洛哥", value: "摩洛哥" },
        { name: "莫桑比克", value: "莫桑比克" },
        { name: "缅甸", value: "缅甸" },
        { name: "纳米比亚", value: "纳米比亚" },
        { name: "瑙鲁", value: "瑙鲁" },
        { name: "尼泊尔", value: "尼泊尔" },
        { name: "荷兰", value: "荷兰" },
        { name: "新喀里多尼亚", value: "新喀里多尼亚" },
        { name: "新西兰", value: "新西兰" },
        { name: "尼加拉瓜", value: "尼加拉瓜" },
        { name: "尼日尔", value: "尼日尔" },
        { name: "尼日利亚", value: "尼日利亚" },
        { name: "纽埃", value: "纽埃" },
        { name: "诺福克岛", value: "诺福克岛" },
        { name: "挪威", value: "挪威" },
        { name: "阿曼", value: "阿曼" },
        { name: "巴基斯坦", value: "巴基斯坦" },
        { name: "帕劳", value: "帕劳" },
        { name: "巴勒斯坦", value: "巴勒斯坦" },
        { name: "巴拿马", value: "巴拿马" },
        { name: "巴布亚新几内亚", value: "巴布亚新几内亚" },
        { name: "秘鲁", value: "秘鲁" },
        { name: "菲律宾", value: "菲律宾" },
        { name: "皮特凯恩群岛", value: "皮特凯恩群岛" },
        { name: "波兰", value: "波兰" },
        { name: "葡萄牙", value: "葡萄牙" },
        { name: "波多黎各", value: "波多黎各" },
        { name: "卡塔尔", value: "卡塔尔" },
        { name: "留尼汪岛", value: "留尼汪岛" },
        { name: "罗马尼亚", value: "罗马尼亚" },
        { name: "卢旺达", value: "卢旺达" },
        { name: "俄罗斯", value: "俄罗斯" },
        { name: "圣赫勒拿", value: "圣赫勒拿" },
        { name: "圣基茨和尼维斯", value: "圣基茨和尼维斯" },
        { name: "圣卢西亚", value: "圣卢西亚" },
        { name: "圣文森特和格林纳丁斯", value: "圣文森特和格林纳丁斯" },
        { name: "萨尔瓦多", value: "萨尔瓦多" },
        { name: "萨摩亚", value: "萨摩亚" },
        { name: "圣马力诺", value: "圣马力诺" },
        { name: "圣多美和普林西比", value: "圣多美和普林西比" },
        { name: "沙特阿拉伯", value: "沙特阿拉伯" },
        { name: "塞内加尔", value: "塞内加尔" },
        { name: "塞舌尔", value: "塞舌尔" },
        { name: "塞拉利昂", value: "塞拉利昂" },
        { name: "新加坡", value: "新加坡" },
        { name: "塞尔维亚", value: "塞尔维亚" },
        { name: "斯洛伐克", value: "斯洛伐克" },
        { name: "斯洛文尼亚", value: "斯洛文尼亚" },
        { name: "所罗门群岛", value: "所罗门群岛" },
        { name: "索马里", value: "索马里" },
        { name: "南非", value: "南非" },
        { name: "西班牙", value: "西班牙" },
        { name: "斯里兰卡", value: "斯里兰卡" },
        { name: "苏丹", value: "苏丹" },
        { name: "苏里南", value: "苏里南" },
        { name: "斯威士兰", value: "斯威士兰" },
        { name: "瑞典", value: "瑞典" },
        { name: "瑞士", value: "瑞士" },
        { name: "叙利亚", value: "叙利亚" },
        { name: "塔吉克斯坦", value: "塔吉克斯坦" },
        { name: "坦桑尼亚", value: "坦桑尼亚" },
        { name: "泰国", value: "泰国" },
        { name: "特立尼达和多巴哥", value: "特立尼达和多巴哥" },
        { name: "东帝汶", value: "东帝汶" },
        { name: "多哥", value: "多哥" },
        { name: "托克劳", value: "托克劳" },
        { name: "汤加", value: "汤加" },
        { name: "突尼斯", value: "突尼斯" },
        { name: "土耳其", value: "土耳其" },
        { name: "土库曼斯坦", value: "土库曼斯坦" },
        { name: "图瓦卢", value: "图瓦卢" },
        { name: "乌干达", value: "乌干达" },
        { name: "乌克兰", value: "乌克兰" },
        { name: "阿拉伯联合酋长国", value: "阿拉伯联合酋长国" },
        { name: "英国", value: "英国" },
        { name: "美国", value: "美国" },
        { name: "乌拉圭", value: "乌拉圭" },
        { name: "乌兹别克斯坦", value: "乌兹别克斯坦" },
        { name: "瓦努阿图", value: "瓦努阿图" },
        { name: "梵蒂冈", value: "梵蒂冈" },
        { name: "委内瑞拉", value: "委内瑞拉" },
        { name: "越南", value: "越南" },
        { name: "瓦利斯群岛和富图纳群岛", value: "瓦利斯群岛和富图纳群岛" },
        { name: "西撒哈拉", value: "西撒哈拉" },
        { name: "也门", value: "也门" },
        { name: "南斯拉夫", value: "南斯拉夫" },
        { name: "赞比亚", value: "赞比亚" },
        { name: "津巴布韦", value: "津巴布韦" },
        { name: "中国台湾", value: "中国台湾" },
        { name: "中国香港", value: "中国香港" },
        { name: "中国澳门", value: "中国澳门" },
        { name: "苏联", value: "苏联" },
      ],
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
      options: [
        { name: "VHS", value: "VHS" },
        { name: "DVD", value: "DVD" },
        { name: "HD-DVD", value: "HD-DVD" },
        { name: "TV", value: "TV" },
        { name: "HDTV", value: "HDTV" },
        { name: "WEB", value: "WEB" },
        { name: "Blu-ray", value: "Blu-ray" },
        { name: "Other", value: "Other" },
      ],
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { name: "DivX", value: "DivX" },
        { name: "XviD", value: "XviD" },
        { name: "x264", value: "x264" },
        { name: "H.264", value: "H.264" },
        { name: "x265", value: "x265" },
        { name: "H.265", value: "H.265" },
        { name: "Other", value: "Other" },
      ],
    },
    {
      name: "容器",
      key: "container",
      options: [
        { name: "AVI", value: "AVI" },
        { name: "MPG", value: "MPG" },
        { name: "MP4", value: "MP4" },
        { name: "MKV", value: "MKV" },
        { name: "VOB IFO", value: "VOB IFO" },
        { name: "ISO", value: "ISO" },
        { name: "m2ts", value: "m2ts" },
        { name: "Other", value: "Other" },
      ],
    },
    {
      name: "分辨率",
      key: "resolution",
      options: [
        { name: "NTSC", value: "NTSC" },
        { name: "PAL", value: "PAL" },
        { name: "480p", value: "480p" },
        { name: "576p", value: "576p" },
        { name: "720p", value: "720p" },
        { name: "1080i", value: "1080i" },
        { name: "1080p", value: "1080p" },
        { name: "2160p", value: "2160p" },
        { name: "Other", value: "Other" },
      ],
    },
    {
      name: "处理",
      key: "processing",
      options: [
        { name: "Encode", value: "Encode" },
        { name: "Remux", value: "Remux" },
        { name: "DIY", value: "DIY" },
        { name: "Untouched", value: "Untouched" },
      ],
    },
    {
      name: "标签",
      key: "taglist",
      options: [
        { name: "动作", value: "动作" },
        { name: "成人", value: "成人" },
        { name: "冒险", value: "冒险" },
        { name: "动画", value: "动画" },
        { name: "艺术", value: "艺术" },
        { name: "亚洲", value: "亚洲" },
        { name: "传记", value: "传记" },
        { name: "喜剧", value: "喜剧" },
        { name: "犯罪", value: "犯罪" },
        { name: "邪典", value: "邪典" },
        { name: "纪录片", value: "纪录片" },
        { name: "剧情", value: "剧情" },
        { name: "实验", value: "实验" },
        { name: "家庭", value: "家庭" },
        { name: "奇幻", value: "奇幻" },
        { name: "黑色电影", value: "黑色电影" },
        { name: "历史", value: "历史" },
        { name: "恐怖", value: "恐怖" },
        { name: "lgbt", value: "lgbt" },
        { name: "武侠", value: "武侠" },
        { name: "音乐", value: "音乐" },
        { name: "音乐剧", value: "音乐剧" },
        { name: "悬疑", value: "悬疑" },
        { name: "演出", value: "演出" },
        { name: "政治", value: "政治" },
        { name: "爱情", value: "爱情" },
        { name: "科幻", value: "科幻" },
        { name: "短片", value: "短片" },
        { name: "默片", value: "默片" },
        { name: "体育", value: "体育" },
        { name: "惊悚", value: "惊悚" },
        { name: "video.art", value: "video.art" },
        { name: "战争", value: "战争" },
        { name: "西部", value: "西部" },
      ],
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
