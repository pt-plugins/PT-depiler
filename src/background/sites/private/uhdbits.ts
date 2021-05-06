import { SiteMetadata, Torrent, UserInfo } from '@/shared/interfaces/sites';
import GazelleJSONAPI from '@/background/sites/schema/GazelleJSONAPI';
import Sizzle from 'sizzle';
import urlparse from 'url-parse';
import userDataRecords from '@/background/service/storage/userDataRecords';
import { parseSizeString } from '@/shared/utils/filter';

export const siteMetadata: SiteMetadata = {
  name: 'UHDBits',
  timezoneOffset: '+0000',
  description: 'HD',
  schema: 'GazelleJSONAPI',
  tags: ['影视'],
  url: 'https://uhdbits.org/',
  collaborator: ['bimzcy', 'enigamz'],
  host: 'uhdbits.org',
  search: {
    keywordsParam: 'searchstr',
    requestConfig: {
      url: '/torrents.php',
      params: {
        group_results: 0, // 取消分组
        searchsubmit: 1
      },
      responseType: 'document' // 需要覆盖掉 GazelleJSONAPI 默认的 json 设置
    },
    categories: [
      {
        name: 'Category',
        key: 'filter_cat',
        options: [
          { value: 1, name: 'Movie' },
          { value: 2, name: 'Music' },
          { value: 3, name: 'TV' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.torrent_table:last > tbody > tr.torrent' },
      id: {
        selector: "a[href*='torrents.php?id=']",
        attr: 'href',
        filters: [
          (query: string) => {
            const urlParse = urlparse(query, true).query;
            return urlParse.torrentid || urlParse.id;
          }
        ]
      },
      title: {
        selector: "div.group_info:has(> a[href*='torrents.php?id='])",
        elementProcess: [
          (element:HTMLElement) => {
            const cloneElement = element.cloneNode(true) as HTMLElement;
            Sizzle('>span, div.torrent_info', cloneElement).forEach(e => e.remove());
            return cloneElement.innerText.trim();
          }
        ]
      },
      subTitle: { selector: 'div.group_info > div.torrent_info:first' },
      url: { selector: "a[href*='torrents.php?id=']", attr: 'href' },
      link: { selector: "a[href*='torrents.php?action=download'][title='Download']:first", attr: 'href' },
      time: {
        selector: '>td:eq(4)',
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
      size: { selector: '>td:eq(5)' },
      completed: { selector: '>td:eq(6)' },
      seeders: { selector: '>td:eq(7)' },
      leechers: { selector: '>td:eq(8)' },
      comments: { selector: '>td:eq(3)' },
      author: { text: '' },
      category: {
        selector: 'td.cats_col > a > div',
        attr: 'class',
        filters: [
          (query:string) => {
            if (query.includes('cats_movie')) {
              return 'Movie';
            } else if (query.includes('cats_tv')) {
              return 'TV';
            } else if (query.includes('cats_music')) {
              return 'Music';
            } else {
              return 'Other';
            }
          }
        ]
      }
    },
    userInfo: {
      bonus: {
        selector: ["[href='bonus.php'] + span"]
      }
    }
  }
};

export default class uhdbits extends GazelleJSONAPI {
  /**
   * 使用 AbstractBittorrentSite 的解析方法，但是 TS 不允许调用 super.super
   * 同时， transformSearchPage 在基类中属于 protected 属性，
   * （意味着我们不能使用 BittorrentSite.prototype.transformSearchPage 方法调用
   * 所以我们得直接从基类方法中简化抄.....
   *
   * @param doc
   * @protected
   */
  protected async transformSearchPage (doc: Document): Promise<Torrent[]> {
    const torrents: Torrent[] = [];

    const trs = Sizzle(this.config.selector!.search!.rows!.selector as string, doc);
    trs?.forEach((tr: any) => {
      torrents.push(this.parseRowToTorrent(tr) as Torrent);
    });

    return torrents;
  }

  private async getUserTorrentList (userId: number, page: number = 0, type: string = 'seeding'): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: '/torrents.php',
      params: {
        userid: userId, page, type
      },
      responseType: 'document'
    });
    return TListDocument;
  }

  protected async getUserSeedingTorrents (userId: number): Promise<Partial<UserInfo>> {
    const userSeedingTorrent: Partial<UserInfo> = { seedingSize: 0 };
    const pageInfo = { count: 0, current: 0 }; // 生成页面信息

    for (;pageInfo.current <= pageInfo.count; pageInfo.current++) {
      const TListDocument = await this.getUserTorrentList(userId, pageInfo.current);
      // 更新最大页数
      if (pageInfo.count === 0) {
        pageInfo.count = this.getFieldData(TListDocument, {
          selector: ["a[href*='torrents.php?page=']:contains('Last'):last"],
          attr: 'href',
          filters: [(query: string) => parseInt(urlparse(query, true).query.page as string) || -1]
        });
      }

      // 更新做种情况
      if (!userSeedingTorrent.bonus && this.config.selector?.userInfo?.bonus) {
        userSeedingTorrent.bonus = this.getFieldData(TListDocument, this.config.selector.userInfo.bonus);
      }

      // 解析当前页信息， 并合并至顶层字典中
      const sizeAnothers = Sizzle('td.number_column.nobr', TListDocument);
      sizeAnothers.forEach(element => {
        userSeedingTorrent.seedingSize! += parseSizeString((element as HTMLElement).innerText.trim());
      });
    }

    return userSeedingTorrent;
  }
}
