import Sizzle from "sizzle";
import type { AxiosResponse } from "axios";

import PrivateSite from "./AbstractPrivateSite";
import { parseSizeString, parseTimeWithZone, extractContent } from "../utils";
import {
  EResultParseStatus,
  type IUserInfo,
  type ITorrent,
  type ISiteMetadata,
  type ISearchInput,
  NeedLoginError,
} from "../types";

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/index.php#L16
 */
type apiType =
  | "upload_section"
  | "preview"
  | "torrent_info"
  | "stats"
  | "checkprivate"
  | "torrent"
  | "torrentgroup"
  | "torrentgroupalbumart"
  | "tcomments"
  | "user"
  | "forum"
  | "top10"
  | "browse"
  | "usersearch"
  | "requests"
  | "artist"
  | "inbox"
  | "subscriptions"
  | "index"
  | "bookmarks"
  | "announcements"
  | "notifications"
  | "request"
  | "loadavg"
  | "better"
  | "password_validate"
  | "similar_artists"
  | "userhistory"
  | "votefavorite"
  | "wiki"
  | "send_recommendation"
  | "get_friends"
  | "news_ajax"
  | "community_stats"
  | "user_recents"
  | "collage"
  | "raw_bbcode"
  | "get_user_notifications"
  | "clear_user_notification"
  | "pushbullet_devices";

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/classes/util.php#L167-L187
 */
export interface jsonResponse {
  status: "success" | "failure" | "error";
  response: any;
  error?: string;
}

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/info.php#L96-L115
 */
export interface infoJsonResponse extends jsonResponse {
  response: {
    username: string;
    id: number;
    authkey: string;
    passkey: string;
    notifications: {
      messages: number;
      notifications: number;
      newAnnouncement: boolean;
      newBlog: boolean;
      newSubscriptions: boolean;
    };
    userstats: {
      uploaded: number;
      downloaded: number;
      ratio: number;
      requiredratio: number;
      class: string;
    };
  };
}

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/browse.php
 */
export interface baseBrowseResult {
  groupId: number;
  groupName: string;
  tags: string[];
  groupTime: string;
}

export interface partTorrent {
  torrentId: number;
  fileCount: number;
  size: number;
  snatches: number;
  seeders: number;
  leechers: number;
  isFreeleech: boolean;
  isNeutralLeech: boolean;
  isPersonalFreeleech: boolean;
  canUseToken: boolean;
  hasSnatched: boolean;
}

export interface groupTorrent extends partTorrent {
  editionId: number;
  artists: { id: number; name: string; aliasid: number }[];
  remastered: boolean;
  remasterYear: number;
  remasterCatalogueNumber: string;
  remasterTitle: string;
  media: string;
  encoding: string;
  format: string;
  hasLog: boolean;
  logScore: number;
  hasCue: boolean;
  scene: boolean;
  vanityHouse: boolean;
  time: string;
}

export interface groupBrowseResult extends baseBrowseResult {
  artist: string;
  cover: string;
  bookmarked: boolean;
  vanityHouse: boolean;
  groupYear: number;
  releaseType: string | null;
  maxSize: number;
  totalSnatched: number;
  totalSeeders: number;
  totalLeechers: number;
  torrents: groupTorrent[];
}

export interface torrentBrowseResult extends baseBrowseResult, partTorrent {
  category: string;
}

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/browse.php
 */
export interface browseJsonResponse extends jsonResponse {
  response: {
    currentPage: number;
    pages: number;
    results: (groupBrowseResult | torrentBrowseResult)[];
  };
}

export interface userJsonResponse extends jsonResponse {
  response: {
    username: string;
    avatar: string;
    isFriend: boolean;
    profileText: string;
    stats: {
      joinedDate: string;
      lastAccess: string;
      uploaded: number;
      downloaded: number;
      ratio: string;
      requiredRatio: number;
      bonusPoints: number | null;
      bonusPointsPerHour: number | null;
      bonusSeedingPointsPerHour: number | null;
      seedingSize: number | null;
    };
    ranks: {
      uploaded: number;
      downloaded: number;
      uploads: number;
      requests: number;
      bounty: number;
      posts: number;
      artists: number;
      overall: number;
    };
    personal: {
      class: string;
      paranoia: number;
      paranoiaText: "Off" | "Very Low" | "Low" | "High" | "Very high";
      donor: boolean;
      warned: boolean;
      enabled: boolean;
      passkey: string;
    };
    community: {
      posts: number;
      torrentComments: number | null;
      artistComments: number | null;
      collageComments: number | null;
      requestComments: number | null;
      collagesStarted: number | null;
      collagesContrib: number | null;
      requestsFilled: number | null;
      bountyEarned: number | null;
      requestsVoted: number | null;
      bountySpent: number | null;
      perfectFlacs: number | null;
      uploaded: number | null;
      groups: number | null;
      seeding: number | null;
      leeching: number | null;
      snatched: number | null;
      invited: number | null;
      artistsAdded: number | null;
    };
  };
}

export const SchemaMetadata: Partial<ISiteMetadata> = {
  version: 0,
  search: {
    keywordPath: "params.searchstr",
    requestConfig: {
      url: "/ajax.php",
      responseType: "json",
      params: {
        action: "browse",
      },
    },
  },
  userInfo: {
    selectors: {
      // "/ajax.php?action=index"
      id: {
        selector: ["response.id"],
      },
      name: {
        selector: ["response.username"],
      },
      messageCount: {
        selector: ["response.notifications.messages"],
      },
      uploaded: {
        selector: ["response.userstats.uploaded"],
      },
      downloaded: {
        selector: ["response.userstats.downloaded"],
      },
      ratio: {
        selector: ["response.userstats.ratio"],
      },
      levelName: {
        selector: ["response.userstats.class"],
      },
      bonus: {
        selector: ["response.userstats.bonusPoints"],
      },
      bonusPerHour: {
        selector: ["response.userstats.bonusPointsPerHour", "response.userstats.seedingBonusPointsPerHour"],
      },
      seedingSize: {
        selector: ["response.userstats.seedingSize"], // GazellePW
      },
      joinTime: {
        selector: ["response.stats.joinedDate"],
        filters: [{ name: "parseTime" }],
      },

      // "/ajax.php?action=user&id=$user.id$"
      seeding: {
        selector: ["response.community.seeding"],
      },
      uploads: {
        selector: ["response.community.uploaded"],
      },
      perfectFlacs: {
        selector: ["response.community.perfectFlacs"],
      },
      groups: {
        selector: ["response.community.groups"],
      },
      invited: {
        selector: ["response.community.invited"],
      },
      lastAccessAt: {
        selector: ["response.stats.lastAccess"],
        filters: [{ name: "parseTime" }],
      },
    },
  },
};

export default class GazelleJSONAPI extends PrivateSite {
  private _authKey?: { authkey: string; passkey: string };

  protected async requestApi<T extends jsonResponse>(
    action: apiType,
    params: { [key: string]: any },
  ): Promise<AxiosResponse<T>> {
    return await this.request<T>({
      url: "/ajax.php",
      params: { action, ...params },
    });
  }

  protected async requestApiInfo(): Promise<infoJsonResponse> {
    const { data: apiInfo } = await this.requestApi<infoJsonResponse>("index", {});
    return apiInfo;
  }

  protected async getAuthKey(): Promise<{ authkey: string; passkey: string }> {
    if (!this._authKey) {
      const apiInfo = await this.requestApiInfo();
      this._authKey = {
        authkey: apiInfo.response.authkey,
        passkey: apiInfo.response.passkey,
      };
    }
    return this._authKey;
  }

  protected async transformUnGroupTorrent(group: torrentBrowseResult): Promise<ITorrent> {
    const { authkey, passkey } = await this.getAuthKey();

    const tags: { name: string; color: string }[] = [];
    if (group.isFreeleech || group.isPersonalFreeleech) {
      tags.push({ name: "Free", color: "blue" });
    }
    if (group.isNeutralLeech) {
      tags.push({ name: "Neutral", color: "cyan" });
    }

    return {
      site: this.metadata.id, // 补全种子的 site 属性
      id: group.torrentId,
      title: extractContent(group.groupName),
      subTitle: group.tags.join(", "),
      url: `${this.url}torrents.php?id=${group.groupId}&torrentid=${group.torrentId}`,
      link: `${this.url}torrents.php?action=download&id=${group.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(group.groupTime, this.metadata.timezoneOffset),
      size: group.size,
      author: "",
      seeders: group.seeders,
      leechers: group.leechers,
      completed: group.snatches,
      tags,
      category: group.category,
    } as ITorrent;
  }

  protected async transformGroupTorrent(group: groupBrowseResult, torrent: groupTorrent): Promise<ITorrent> {
    const { authkey, passkey } = await this.getAuthKey();

    const tags: { name: string; color: string }[] = [];
    if (torrent.isFreeleech || torrent.isPersonalFreeleech) {
      tags.push({ name: "Free", color: "blue" });
    }
    if (torrent.isNeutralLeech) {
      tags.push({ name: "Neutral", color: "cyan" });
    }

    return {
      site: this.metadata.id, // 补全种子的 site 属性
      id: torrent.torrentId,
      title: `${group.artist} - ${extractContent(group.groupName)} [${group.groupYear}] [${group.releaseType}]`,
      subTitle:
        `${torrent.format} / ${torrent.encoding} / ${torrent.media}` +
        (torrent.hasLog ? ` / Log(${torrent.logScore})` : "") +
        (torrent.hasCue ? " / Cue" : "") +
        (torrent.remastered ? ` / ${torrent.remasterYear}` : "") +
        (torrent.remasterTitle ? ` / ${extractContent(torrent.remasterTitle)}` : "") +
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
    } as ITorrent;
  }

  public override async transformSearchPage(
    doc: browseJsonResponse | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const torrents: ITorrent[] = [];

    if (doc.status === "success") {
      const rows = doc.response.results;
      for (const group of rows) {
        if ("torrents" in group) {
          // is groupBrowseResult
          for (const rawTorrent of group.torrents) {
            const torrent: ITorrent = await this.transformGroupTorrent(group, rawTorrent);
            torrents.push(torrent);
          }
        } else {
          const torrent: ITorrent = await this.transformUnGroupTorrent(group);
          torrents.push(torrent);
        }
      }
    }

    return torrents;
  }

  public override async getUserInfoResult(lastUserInfo: Partial<IUserInfo> = {}): Promise<IUserInfo> {
    let flushUserInfo: IUserInfo = {
      status: EResultParseStatus.unknownError,
      updateAt: +new Date(),
      site: this.metadata.id,
    };

    if (!this.allowQueryUserInfo) {
      flushUserInfo.status = EResultParseStatus.passParse;
      return flushUserInfo;
    }

    try {
      flushUserInfo = { ...flushUserInfo, ...(await this.getUserBaseInfo()) };
      if (flushUserInfo.id) {
        flushUserInfo = {
          ...flushUserInfo,
          ...(await this.getUserExtendInfo(flushUserInfo.id as number)),
        };

        if (!flushUserInfo.seedingSize) {
          flushUserInfo = {
            ...flushUserInfo,
            ...(await this.getSeedingSize(flushUserInfo.id as number)),
          };
        }

        // 清理数据
        flushUserInfo = this.cleanupUserInfo(flushUserInfo);
      }

      if (this.metadata.levelRequirements && flushUserInfo.levelName && typeof flushUserInfo.levelId === "undefined") {
        flushUserInfo.levelId = this.guessUserLevelId(flushUserInfo as IUserInfo);
      }

      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      flushUserInfo.status = EResultParseStatus.parseError;

      if (error instanceof NeedLoginError) {
        flushUserInfo.status = EResultParseStatus.needLogin;
      }
    }

    return flushUserInfo;
  }

  protected async getUserBaseInfo(): Promise<Partial<IUserInfo>> {
    const apiInfo = await this.requestApiInfo();

    return this.getFieldsData(apiInfo, this.metadata.userInfo!.selectors!, [
      "id",
      "name",
      "messageCount",
      "uploaded",
      "downloaded",
      "ratio",
      "levelName",
      "bonus",
      "bonusPerHour",
      "seedingSize",
    ] as (keyof IUserInfo)[]) as Partial<IUserInfo>;
  }

  protected async getUserExtendInfo(userId: number): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: apiUser } = await this.requestApi<userJsonResponse>("user", {
      id: userId,
    });

    return this.getFieldsData(apiUser, this.metadata.userInfo!.selectors!, [
      "joinTime",
      "seeding",
      "uploads",
      "perfectFlacs",
      "groups",
      "invited",
      "lastAccessAt",
    ] as (keyof Partial<IUserInfo>)[]) as Partial<IUserInfo>;
  }

  protected cleanupUserInfo(flushUserInfo: IUserInfo): IUserInfo {
    if (!flushUserInfo.bonus) {
      flushUserInfo.bonus = "N/A";
    }
    if (!flushUserInfo.bonusPerHour) {
      flushUserInfo.bonusPerHour = "N/A";
    }
    if (!flushUserInfo.perfectFlacs) {
      delete flushUserInfo["perfectFlacs"];
    }

    return flushUserInfo;
  }

  protected async getSeedingSize(userId?: number): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const userSeedingTorrent: Partial<IUserInfo> = { seedingSize: 0 };

    const { data: seedPage } = await this.request<Document>({
      url: "/torrents.php",
      params: { type: "seeding", userid: userId },
      responseType: "document",
    });
    const rows = Sizzle("tr.torrent_row > td.nobr", seedPage);
    rows.forEach((element) => {
      userSeedingTorrent.seedingSize! += parseSizeString((element as HTMLElement).innerText.trim());
    });

    return userSeedingTorrent;
  }
}
