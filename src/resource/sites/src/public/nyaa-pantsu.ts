import { ISiteMetadata } from '../../types';
import dayjs from '@ptpp/utils/plugins/dayjs';

export const siteMetadata: ISiteMetadata = {
  name: 'Nyaa Pantsu',
  description: '另一个 Nyaa 的继承者，侧重于东亚（中国、日本及韩国）多媒体资源的BitTorrent站点',
  url: 'https://nyaa.net/',
  search: {
    requestConfig: { url: '/search' },
    categories: [
      {
        name: 'Domain',
        key: 'domain',
        options: [
          { name: 'Fun', value: 'https://nyaa.net/' },
          { name: 'Fap', value: 'https://sukebei.nyaa.net/' }
        ]
      },
      {
        name: 'Sort',
        key: 'sort',
        options: [
          { name: 'Name', value: 1 },
          { name: 'Created', value: 2 },
          { name: 'File Size', value: 4 },
          { name: 'Seeders', value: 5 },
          { name: 'Leechers', value: 6 },
          { name: 'Downloaders', value: 7 }
        ]
      },
      {
        name: 'Order',
        key: 'order',
        options: [
          { name: 'Ascending', value: 'false' },
          { name: 'Descending', value: 'true' }
        ]
      },
      {
        name: 'Category',
        key: 'c',
        options: [
          { name: 'All categories', value: '_' },
          { name: 'Anime', value: '3_' },
          { name: 'Anime - Anime Music Video', value: '3_12' },
          { name: 'Anime - English-translated', value: '3_5' },
          { name: 'Anime - Non-English-translated', value: '3_13' },
          { name: 'Anime - Raw', value: '3_6' },
          { name: 'Audio', value: '2_' },
          { name: 'Audio - Lossless', value: '2_3' },
          { name: 'Audio - Lossy', value: '2_4' },
          { name: 'Literature', value: '4_' },
          { name: 'Literature - English-translated', value: '4_7' },
          { name: 'Literature - Non-English-translated', value: '4_14' },
          { name: 'Literature - Raw', value: '4_8' },
          { name: 'Live Action', value: '5_' },
          { name: 'Live Action - English-translated', value: '5_9' },
          { name: 'Live Action - Idol/Promotional Video', value: '5_10' },
          { name: 'Live Action - Non-English-translated', value: '5_18' },
          { name: 'Live Action - Raw', value: '5_11' },
          { name: 'Pictures', value: '6_' },
          { name: 'Pictures - Graphics', value: '6_15' },
          { name: 'Pictures - Photos', value: '6_16' },
          { name: 'Software', value: '1_' },
          { name: 'Software - Applications', value: '1_1' },
          { name: 'Software - Games', value: '1_2' },
          { name: 'All categories', value: '_' },
          { name: 'Anime', value: '3_' },
          { name: 'Anime - Anime Music Video', value: '3_12' },
          { name: 'Anime - English-translated', value: '3_5' },
          { name: 'Anime - Non-English-translated', value: '3_13' },
          { name: 'Anime - Raw', value: '3_6' },
          { name: 'Audio', value: '2_' },
          { name: 'Audio - Lossless', value: '2_3' },
          { name: 'Audio - Lossy', value: '2_4' },
          { name: 'Literature', value: '4_' },
          { name: 'Literature - English-translated', value: '4_7' },
          { name: 'Literature - Non-English-translated', value: '4_14' },
          { name: 'Literature - Raw', value: '4_8' },
          { name: 'Live Action', value: '5_' },
          { name: 'Live Action - English-translated', value: '5_9' },
          { name: 'Live Action - Idol/Promotional Video', value: '5_10' },
          { name: 'Live Action - Non-English-translated', value: '5_18' },
          { name: 'Live Action - Raw', value: '5_11' },
          { name: 'Pictures', value: '6_' },
          { name: 'Pictures - Graphics', value: '6_15' },
          { name: 'Pictures - Photos', value: '6_16' },
          { name: 'Software', value: '1_' },
          { name: 'Software - Applications', value: '1_1' },
          { name: 'Software - Games', value: '1_2' }
        ]
      },
      {
        name: 'Category - Sukebei',
        key: 'c',
        options: [
          { name: 'All categories', value: '_' },
          { name: 'Art', value: '1_' },
          { name: 'Art - Anime', value: '1_1' },
          { name: 'Art - Doujinshi', value: '1_2' },
          { name: 'Art - Games', value: '1_3' },
          { name: 'Art - Manga', value: '1_4' },
          { name: 'Art - Pictures', value: '1_5' },
          { name: 'Real Life', value: '2_' },
          { name: 'Real Life - Photobooks and Pictures', value: '2_1' },
          { name: 'Real Life - Videos', value: '2_2' },
          { name: 'All categories', value: '_' },
          { name: 'Art', value: '1_' },
          { name: 'Art - Anime', value: '1_1' },
          { name: 'Art - Doujinshi', value: '1_2' },
          { name: 'Art - Games', value: '1_3' },
          { name: 'Art - Manga', value: '1_4' },
          { name: 'Art - Pictures', value: '1_5' },
          { name: 'Real Life', value: '2_' },
          { name: 'Real Life - Photobooks and Pictures', value: '2_1' },
          { name: 'Real Life - Videos', value: '2_2' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'tbody#torrentListResults > tr.torrent-info' },
      id: {
        selector: 'td:nth-child(2) > a',
        attr: 'href',
        filters: [
          (q:string) => parseInt(q.match(/(\d+)/)![0])
        ]
      },
      title: { selector: 'td:nth-child(2) > a' },
      url: { selector: 'td:nth-child(2) > a', attr: 'href' },
      link: { selector: 'td:nth-child(3) > a', attr: 'href' },
      time: { //  注意，我们仅适配了英文和中文环境
        selector: 'td:nth-child(8)',
        attr: 'title',
        filters: [
          (q:string) => {
            const normalTime = dayjs(q);
            if (/下午/.test(q)) {
              normalTime.add(12, 'hours');
            }
            return normalTime.valueOf();
          }
        ]
      },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(5)' },
      leechers: { selector: 'td:nth-child(6)' },
      completed: { selector: 'td:nth-child(7)' },
      category: { selector: 'td:nth-child(1) > div > a', attr: 'title' }
    }
  }
};
