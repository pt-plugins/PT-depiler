import { SiteMetadata } from '@/shared/interfaces/sites';
import { parseTimeToLive } from '@/shared/utils/filter';

export const siteMetadata: SiteMetadata = {
  name: 'MyPornClub',
  description: 'MyPornClub is a Public Torrent Tracker for 3X',
  url: 'https://myporn.club/',
  selector: {
    search: {
      rows: { selector: 'div.torrents_list > div.torrent_element' },
      id: { selector: 'a[href^="/torrent/"]', attr: 'href', filters: [(q:string) => q.match(/\/torrent\/([a-zA-Z0-9]+)/)![1]] },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: 'href' },
      time: {
        selector: 'div.torrent_element_info span:nth-child(2)',
        filters: [
          (q:string) => q.replace('Last year', '1 year ago').replace('Last month', '1 month ago'),
          parseTimeToLive
        ]
      },
      size: { selector: 'div.torrent_element_info span:nth-child(4)' },
      seeders: { selector: 'div.torrent_element_info span:nth-child(10)' },
      leechers: { selector: 'div.torrent_element_info span:nth-child(12)' },
      completed: { selector: 'div.torrent_element_info span:nth-child(8)' },
      category: { text: 'XXX' },
      author: { selector: 'span.uploader_nick', filters: [(q:string) => q.replace(' >', '')] }
    },
    detail: {
      link: { selector: 'div.torrent_download_div > a', attr: 'href' }
    }
  }
};
