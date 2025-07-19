/**
 * 此函数用于处理 Cloudflare 阻止请求的情况。
 */

import type { AxiosError, AxiosInstance, AxiosResponse, AxiosStatic, AxiosRequestConfig } from "axios";
import { omit, pick } from "es-toolkit";

const cloudflareBlocked5xxCodes = [
  521, // used by cloudflare to signal the original webserver is refusing the connection
  522, // used by cloudflare to signal the original webserver is not reachable at all (timeout)
  523, // used by cloudflare to signal the original webserver is not reachable at all (Origin is unreachable)
];

export function buildCookieUrl(secure: boolean, domain: string, path: string) {
  if (domain.startsWith(".")) {
    domain = domain.substring(1);
  }
  return `http${secure ? "s" : ""}://${domain}${path}`;
}

export function isCloudflareBlocked(response: AxiosResponse): boolean {
  try {
    // https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/#detect-a-challenge-page-response
    if (response.headers?.["cf-mitigated"] === "challenge") {
      return true;
    }

    if (cloudflareBlocked5xxCodes.includes(response.status)) {
      return true;
    }

    // 其他 403 需进一步判断
    if (response.status === 403) {
      const request = response.request as XMLHttpRequest;
      const responseText =
        request.responseType === "document" ? request.responseXML?.documentElement?.outerHTML : request.responseText;
      if (typeof responseText === "undefined") {
        return false; // 检查最终的Text，如果什么都没有, bypass
      } else if (/Enable JavaScript and cookies to continue/.test(responseText)) {
        return true; // 包含关键字，说明被封锁
      }
    }
  } catch (e) {
    console.error("[CFBlockCheck] An error occurred while checking CF block status:", e);
  }

  return false;
}

interface AxiosRetryWhenCloudflareBlockInstance extends AxiosInstance {
  defaults: AxiosInstance["defaults"] & {
    retryWhenCloudflare: boolean;
  };
}

function fixConfig(axiosInstance: AxiosInstance | AxiosStatic, config: AxiosRequestConfig) {
  // @ts-ignore
  if (axiosInstance.defaults.agent === config.agent) {
    // @ts-ignore
    delete config.agent;
  }
  if (axiosInstance.defaults.httpAgent === config.httpAgent) {
    delete config.httpAgent;
  }
  if (axiosInstance.defaults.httpsAgent === config.httpsAgent) {
    delete config.httpsAgent;
  }
}

export function setupRetryWhenCloudflareBlock(axios: AxiosInstance): AxiosRetryWhenCloudflareBlockInstance {
  const axiosRetryWhenCloudflareBlockInstance = axios as AxiosRetryWhenCloudflareBlockInstance;

  if (axiosRetryWhenCloudflareBlockInstance.defaults.retryWhenCloudflare) {
    console.debug("setupRetryWhenCloudflareBlock() should be called only once");
    return axiosRetryWhenCloudflareBlockInstance;
  }
  axiosRetryWhenCloudflareBlockInstance.defaults.retryWhenCloudflare = true;

  // 请求完成后，自动删除 我们设置的 cf_clearance cookie
  axiosRetryWhenCloudflareBlockInstance.interceptors.response.use(
    async (response) => {
      if ((response.config as any).cfCookie) {
        // 如果请求中有 cf_clearance 的 set cookie detail，说明是重试请求，删除我们设置的 cf_clearance cookie
        const cfCookie = (response.config as any).cfCookie as chrome.cookies.SetDetails;
        await chrome.cookies.remove(pick(cfCookie, ["name", "url"]) as chrome.cookies.CookieDetails);
      }

      return response;
    },
    async (error: AxiosError) => {
      const isCFBlocked = isCloudflareBlocked(error.response!);

      const { config } = error;

      // If we have no information to retry the request
      if (!config) {
        return Promise.reject(error);
      }

      // 如果请求参数中没有 isCfBlockedRetry 标记，说明是第一次被 Cloudflare 阻止的请求
      if (isCFBlocked && (config as any).isCfBlockedRetry !== true) {
        // 尝试获取到 cf_clearance

        const fullRequestUrl = axiosRetryWhenCloudflareBlockInstance.getUri(config);
        const parsedUrl = new URL(fullRequestUrl);
        const partitionSiteKey = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

        const cfCookie = await chrome.cookies.getAll({
          url: fullRequestUrl,
          name: "cf_clearance",
          partitionKey: { topLevelSite: partitionSiteKey },
        });

        if (cfCookie && cfCookie.length > 0) {
          // 强行将 cf_clearance 这个 cookies 修改为 httpOnly: false
          const newCfCookie = pick(cfCookie[0], [
            "domain",
            "expirationDate",
            "name",
            "partitionKey",
            "path",
            "sameSite",
            "secure",
            "storeId",
            "value",
          ]) as chrome.cookies.SetDetails;
          newCfCookie.url = buildCookieUrl(newCfCookie.secure!, newCfCookie.domain!, newCfCookie.path!);

          // 设置一个新的但是没有 partitionKey 属性的 cf_clearance 以便于fetch时能使用
          await chrome.cookies.set(omit(newCfCookie, ["partitionKey"]));

          (config as any).isCfBlockedRetry = true; // 标记为已重试过，防止反复重试
          (config as any).cfCookie = newCfCookie;
          return new Promise((resolve) => {
            fixConfig(axiosRetryWhenCloudflareBlockInstance, config);
            resolve(axiosRetryWhenCloudflareBlockInstance(config));
          });
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosRetryWhenCloudflareBlockInstance;
}
