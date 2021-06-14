import { ISearchFilter, ISiteMetadata } from '../../types';
import BittorrentSite from '../schema/AbstractBittorrentSite';
import { AxiosRequestConfig } from 'axios';
import { parseTimeToLive } from '@/shared/utils/filter';

// FIXME Cloudflare DDoS Protect
export const siteMetadata: ISiteMetadata = {
  name: 'BTDB',
  description: 'BTDB is a Public BitTorrent DHT search engine.',
  url: 'https://btdb.eu/',
  legacyUrl: [
    'https://btdb.to/'
  ],
  selector: {
    search: {
      rows: { selector: 'div.media' },
      id: { selector: 'h2.item-title a', attr: 'href', filters: [(q:string) => q.match(/([^/]+)$/)![1]] },
      title: { selector: 'h2.item-title a', attr: 'title' },
      url: { selector: 'h2.item-title a', attr: 'href' },
      link: { selector: ['a[href^="magnet:?xt="]', 'a[href$=".torrent"]'], attr: 'href' },
      time: { selector: 'small:nth-of-type(5) strong', filters: [parseTimeToLive] },
      size: { selector: 'small:nth-of-type(1) strong' },
      seeders: { selector: 'small:nth-of-type(3) strong' },
      leechers: { selector: 'small:nth-of-type(4) strong' },
      category: { text: 'Other' }
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default class BtDB extends BittorrentSite {
  protected override async transformSearchFilter (filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords ? `/search/${filter.keywords}/` : '/recent';

    return config;
  }
}
