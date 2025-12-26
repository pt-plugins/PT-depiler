import type { ISiteMetadata, ISearchInput, ITorrent, IUserInfo } from "../types.ts";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  parseValidTimeString,
  extractContent,
  buildCategoryOptionsFromList,
  buildCategoryOptionsFromDict,
} from "../utils.ts";
import urlJoin from "url-join";
import GazelleJSONAPI from "../schemas/GazelleJSONAPI.ts";
import { SchemaMetadata, jsonResponse, infoJsonResponse, userJsonResponse } from "../schemas/GazelleJSONAPI.ts";

interface groupResult {
  Artists: {
    id: number;
    name: string;
  }[];
  Year: string;
  Torrents?: Record<string, groupTorrent>;
}

interface groupTorrent {
  ID: string;
  GroupID: string;
  CategoryID: string;
  Language: string;
  Format: string;
  Encoding: string;
  Region: string;
  Remastered: string;
  RemasterYear: string;
  RemasterTitle: string;
  Scene: string;
  ReleaseTitle: string;
  GameDOXType: string;
  Size: string;
  Time: string;
  TorrentType: string;
  Miscellaneous: string;
  FreeTorrent: string;
  IsSnatched: boolean;
  Seeders: number;
  Leechers: number;
  Snatched: number;
}

interface torrentSearchResponse extends jsonResponse {
  response: Record<string, groupResult>;
}

interface ggnUserJsonResponse extends userJsonResponse {
  response: userJsonResponse["response"] & {
    stats: userJsonResponse["response"]["stats"] & {
      gold: number | null;
    };
    community: userJsonResponse["response"]["community"] & {
      hourlyGold: number | null;
      seedSize: number | null;
    };
    achievements: {
      totalPoints: number | null;
    };
  };
}

const categoryMap: Record<number, string> = {
  1: "Games",
  2: "Applications",
  3: "E-Books",
  4: "OST",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  version: 1,
  id: "gazellegames",
  name: "GazelleGames",
  aka: ["GGn"],
  description: "GazelleGames is a Private gaming tracker",
  tags: ["游戏"],
  timezoneOffset: "+0000",

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["uggcf://tnmryyrtnzrf.arg/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "appendQuote" },
    },
    {
      name: "评级",
      key: "rating",
      options: buildCategoryOptionsFromList(["3+", "7+", "12+", "16+", "18+", "N/A"]),
    },
    {
      name: "促销方案",
      key: "freetorrent",
      options: [
        { name: "Free", value: 1 },
        { name: "Neutral", value: 2 },
        { name: "Either", value: 3 },
        { name: "Normal", value: 4 },
      ],
    },
  ],

  search: {
    keywordPath: "params.searchstr",
    requestConfig: {
      url: "/api.php",
      params: {
        request: "search",
        search_type: "torrents",
        order_by: "time",
        order_way: "desc",
      },
    },
    advanceKeywordParams: {
      imdb: false,
    },
    requestConfigTransformer: ({ requestConfig }) => {
      if (requestConfig?.params.searchstr) {
        // remove . as not used in titles
        requestConfig.params.searchstr = requestConfig.params.searchstr.replace(/\./g, " ");
      }
      return requestConfig!;
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: { selector: "response.stats.gold" },
      bonusPerHour: { selector: "response.community.hourlyGold" },
      seedingSize: { selector: "response.community.seedSize" },
      // 并不是做种积分，只是用于表示升级所需积分
      seedingBonus: { selector: "response.achievements.totalPoints" },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Amateur",
    },
    {
      id: 2,
      name: "Gamer",
      seedingBonus: 600,
      privilege: "Can send invites",
    },
    {
      id: 3,
      name: "Pro Gamer",
      seedingBonus: 1200,
      privilege: "Access to the Pro Gamers forum and Invites forum; Immunity from inactivity pruning",
    },
    {
      id: 4,
      name: "Elite Gamer",
      seedingBonus: 2100,
      privilege: "Edit any torrent; Immunity from Hit 'n' Runs",
    },
    {
      id: 5,
      name: "Legendary Gamer",
      seedingBonus: 3000,
      privilege: "Access to the Legendary Gamer Invites forum",
    },
    {
      id: 6,
      name: "Master Gamer",
      seedingBonus: 4200,
    },
    {
      id: 7,
      name: "Gaming God",
      seedingBonus: 6000,
      privilege: "Can send unlimited Invites",
    },
  ],

  userInputSettingMeta: [
    {
      name: "token",
      label: "Token",
      hint: "请在用户设置中生成 API key，指定权限 User 和 Torrents",
      required: true,
    },
  ],
};

export default class GazelleGames extends GazelleJSONAPI {
  public override async request<T>(
    axiosConfig: AxiosRequestConfig,
    checkLogin: boolean = true,
  ): Promise<AxiosResponse<T>> {
    // 设置默认的 responseType，这样其他配置不需要显式声明
    axiosConfig.responseType = "json";

    // 在请求的 headers 中添加 存取令牌
    axiosConfig.headers = {
      ...(axiosConfig.headers ?? {}),
      "X-API-Key": this.userConfig.inputSetting!.token ?? "",
    };

    return super.request<T>(axiosConfig, checkLogin);
  }

  protected override async requestApi<T extends jsonResponse>(
    action: string,
    params: { [key: string]: any },
  ): Promise<AxiosResponse<T>> {
    return await this.request<T>({
      url: "/api.php",
      params: { request: action, ...params },
    });
  }

  protected override async requestApiInfo(): Promise<infoJsonResponse> {
    const { data: apiInfo } = await this.requestApi<infoJsonResponse>("quick_user", {});
    return apiInfo;
  }

  protected transformGroupTorrents(authkey: string, passkey: string, rows: groupResult[]): ITorrent[] {
    const results: ITorrent[] = [];
    for (const group of rows) {
      if (!group.Torrents) continue;
      for (const torrent of Object.values(group.Torrents)) {
        const tags: { name: string; color: string }[] = [];

        switch (torrent.FreeTorrent) {
          case "1": {
            tags.push({ name: "Free", color: "blue" });
            break;
          }
          case "2": {
            tags.push({ name: "Neutral", color: "cyan" });
            break;
          }
        }

        const torrentProps: string[] = [];
        const relYear =
          torrent.Miscellaneous === "GameDOX"
            ? ""
            : (torrent.RemasterYear !== "0" && torrent.RemasterYear) ||
              (group.Year !== "0" && group.Year) ||
              (torrent.Remastered === "1" && "Unknown Release(s)") ||
              "";

        const torEdition = torrent.Miscellaneous === "GameDOX" ? torrent.GameDOXType : torrent.RemasterTitle;

        [
          relYear,
          torEdition,
          torrent.Language,
          torrent.Region,
          torrent.Format,
          torrent.Encoding,
          torrent.Miscellaneous,
        ].forEach((prop) => {
          if (prop) torrentProps.push(prop);
        });

        if (parseInt(torrent.Scene)) {
          torrentProps.push("Scene");
        }

        // GGn 每一个平台对应一个 Artist，每一个种子一般只有一个平台
        const platform = group.Artists.length > 0 ? group.Artists[0].name : "";

        results.push({
          site: this.metadata.id, // 补全种子的 site 属性
          id: parseInt(torrent.ID),
          title: extractContent(torrent.ReleaseTitle),
          subTitle: torrentProps.join(" / "),
          seeders: torrent.Seeders,
          leechers: torrent.Leechers,
          completed: torrent.Snatched,
          category: platform ? platform : categoryMap[parseInt(torrent.CategoryID)],
          size: parseInt(torrent.Size),
          time: parseValidTimeString(torrent.Time) as number,
          url: urlJoin(this.url, `torrents.php?id=${torrent.GroupID}&torrentid=${torrent.ID}`),
          link: urlJoin(
            this.url,
            `torrents.php?action=download&id=${torrent.ID}&authkey=${authkey}&torrent_pass=${passkey}`,
          ),
          tags,
        });
      }
    }
    return results;
  }

  public override async transformSearchPage(
    doc: torrentSearchResponse,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    if (doc.status === "success") {
      const { authkey, passkey } = await this.getAuthKey();
      const rows = Object.values(doc.response);
      const torrents = this.transformGroupTorrents(authkey, passkey, rows);
      return torrents;
    }
    return [];
  }

  protected override async getUserExtendInfo(userId: number): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: apiUser } = await this.requestApi<ggnUserJsonResponse>("user", {
      id: userId,
    });

    return this.getFieldsData(apiUser, this.metadata.userInfo!.selectors!, [
      "joinTime",
      "seeding",
      "uploads",
      "invited",
      "bonus",
      "bonusPerHour",
      "seedingSize",
      "seedingBonus",
    ] as (keyof Partial<IUserInfo>)[]) as Partial<IUserInfo>;
  }
}
