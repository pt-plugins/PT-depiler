import { SiteMetadata } from '@/shared/interfaces/sites';
import { parseTimeToLive } from '@/shared/utils/filter';
import urlparse from 'url-parse';

export const siteMetadata: SiteMetadata = {
  name: 'Isohunt2',
  description: 'Isohunt2 is a Public torrent search engine for MOVIES / TV / GENERAL',
  url: 'https://isohunt.nz/',
  legacyUrl: [
    'https://isohunt.fun/',
    'https://isohunt.tv/',
    'https://isohunt.ch/'
  ],
  search: {
    requestConfig: { url: '/torrent/' },
    keywordsParam: 'ihq',
    categories: [
      {
        name: 'Category',
        key: 'iht',
        options: [
          { value: 0, name: 'All' },
          { value: 1, name: 'Anime' },
          { value: 2, name: 'Software' },
          { value: 3, name: 'Games' },
          { value: 4, name: 'Adult' },
          { value: 5, name: 'Movies' },
          { value: 6, name: 'Music' },
          { value: 7, name: 'Other' },
          { value: 8, name: 'Series & TV' },
          { value: 9, name: 'Books' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'table > tbody > tr[data-key="0"]' },
      id: {
        selector: 'td.title-row > a[href^="/torrent_details"]',
        attr: 'href',
        filters: [(q:string) => q.match(/torrent_details\/([^/])\//)![1]]
      },
      title: { selector: 'td.title-row > a[href^="/"] > span' },
      url: { selector: 'td.title-row > a[href^="/torrent_details"]', attr: 'href' },
      time: { selector: 'td.date-row', filters: [parseTimeToLive] },
      size: { selector: 'td.size-row' },
      seeders: { selector: 'td.sn' },
      category: { selector: 'td.category-row > span', attr: 'title' }
    },
    detail: {
      link: { selector: 'a.btn-magnet', attr: 'href', filters: [(q:string) => urlparse(q, true).query.url] }
    }
  }
};
