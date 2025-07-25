import axios from "axios";
import Sizzle from "sizzle";
import {
  IFetchSocialSiteInformationConfig,
  IPtgenApiResponse,
  ISocialInformation,
  ISocialSitePageInformation,
  TSupportSocialSitePageParserMatches,
} from "../types";
import { uniq } from "es-toolkit";
import { parse as parseImdb } from "./imdb.ts";
import { commonParseFactory } from "../utils.ts";

const doubanUrlPattern = /^(?:https?:\/\/)?(?:movie\.|www\.)?douban\.com\/subject\/(\d+)\/?/;

export function build(id: string): string {
  return `https://movie.douban.com/subject/${id}/`;
}

export const parse = commonParseFactory([doubanUrlPattern]);

function pageParser$1(doc: Document): ISocialSitePageInformation {
  const chinese_title = (doc.querySelector("title")?.textContent ?? "").replace("(豆瓣)", "").trim();
  const foreign_title = (doc.querySelector('span[property="v:itemreviewed"]')?.textContent ?? "")
    .replace(chinese_title, "")
    .trim();
  const aka_anchor = Sizzle('#info span.pl:contains("又名")', doc);
  let aka_title: string[] = [];
  if (aka_anchor.length > 0) {
    aka_title = (aka_anchor[0].nextSibling?.nodeValue ?? "")
      .trim()
      .split(" / ")
      .sort((a, b) => a.localeCompare(b)); //首字(母)排序
  }

  // 尝试获取外部 ID
  const external_ids: Record<string, string> = {};

  // 获取 IMDb ID
  let imdb_id;

  const imdb_link_another = doc.querySelector('#info a[href*="imdb.com/title/tt"]');
  if (imdb_link_another) {
    imdb_id = parseImdb(imdb_link_another.getAttribute("href")!);
  } else {
    const raw_imdb_another = Sizzle('#info span.pl:contains("IMDb:")', doc);
    if (raw_imdb_another.length > 0) {
      const imdb_link = raw_imdb_another[0].nextSibling?.nodeValue?.trim();
      if (imdb_link) {
        imdb_id = parseImdb(imdb_link);
      }
    }
  }

  if (imdb_id) {
    external_ids.imdb = imdb_id;
  }

  return {
    site: "douban",
    id: parse(doc.URL),
    titles: uniq([chinese_title, foreign_title, ...aka_title]).filter(Boolean),
    external_ids,
  };
}

function pageParse$2Factory(urlPattern: string, rowSelector: string): TSupportSocialSitePageParserMatches[0] {
  return [
    urlPattern,
    (doc: Document) => {
      const retItems: ISocialSitePageInformation[] = [];
      const items = Sizzle(rowSelector, doc);
      for (const item of items) {
        const titleElement = item.querySelector("a[href*='/subject/']");
        if (titleElement) {
          const id = parse(titleElement?.getAttribute("href") ?? "");
          const title = (titleElement as HTMLAnchorElement)?.innerText?.trim() ?? "";
          const titles = title
            .replace(/(\([^)]*?)\/([^)]*\))/g, "$1---$2") // 防止 `哈利波特1：神秘的魔法石(港 / 台)`  被错误拆分
            .split("/")
            .map((x) => x.trim().replace(/---/g, "/"));

          retItems.push({ site: "douban", id, titles });
        }
      }
      return retItems;
    },
  ];
}

export const pageParserMatches: TSupportSocialSitePageParserMatches = [
  [doubanUrlPattern, pageParser$1],
  // TOP 250
  pageParse$2Factory("movie.douban.com/top250", "ol.grid_view > li"),
  // 排行榜
  pageParse$2Factory("movie.douban.com/chart", "div.indent table div.pl2"),
  // 选电影、选剧集
  [
    /movie\.douban\.com\/(explore|tv)/,
    (doc: Document) => {
      const retItems: ISocialSitePageInformation[] = [];

      const items = Sizzle("ul.subject-list-list > li", doc);
      for (const item of items) {
        const another = item.querySelector("a[href*='doubanapp/dispatch?uri=']");
        if (another) {
          const id = another.getAttribute("href")!.replace(/^.+\?uri=\/(movie|tv)\//, "");
          const title = item.querySelector("span.drc-subject-info-title-text")?.textContent?.trim() ?? "";

          retItems.push({ site: "douban", id, titles: [title] });
        }
      }

      return retItems;
    },
  ],
];

// 这里只列出了我们需要的部分
interface IDoubanPtGen extends IPtgenApiResponse {
  aka: string[];
  this_title: string[];
  chinese_title: string;
  foreign_title: string;
  poster: string;
  douban_votes: string;
  douban_rating_average: string | number;
}

export function transformPtGen(data: IDoubanPtGen): ISocialInformation {
  const uniqueTitles = new Set([
    data.chinese_title ?? "",
    data.foreign_title ?? "",
    ...(data.this_title ?? []),
    ...(data.aka ?? []),
  ]);
  const titles = Array.from(uniqueTitles).filter(Boolean);

  return {
    site: "douban",
    id: data.sid,
    title: titles.join(" / "),
    poster: data.poster ?? "",
    ratingScore: Number(data.douban_rating_average ?? 0),
    ratingCount: Number(data.douban_votes ?? 0),
    createAt: +Date.now(),
  };
}

export async function fetchInformation(
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
): Promise<ISocialInformation> {
  const realId = parse(String(id));
  const resDict = {
    site: "douban",
    id: realId,
    title: "",
    poster: "",
    ratingScore: 0,
    ratingCount: 0,
    createAt: 0,
  } as ISocialInformation;

  try {
    const { data } = await axios.get<Document>(build(realId), {
      responseType: "document",
      timeout: config.timeout ?? 10e3,
    });
    let ld_json = JSON.parse(
      (data.querySelector('head > script[type="application/ld+json"]')?.textContent ?? "{}").replace(
        /(\r\n|\n|\r|\t)/gm,
        "",
      ),
    );

    resDict.title = pageParser$1(data).titles.join(" / ");

    resDict.poster = (ld_json.image ?? "")
      .replace(/s(_ratio_poster|pic)/g, "l$1")
      .replace(/img\d(.doubanio.com)/g, "img1$1");

    resDict.ratingScore = ld_json?.aggregateRating?.ratingValue ?? 0;
    resDict.ratingCount = ld_json?.aggregateRating?.ratingCount ?? 0;
  } catch (error) {
    console.warn(error);
  } finally {
    resDict.createAt = +Date.now();
  }
  return resDict;
}
