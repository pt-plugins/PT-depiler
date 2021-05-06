import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: 'AniRena',
  description: 'AniRena is a Public torrent tracker for the latest anime and Japanese related torrents',
  url: 'https://www.anirena.com/',
  search: {
    keywordsParam: 's'
  },
  selector: {
    search: {
      rows: { selector: 'div.full2:not([id]) table tr' },
      id: { selector: 'div.torrents_small_info_data1 a[nohref]', attr: 'onClick', filters: [(q:string) => q.match(/details(\d+)/)![1]] },
      title: { selector: 'div.torrents_small_info_data1 a[nohref]', attr: 'title' },
      url: { text: 'https://www.anirena.com/' }, // 这个站没有种子详情页面，都是直接加载到列表中的
      link: { selector: 'div.torrents_small_info_data2b a[title!="Report a torrent"]', attr: 'href' },
      // 发布时间 动态加载，不做获取
      size: { selector: 'td.torrents_small_size_data1' },
      seeders: { selector: 'td.torrents_small_seeders_data1' },
      leechers: { selector: 'td.torrents_small_leechers_data1' },
      completed: { selector: 'td.torrents_small_downloads_data1' },
      category: { selector: 'td.torrents_small_type_data1 img', attr: 'title' }
    }
  }
};
