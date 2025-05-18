import { onMessage } from "@/messages.ts";

export async function getCookiesByDomain(domain: string): Promise<chrome.cookies.Cookie[]> {
  return await chrome.cookies.getAll({ domain });
}

onMessage("getCookiesByDomain", async ({ data }) => {
  return await getCookiesByDomain(data);
});

function buildUrl(secure: boolean, domain: string, path: string) {
  if (domain.startsWith(".")) {
    domain = domain.substring(1);
  }
  return `http${secure ? "s" : ""}://${domain}${path}`;
}

export async function setCookie(cookie: chrome.cookies.SetDetails): Promise<void> {
  let new_cookie = {} as chrome.cookies.SetDetails;

  (
    ["name", "value", "domain", "path", "secure", "httpOnly", "sameSite"] as (keyof chrome.cookies.SetDetails)[]
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

  const now = Math.floor(new Date().getTime() / 1000);
  new_cookie.expirationDate = now + parseInt("6000") * 60; // FIXME

  new_cookie.url = buildUrl(cookie.secure!, cookie.domain!, cookie.path!);
  await chrome.cookies.set(new_cookie);
}

onMessage("setCookie", async ({ data }) => {
  return await setCookie(data);
});
