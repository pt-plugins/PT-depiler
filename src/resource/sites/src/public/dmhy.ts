import { ISiteMetadata } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: '動漫花園資源網',
  description: '動漫花園資訊網是一個動漫愛好者交流的平台,提供最及時,最全面的動畫,漫畫,動漫音樂,動漫下載,BT,ED,動漫遊戲,資訊,分享,交流,讨论.',
  url: 'https://share.dmhy.org/',
  timezoneOffset: '+0800', // CST
  search: {
    requestConfig: {
      url: '/topics/list',
      params: {
        sort_id: 0,
        team_id: 0,
        order: 'date-desc'
      }
    },
    keywordsParam: 'keyword',
    categories: [
      {
        name: '分類',
        key: 'sort_id',
        options: [
          { name: '全部', value: '0' },
          { name: '動畫', value: '2' },
          { name: '季度全集', value: '31' },
          { name: '漫畫', value: '3' },
          { name: '港台原版', value: '41' },
          { name: '日文原版', value: '42' },
          { name: '音樂', value: '4' },
          { name: '動漫音樂', value: '43' },
          { name: '同人音樂', value: '44' },
          { name: '流行音樂', value: '15' },
          { name: '日劇', value: '6' },
          { name: 'ＲＡＷ', value: '7' },
          { name: '遊戲', value: '9' },
          { name: '電腦遊戲', value: '17' },
          { name: '電視遊戲', value: '18' },
          { name: '掌機遊戲', value: '19' },
          { name: '網絡遊戲', value: '20' },
          { name: '遊戲周邊', value: '21' },
          { name: '特攝', value: '12' },
          { name: '其他', value: '1' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table tbody tr:has(a[href^="magnet:?"])' },
      id: { selector: 'a[href^="/topics/view/"]', attr: 'href', filters: [(q:string) => q.match(/\/view\/(\d+)/)![1]] },
      title: { selector: 'a[href^="/topics/view/"]' },
      url: { selector: 'a[href^="/topics/view/"]', attr: 'href' },
      // 种子链接只有到页面中才能获取、虽然也可以通过发布时间+magnet链接中的hash构造，但似乎并没有太多必要
      link: { selector: 'a[href^="magnet:?"]', attr: 'href' },
      time: { selector: 'td:nth-child(1) span' },
      size: { selector: 'td:nth-child(5)' },
      // 从某个时间段开始，这三个 （種子，下載，完成） 就一直不显示
      seeders: { selector: 'td:nth-child(6)' },
      leechers: { selector: 'td:nth-child(7)' },
      completed: { selector: 'td:nth-child(8)' },
      category: { selector: 'td:nth-child(2) a' },
      author: { selector: 'td:nth-child(9) a' }
    }
  }
};
