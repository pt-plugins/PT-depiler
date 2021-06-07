/**
 * 感觉使用配置项的形式来解析有点麻烦，还是直接重写搜索转化方法吧
 * 但同样未经测试
 * Rhilip, 2021.04.23
 */
import { SiteMetadata, Torrent } from '@/shared/interfaces/sites';
import { parseSizeString, parseTimeWithZone } from '@/shared/utils/filter';
import Gazelle from '../schema/Gazelle';

export const siteMetadata: SiteMetadata = {
  name: 'PTP',
  timezoneOffset: '+0000',
  description: '电影',
  url: 'https://passthepopcorn.me/',
  tags: ['电影'],
  schema: 'Gazelle',
  host: 'passthepopcorn.me',
  collaborator: ['lengmianxia', 'birdplane'],
  search: {
    requestConfig: {
      responseType: 'json',
      params: {
        groupint: 0,
        json: 'noredirect'
      }
    }
  },

  selector: {
    userInfo: {
      id: { selector: ["a.user-info-bar__link[href*='user.php']:first"], attr: 'href' },
      name: { selector: ["a.user-info-bar__link[href*='user.php']:first"] },
      messageCount: {
        selector: ["div.alert-bar a[href*='inbox.php']"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/\s+/g, '').match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },

      uploaded: {
        selector: ["a.user-info-bar__link[href*='type=seeding']:first"],
        attr: 'title',
        filters: [parseSizeString]
      },
      downloaded: {
        selector: ["a.user-info-bar__link[href*='type=leeching']:first"],
        attr: 'title',
        filters: [parseSizeString]
      },
      ratio: {
        selector: "ul.list > li:contains('Ratio:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,|\n|\s+/g, '').match(/Ratio.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : 0;
          }
        ]
      },
      seeding: {
        selector: "ul.list > li:contains('Seeding:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/[,\n]/g, '').match(/:.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          }
        ]
      },
      seedingSize: {
        selector: "ul.list > li:contains('Seeding size:')",
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, '').match(/:.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
            return queryMatch && queryMatch.length >= 2 ? parseSizeString(queryMatch[1]) : 0;
          }
        ]
      },
      levelName: { selector: "ul.list > li:contains('Class:')" },
      bonus: {
        selector: ["ul.list > li:contains('Points:')", "div:contains('Stats') + ul.stats > li:contains('SeedBonus:')"],
        filters: [
          (query: string) => {
            query = query.replace(/,|\n|\s+/g, '');
            const queryMatch = query.match(/Points.+?([\d.]+)/) || query.match(/SeedBonus.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? parseFloat(queryMatch[1]) : 0;
          }
        ]
      },
      joinTime: {
        selector: ["ul.list > li:contains('Joined:') > span"]
      }

    }
  }
};

// PTP 在调用json搜索接口时的返回结构
interface SearchResponse {
  TotalResults: string,
  AuthKey: string,
  PassKey: string,
  Movies: {
    GroupId: number,
    Title: string,
    Year: string,
    Cover: string,
    Tags: string[],
    Directors: { Name: string, Id: string }[],
    ImdbId: string,
    TotalLeechers: string | null,
    TotalSeeders: string | null,
    TotalSnatched: string | null,
    MaxSize: number,
    LastUploadTime: string,
    Torrents: {
      Id: number,
      Quality: string,
      Source: string,
      Container: string,
      Codec: string,
      Resolution: string,
      Scene: boolean,
      Size: string,
      UploadTime: string,
      Snatched: string,
      Seeders: string,
      Leechers: string,
      ReleaseName: string,
      ReleaseGroup: string | null,
      Checked: boolean,
      GoldenPopcorn: boolean
    }[]
  }[]
}

export default class passthepopcorn extends Gazelle {
  protected async transformSearchPage (doc: SearchResponse): Promise<Torrent[]> {
    const authKey = doc.AuthKey;
    const passKey = doc.PassKey;

    const torrents : Torrent[] = [];
    for (let i = 0; i < doc.Movies.length; i++) {
      const row = doc.Movies[i];
      const rawTorrent = row.Torrents[0];
      torrents.push({
        id: rawTorrent.Id,
        title: `${row.Title}[${row.Year}]-${rawTorrent.Codec}/${rawTorrent.Container}/${rawTorrent.Source}/${rawTorrent.Resolution}`,
        subTitle: rawTorrent.ReleaseName,
        link: `/torrents.php?action=download&id=${rawTorrent.Id}&authkey=${authKey}&torrent_pass=${passKey}`,
        url: `/torrents.php?id=${row.GroupId}&torrentid=${rawTorrent.Id}`,
        size: parseFloat(rawTorrent.Size),
        time: parseTimeWithZone(rawTorrent.UploadTime, this.config.timezoneOffset || '+0000'),
        author: '',
        seeders: parseInt(rawTorrent.Seeders),
        leechers: parseInt(rawTorrent.Leechers),
        completed: parseInt(rawTorrent.Snatched),
        comments: 0,
        tags: [],
        category: 'Movie'
      } as Torrent);
    }
    return torrents;
  }
}
