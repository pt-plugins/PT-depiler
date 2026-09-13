/**
 * IYUU 站名 ↔ 本地站点 id 映射表（实测对账，2026-09-13）
 * @see docs/iyuu-integration-plan.md §5
 */
import type { TSiteID } from "@ptd/site";

/**
 * 命名差异站：IYUU 站名 → 本地 definitions basename（20 项，本地文件已核验存在）
 */
export const IYUU_SITE_NAME_DIFFS: Record<string, TSiteID> = {
  "m-team": "mteam", // api.m-team.cc 馒头
  torrentccf: "tccf", // et8.org 他吹吹风
  ttg: "totheglory", // totheglory.im 听听歌
  ssd: "springsunday", // springsunday.net 春天
  upxin: "hdupt", // pt.upxin.net（HDU）
  oshen: "oshenpt", // oshen.win 奥申
  byr: "byrbt", // byr.pt 北邮人
  pt: "sjtu", // pt.sjtu.edu.cn 葡萄
  pt0ffcc: "freefarm", // pt.0ff.cc 自由农场
  shadowflow: "starspace", // star-space.net 影
  qingwapt: "qingwa", // qingwapt.com 青蛙
  hdkyl: "hdkylin", // hdkyl.in 麒麟
  gtkpw: "ptgtk", // pt.gtk.pw GTK
  ptlover: "afun", // ptlover.cc AFun
  bilibili: "railgunpt", // bilibili.download
  gamegamept: "ggpt", // gamegamept.com GGPT
  myptcc: "mypt", // cc.mypt.cc 我的PT(CC)
  duckboobee: "march", // duckboobee.org March
  eastgame: "tlfbits", // pt.eastgame.org 吐鲁番
  cangbaoge: "cbg", // cangbao.ge 藏宝阁
};

/**
 * 同名站：IYUU 站名 == 本地 definitions basename（84 项，实测对账一致）
 */
export const IYUU_SAME_NAME_SITES: readonly TSiteID[] = [
  "keepfrds",
  "pthome",
  "hdsky",
  "tjupt",
  "pter",
  "hdhome",
  "btschool",
  "ourbits",
  "nanyangpt",
  "hdcity",
  "nicept",
  "52pt",
  "soulvoice",
  "chdbits",
  "ptsbao",
  "hdarea",
  "hdtime",
  "1ptba",
  "hd4fans",
  "opencd",
  "joyhd",
  "dmhy",
  "discfan",
  "dicmusic",
  "skyeysnow",
  "hdroute",
  "haidan",
  "hdfans",
  "dragonhd",
  "hitpt",
  "greatposterwall",
  "hdpost",
  "hudbt",
  "audiences",
  "piggo",
  "wintersakura",
  "hhanclub",
  "hdvideo",
  "ptchina",
  "zhuque",
  "zmpt",
  "rousi",
  "monikadesign",
  "cyanbug",
  "ubits",
  "pandapt",
  "carpt",
  "agsvpt",
  "ptvicomo",
  "xingtan",
  "ilolicon",
  "okpt",
  "crabpt",
  "hddolby",
  "kamept",
  "ptcafe",
  "yemapt",
  "ptlgs",
  "lemonhd",
  "raingfh",
  "njtupt",
  "ptzone",
  "hdclone",
  "kufei",
  "xingyunge",
  "cspt",
  "tmpt",
  "htpt",
  "sewerpt",
  "longpt",
  "hdbao",
  "13city",
  "luckpt",
  "ptskit",
  "playletpt",
  "novahd",
  "lajidui",
  "hxpt",
  "dubhe",
  "tangpt",
  "muxuege",
  "zrpt",
  "siqi",
  "baozi",
];

/**
 * IYUU 站名 → 本地站点 id 全量映射（104 = 84 同名 + 20 差异）
 * 覆盖 IYUU 全部已适配站点；未收录的站名自然返回 undefined（走模板兜底或提示）。
 */
export const IYUU_SITE_TO_LOCAL: Readonly<Record<string, TSiteID>> = Object.freeze({
  ...IYUU_SITE_NAME_DIFFS,
  ...Object.fromEntries(IYUU_SAME_NAME_SITES.map((id) => [id, id])),
} as Record<string, TSiteID>);

/** 由 IYUU 站名解析本地站点 id；未收录时返回 undefined */
export function iyuuSiteToLocal(siteName: string): TSiteID | undefined {
  return IYUU_SITE_TO_LOCAL[siteName];
}
