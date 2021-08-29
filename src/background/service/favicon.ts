/**
 * 获取站点图标的方法
 *
 * 我们不用很在意 Favicon 的本地缓存情况，因为这部分可以随时重新获取，所以直接用 localforage 就行了
 * 程序按照如下顺序获取Favicon：
 *   1. localforage 中已有的 base64 缓存（根据站点的 host 值）
 *   2. ISiteMetadata 中定义的 favicon 字段
 *   3. './public/assets/sites' 目录中是否存在对应 png 文件
 *       （主要方便 以解压缩形式安装的用户覆写 以及部分教育网站点可能需要特殊方法访问的情况 ）
 *   4. 请求网站首页，并从返回的html中解析所需要的 favicion 字段
 *   5. 使用 NO_IMAGE 替代
 *
 * special thanks to: https://github.com/spro/get-website-favicon/tree/master/lib/origin
 */

import axios from 'axios';
import * as localforage from 'localforage';
import browser from 'webextension-polyfill';
import BittorrentSite from '@ptpp/sites/src/schema/AbstractBittorrentSite';
import urlparse from 'url-parse';

// from: https://stackoverflow.com/a/9967193/8824471
// from: http://proger.i-forge.net/%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80/[20121112]%20The%20smallest%20transparent%20pixel.html
const NO_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';

const FAVICON_FROM_LINK = [
  "link[rel='icon' i][href]",
  "link[rel='shortcut icon' i][href]",
  "link[rel='apple-touch-icon' i][href]",
  "link[rel='apple-touch-icon-precomposed' i][href]",
  "link[rel='apple-touch-startup-image' i][href]",
  "link[rel='fluid-icon' i][href]"
  // "meta[name='msapplication-TileImage' i][content]"
];

interface IParsedFavicon {
  href: string,
  sizes: string | `${string}x${string}`,
  source: 'manifest' | 'link' | 'favicon',
  blob?: Blob
}

class Favicon {
  private cache: LocalForage;

  constructor () {
    this.cache = localforage.createInstance({
      name: 'Favicon'
    });
  }

  public async removeCachedItem (host: string) {
    return await this.cache.removeItem(host);
  }

  public async clearCache () {
    return await this.cache.clear();
  }

  public async getFavicon (site: BittorrentSite): Promise<string> {
    const siteHost = site.config.host!;

    // 1. localforage 中已有的 base64 缓存（根据站点的 host 值）
    const lfCache = await this.cache.getItem<string>(siteHost);
    if (lfCache) {
      return lfCache;
    }

    let faviconMeta;

    // 2. ISiteMetadata 中定义的 favicon 字段
    if (site.config.favicon) {
      if (site.config.favicon.startsWith('data:image/')) {
        return site.config.favicon;
      } else {
        try {
          const configReq = await axios.get(site.config.favicon, { responseType: 'blob' });
          faviconMeta = configReq.data;
        } catch {
        }
      }
    }

    // 3. './public/assets/sites' 目录中是否存在对应 png 文件 （主要方便以解压缩形式安装的用户覆写）
    if (!faviconMeta) {
      const assetLoc = browser.runtime.getURL(`assets/sites/${siteHost}.png`);
      try {
        const configReq = await axios.get(assetLoc, { responseType: 'blob' });
        faviconMeta = configReq.data;
      } catch {
      }
    }

    // 4. 请求网站首页，并从返回的html中解析所需要的 favicion 字段
    if (!faviconMeta) {
      try {
        const siteBaseUrl = site.activateUrl || site.config.url;
        faviconMeta = await this.getFaviconFromUrl(siteBaseUrl);
      } catch {
      }
    }

    // 5. 使用 NO_IMAGE 替代
    let faviconBase64 = NO_IMAGE;

    // 将 faviconMeta 转成 base64
    if (faviconMeta) {
      try {
        faviconBase64 = await this.transformBlob(faviconMeta);
      } catch {
      }
    }

    await this.cache.setItem(site.config.url, faviconBase64);

    return faviconBase64;
  }

  public async getFaviconFromUrl (url: string): Promise<Blob> {
    const baseUrl = urlparse(url);

    const { data: doc } = await axios.get<Document>(url, { responseType: 'document' });

    const favicons : IParsedFavicon[] = [];

    // 1. Parse from head
    FAVICON_FROM_LINK.forEach(selector => {
      const element = doc.querySelector(selector) as HTMLLinkElement;
      if (element) {
        favicons.push({
          href: element.href,
          sizes: element.sizes?.toString() || '',
          source: 'link'
        } as IParsedFavicon);
      }
    });

    // 2. Parse from manifest
    const manifestElement = doc.querySelector('head link[rel="manifest" i]') as HTMLLinkElement;
    if (manifestElement) {
      const { data: manifest } = await axios.get<{
        icons: Record<'sizes' | 'src' |'type', string>[]
      }>(manifestElement.href, { responseType: 'json' });

      manifest.icons.forEach(({ sizes, src }) => {
        favicons.push({
          href: src,
          sizes,
          source: 'manifest'
        } as IParsedFavicon);
      });
    }

    // 3. Default /favicon.ico
    try {
      const faviconIco = await axios.get<Blob>('/favicon.ico', {
        baseURL: baseUrl.origin,
        responseType: 'blob'
      });
      if (faviconIco && faviconIco.data?.type === 'image/x-icon') {
        favicons.push({
          href: '/favicon.ico',
          sizes: '',
          source: 'favicon',
          blob: faviconIco.data
        } as IParsedFavicon);
      }
    } catch (e) {
    }

    // 如果前面获取到足够的 favicons，我们需要比较下哪个更合适，并排序
    if (favicons.length > 0) {
      const rankedFavicons : (IParsedFavicon & {rank: number})[] = favicons.map(icon => { // 计算每一个favicon的评分
        let rank = 0;

        // 大小，从 sizes 中读取，如果没有则该项权重为 0
        if (icon.sizes) {
          const wh = icon.sizes.split('x');
          if (wh.length > 1 && wh[0] === wh[1]) {
            const size = parseInt(wh[0]);
            let baseRank = 0;

            if (size === 256) baseRank = 10; // 优先使用 128 或 256 的
            else if (size === 128) baseRank = 8;
            else if (size > 88 && size < 260) baseRank = 4;
            else if (size > 36 && size < 90) baseRank = 3;
            else if (size > 24 && size < 40) baseRank = 2;
            else if (size > 15 && size < 26) baseRank = 1;

            rank += baseRank * 100;
          }
        }

        // 图片类型，按照 png > jpg > ico 顺序
        const iconTypes = [/\.ico$/im, /\.jpg$/im, /\.png$/im];
        for (const iconTypeKey in iconTypes) {
          rank += iconTypes[iconTypeKey].test(icon.href) ? parseInt(iconTypeKey) * 10 : 0;
        }

        // 来源， 按照 manifest > link > favicon 顺序
        if (icon.source === 'manifest') {
          rank += 2;
        } else if (icon.source === 'link') {
          rank += 1;
        }

        return {
          ...icon,
          rank
        };
      }).sort((a, b) => a.rank < b.rank ? 1 : -1);

      // 选择排序后第一个图标作为我们需要的图标
      for (let i = 0; i < rankedFavicons.length; i++) {
        const usedFavicons = rankedFavicons[i];
        if (usedFavicons.blob) {
          return usedFavicons.blob;
        } else {
          try {
            let faviconUrl = usedFavicons.href;
            if (faviconUrl.startsWith('//')) {
              faviconUrl = `${baseUrl.protocol}${faviconUrl}`;
            } else if (faviconUrl.startsWith('/')) {
              faviconUrl = `${baseUrl.origin}${faviconUrl}`;
            }

            const { data } = await axios.get(faviconUrl, { responseType: 'blob' });
            return data;
          } catch {
          }
        }
      }
    }

    throw new Error("Can't find any favicons from this site");
  }

  // FIXME 转成公共函数 BlobToBase64
  private transformBlob (blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          reject(new Error('Error when parse favicon Blob'));
        }
      });

      reader.readAsDataURL(blob);
    });
  }
}

export default new Favicon();
