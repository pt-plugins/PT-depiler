import { add, differenceInDays } from "date-fns";

import { extStorage } from "@/storage.ts";
import { onMessage, sendMessage } from "@/messages.ts";

/**
 * 计算cookie的剩余有效期（以天为单位）
 * @param expirationDate cookie的过期时间戳（秒）
 * @returns 剩余天数，如果是session cookie则返回Infinity
 */
export function calculateRemainingDays(expirationDate?: number): number {
  if (!expirationDate) {
    // Session cookie，没有过期时间
    return Infinity;
  }

  // 使用 date-fns 的 differenceInDays 函数计算剩余天数
  const expirationDateMs = expirationDate * 1000; // 转换为毫秒
  const remainingDays = differenceInDays(new Date(expirationDateMs), new Date());

  return Math.max(0, remainingDays); // 确保不返回负数
}

export function buildCookieUrl(secure: boolean, domain: string, path: string) {
  if (domain.startsWith(".")) {
    domain = domain.substring(1);
  }
  return `http${secure ? "s" : ""}://${domain}${path}`;
}

onMessage("getAllCookies", async ({ data }) => {
  return await chrome.cookies.getAll(data);
});

onMessage("getCookie", async ({ data: detail }) => {
  return await chrome.cookies.get(detail);
});

/**
 * 设置cookie
 * @param cookie cookie详细信息
 * @param force 是否强制设置，为true时跳过过期检查直接设置
 */
export async function setCookie(cookie: chrome.cookies.SetDetails, force: boolean = false): Promise<void> {
  let new_cookie = {} as chrome.cookies.SetDetails;

  (
    [
      "name",
      "value",
      "domain",
      "path",
      "secure",
      "httpOnly",
      "sameSite",
      "expirationDate",
    ] as (keyof chrome.cookies.SetDetails)[]
  ).forEach((key) => {
    if (key == "sameSite" && cookie[key] && cookie[key].toLowerCase() == "unspecified" && __BROWSER__ === "firefox") {
      // firefox 下 unspecified 会导致cookie无法设置
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/SameSiteStatus
      new_cookie["sameSite"] = "no_restriction";
    } else {
      // @ts-ignore
      new_cookie[key] = cookie[key];
    }
  });

  new_cookie.url = buildCookieUrl(cookie.secure!, cookie.domain!, cookie.path!);

  let allowSet = false;
  const now = new Date().getTime() / 1000;

  if (force) {
    // 如果强制设置，直接允许
    allowSet = true;
  } else {
    // 尝试获取当前站点已存在的Cookie
    const exist_cookie = await chrome.cookies.get({ url: new_cookie.url, name: new_cookie.name! });
    if (exist_cookie === null) {
      // 如果当前站点没有这个Cookies，则允许设置
      allowSet = true;
    } else if ((exist_cookie.expirationDate ?? 0) < now) {
      // 如果站点存在这个Cookies，但已过期，允许设置
      allowSet = true;
    }
  }

  if (allowSet) {
    await chrome.cookies.set(new_cookie);
  }
}

onMessage("setCookie", async ({ data }) => {
  return await setCookie(data);
});

onMessage("removeCookie", async ({ data }) => {
  const removeCookie = {} as chrome.cookies.CookieDetails;

  removeCookie.name = data.name!;
  removeCookie.storeId = data.storeId ?? "0";

  if (typeof data.url === "undefined") {
    const setDetails = data as chrome.cookies.SetDetails;
    removeCookie.url = buildCookieUrl(setDetails.secure ?? true, setDetails.domain!, setDetails.path!);
  } else {
    removeCookie.url = data.url;
  }

  return await chrome.cookies.remove(removeCookie);
});

/**
 * 检查并延长指定域名的cookies
 * @param url 域名
 */
export async function checkAndExtendCookies(url: string) {
  try {
    const config = (await extStorage.getItem("config"))?.autoExtendCookies ?? { enabled: false };

    if (!config.enabled) {
      return;
    }

    // 获取指定URL下的所有cookies
    const cookies = await chrome.cookies.getAll({ url });

    const thresholdDays = config.triggerThreshold * 7; // 转换为天数

    for (const cookie of cookies) {
      try {
        const remainingDays = calculateRemainingDays(cookie.expirationDate);

        // 跳过session cookies（没有过期时间）
        if (remainingDays === Infinity) {
          continue;
        }

        // 只延长指定名称的cookie
        const shouldExtendCookie = cookie.name.startsWith("c_secure_") || cookie.name.startsWith("remember_web_");

        // 如果剩余时间少于阈值，且是目标cookie，则延长cookie
        if (remainingDays < thresholdDays && shouldExtendCookie) {
          // 使用 date-fns 的 add 函数来计算新的过期时间
          const newExpirationDate = Math.floor(add(new Date(), { months: config.extensionDuration }).getTime() / 1000);

          const cookieDetails: chrome.cookies.SetDetails = {
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
            expirationDate: newExpirationDate,
            url: buildCookieUrl(cookie.secure, cookie.domain, cookie.path),
          };

          // 使用force=true强制设置cookie，即使原cookie未过期
          await setCookie(cookieDetails, true);
        }
      } catch (error) {
        // 静默处理单个cookie的错误，继续处理其他cookies
        sendMessage("logger", { msg: `Failed to extend cookie ${cookie.name} for url ${url}`, level: "debug" }).catch();
      }
    }
  } catch (error) {
    // 静默处理整体错误，不影响调用方
    sendMessage("logger", { msg: `Failed to check and extend cookies for url ${url}`, level: "debug" }).catch();
  }
}

onMessage("checkAndExtendCookies", async ({ data: url }) => {
  return await checkAndExtendCookies(url);
});
