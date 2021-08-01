import { ISiteMetadata } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'Nyaa Torrents',
  description: '一个侧重于东亚（中国、日本及韩国）多媒体资源的BitTorrent站点，是世界上最大的动漫专用种子索引站。',
  url: 'https://nyaa.si/',
  search: {
    keywordsParam: 'q',
    requestConfig: { params: { c: '0_0' } },
    categories: [
      {
        name: 'Domain',
        key: '#changeDomain',
        options: [
          { name: 'Fun', value: 'https://nyaa.si/' },
          { name: 'Fap', value: 'https://sukebei.nyaa.si/' }
        ]
      },
      {
        name: 'Filter',
        key: 'f',
        options: [
          { name: 'No filter', value: 0 },
          { name: 'No remakes', value: 1 },
          { name: 'Trusted only', value: 2 }
        ]
      },
      {
        name: 'Sort',
        key: 's',
        options: [
          { name: 'Created', value: 'id' },
          { name: 'Size', value: 'size' },
          { name: 'Seeders', value: 'seeders' },
          { name: 'Leechers', value: 'leechers' },
          { name: 'Downloaders', value: 'downloads' },
          { name: 'Comments', value: 'comments' }
        ]
      },
      {
        name: 'Order',
        key: 'o',
        options: [
          { name: 'Descending', value: 'desc' },
          { name: 'Ascending', value: 'asc' }
        ]
      },
      {
        name: 'Category',
        key: 'c',
        options: [
          { name: 'All categories', value: '0_0' },
          { name: 'Anime', value: '1_0' },
          { name: 'Anime - AMV', value: '1_1' },
          { name: 'Anime - English', value: '1_2' },
          { name: 'Anime - Non-English', value: '1_3' },
          { name: 'Anime - Raw', value: '1_4' },
          { name: 'Audio', value: '2_0' },
          { name: 'Audio - Lossless', value: '2_1' },
          { name: 'Audio - Lossy', value: '2_2' },
          { name: 'Literature', value: '3_0' },
          { name: 'Literature - English', value: '3_1' },
          { name: 'Literature - Non-English', value: '3_2' },
          { name: 'Literature - Raw', value: '3_3' },
          { name: 'Live Action', value: '4_0' },
          { name: 'Live Action - English', value: '4_1' },
          { name: 'Live Action - Idol/PV', value: '4_2' },
          { name: 'Live Action - Non-English', value: '4_3' },
          { name: 'Live Action - Raw', value: '4_4' },
          { name: 'Pictures', value: '5_0' },
          { name: 'Pictures - Graphics', value: '5_1' },
          { name: 'Pictures - Photos', value: '5_2' },
          { name: 'Software', value: '6_0' },
          { name: 'Software - Apps', value: '6_1' },
          { name: 'Software - Games', value: '6_2' }
        ]
      },
      {
        name: 'Category - Sukebei',
        key: 'c',
        options: [
          { name: 'All categories', value: '0_0' },
          { name: 'Art', value: '1_0' },
          { name: 'Art - Anime', value: '1_1' },
          { name: 'Art - Doujinshi', value: '1_2' },
          { name: 'Art - Games', value: '1_3' },
          { name: 'Art - Manga', value: '1_4' },
          { name: 'Art - Pictures', value: '1_5' },
          { name: 'Real Life', value: '2_0' },
          { name: 'Real Life - Pictures', value: '2_1' },
          { name: 'Real Life - Videos', value: '2_2' }
        ]
      }
    ],
    selectors: {
      rows: { selector: 'table.torrent-list > tbody > tr' },
      id: { selector: 'td:nth-child(2) a:last-of-type', attr: 'href', filters: [(q: string) => q.match(/(\d+)/)![0]] },
      title: { selector: 'td:nth-child(2) a:last-of-type', attr: 'title' },
      url: { selector: 'td:nth-child(2) a:last-of-type', attr: 'href' },
      link: { selector: 'td:nth-child(3) a', attr: 'href' },
      time: { selector: 'td:nth-child(5)', data: 'timestamp' },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(6)' },
      leechers: { selector: 'td:nth-child(7)' },
      completed: { selector: 'td:nth-child(8)' },
      comments: { text: 0, selector: 'td:nth-child(2) a.comments' },
      category: { selector: 'td:nth-child(1) a', attr: 'title' }
    }
  }
};
