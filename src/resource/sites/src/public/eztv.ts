import { ISearchFilter, ISiteMetadata } from '../../types';
import { parseTimeToLive } from '@/shared/utils/filter';
import BittorrentSite from '../schema/AbstractBittorrentSite';
import { AxiosRequestConfig } from 'axios';

export const siteMetadata: ISiteMetadata = {
  name: 'EZTV',
  description: 'EZTV is a Public torrent site for TV shows',
  url: 'https://eztv.re/',
  legacyUrl: [
    'https://eztv.wf/',
    'https://eztv.tf/',
    'https://eztv.yt/'
  ],
  search: {
    requestConfig: { url: '/search/' },
    keywordsParam: 'keywords'
  },
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
};

// noinspection JSUnusedGlobalSymbols
export default class Eztv extends BittorrentSite {
  protected override async transformSearchFilter (filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords ? `/search/${filter.keywords}` : '/';
    return config;
  }
}
