import { onMessage, sendMessage } from "@/messages.ts";

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

export async function setCookie(cookie: chrome.cookies.SetDetails): Promise<void> {
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

  // 尝试获取当前站点已存在的Cookie
  const exist_cookie = await chrome.cookies.get({ url: new_cookie.url, name: new_cookie.name! });
  if (exist_cookie === null) {
    // 如果当前站点没有这个Cookies，则允许设置
    allowSet = true;
  } else if ((exist_cookie.expirationDate ?? 0) < now) {
    // 如果站点存在这个Cookies，但已过期，允许设置
    allowSet = true;
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
