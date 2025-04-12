/**
 * 获取站点图标的方法
 *
 * 我们不用很在意 Favicon 的本地缓存情况，因为这部分可以随时重新获取，所以直接用 localforage 就行了
 * 程序按照如下顺序获取Favicon：
 *   1. '../icons' 目录中是否存在对应 png 或 ico 文件 `${config.id}.${"png" | "ico"}`
       注意：1. 主要方便 以解压缩形式安装的用户覆写 以及部分教育网站点可能需要特殊方法访问的情况
            2. 此时，ISiteMetadata 中定义的 favicon 字段配置项不起作用，强制刷新缓存不起作用（本地硬配置优先）
 *   2. localforage 中已有的 base64 缓存（根据站点的 host 值）
 *   3. ISiteMetadata 中定义的 favicon 字段
 *   4. 请求网站首页，并从返回的html中解析所需要的 favicion 字段
 *   5. 使用 NO_IMAGE 替代
 *
 * special thanks to: https://github.com/spro/get-website-favicon/tree/master/lib/origin
 */

import axios from "axios";
import { ISiteMetadata } from "../types";

// from: https://stackoverflow.com/a/9967193/8824471
// from: http://proger.i-forge.net/%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80/[20121112]%20The%20smallest%20transparent%20pixel.html
export const NO_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

const FAVICON_FROM_LINK = [
  "link[rel='icon' i][href]",
  "link[rel='shortcut icon' i][href]",
  "link[rel='apple-touch-icon' i][href]",
  "link[rel='apple-touch-icon-precomposed' i][href]",
  "link[rel='apple-touch-startup-image' i][href]",
  "link[rel='fluid-icon' i][href]",
  // "meta[name='msapplication-TileImage' i][content]"
];

interface IParsedFavicon {
  href: string;
  sizes: string | `${string}x${string}`;
  source: "manifest" | "link" | "favicon";
  blob?: Blob;
}

const remoteBetterFaviconOrder = [
  {
    key: "source", // favicon.ico - 2
    rank: (item: IParsedFavicon) => {
      const rule = ["favicon", "link", "manifest"].reverse();
      let rank = 0;
      for (const n in rule) {
        rank += rule[n] === item.source ? parseInt(n) : 0;
      }
      return rank;
    },
  },
  {
    // favicon.ico - 3
    key: "ext",
    rank: (item: IParsedFavicon) => {
      const rule = [/\.ico$/im, /\.png$/im, /\.jpg$/im, /\.svg$/im].reverse();
      let rank = 0;
      for (const n in rule) {
        rank += rule[n].test(item.href) ? parseInt(n) : 0;
      }
      return rank;
    },
  },
  {
    key: "sizes",
    rank: (item: IParsedFavicon) => {
      let rank = 0;
      if (!item.sizes) return rank;
      const wh = item.sizes.split("x");
      const size = parseInt(wh[0]);
      if (wh[0] != wh[1]) return rank;
      if (size > 24 && size < 40) {
        rank = 4;
      } else if (size > 36 && size < 90) {
        rank = 3;
      } else if (size > 88 && size < 260) {
        rank = 2;
      } else if (size > 15 && size < 26) {
        rank = 1;
      } else {
        rank = 0;
      }
      return rank;
    },
  },
].reverse();

// FIXME 转成公共函数 BlobToBase64
function transformBlob(blob: Blob): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      if (reader.result) {
        resolve(reader.result);
      } else {
        reject(new Error("Error when parse favicon Blob"));
      }
    });

    reader.readAsDataURL(blob);
  });
}

async function getFaviconFromUrl(url: string): Promise<Blob> {
  const baseUrl = new URL(url);

  const { data: doc } = await axios.get<Document>(url, { responseType: "document" });

  const favicons: IParsedFavicon[] = [];

  // 1. Parse from head
  FAVICON_FROM_LINK.forEach((selector) => {
    const element = doc.querySelector(selector) as HTMLLinkElement;
    if (element) {
      favicons.push({
        href: element.href,
        sizes: element.sizes?.toString() || "",
        source: "link",
      });
    }
  });

  // 2. Parse from manifest
  const manifestElement = doc.querySelector('head link[rel="manifest" i]') as HTMLLinkElement;
  if (manifestElement) {
    const { data: manifest } = await axios.get<{
      icons: Record<"sizes" | "src" | "type", string>[];
    }>(manifestElement.href, { responseType: "json" });

    manifest.icons.forEach(({ sizes, src }) => {
      favicons.push({
        href: src,
        sizes,
        source: "manifest",
      });
    });
  }

  // 3. Default /favicon.ico
  try {
    const faviconIco = await axios.get<Blob>("/favicon.ico", {
      baseURL: baseUrl.origin,
      responseType: "blob",
    });
    if (faviconIco && faviconIco.data?.type === "image/x-icon") {
      favicons.push({
        href: "/favicon.ico",
        sizes: "",
        source: "favicon",
        blob: faviconIco.data,
      } as IParsedFavicon);
    }
  } catch (e) {}

  // 如果前面获取到足够的 favicons，我们需要比较下哪个更合适，并排序
  if (favicons.length > 0) {
    const rankedFavicons: Array<IParsedFavicon & { rank: number }> = favicons
      .map((icon) => {
        // 计算每一个favicon的评分
        let rank = 0;
        for (const x in remoteBetterFaviconOrder) {
          const order = remoteBetterFaviconOrder[x];
          if (order.rank) {
            rank += order.rank(icon) * Math.pow(10, parseInt(x));
          }
        }

        return {
          ...icon,
          rank,
        };
      })
      .sort((a, b) => (a.rank < b.rank ? 1 : -1));

    // 选择排序后第一个图标作为我们需要的图标
    for (let i = 0; i < rankedFavicons.length; i++) {
      const usedFavicons = rankedFavicons[i];
      if (usedFavicons.blob) {
        return usedFavicons.blob;
      } else {
        try {
          let faviconUrl = usedFavicons.href;
          if (faviconUrl.startsWith("//")) {
            faviconUrl = `${baseUrl.protocol}${faviconUrl}`;
          } else if (faviconUrl.startsWith("/")) {
            faviconUrl = `${baseUrl.origin}${faviconUrl}`;
          }

          const { data } = await axios.get(faviconUrl, { responseType: "blob" });
          return data;
        } catch {}
      }
    }
  }

  throw new Error("Can't find any favicons from this site");
}

export type getFaviconMetadata = Required<Pick<ISiteMetadata, "id" | "urls">> & Pick<ISiteMetadata, "favicon">;

export async function getFavicon(site: getFaviconMetadata): Promise<string> {
  const { id: siteId, urls: siteUrls, favicon: siteFavicon } = site;

  // 1. 检查本地icons目录是否存在对应文件
  let checkLocalIconPaths = [`${siteId}.png`, `${siteId}.ico`, `${siteId}.svg`];

  if (siteFavicon) {
    if (siteFavicon.startsWith("data:image/")) {
      return siteFavicon; // base64直接返回就行了
    } else if (siteFavicon.startsWith("./")) {
      checkLocalIconPaths = [siteFavicon.replace(/^\.\//, ""), ...checkLocalIconPaths]; // 优先使用 已定义的 favicon
    }
  }

  for (const checkLocalIconPath of checkLocalIconPaths) {
    if (__RESOURCE_SITE_ICONS__.includes(checkLocalIconPath)) {
      return `/icons/site/${checkLocalIconPath}`;
    }
  }

  // 2. 检查网站是否有对应icon
  let faviconMeta;

  // 2.1 ISiteMetadata 中定义的 favicon 字段为一个链接
  if (siteFavicon && siteFavicon.startsWith("http")) {
    try {
      const configReq = await axios.get(siteFavicon, { responseType: "blob" });
      faviconMeta = configReq.data;
    } catch {}
  }

  // 2.2 请求网站首页，并从返回的html中解析所需要的 favicon 字段
  if (!faviconMeta) {
    for (const url of siteUrls) {
      try {
        faviconMeta = await getFaviconFromUrl(url);
        break;
      } catch {}
    }
  }

  // 将请求结果转为 base64
  let faviconBase64;
  if (typeof faviconMeta !== "undefined") {
    faviconBase64 = await transformBlob(faviconMeta); // 将 faviconMeta 转成 base64，并缓存
  }

  // 3. fallback 使用 NO_IMAGE 替代
  faviconBase64 ??= NO_IMAGE;

  return faviconBase64;
}
