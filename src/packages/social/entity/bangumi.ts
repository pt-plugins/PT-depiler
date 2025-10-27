import axios from "axios";
import { uniq } from "es-toolkit";

import { commonParseFactory } from "../utils";
import {
  IFetchSocialSiteInformationConfig,
  IPtgenApiResponse,
  ISocialInformation,
  ISocialSitePageInformation,
  TSupportSocialSitePageParserMatches,
} from "../types";

import { REPO_URL } from "~/helper.ts";
import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";
import { name as EXT_NAME, version as EXT_VERSION } from "~/../package.json";

setupReplaceUnsafeHeader(axios);

const bgmUrlPattern = /^(?:https?:\/\/)?(?:bgm\.tv|bangumi\.tv|chii\.in)\/subject\/(\d+)\/?/;

export function build(id: string): string {
  return `https://bgm.tv/subject/${id}`;
}

export const parse = commonParseFactory([bgmUrlPattern]);

export const pageParserMatches: TSupportSocialSitePageParserMatches = [
  [
    bgmUrlPattern,
    (doc: Document) => {
      const titles = [] as string[];

      const mainTitle = doc.querySelector('h1.nameSingle a[property="v:itemreviewed"]');
      if (mainTitle) {
        titles.push(mainTitle.textContent?.trim() ?? "");
      }
      const infoBoxs = doc.querySelectorAll("#infobox li:has(> span.tip)");
      infoBoxs.forEach((item) => {
        const text = item.textContent?.trim() ?? "";
        if (text.match(/^(?:别名|中文名|英文名|原名|其他译名):/)) {
          const title = text.replace(/^(?:别名|中文名|英文名|原名|其他译名):/, "").trim();
          if (title) {
            titles.push(title);
          }
        }
      });

      return {
        site: "bangumi",
        id: parse(doc.URL),
        titles,
      } as ISocialSitePageInformation;
    },
  ],
  [
    /^(?:https?:\/\/)?(?:bgm\.tv|bangumi\.tv|chii\.in)\/anime\/(browser|list\/.+?\/(wish|collect|do|on_hold|dropped)|tag\/)/,
    (doc: Document): ISocialSitePageInformation[] => {
      const parseShortUrl = commonParseFactory([/\/subject\/(\d+)\/?/]);

      const retItems: ISocialSitePageInformation[] = [];
      const items = doc.querySelectorAll("ul#browserItemList > li.item");
      for (const item of items) {
        const another = item.querySelector("h3 > a[href*='/subject/']");
        if (another) {
          const id = parseShortUrl(another.getAttribute("href")!);
          const titles = [another.textContent?.trim() ?? ""];

          const aka_anchor = item.querySelector("small.grey");
          if (aka_anchor) {
            titles.push(aka_anchor.textContent?.trim() ?? "");
          }

          retItems.push({
            site: "bangumi",
            id,
            titles,
          } as ISocialSitePageInformation);
        }
      }

      return retItems;
    },
  ],
];

interface IBangumiPtGen extends IPtgenApiResponse {
  cover: string;
  name: string;
  name_cn: string;
  rating: { score: number; total: number };
}

export function transformPtGen(data: IBangumiPtGen): ISocialInformation {
  return {
    site: "bangumi",
    id: String(data.sid),
    title: [data.name_cn ?? "", data.name ?? ""].filter(Boolean).join(" / "),
    poster: data.cover ?? "",
    ratingScore: data?.rating?.score ?? 0,
    ratingCount: data?.rating?.total ?? 0,
    createAt: +Date.now(),
  };
}

/** 完整定义见 https://github.com/bangumi/api/blob/d04e007e0bcc9e7695b6d0de34f9ff9ada7ff806/open-api/v0.yaml#L3539-L3685
 *  此处仅列出了我们需要的部分
 */
interface IBangumiApiResp {
  id: number;
  name: string;
  name_cn: string;
  images: Record<"small" | "grid" | "large" | "medium" | "common", string>;
  infobox: Array<{ key: string; value: string | Array<{ v: string }> }>;
  ranking: {
    rank: number;
    total: number;
    count: Record<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10", number>;
    score: number;
  };
}

// 解析页面获取信息
export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  const realId = parse(String(id));
  const resDict = {
    site: "bangumi",
    id: realId,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;

  const bangumiApiReqHeader: Record<string, any> = {
    // refs: https://github.com/bangumi/api/blob/master/docs-raw/user%20agent.md
    "user-agent": `${EXT_NAME}/${EXT_VERSION} (${REPO_URL})`,
  };

  // Bangumi 默认不需要 apikey，但是如果设置了 apikey，则使用 apikey 进行请求
  if (config?.socialSite?.bangumi?.apikey) {
    bangumiApiReqHeader.Authorization = `Bearer ${config.socialSite.bangumi.apikey}`;
  }

  try {
    const { data } = await axios.get<IBangumiApiResp>(`https://api.bgm.tv/v0/subjects/${realId}`, {
      timeout: config.timeout ?? 10e3,
      responseType: "json",
      headers: bangumiApiReqHeader,
    });

    const titles = [data.name_cn ?? "", data.name ?? ""];
    // 处理 infobox 中的别名
    const aka = data.infobox
      .filter((item) => item.key === "别名")
      .flatMap((item) => {
        if (typeof item.value === "string") {
          return [item.value];
        } else if (Array.isArray(item.value)) {
          return item.value.map((v) => v.v);
        }
        return [];
      });

    resDict.title = uniq([...titles, ...aka])
      .filter(Boolean)
      .join(" / ");

    resDict.poster = data.images?.large ?? data.images?.common ?? data.images?.medium ?? "";
    resDict.ratingScore = data.ranking?.score ?? 0;
    resDict.ratingCount = data.ranking?.total ?? 0;
  } catch (error) {
    console.warn(error);
  } finally {
    resDict.createAt = +Date.now();
  }

  return resDict;
}
