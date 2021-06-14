import { ISiteMetadata, ITorrent } from '../../types';
import PrivateSite from '../schema/AbstractPrivateSite';
import urlparse from 'url-parse';

export const siteMetadata: ISiteMetadata = {
  name: 'TorrentSeeds',
  description: 'TorrentSeeds',
  url: 'https://www.torrentseeds.org/',
  tags: ['综合'],
  collaborator: 'ian',
  search: {
    keywordsParam: 'query',
    requestConfig: {
      url: '/browse_elastic.php',
      params: {
        search_in: 'name',
        search_mode: 'all',
        order_by: 'added',
        order_way: 'desc'
      }
    }
  },
  selector: {
    search: {
      rows: { selector: 'table.table-bordered > tbody > tr[class*="torrent_row_"]' },
      id: { selector: 'a[href^="/details.php?id="]', attr: 'href', filters: [(q: string) => urlparse(q, true).query.id] },
      title: { selector: 'td:has(a[href^="/details.php?id="]) b' },
      subTitle: { text: '' },
      url: { selector: 'a[href^="/details.php?id="]', attr: 'href' },
      link: { selector: 'a[href^="/download.php?torrent="]' },
      time: { selector: '> td:eq(5)' },
      size: { selector: '> td:eq(6)' },
      author: { text: '' },
      category: { selector: '> td:eq(0)' }, // FIXME
      seeders: { selector: '> td:eq(8)' },
      leechers: { selector: '> td:eq(9)' },
      completed: { selector: '> td:eq(7)' },
      comments: { text: 0 }
    },
    detail: {
      id: { selector: 'h2.text-center > a', attr: 'href' }, // FIXME
      title: { selector: 'div > div:nth-child(3) > div.pull-left > h1' },
      subTitle: { text: '' },
      url: { selector: 'h2.text-center > a', attr: 'href' },
      link: { selector: 'a[href*="download.php?torrent="]', attr: 'href' },
      time: { selector: "td.heading:contains('Added') + td" },
      size: {
        selector: 'td.heading:contains("Size") + td',
        filters: [
          (query:string) => query.split('(')[0].trim()
        ]
      },
      author: { text: '' },
      category: { selector: "td.heading:contains('Type') + td" },
      seeders: {
        selector: "td.heading:contains('Peers') + td",
        filters: [
          (query: string) => {
            const peerStatus = query.split(',');
            return peerStatus[0].replace(' seeder(s)', '').trim();
          }
        ]
      },
      leechers: {
        selector: "td.heading:contains('Peers') + td",
        filters: [
          (query: string) => {
            const peerStatus = query.split(',');
            return peerStatus[1].split('=')[0].replace(' leecher(s) ', '').trim();
          }
        ]
      },
      completed: {
        selector: "td.heading:contains('Snatched') + td",
        filters: [
          (query: string) => query.replace(' time(s)', '')
        ]
      },
      comments: { text: 0 }
    }
  }
};

export default class torrentseeds extends PrivateSite {
  protected override async transformSearchPage (doc: Document): Promise<ITorrent[]> {
    // 当搜索结果只有1条时会自动重定向到种子详情页，这时直接解析页面
    if (/Info\shash/.test(doc.documentElement.outerHTML)) {
      return [
        this.getFieldsData(doc, 'detail',
          ['id', 'title', 'subTitle', 'url', 'link', 'time', 'size', 'author', 'category', 'seeders', 'leechers', 'completed', 'comments']
        ) as ITorrent
      ];
    }

    return super.transformSearchPage(doc);
  }
}
