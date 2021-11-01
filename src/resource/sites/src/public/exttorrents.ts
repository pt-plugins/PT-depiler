import { ISearchFilter, ISiteMetadata, ITorrent } from '../../types';
import BittorrentSite from '../schema/AbstractBittorrentSite';
import { AxiosRequestConfig } from 'axios';

const CategoryMap = new Map([
  ['/anime/', 'Anime'],
  ['/anime/english-translated/', 'Anime English Translated'],
  ['/applications/', 'Apps'],
  ['/applications/android/', 'Apps Android'],
  ['/applications/ios/', 'Apps iOS'],
  ['/applications/linux/', 'Apps Linux'],
  ['/applications/mac/', 'Apps Mac'],
  ['/applications/other-applications/', 'Apps Other'],
  ['/applications/windows/', 'Apps Windows'],
  ['/books/', 'Books'],
  ['/books/audio-books/', 'Books Audiobooks'],
  ['/books/comics/', 'Books Comics'],
  ['/books/ebooks/', 'Books Ebooks'],
  ['/games/', 'Games'],
  ['/games/nds/', 'Games NDS'],
  ['/games/other-games/', 'Games Other'],
  ['/games/pc-games/', 'Games PC'],
  ['/games/ps3/', 'Games PS3'],
  ['/games/ps4/', 'Games PS4'],
  ['/games/psp/', 'Games PSP'],
  ['/games/switch/', 'Games Switch'],
  ['/games/wii/', 'Games Wii'],
  ['/games/xbox360/', 'Games Xbox360'],
  ['/movies/', 'Movies'],
  ['/movies/3d-movies/', 'Movies 3D'],
  ['/movies/bollywood/', 'Movies Bollywood'],
  ['/movies/documentary/', 'Movies Documentary'],
  ['/movies/dubbed-movies/', 'Movies Dubbed'],
  ['/movies/dvd/', 'Movies DVD'],
  ['/movies/highres-movies/', 'Movies Highres'],
  ['/movies/mp4/', 'Movies MP4'],
  ['/movies/ultrahd/', 'Movies UltraHD'],
  ['/music/', 'Music'],
  ['/music/aac/', 'Music AAC'],
  ['/music/lossless/', 'Music Lossless'],
  ['/music/mp3/', 'Music MP3'],
  ['/music/other-music/', 'Music Other'],
  ['/music/radio-shows/', 'Music Radio Shows'],
  ['/other/', 'Other'],
  ['/tv/', 'TV'],
  ['/xxx/', 'XXX'],
  ['/xxx/games/', 'XXX Games'],
  ['/xxx/hentai/', 'XXX Hentai'],
  ['/xxx/magazines/', 'XXX Magazines'],
  ['/xxx/pictures/', 'XXX Pictures'],
  ['/xxx/video/', 'XXX Video']
]);

export const siteMetadata: ISiteMetadata = {
  name: 'EXT Torrents',
  description: 'EXT Torrents is a Public torrent site for MOVIES / TV / GENERAL',
  url: 'https://ext.to/',
  legacyUrl: [
    'https://torrent.extto.com/',
    'https://ext.torrentbay.to/'
  ],
  search: {
    requestConfig: { url: '/search/' },
    keywordsParam: 'q',
    categories: [
      {
        name: 'Category',
        key: 'c',
        options: [
          { name: 'ALL', value: '' },
          { name: 'MOVIES', value: 'movies' },
          { name: 'TV', value: 'tv' },
          { name: 'MUSIC', value: 'music' },
          { name: 'GAMES', value: 'games' },
          { name: 'APPS', value: 'applications' },
          { name: 'BOOKS', value: 'books' },
          { name: 'ANIME', value: 'anime' },
          { name: 'OTHER', value: 'other' }
        ]
      }
    ],
    selectors: {
      rows: { selector: 'table.table-striped > tbody > tr' },
      id: { selector: 'td:nth-child(1) div.float-left a', attr: 'href', filters: [(q:string) => q && q.match(/-(\d+)\/?$/)![1]] },
      title: { selector: 'td:nth-child(1) div.float-left a' },
      url: { selector: 'td:nth-child(1) div.float-left a', attr: 'href' },
      // 当且仅有torrents时，列表页才有种子文件链接存在，不然我们走details页面获取magnet链接
      link: { selector: 'td:nth-child(1) div.float-right a.torrent-dwn', attr: 'href' },
      time: { selector: 'td:nth-child(4)', filters: [{ name: 'parseTTL' }] },
      size: { selector: 'td:nth-child(2)' },
      seeders: { selector: 'td:nth-child(5)' },
      leechers: { selector: 'td:nth-child(6)' },
      category: { selector: 'td:nth-child(1) div.related-posted a:last-of-type', attr: 'href', filters: [(q:string) => CategoryMap.get(q)] }
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default class Exttorrents extends BittorrentSite {
  protected override async transformSearchFilter (filter: ISearchFilter = {}): Promise<AxiosRequestConfig> {
    const config = await super.transformSearchFilter(filter);
    config.url = filter.keywords ? '/search/' : '/latest/';

    return config;
  }

  override async getTorrentDownloadLink (torrent: ITorrent): Promise<string> {
    let link = torrent.link;
    if (!link) {
      const { data } = await this.request({ url: torrent.url, responseType: 'document' });
      link = this.getFieldData(<Document>data, { selector: 'a.download-btn:last-of-type', attr: 'href' });
    }

    return link;
  }
}
