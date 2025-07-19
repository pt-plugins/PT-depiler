/**
 * 此函数用于处理 Cloudflare 阻止请求的情况。
 */

import { pick } from "es-toolkit";
import { sendMessage } from "@/messages.ts";
import type { AxiosError, AxiosInstance, AxiosResponse, AxiosStatic, AxiosRequestConfig } from "axios";

const cloudflareBlocked5xxCodes = [
  521, // used by cloudflare to signal the original webserver is refusing the connection
  522, // used by cloudflare to signal the original webserver is not reachable at all (timeout)
  523, // used by cloudflare to signal the original webserver is not reachable at all (Origin is unreachable)
];

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

function removeCustomCloudflareCookie(response: AxiosResponse | undefined) {
  if ((response?.config as any).cfCookie) {
    // 如果请求中有 cf_clearance 的 set cookie detail，说明是重试请求，删除我们设置的 cf_clearance cookie
    sendMessage("removeCookie", (response!.config as any).cfCookie).catch();
  }
}

export function setupRetryWhenCloudflareBlock(axios: AxiosInstance): AxiosRetryWhenCloudflareBlockInstance {
  const axiosRetryWhenCloudflareBlockInstance = axios as AxiosRetryWhenCloudflareBlockInstance;

  if (axiosRetryWhenCloudflareBlockInstance.defaults.retryWhenCloudflare) {
    console.debug("setupRetryWhenCloudflareBlock() should be called only once");
    return axiosRetryWhenCloudflareBlockInstance;
  }
  axiosRetryWhenCloudflareBlockInstance.defaults.retryWhenCloudflare = true;

  // 请求完成后，自动删除 我们设置的 cf_clearance cookie （这不会影响具有 partitionKey 属性的原 cookie ）
  axiosRetryWhenCloudflareBlockInstance.interceptors.response.use(
    async (response) => {
      removeCustomCloudflareCookie(response);

      return response;
    },
    async (error: AxiosError) => {
      const isCFBlocked = isCloudflareBlocked(error.response!);

      // 无论此时是否被 Cloudflare 阻止，都需要删除我们设置的 cf_clearance cookie （如果有），以便后面根据需要再设置
      removeCustomCloudflareCookie(error?.response);

      const { config } = error;

      // If we have no information to retry the request
      if (!config) {
        return Promise.reject(error);
      }

      // 如果请求参数中没有 isCfBlockedRetry 标记，说明是第一次被 Cloudflare 阻止的请求
      if (isCFBlocked && (config as any)?.isCfBlockedRetry !== true) {
        // 尝试获取到 cf_clearance
        const fullRequestUrl = axiosRetryWhenCloudflareBlockInstance.getUri(config);
        const parsedUrl = new URL(fullRequestUrl);
        const partitionSiteKey = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

        const cfCookie = await sendMessage("getAllCookies", {
          url: fullRequestUrl,
          name: "cf_clearance",
          partitionKey: { topLevelSite: partitionSiteKey },
        });

        if (cfCookie && cfCookie.length > 0) {
          // 强行设置一个新的但是没有 partitionKey 属性的 cf_clearance 以便于fetch时能使用
          const newCfCookie = pick(cfCookie[0], [
            "domain",
            "expirationDate",
            "name",
            "path",
            "sameSite",
            "secure",
            "storeId",
            "value",
          ]) as chrome.cookies.SetDetails;

          await sendMessage("setCookie", newCfCookie);

          (config as any).isCfBlockedRetry = true; // 标记为已重试过，防止反复重试
          (config as any).cfCookie = newCfCookie; // 保存当前的 cf_clearance cookie 信息，以便于在成功获取信息时删除我们设置的 cf_clearance

          // 重新发送请求
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
