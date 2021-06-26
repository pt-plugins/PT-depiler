import { ISiteMetadata, ETorrentStatus } from '../../types';
import Sizzle from 'sizzle';

export const siteMetadata: ISiteMetadata = {
  name: 'SkyeySnow',
  aka: ['天雪'],
  timezoneOffset: '+0800',
  url: 'https://www.skyey2.com/',
  legacyUrl: [
    'https://skyeysnow.com/'
  ],
  tags: ['动漫'],
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/forum.php',
      params: {
        mod: 'torrents',
        cat: 1
      }
    }
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id', 'name', 'messageCount']
      },
      {
        requestConfig: { url: '/home.php', params: { mod: 'space' } },
        assertion: { id: 'uid' },
        fields: ['uploaded', 'downloaded', 'levelName', 'bonus', 'joinTime', 'seeding', 'seedingSize']
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table.torrents > tbody > tr:gt(0)' },
      id: {
        selector: 'a[href^="/forum.php?mod=viewthread"]',
        attr: 'href',
        filters: [{ name: 'querystring', args: ['tid'] }]
      }, // 帖子id
      title: { selector: 'td.torrent_title > a[title]', attr: 'title' },
      url: { selector: 'a[href^="/forum.php?mod=viewthread"]', attr: 'href' },
      link: { selector: 'a[href^="/download.php?id="]', attr: 'href' }, // 种子id
      time: { selector: ' > td:nth-child(3)' },
      author: { selector: '> td:nth-last-child(1)' },
      category: { selector: '> td:nth-child(1)' },
      seeders: { selector: ' > td:nth-child(5)' },
      leechers: { selector: ' > td:nth-child(6)' },
      completed: { selector: ' > td:nth-child(7)' },
      tags: [
        { name: '70%', selector: 'img.sp_1' },
        { name: '50%', selector: 'img.sp_2' },
        { name: '50%', selector: 'img.sp_2' },
        { name: '35%', selector: 'img.sp_3' },
        { name: 'Free', selector: 'img.sp_4' },
        { name: '2xFree', selector: 'img.sp_5' }
      ],
      progress: {
        selector: ['div.tline1, div.tline2'],
        attr: 'style',
        filters: [
          (query:string) => {
            const queryMatch = query.match(/width:([ \d.]+)%/);
            return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : null;
          }
        ]
      },
      status: {
        selector: ':self',
        elementProcess: (tr: HTMLElement) => {
          const statusAnothers = Sizzle('> td:eq(4), > td:eq(5), > td:eq(6)', tr);
          const statusStyle: (string | null)[] = statusAnothers.map(e => e.getAttribute('style'));
          if (statusStyle[0]) {
            return ETorrentStatus.seeding;
          } else if (statusStyle[2]) {
            return ETorrentStatus.completed;
          } else if (statusStyle[1]) {
            return ETorrentStatus.downloading;
          } else {
            return ETorrentStatus.unknown;
          }
        }
      }

    },
    userInfo: {
      id: {
        selector: '.vwmy a',
        attr: 'href',
        filters: [{ name: 'querystring', args: ['uid'] }]
      },
      name: { selector: '.vwmy a' },
      messageCount: {
        selector: ['a.a.showmenu.new'],
        filters: [{ name: 'parseNumber' }]
      },
      uploaded: {
        selector: "#psts li:contains('上传量')",
        filters: [{ name: 'parseSize' }]
      },
      downloaded: {
        selector: "#psts li:contains('下载量')",
        filters: [{ name: 'parseSize' }]
      },
      levelName: {
        selector: "a[href='home.php?mod=spacecp&ac=usergroup']",
        filters: [(query:string) => query.replace('用户组: ', '').trim()]
      },
      bonus: {
        selector: '#ratio',
        filters: [
          (query:string) => query.replace('论坛积分:', '').replace(/,/g, '').trim(),
          parseFloat
        ]
      },
      joinTime: {
        selector: "#pbbs > li:contains('注册时间')",
        filters: [
          (query:string) => query.replace('注册时间', '').trim(),
          { name: 'parseTime' }
        ]
      },
      seeding: { // FIXME 没看到有 “即时保种数” 这栏
        text: 0,
        selector: "#psts li:contains('即时保种数')",
        filters: [
          (query:string) => query.replace('即时保种数', '').replace(/,/g, '').trim(),
          parseFloat
        ]
      },
      seedingSize: { text: 'N/A' }
    }
  }
};
