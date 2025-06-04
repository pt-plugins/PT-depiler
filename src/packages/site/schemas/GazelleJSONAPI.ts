import Sizzle from "sizzle";
import type { AxiosResponse } from "axios";

import PrivateSite from "./AbstractPrivateSite";
import { parseSizeString, parseTimeWithZone } from "../utils";
import { EResultParseStatus, type IUserInfo, type ITorrent, type ISiteMetadata, type ISearchInput } from "../types";

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

      // "/ajax.php?action=user&id=$user.id$"
      joinTime: {
        selector: ["response.stats.joinedDate"],
        filters: [{ name: "parseTime" }],
      },
      seeding: {
        selector: ["response.community.seeding"],
      },

      // "/torrents.php?type=seeding&userid=$user.id$"
      bonus: {
        text: "N/A",
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

    return {
      site: this.metadata.id, // 补全种子的 site 属性
      id: group.torrentId,
      title: group.groupName,
      url: `/torrents.php?id=${group.groupId}&torrentid=${group.torrentId}`,
      link: `/torrents.php?action=download&id=${group.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(group.groupTime, this.metadata.timezoneOffset),
      size: group.size,
      author: "",
      seeders: group.seeders,
      leechers: group.leechers,
      completed: group.snatches,
      comments: 0,
      tags: group.tags.map((tag) => ({ name: tag })),
      category: group.category,
    } as ITorrent;
  }

  protected async transformGroupTorrent(group: groupBrowseResult, torrent: groupTorrent): Promise<ITorrent> {
    const { authkey, passkey } = await this.getAuthKey();
    return {
      site: this.metadata.id, // 补全种子的 site 属性
      id: torrent.torrentId,
      title: `${group.artist} - ${group.groupName} [${group.groupYear}] [${group.releaseType}]`,
      subTitle:
        `${torrent.format} / ${torrent.encoding} / ${torrent.media}` +
        (torrent.hasLog ? ` / Log(${torrent.logScore})` : "") +
        (torrent.hasCue ? " / Cue" : "") +
        (torrent.remastered ? ` / ${torrent.remasterYear}` : "") +
        (torrent.remasterTitle ? ` / ${torrent.remasterTitle}` : "") +
        (torrent.scene ? " / Scene" : "") +
        (torrent.isFreeleech || torrent.isNeutralLeech || torrent.isPersonalFreeleech ? " / Freeleech" : ""),
      url: `/torrents.php?id=${group.groupId}&torrentid=${torrent.torrentId}`,
      link: `/torrents.php?action=download&id=${torrent.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(torrent.time, this.metadata.timezoneOffset),
      size: torrent.size,
      author: "",
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      completed: torrent.snatches,
      category: group.releaseType || "",
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
          ...(await this.getUserSeedingTorrents(flushUserInfo.id as number)),
        };
      }
      flushUserInfo.status = EResultParseStatus.success;
    } catch (error) {
      flushUserInfo.status = EResultParseStatus.parseError;
    }

    return flushUserInfo;
  }

  protected async getUserBaseInfo(): Promise<Partial<IUserInfo>> {
    const apiInfo = await this.requestApiInfo();

    return this.getFieldsData(
      apiInfo,
      ["id", "name", "messageCount", "uploaded", "downloaded", "ratio", "levelName"] as (keyof IUserInfo)[],
      this.metadata.userInfo!.selectors!,
    ) as Partial<IUserInfo>;
  }

  protected async getUserExtendInfo(userId: number): Promise<Partial<IUserInfo>> {
    const { data: apiUser } = await this.requestApi<userJsonResponse>("user", {
      id: userId,
    });

    return this.getFieldsData(
      apiUser,
      ["joinTime", "seeding"] as (keyof Partial<IUserInfo>)[],
      this.metadata.userInfo!.selectors!,
    ) as Partial<IUserInfo>;
  }

  protected async getUserSeedingTorrents(userId?: number): Promise<Partial<IUserInfo>> {
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

    if (this.metadata.userInfo?.selectors?.bonus) {
      userSeedingTorrent.bonus = this.getFieldData(seedPage, this.metadata.userInfo.selectors.bonus);
    }

    return userSeedingTorrent;
  }
}
