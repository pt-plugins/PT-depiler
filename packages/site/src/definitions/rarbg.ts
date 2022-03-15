import type { ISiteMetadata } from "../types";
import BittorrentSite from "../schema/AbstractBittorrentSite";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { sleep } from "@ptpp/util/filter";

const appName = "PTPP";

export const siteMetadata: ISiteMetadata = {
  name: "RARBG",
  type: "public",
  description: "RARBG is a Public torrent site for MOVIES / TV / GENERAL",
  url: "https://rarbg.to/",
  search: {
    requestConfig: {
      responseType: "json",
      params: {
        mode: "search",
        format: "json_extended", // format json_extended returns a lot more info about the torrent.
        /**
         * By default the api will return only ranked torrents ( internal ) , scene releases + -rarbg releases + -rartv releases.
         * If you want other groups included in the results use the ranked parameter with a value of 0 to get them included.
         */
        ranked: 0,
      },
    },
    keywordsParam: "search_string",
    selectors: {
      rows: { selector: "torrent_results" },
      id: {
        selector: "info_page",
        filters: [(q: string) => q.match(/_([a-zA-Z0-9]+)$/)![1]],
      },
      title: { selector: "title" },
      url: {
        selector: "info_page",
        filters: [(q: string) => `${q}&app_id=${appName}`],
      },
      link: { selector: "download" },
      time: { selector: "pubdate" },
      size: { selector: "size" },
      seeders: { selector: "seeders" },
      leechers: { selector: "leechers" },
      category: { selector: "category" },
    },
  },
};

interface errorResp {
  error: string;
  error_code: number;
}

interface rawTorrent {
  filename: string;
  category: string;
  download: string;
}

interface rawExtendTorrent extends rawTorrent {
  seeders: number;
  leechers: number;
  size: number;
  pubdate: string;
  episode_info: {
    imdb: string | null;
    tvrage: string | null;
    tvdb: string | null;
    themoviedb: string | null;
  };
  ranked: 0 | 1;
  info_page: string;
}

interface torrentResp<T extends rawTorrent> {
  torrent_results: T[];
}

// noinspection JSUnusedGlobalSymbols
export default class Rarbg extends BittorrentSite {
  // docs: https://torrentapi.org/apidocs_v2.txt?app_id=PTPP
  private readonly apiPoint = "https://torrentapi.org/pubapi_v2.php";

  private _token?: string;
  private _tokenExpired?: number;

  private async getApiToken(): Promise<string> {
    if (
      !this._token || // 未生成过 token
      !this._tokenExpired || // 未生成过 token
      this._tokenExpired <= Date.now() // Token Expired
    ) {
      const { data } = await axios.get<{ token: string }>(this.apiPoint, {
        params: { get_token: "get_token", app_id: appName },
      });
      this._token = data.token;
      this._tokenExpired = Date.now() + 10 * 60 * 1e3; // 10 minutes, though the real is `expire in 15 minutes`.
    }
    return this._token;
  }

  override async request<T>(
    axiosConfig: AxiosRequestConfig = {},
    retry: boolean = true
  ): Promise<AxiosResponse<T>> {
    axiosConfig.url = this.apiPoint;
    axiosConfig.params.token = await this.getApiToken();
    axiosConfig.params.app_id = appName;
    axiosConfig.responseType = "json";

    await sleep(3e3); // The api has a 1req/2s limit, so we force sleep 3s before request
    let resp = await super.request<T>(axiosConfig);

    const errorCode = (resp.data as unknown as errorResp).error_code || 0;
    switch (errorCode) {
      case 2:
      case 4: // invalid token
        this._tokenExpired = Date.now();
        resp = await this.request<T>(axiosConfig);
        break;
      case 20: // no results found
        // the api returns "no results" in some valid queries. (Mostly happened on same keywords re-search)
        // we do one retry on this case but we can't do more
        // because we can't distinguish between search without results and api malfunction
        if (retry) {
          resp = await this.request<T>(axiosConfig, false);
        }
    }

    return resp as AxiosResponse<T>;
  }
}
