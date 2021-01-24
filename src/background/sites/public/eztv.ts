import { SiteMetadata } from '@/shared/interfaces/sites'
import { parseTimeToLive } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'EZTV',
  description: 'EZTV is a Public torrent site for TV shows',
  url: 'https://eztv.re/',
  legacyUrl: [
    'https://eztv.wf/',
    'https://eztv.tf/',
    'https://eztv.yt/'
  ],
  selector: {
    search: {
      rows: { selector: 'table.forum_header_border tr[name="hover"].forum_header_border:has(a.magnet)' },
      id: { selector: 'td:nth-child(2) a', attr: 'href', filters: [(q:string) => q.match(/\/ep\/(\d+)/)![1]] },
      title: {
        selector: 'td:nth-child(2) a',
        attr: 'title',
        filters: [
          (q:string) => q.replace('[eztv]', '').replace(/\(.*\)$/, '')]
      },
      url: { selector: 'td:nth-child(2) a', attr: 'href' },
      link: { selector: 'td:nth-child(3) a.magnet, td:nth-child(3) a', attr: 'href' },
      time: { selector: 'td:nth-child(5)', filters: [parseTimeToLive] },
      size: { selector: 'td:nth-child(4)' },
      seeders: { selector: 'td:nth-child(6)' }
    }
  }
}
