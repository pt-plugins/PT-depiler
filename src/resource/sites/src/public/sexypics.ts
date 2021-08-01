import { ISearchFilter, ISiteMetadata } from '../../types';
import BittorrentSite from '../schema/AbstractBittorrentSite';
import { AxiosRequestConfig } from 'axios';

export const siteMetadata: ISiteMetadata = {
  name: 'Sexy-Pics',
  description: 'Sexy-Pics is a Public Magnet Links site for 3X MP4',
  url: 'https://www.sexy-pics.us/',
  search: {
    selectors: {
      rows: { selector: 'tr:has(td.m)' },
      id: { selector: 'td.n a', attr: 'href', filters: [(q:string) => q.match(/\/file\/(\d+)/)![1]] },
      title: { selector: 'td.n a', attr: 'title' },
      url: { selector: 'td.n a', attr: 'href' },
      link: { selector: 'td.m a', attr: 'href' },
      time: { selector: 'td:nth-child(3)', filters: [{ name: 'parseTTL' }] },
      size: { selector: 'td:nth-child(6)' },
      seeders: { selector: 'td.s' },
      leechers: { selector: 'td.l' }
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default class Sexypics extends BittorrentSite {
  protected override async transformSearchFilter (filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords ? `/${filter.keywords.charAt(0)}/${filter.keywords}` : '/browse/all/';
    return config;
  }
}
