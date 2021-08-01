import { ISearchFilter, ISearchParams, ISiteMetadata } from '../../types';
import BittorrentSite from '../schema/AbstractBittorrentSite';
import { AxiosRequestConfig } from 'axios';
import urljoin from 'url-join';
import dayjs from '@ptpp/utils/plugins/dayjs';

const categoryMap = new Map([
  [28, 'Anime/Anime'], [78, 'Anime/Dual Audio'], [79, 'Anime/Dubbed'], [80, 'Anime/Subbed'], [81, 'Anime/Raw'],
  [22, 'Music/MP3'], [23, 'Music/Lossless'], [24, 'Music/DVD'], [25, 'Music/Video'], [26, 'Music/Radio'], [27, 'Music/Other'], [53, 'Music/Album'], [58, 'Music/Box set'], [59, 'Music/Discography'], [60, 'Music/Single'], [68, 'Music/Concerts'], [69, 'Music/AAC'],
  [1, 'Movies/DVD'], [2, 'Movies/Divx/Xvid'], [3, 'Movies/SVCD/VCD'], [4, 'Movies/Dubs/Dual Audio'], [42, 'Movies/HD'], [54, 'Movies/h.264/x264'], [55, 'Movies/Mp4'], [66, 'Movies/3D'], [70, 'Movies/HEVC/x265'], [73, 'Movies/Bollywood'], [76, 'Movies/UHD'],
  [5, 'TV/DVD'], [6, 'TV/Divx/Xvid'], [7, 'TV/SVCD/VCD'], [41, 'TV/HD'], [71, 'TV/HEVC/x265'], [74, 'TV/Cartoons'], [75, 'TV/SD'], [9, 'TV/Documentary'],
  [18, 'Apps/PC Software'], [19, 'Apps/Mac'], [20, 'Apps/Linux'], [21, 'Apps/Other'], [56, 'Apps/Android'], [57, 'Apps/iOS'],
  [10, 'Games/PC Game'], [11, 'Games/PS2'], [12, 'Games/PSP'], [13, 'Games/Xbox'], [14, 'Games/Xbox360'], [15, 'Games/PS1'], [16, 'Games/Dreamcast'], [17, 'Games/Other'], [43, 'Games/PS3'], [44, 'Games/Wii'], [45, 'Games/DS'], [46, 'Games/GameCube'], [72, 'Games/3DS'], [77, 'Games/PS4'], [82, 'Games/Switch'],
  [48, 'XXX/Video'], [49, 'XXX/Picture'], [50, 'XXX/Magazine'], [51, 'XXX/Hentai'], [67, 'XXX/Games'],
  [33, 'Other/Emulation'], [34, 'Other/Tutorial'], [35, 'Other/Sounds'], [36, 'Other/E-books'], [37, 'Other/Images'], [38, 'Other/Mobile Phone'], [39, 'Other/Comics'], [40, 'Other/Other'], [47, 'Other/Nulled Script'], [52, 'Other/Audiobook']
]);

export const siteMetadata: ISiteMetadata = {
  name: '1337x',
  description: '1337X is a Public torrent site that offers verified torrent downloads',
  url: 'https://1337x.to/',
  legacyUrl: [
    'https://1337x.gd/',
    'https://1337x.is/',
    'https://1337x.st/',
    'https://x1337x.ws/',
    'https://x1337x.eu/',
    'https://x1337x.se/'
  ],
  search: {
    requestConfig: {
      url: '/search',
      params: {
        order: 'desc'
      }
    },
    categories: [
      {
        name: 'Category',
        key: 'category',
        options: [
          { name: 'TV', value: 'TV' },
          { name: 'Movies', value: 'Movies' },
          { name: 'Games', value: 'Games' },
          { name: 'Apps', value: 'Documentaries' },
          { name: 'Anime', value: 'Anime' },
          { name: 'Other', value: 'Other' },
          { name: 'XXX', value: 'XXX' }
        ]
      },
      {
        name: 'Sort',
        key: 'value',
        options: [
          { name: 'Time', value: 'time' },
          { name: 'Size', value: 'size' },
          { name: 'Seeders', value: 'seeders' },
          { name: 'leechers', value: 'leechers' }
        ]
      },
      {
        name: 'Order',
        key: 'order',
        options: [
          { name: 'Ascending', value: 'asc' },
          { name: 'Descending', value: 'desc' }
        ]
      }
    ],
    selectors: {
      rows: { selector: 'table.table-list > tbody > tr' }, // 'tr:has(a[href^="/torrent/"])'
      id: {
        selector: 'td[class^="coll-1"] a[href^="/torrent/"]',
        attr: 'href',
        filters: [
          (q: string) => q.match(/\/torrent\/(\d+)/)![1]
        ]
      },
      title: { selector: 'td[class^="coll-1"] a[href^="/torrent/"]' },
      url: { selector: 'td[class^="coll-1"] a[href^="/torrent/"]', attr: 'href' },
      // .torrent link is on the details page, So we override func getTorrentDownloadLink
      time: {
        selector: 'td[class^="coll-date"]',
        filters: [
          (q: string) => {
            /**
             * - (within this year) 7am Sep. 14th
             * - (more than a year ago) Apr. 18th '11
             * - (today) 12:25am
             */
            q = q.replace("'", '').replace('.', '');
            return dayjs(q, ['MMM Do YY', 'HH:mma', 'mma MMM Do']).valueOf();
          }
        ]
      },
      size: { selector: 'td[class^="coll-4"]' },
      seeders: { selector: 'td[class^="coll-2"]' },
      leechers: { selector: 'td[class^="coll-3"]' },
      comments: { selector: 'td[class^="coll-1"] span.comments', filters: [(q:string) => parseInt(q) || 0] },
      category: {
        selector: 'td[class^="coll-1"] a[href^="/sub/"]',
        attr: 'href',
        filters: [
          (q: string) => categoryMap.get(parseInt(q.match(/\/sub\/(\d+)/)![1]))
        ]
      }
    }
  },

  detail: {
    selectors: {
      link: { selector: 'ul[aria-labelledby="dropdownMenu1"] a', attr: 'href' }
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default class x1337x extends BittorrentSite {
  protected override async transformSearchFilter (filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const { keywords, extraParams } = filter;
    let searchPath = 'search';

    const category = extraParams?.filter((v: ISearchParams) => v.key === 'category')[0];
    if (category) {
      searchPath = 'category-' + searchPath;
    }

    const sort = extraParams?.filter((v: ISearchParams) => v.key === 'sort')[0];
    if (sort) {
      searchPath = 'sort-' + searchPath;
    }

    const order = extraParams?.filter((v: ISearchParams) => v.key === 'order')[0];

    return {
      /**
       * 链接示例：
       *  - /search/Ntb/1/
       *  - /category-search/Ntb/Movies/1/
       *  - /sort-category-search/Ntb/Movies/time/desc/1/
       */
      url: urljoin(
        searchPath, keywords || '',
        String(category?.value || ''), String(sort?.value || ''),
        String(sort ? (order?.value || 'desc') : ''), '1/'
      )
    };
  }
}
