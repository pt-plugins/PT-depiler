import { ISearchFilter, ISiteMetadata } from '../../types';
import BittorrentSite from '../schema/AbstractBittorrentSite';
import { AxiosRequestConfig } from 'axios';

export const siteMetadata: ISiteMetadata = {
  name: 'AnimeClipse',
  description: 'AnimeClipse is a Public site for Hellenic Fansubs Anime.',
  timezoneOffset: '+0200',
  url: 'http://www.animeclipse.com/',
  search: {
    requestConfig: {
      url: '/index.php',
      params: {
        ind: 'btitracker',
        active: 0,
        category: 0,
        tor_page: 50
      }
    },
    keywordsParam: 'search',
    categories: [
      {
        name: 'Category',
        key: 'category',
        options: [
          { name: '----', value: '0' },
          { name: 'Area 88', value: '16' },
          { name: 'Black Lagoon', value: '13' },
          { name: 'Bleach', value: '11' },
          { name: 'Broken Blade', value: '137' },
          { name: 'Candy Candy', value: '14' },
          { name: 'Claymore', value: '20' },
          { name: 'Danshi Koukousei no Nichijou', value: '156' },
          { name: 'Darker than Black', value: '22' },
          { name: 'Death Note', value: '19' },
          { name: 'Devil May Cry', value: '129' },
          { name: 'Dragonball Kai', value: '29' },
          { name: 'Elfen Lied', value: '1' },
          { name: 'Ergo Proxy', value: '15' },
          { name: 'Fairy Tail', value: '30' },
          { name: 'Ghost in the Shell: Arise', value: '135' },
          { name: 'Golden Boy', value: '5' },
          { name: 'Great Teacher Onizuka', value: '26' },
          { name: 'Gungrave', value: '18' },
          { name: 'Hajime no ippo', value: '24' },
          { name: 'Highschool Of The Dead', value: '126' },
          { name: 'Hunter X Hunter', value: '130' },
          { name: 'Karas', value: '12' },
          { name: 'Kenja no Mago', value: '155' },
          { name: 'Movies', value: '8' },
          { name: 'Plawres Sanshiro', value: '2' },
          { name: 'Robin Hood no Daibouken', value: '32' },
          { name: 'Rurouni Kenshin', value: '10' },
          { name: 'SDF Macross', value: '131' },
          { name: 'Seirei No Moribito', value: '21' },
          { name: 'Shinrei Tantei Yakumo', value: '128' },
          { name: 'Soul Eater', value: '28' },
          { name: 'Suisei no Gargantia', value: '133' },
          { name: 'Sword Art Online', value: '154' },
          { name: 'Uchuu Kaizoku Captain Harlock', value: '127' },
          { name: 'UFO Robo Grendizer', value: '31' }
        ]
      },
      {
        name: 'Status',
        key: 'active',
        options: [
          { name: 'ALL', value: '0' },
          { name: 'Active Only', value: '1' },
          { name: 'Dead Only', value: '2' }
        ]
      },
      {
        name: 'Sort',
        key: 'order',
        options: [
          { name: 'Date Added', value: 'added' },
          { name: 'Category', value: 'cname' },
          { name: 'Size', value: 'size' },
          // 以下三个在请求时需要被转化为 &active= 所以如果传入这几个的话，Status的值会被覆盖
          { name: 'Completed', value: '5' },
          { name: 'Seeders', value: '3' },
          { name: 'Leechers', value: '4' }
        ]
      },
      {
        name: 'Order',
        key: 'by',
        options: [
          { name: 'Descending', value: 'DESC' },
          { name: 'Ascending', value: 'ASC' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'tr.torrentRow' },
      id: { selector: 'a[href*="/download/"][title]', attr: 'title', filters: [(q:string) => q.replace('Download:', '')] },
      title: { selector: 'a[href*="/download/"][title]', attr: 'title', filters: [(q:string) => q.replace('Download:', '')] },
      url: { text: 'http://www.animeclipse.com/' },
      link: { selector: 'a[href*="/download/"]', attr: 'href' },
      time: { selector: 'td:nth-child(2) > table:nth-child(2) td:nth-child(2) span.torrentInfoData' },
      size: { selector: 'td:nth-child(2) > table:nth-child(2) td:nth-child(1) span.torrentInfoData' },
      seeders: { selector: 'td:nth-child(2) > table:nth-child(2) td:nth-child(5) span.torrentInfoData' },
      leechers: { selector: 'td:nth-child(2) > table:nth-child(2) td:nth-child(6) span.torrentInfoData' },
      completed: { selector: 'td:nth-child(2) > table:nth-child(2) td:nth-child(4) span.torrentInfoData' }
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default class Animeclipse extends BittorrentSite {
  protected override async transformSearchFilter (filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const extraSortParamsIndex = filter.extraParams
      ?.findIndex(v => v.key === 'order' && ['3', '4', '5'].includes(v.value as string));

    if (extraSortParamsIndex && extraSortParamsIndex > -1) {
      const extraSortParams = filter.extraParams![extraSortParamsIndex];
      extraSortParams.key = 'active';
      filter.extraParams?.splice(extraSortParamsIndex, 1);
      filter.extraParams?.push(extraSortParams);
    }

    return await super.transformSearchFilter(filter);
  }
}
