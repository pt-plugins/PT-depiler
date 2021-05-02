import PrivateSite from '@/background/sites/schema/AbstractPrivateSite'
import { SiteConfig, Torrent, UserInfo } from '@/shared/interfaces/sites'
import { AxiosResponse } from 'axios'
import { parseSizeString, parseTimeWithZone } from '@/shared/utils/filter'
import dayjs from '@/shared/utils/dayjs'
import Sizzle from 'sizzle'

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/index.php#L16
 */
type apiType =
  'upload_section'
  | 'preview'
  | 'torrent_info'
  | 'stats'
  | 'checkprivate'
  | 'torrent'
  | 'torrentgroup'
  | 'torrentgroupalbumart'
  | 'tcomments'
  | 'user'
  | 'forum'
  | 'top10'
  | 'browse'
  | 'usersearch'
  | 'requests'
  | 'artist'
  | 'inbox'
  | 'subscriptions'
  | 'index'
  | 'bookmarks'
  | 'announcements'
  | 'notifications'
  | 'request'
  | 'loadavg'
  | 'better'
  | 'password_validate'
  | 'similar_artists'
  | 'userhistory'
  | 'votefavorite'
  | 'wiki'
  | 'send_recommendation'
  | 'get_friends'
  | 'news_ajax'
  | 'community_stats'
  | 'user_recents'
  | 'collage'
  | 'raw_bbcode'
  | 'get_user_notifications'
  | 'clear_user_notification'
  | 'pushbullet_devices'

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/classes/util.php#L167-L187
 */
export interface jsonResponse {
  status: 'success' | 'failure' | 'error'
  response: any,
  error?: string
}

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/info.php#L96-L115
 */
export interface infoJsonResponse extends jsonResponse {
  response: {
    username: string,
    id: number,
    authkey: string,
    passkey: string,
    notifications: {
      messages: number,
      notifications: number,
      newAnnouncement: boolean,
      newBlog: boolean,
      newSubscriptions: boolean
    },
    userstats: {
      uploaded: number,
      downloaded: number,
      ratio: number,
      requiredratio: number,
      class: string
    }
  }
}

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/browse.php
 */
export interface baseBrowseResult {
  groupId: number,
  groupName: string,
  tags: string[],
  groupTime: string,
}

export interface partTorrent {
  torrentId: number,
  fileCount: number,
  size: number,
  snatches: number,
  seeders: number,
  leechers: number,
  isFreeleech: boolean,
  isNeutralLeech: boolean,
  isPersonalFreeleech: boolean,
  canUseToken: boolean,
  hasSnatched: boolean,
}

export interface groupTorrent extends partTorrent {
  editionId: number,
  artists: { id: number, name: string, aliasid: number }[],
  remastered: boolean,
  remasterYear: number,
  remasterCatalogueNumber: string,
  remasterTitle: string,
  media: string,
  encoding: string,
  format: string,
  hasLog: boolean,
  logScore: number,
  hasCue: boolean,
  scene: boolean,
  vanityHouse: boolean,
  time: string
}

export interface groupBrowseResult extends baseBrowseResult {
  artist: string,
  cover: string,
  bookmarked: boolean,
  vanityHouse: boolean,
  groupYear: number,
  releaseType: string | null,
  maxSize: number,
  totalSnatched: number,
  totalSeeders: number,
  totalLeechers: number,
  torrents: groupTorrent[]
}

export interface torrentBrowseResult extends baseBrowseResult, partTorrent {
  category: string,
}

/**
 * @refs: https://github.com/WhatCD/Gazelle/blob/63b337026d49b5cf63ce4be20fdabdc880112fa3/sections/ajax/browse.php
 */
export interface browseJsonResponse extends jsonResponse {
  response: {
    currentPage: number,
    pages: number,
    results: (groupBrowseResult | torrentBrowseResult)[]
  }
}

export interface userJsonResponse extends jsonResponse {
  response: {
    username: string,
    avatar: string,
    isFriend: boolean,
    profileText: string,
    stats: {
      joinedDate: string,
      lastAccess: string,
      uploaded: number,
      downloaded: number,
      ratio: string,
      requiredRatio: number
    },
    ranks: {
      uploaded: number,
      downloaded: number,
      uploads: number,
      requests: number,
      bounty: number,
      posts: number,
      artists: number,
      overall: number
    },
    personal: {
      class: string,
      paranoia: number,
      paranoiaText: 'Off' | 'Very Low' | 'Low' | 'High' | 'Very high',
      donor: boolean,
      warned: boolean,
      enabled: boolean,
      passkey: string
    },
    community: {
      posts: number,
      torrentComments : number | null,
      artistComments : number | null,
      collageComments : number | null,
      requestComments : number | null,
      collagesStarted : number | null,
      collagesContrib : number | null,
      requestsFilled : number | null,
      bountyEarned : number | null,
      requestsVoted : number | null,
      bountySpent : number | null,
      perfectFlacs : number | null,
      uploaded : number | null,
      groups : number | null,
      seeding : number | null,
      leeching : number | null,
      snatched : number | null,
      invited : number | null,
      artistsAdded : number | null,
    }
  }
}

export default class GazelleJSONAPI extends PrivateSite {
  protected readonly initConfig: Partial<SiteConfig> = {
    search: {
      keywordsParam: 'searchstr',
      requestConfig: {
        url: '/ajax.php',
        responseType: 'json',
        params: {
          action: 'browse'
        }
      }
    },
    selector: {
      userInfo: {
        // "/ajax.php?action=index"
        id: {
          selector: ['response.id']
        },
        name: {
          selector: ['response.username']
        },
        messageCount: {
          selector: ['response.notifications.messages']
        },
        uploaded: {
          selector: ['response.userstats.uploaded']
        },
        downloaded: {
          selector: ['response.userstats.downloaded']
        },
        ratio: {
          selector: ['response.userstats.ratio']
        },
        levelName: {
          selector: ['response.userstats.class']
        },

        // "/ajax.php?action=user&id=$user.id$"
        joinTime: {
          selector: ['response.stats.joinedDate'],
          filters: [
            (query: string) => dayjs(query).isValid() ? dayjs(query).valueOf() : query
          ]
        },
        seeding: {
          selector: ['response.community.seeding']
        },

        // "/torrents.php?type=seeding&userid=$user.id$"
        bonus: {
          text: 'N/A'
        }
      }
    }
  }

  private _authKey?: {authkey: string, passkey: string }

  protected async requestApi <T extends jsonResponse> (action: apiType, params: {[key: string]: any}): Promise<AxiosResponse<T>> {
    return await this.request<T>({ url: '/ajax.php', params: { action, ...params }, requestName: `/ajax.php?action=${action}` })
  }

  protected async requestApiInfo (): Promise<infoJsonResponse> {
    const { data: apiInfo } = await this.requestApi<infoJsonResponse>('index', {})
    return apiInfo
  }

  protected async getAuthKey (): Promise<{ authkey: string, passkey: string }> {
    if (!this._authKey) {
      const apiInfo = await this.requestApiInfo()
      this._authKey = { authkey: apiInfo.response.authkey, passkey: apiInfo.response.passkey }
    }
    return this._authKey
  }

  protected async transformUnGroupTorrent (group: torrentBrowseResult): Promise<Torrent> {
    const { authkey, passkey } = await this.getAuthKey()

    return {
      id: group.torrentId,
      title: group.groupName,
      url: `/torrents.php?id=${group.groupId}&torrentid=${group.torrentId}`,
      link: `/torrents.php?action=download&id=${group.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(group.groupTime, this.config.timezoneOffset),
      size: group.size,
      author: '',
      seeders: group.seeders,
      leechers: group.leechers,
      completed: group.snatches,
      comments: 0,
      tags: group.tags.map(tag => { return { name: tag } }),
      category: group.category
    } as Torrent
  }

  protected async transformGroupTorrent (group: groupBrowseResult, torrent:groupTorrent): Promise<Torrent> {
    const { authkey, passkey } = await this.getAuthKey()
    return {
      id: torrent.torrentId,
      title: `${group.artist} - ${group.groupName} [${group.groupYear}] [${group.releaseType}]`,
      subTitle: `${torrent.format} / ${torrent.encoding} / ${torrent.media}` +
        (torrent.hasLog ? ` / Log(${torrent.logScore})` : '') +
        (torrent.hasCue ? ' / Cue' : '') +
        (torrent.remastered ? ` / ${torrent.remasterYear}` : '') +
        (torrent.scene ? ' / Scene' : '') +
        (torrent.isFreeleech || torrent.isNeutralLeech || torrent.isPersonalFreeleech ? ' / Freeleech' : ''),
      url: `/torrents.php?id=${group.groupId}&torrentid=${torrent.torrentId}`,
      link: `/torrents.php?action=download&id=${torrent.torrentId}&authkey=${authkey}&torrent_pass=${passkey}`,
      time: parseTimeWithZone(torrent.time, this.config.timezoneOffset),
      size: torrent.size,
      author: '',
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      completed: torrent.snatches,
      category: group.releaseType || ''
    } as Torrent
  }

  protected async transformSearchPage (doc: browseJsonResponse | any): Promise<Torrent[]> {
    const torrents : Torrent[] = []

    if (doc.status === 'success') {
      const rows = doc.response.results
      for (const group of rows) {
        if ('torrents' in group) { // is groupBrowseResult
          for (const rawTorrent of group.torrents) {
            const torrent: Torrent = await this.transformGroupTorrent(group, rawTorrent)
            torrents.push(torrent)
          }
        } else {
          const torrent: Torrent = await this.transformUnGroupTorrent(group)
          torrents.push(torrent)
        }
      }
    }

    return torrents
  }

  async flushUserInfo (): Promise<UserInfo> {
    let userInfo: Partial<UserInfo> = {}
    userInfo = { ...userInfo, ...await this.getUserBaseInfo() }
    if (userInfo.id) {
      userInfo = {
        ...userInfo,
        ...await this.getUserExtendInfo(userInfo.id as number),
        ...await this.getUserSeedingTorrents(userInfo.id as number)
      }
    }
    return userInfo as UserInfo
  }

  protected async getUserBaseInfo () : Promise<Partial<UserInfo>> {
    const apiInfo = await this.requestApiInfo()
    return this.getFieldsData(apiInfo, 'userInfo', ['id', 'name', 'messageCount', 'uploaded', 'downloaded', 'ratio', 'levelName'])
  }

  protected async getUserExtendInfo (userId: number): Promise<Partial<UserInfo>> {
    const apiUser = await this.requestApi<userJsonResponse>('user', { id: userId })
    return this.getFieldsData(apiUser, 'userInfo', ['joinTime', 'seeding'])
  }

  protected async getUserSeedingTorrents (userId?: number): Promise<Partial<UserInfo>> {
    const userSeedingTorrent: Partial<UserInfo> = { seedingSize: 0 }

    const { data: seedPage } = await this.request<Document>({ url: '/torrents.php', params: { type: 'seeding', userid: userId }, responseType: 'document' })
    const rows = Sizzle('tr.torrent_row > td.nobr', seedPage)
    rows.forEach(element => {
      userSeedingTorrent.seedingSize! += parseSizeString((element as HTMLElement).innerText.trim())
    })

    if (this.config.selector?.userInfo?.bonus) {
      userSeedingTorrent.bonus = this.getFieldData(seedPage, this.config.selector.userInfo.bonus)
    }

    return userSeedingTorrent
  }
}
