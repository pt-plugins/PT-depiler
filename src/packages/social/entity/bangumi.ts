import axios from "axios";
import { uniq } from "es-toolkit";
import type { IFetchSocialSiteInformationConfig, IPtgenApiResponse, ISocialInformation } from "../types";

import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";
import { name as EXT_NAME, version as EXT_VERSION } from "~/../package.json";

setupReplaceUnsafeHeader(axios);

export function build(id: string): string {
  return `https://bgm.tv/subject/${id}`;
}

export function parse(query: string): string {
  const bgmUrlMatch = query.match(/^(?:https?:\/\/)?(?:bgm\.tv|bangumi\.tv|chii\.in)\/subject\/(\d+)\/?/);
  if (bgmUrlMatch) {
    return bgmUrlMatch[1] as string;
  }
  return query;
}

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
    createAt: data.update_at ? new Date(data.update_at).getTime() : +Date.now(),
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
  const realId = parse(id);
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
    "user-agent": `${EXT_NAME}/${EXT_VERSION}`,
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
    // pass
  } finally {
    resDict.createAt = +Date.now();
  }

  return resDict;
}
