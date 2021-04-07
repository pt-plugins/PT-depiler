import { SiteMetadata } from '@/shared/interfaces/sites'
import BittorrentSite from '@/background/sites/schema/AbstractBittorrentSite'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { sleep } from '@/shared/utils/common'
import dayjs from '@/shared/utils/dayjs'

const appName = 'PTPP'

export const siteMetadata: SiteMetadata = {
  name: 'RARBG',
  description: 'RARBG is a Public torrent site for MOVIES / TV / GENERAL',
  url: 'https://rarbg.to/',
  search: {
    requestConfig: { responseType: 'json' },
    keywordsParam: 'search_string',
    defaultParams: [
      { key: 'mode', value: 'search' },
      { key: 'format', value: 'json_extended' }, // format json_extended returns a lot more info about the torrent.
      /**
       * By default the api will return only ranked torrents ( internal ) , scene releases + -rarbg releases + -rartv releases.
       * If you want other groups included in the results use the ranked parameter with a value of 0 to get them included.
       */
      { key: 'ranked', value: 0 }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'torrent_results' },
      id: { selector: 'info_page', filters: [(q:string) => q.match(/_([a-zA-Z0-9]+)$/)![1]] },
      title: { selector: 'title' },
      url: { selector: 'info_page', filters: [(q:string) => `${q}&app_id=${appName}`] },
      link: { selector: 'download' },
      time: { selector: 'pubdate', filters: [(q:string) => dayjs(q).unix()] },
      size: { selector: 'size' },
      seeders: { selector: 'seeders' },
      leechers: { selector: 'leechers' },
      category: { selector: 'category' }

    }
  }
}

// noinspection JSUnusedGlobalSymbols
export default class Rarbg extends BittorrentSite {
  // docs: https://torrentapi.org/apidocs_v2.txt?app_id=PTPP
  private readonly apiPoint = 'https://torrentapi.org/pubapi_v2.php'

  private _token?: string;
  private _tokenExpired?: number;

  private async getApiToken (): Promise<string> {
    if (
      !this._token || // 未生成过 token
      !this._tokenExpired || // 未生成过 token
      this._tokenExpired <= Date.now() // Token Expired
    ) {
      const { data } = await axios.get<{ token: string }>(this.apiPoint, {
        params: { get_token: 'get_token', app_id: appName }
      })
      this._token = data.token
      this._tokenExpired = Date.now() + 10 * 60 * 1e3 // 10 minutes, though the real is `expire in 15 minutes`.
    }
    return this._token
  }

  async request<T> (axiosConfig: AxiosRequestConfig, retry:Boolean = true): Promise<AxiosResponse> {
    axiosConfig.url = this.apiPoint
    axiosConfig.params.token = await this.getApiToken()
    axiosConfig.params.app_id = appName
    axiosConfig.responseType = 'json'

    await sleep(3e3) // The api has a 1req/2s limit, so we force sleep 3s before request
    let resp = await super.request<T>(axiosConfig)

    const errorCode = parseInt(resp.data.error_code || '0')
    switch (errorCode) {
      case 2:
      case 4: // invalid token
        this._tokenExpired = Date.now()
        resp = await this.request<T>(axiosConfig)
        break
      case 20: // no results found
        // the api returns "no results" in some valid queries. (Mostly happened on same keywords re-search)
        // we do one retry on this case but we can't do more
        // because we can't distinguish between search without results and api malfunction
        if (retry) {
          resp = await this.request<T>(axiosConfig, false)
        }
    }

    return resp
  }
}
