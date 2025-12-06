import type { ITorrentTag } from "@ptd/site";

interface IPreDefinedTorrentTag extends ITorrentTag {
  aka?: Array<string | RegExp>;
}

/**
 * 由于部分站点可能有动态标签情况，此处预定义一些比较基础的标签重新映射名称和颜色，以避免相同性质标签过多重复
 * 如果 site.getSearchResult 返回 tag name 命中 name 或者 aka 中的字段（不区分大小写），会直接替换为对应的 name 和 color
 *
 * color 请从 https://vuetifyjs.com/en/styles/colors/#material-colors 页面查找
 */
export const preDefinedTorrentTagMap: IPreDefinedTorrentTag[] = [
  // 优惠类
  { name: "NL.", color: "deep-purple", aka: ["Neutral"] }, // 中性种子（0xUP & 0xDL）
  { name: "Freeload", color: "red", aka: [] }, // Freeload
  { name: "Free", color: "blue", aka: [] }, // 免费下载
  { name: "2xFree", color: "green", aka: [] }, // 免费下载 + 2x 上传
  { name: "2xUp", color: "lime", aka: [] }, // 2x 上传
  { name: "2x50%", color: "light-green", aka: [] }, // 2x 上传 + 50% 下载
  { name: "25%", color: "purple", aka: [] }, // 25% 下载
  { name: "30%", color: "indigo", aka: [] }, // 30% 下载
  { name: "35%", color: "indigo-darken-3", aka: [] }, // 35% 下载
  { name: "50%", color: "orange", aka: [] }, // 50% 下载
  { name: "70%", color: "blue-grey", aka: [] }, // 70% 下载
  { name: "75%", color: "lime-darken-3", aka: [] }, // 75% 下载

  // 站点属性类
  { name: "官方", color: "blue-darken-2", aka: ["官组", "官种"] },
  { name: "Hot", color: "yellow-lighten-1", aka: ["热门", "熱門"] },
  { name: "H&R", color: "red", aka: ["HnR"] }, // 需要 H&R
  { name: "Excl.", color: "deep-orange-darken-1", aka: ["独家", "限转", "禁转"] }, // 禁止转载
  { name: "VIP", color: "orange-darken-2", aka: [] }, // 仅 VIP 可下载

  // 种子属性类
  { name: "DIY", color: "brown", aka: ["自定义"] },

  { name: "中字", color: "pink-darken-1", aka: ["中文", "简体"] },
  { name: "繁体", color: "amber-darken-3", aka: ["繁中"] },
  { name: "国语", color: "cyan-darken-2", aka: ["国配", "普通话", "中配", /国语$/] },
  { name: "粤语", color: "teal-darken-1", aka: ["粤配"] },

  { name: "4K", color: "teal-darken-3", aka: ["4p", "2160p"] },
  { name: "1080p", color: "teal-darken-1", aka: [] },

  { name: "WEB-DL", color: "green-darken-2", aka: ["WEB DL", /WEB\.?DL/] },
  { name: "Blu-ray", color: "blue-darken-3", aka: ["蓝光", /Blu[-]?ray/] },

  { name: "H265", color: "indigo", aka: ["HEVC", "x265", /H\.?265/] },

  { name: "HDR", color: "purple", aka: ["HDR10", "HDR10+"] },
  { name: "HLG", color: "deep-purple", aka: ["Hybrid Log-Gamma", /混合对数伽玛/] },
  { name: "DoVi", color: "pink", aka: ["Dolby Vision", "DV", /杜比(视界)*/, /DOLBY\s?VISION/] },
] as const;

export type TPreDefinedTorrentTagName = (typeof preDefinedTorrentTagMap)[number]["name"];

export const preDefinedTorrentTagNameSet: Array<string> = preDefinedTorrentTagMap.map((item) => item.name);

// 构建一个中间态的转换 Map
export const normalizedTorrentTagMap: Array<{ from: RegExp; to: ITorrentTag }> = preDefinedTorrentTagMap.flatMap(
  (tagMap) => {
    const to = { name: tagMap.name, color: tagMap.color };
    const fromRaw = [tagMap.name, ...(tagMap.aka ?? [])];

    const retNormalized: Array<{ from: RegExp; to: ITorrentTag }> = [];

    // 将字符串类型的 from 转换为正则表达式
    retNormalized.push({
      from: new RegExp(fromRaw.filter((t) => typeof t === "string").join("|"), "i"),
      to,
    });

    // 将 正则表达式类型的 from 直接加入
    fromRaw
      .filter((t) => t instanceof RegExp)
      .forEach((regExp) => {
        retNormalized.push({ from: regExp as RegExp, to });
      });

    return retNormalized;
  },
);

export function sortTorrentTags(tags: ITorrentTag[]) {
  return tags.toSorted((a, b) => {
    const aIndex = preDefinedTorrentTagNameSet.findIndex((ntt) => ntt === a.name);
    const bIndex = preDefinedTorrentTagNameSet.findIndex((ntt) => ntt === b.name);
    return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
  });
}
