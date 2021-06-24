import { ISiteMetadata, ETorrentStatus } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'U2',
  timezoneOffset: '+0800',
  description: '动漫花园分享园',
  url: 'https://u2.dmhy.org/',
  tags: ['影视', '动漫'],
  schema: 'NexusPHP',
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 9, name: 'U2-Rip' },
          { value: 411, name: 'U2-RBD' },
          { value: 10, name: 'R3TRAW' },
          { value: 11, name: 'R2JRAW' },
          { value: 12, name: 'BDRip' },
          { value: 13, name: 'DVDRip' },
          { value: 14, name: 'HDTVRip' },
          { value: 15, name: 'DVDISO' },
          { value: 16, name: 'BDMV' },
          { value: 17, name: 'LQRip' },
          { value: 410, name: '外挂结构' },
          { value: 412, name: '加流重灌' },
          { value: 21, name: 'Raw Books' },
          { value: 22, name: '港译漫画' },
          { value: 23, name: '台译漫画' },
          { value: 30, name: 'Lossless Music' },
          { value: 40, name: 'Others' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      title: {
        selector: ["a.tooltip[href*='hit']"]
      },
      subTitle: {
        selector: ['span.tooltip']
      },
      progress: {
        selector: ["td[class*='seedhlc_'], td[class*='leechhlc_']"],
        elementProcess: (element: HTMLElement) => {
          switch (true) {
            case /seedhlc_/.test(element.className):
              return 100;
            case /leechhlc_/.test(element.className):
              return parseFloat((element.innerText.match(/[\d.]+%/)! || [0])[0]);
            default:
              return 0;
          }
        }
      },
      status: {
        selector: ["td[class*='seedhlc_ever']", '.seedhlc_current', '.leechhlc_inactive', '.leechhlc_current'],
        switchFilters: [
          () => ETorrentStatus.completed,
          () => ETorrentStatus.seeding,
          () => ETorrentStatus.inactive,
          () => ETorrentStatus.downloading,
          () => ETorrentStatus.unknown // 缺省情况
        ]
      },
      leechers: {
        elementProcess: (element: HTMLElement) => {
          return parseInt(element.firstChild!.textContent!);
        }
      }
    },
    userInfo: {
      bonus: {
        selector: ["td.rowhead:contains('UCoin') + td > span"],
        attr: 'title',
        filters: [
          (query: string) => parseFloat(query.replaceAll(',', ''))
        ]
      }
    }

  }
};
