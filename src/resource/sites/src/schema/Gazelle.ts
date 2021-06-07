import PrivateSite from '../schema/AbstractPrivateSite';
import { SiteConfig, Torrent } from '@/shared/interfaces/sites';
import Sizzle from 'sizzle';
import { merge } from 'lodash-es';
import { ETorrentStatus } from '@/shared/interfaces/enum';
import urlparse from 'url-parse';
import { parseSizeString } from '@/shared/utils/filter';
import dayjs from '@/shared/utils/dayjs';

export default class Gazelle extends PrivateSite {
  protected readonly initConfig: Partial<SiteConfig> = {
    search: {
      keywordsParam: 'searchstr',
      requestConfig: {
        url: '/torrents.php',
        responseType: 'document',
        params: { searchsubmit: 1 }
      }
    },
    userInfo: {
      process: [
        {
          requestConfig: { url: '/index.php', responseType: 'document' },
          fields: ['id', 'name', 'messageCount']
        },
        {
          requestConfig: { url: '/user.php', params: { /* id: flushUserInfo.id */ }, responseType: 'document' },
          assertion: { id: 'id' },
          fields: [
            'uploaded', 'downloaded', 'ratio', 'levelName', 'bonus', 'joinTime', // Gazelle 基础项
            'seeding', 'seedingSize'
          ]
        }
      ]
    },

    selector: {
      search: {
        rows: { selector: 'table.torrent_table:last > tbody > tr:gt(0)' },
        id: {
          selector: "a[href*='torrents.php?id=']",
          attr: 'href',
          filters: [
            (query:string) => {
              const urlParse = urlparse(query, true);
              return urlParse.query.torrentid || urlParse.query.id;
            }
          ]
        },
        title: { selector: "a[href*='torrents.php?id=']" },
        url: { selector: "a[href*='torrents.php?id=']", attr: 'href' },
        link: { selector: "a[href*='torrents.php?action=download'][title='Download']:first", attr: 'href' },
        // TODO category: {}
        time: {
          elementProcess: [
            (element: HTMLElement) => {
              const AccurateTimeAnother = element.querySelector('span[title], time[title]');
              if (AccurateTimeAnother) {
                return AccurateTimeAnother.getAttribute('title')! + ':00';
              } else if (element.getAttribute('title')) {
                return element.getAttribute('title')! + ':00';
              } else {
                return element.innerText.trim() + ':00';
              }
            }
          ]
        },

        progress: { text: 0 },
        status: { text: ETorrentStatus.unknown }
      },
      userInfo: {
        // "page": "/index.php",
        id: {
          selector: ["a.username[href*='user.php']:first"],
          attr: 'href',
          filters: [
            (query: string) => parseInt(urlparse(query, true).query.id || '')
          ]
        },
        name: {
          selector: ["a.username[href*='user.php']:first"]
        },
        messageCount: {
          selector: ["div.alert-bar > a[href*='inbox.php']", "div.alertbar > a[href*='inbox.php']"],
          filters: [
            (query: string) => {
              const queryMatch = query.match(/(\d+)/);
              return (queryMatch && queryMatch.length >= 2) ? parseInt(queryMatch[1]) : 0;
            }
          ]
        },

        // "page": "/user.php?id=$user.id$",
        uploaded: {
          selector: "div:contains('Stats') + ul.stats > li:contains('Uploaded')",
          filters: [
            (query: string) => {
              const queryMatch = query.replace(/,/g, '').match(/Upload.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return (queryMatch && queryMatch.length >= 2) ? parseSizeString(queryMatch[1]) : 0;
            }
          ]
        },
        downloaded: {
          selector: "div:contains('Stats') + ul.stats > li:contains('Downloaded')",
          filters: [
            (query: string) => {
              const queryMatch = query.replace(/,/g, '').match(/Download.+?([\d.]+ ?[ZEPTGMK]?i?B)/);
              return (queryMatch && queryMatch.length >= 2) ? parseSizeString(queryMatch[1]) : 0;
            }
          ]
        },
        ratio: {
          selector: "div:contains('Stats') + ul.stats > li:contains('Ratio:')",
          filters: [
            (query: string) => {
              const queryMatch = query.replace(/,/g, '').match(/Ratio.+?([\d.]+)/);
              return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0;
            }
          ]
        },
        levelName: {
          selector: "div:contains('Personal') + ul.stats > li:contains('Class:')",
          filters: [
            (query: string) => {
              const queryMatch = query.match(/Class:.+?(.+)/);
              return (queryMatch && queryMatch.length >= 2) ? queryMatch[1] : '';
            }
          ]
        },
        bonus: {
          selector: ["div:contains('Stats') + ul.stats > li:contains('Bonus Points:')", "div:contains('Stats') + ul.stats > li:contains('SeedBonus:')"],
          filters: [
            (query: string) => {
              query = query.replace(/,/g, '');
              const queryMatch = query.match(/Bonus Points.+?([\d.]+)/) || query.match(/SeedBonus.+?([\d.]+)/);
              return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0;
            }
          ]
        },
        joinTime: {
          selector: ["div:contains('Stats') + ul.stats > li:contains('Joined:') > span"],
          elementProcess: [
            (element: HTMLElement) => {
              const query = (element.getAttribute('title') || element.innerText).trim();
              return dayjs(query).isValid() ? dayjs(query).valueOf() : query;
            }
          ]
        }
      },
      detail: {}
    }
  }

  protected async transformSearchPage (doc: Document | any): Promise<Torrent[]> {
    // 如果配置文件没有传入 search 的选择器，则我们自己生成
    const legacyTableSelector = 'table.torrent_table:last';

    // 生成 rows的
    if (!this.config.selector?.search?.rows) {
      this.config.selector!.search!.rows = { selector: `${legacyTableSelector} > tbody > tr:gt(0)` };
    }
    // 对于 Gazelle ，一般来说，表的第一行应该是标题行，即 `> tbody > tr:nth-child(1)`
    const tableHeadAnother = Sizzle(`${legacyTableSelector} > tbody > tr:first > td`, doc) as HTMLElement[];

    tableHeadAnother.forEach((element, elementIndex) => {
      for (const [dectField, dectSelector] of Object.entries({
        time: "a[href*='order_by=time']", // 发布时间
        size: "a[href*='order_by=size']", // 大小
        seeders: "a[href*='order_by=seeders']", // 种子数
        leechers: "a[href*='order_by=leechers']", // 下载数
        completed: "a[href*='order_by=snatched']" // 完成数
      } as Record<keyof Torrent, string>)) {
        if (Sizzle(dectSelector, element).length > 0) {
          // @ts-ignore
          this.config.selector.search[dectField] = merge({
            selector: [`> td:eq(${elementIndex})`]
          },
          // @ts-ignore
          (this.config.selector.search[dectField] || {}));
        }
      }
    });

    // 遍历数据行
    const torrents: Torrent[] = [];
    const trs = Sizzle(this.config.selector!.search!.rows.selector as string, doc);

    for (let i = 0; i < trs.length; i++) {
      const tr = trs[i];

      // 对 url 和 link 结果做个检查，检查通过的再进入 parseRowToTorrent
      const url = this.getFieldData(tr, this.config.selector!.search!.url!);
      const link = this.getFieldData(tr, this.config.selector!.search!.link!);
      if (url && link) {
        const torrent = this.parseRowToTorrent(tr, { url, link }) as Torrent;
        torrents.push(torrent);
      }
    }

    return torrents;
  }
}
