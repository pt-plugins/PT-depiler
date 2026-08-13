/**
 * 在 browser 环境中，我们有很多的 headers 是不能设置的，这里为 axios 提供一个方法来替换掉这些 headers
 */
import type { AxiosInstance } from "axios";
import { sendMessage } from "@/messages.ts";

export const unsafeHeaders: { [key: string]: boolean } = {
  "user-agent": true,
  cookie: true,
  "accept-charset": true,
  "accept-encoding": true,
  "access-control-request-headers": true,
  "access-control-request-method": true,
  connection: true,
  "content-length": true,
  date: true,
  dnt: true,
  expect: true,
  "feature-policy": true,
  host: true,
  "keep-alive": true,
  origin: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  via: true,
};

interface AxiosAllowUnsafeHeaderInstance extends AxiosInstance {
  defaults: AxiosInstance["defaults"] & {
    allowUnsafeHeader: boolean;
  };
}

export function setupReplaceUnsafeHeader(axios: AxiosInstance): AxiosAllowUnsafeHeaderInstance {
  const axiosAllowUnsafeHeaderInstance = axios as AxiosAllowUnsafeHeaderInstance;

  if (axiosAllowUnsafeHeaderInstance.defaults.allowUnsafeHeader) {
    console.debug("setupReplaceUnsafeHeader() should be called only once");
    return axiosAllowUnsafeHeaderInstance;
  }
  axiosAllowUnsafeHeaderInstance.defaults.allowUnsafeHeader = true;

  // Add a request interceptor
  axiosAllowUnsafeHeaderInstance.interceptors.request.use(async function (config) {
    if (config.headers) {
      // 准备扔给 chrome.declarativeNetRequest 的请求头
      const requestHeaders = [] as chrome.declarativeNetRequest.ModifyHeaderInfo[];

      for (const [key, value] of config.headers) {
        const lowerKey = key.toLowerCase();
        if (unsafeHeaders[lowerKey] || lowerKey.startsWith("sec-") || lowerKey.startsWith("proxy-")) {
          requestHeaders.push({
            header: key,
            operation: "set" as chrome.declarativeNetRequest.HeaderOperation.SET,
            value: String(value),
          });
          config.headers.delete(key);
        }
      }

      // 移除浏览器自动添加的 Origin 请求头
      // 浏览器会自动为跨域请求添加 `Origin: <当前页面 origin>` 头，该头无法通过 JS 移除，
      // 但部分服务端（如 qBittorrent 的 CSRF 校验）会校验 Origin 是否同源，导致从扩展页面
      // （chrome-extension://）发起的请求被拒绝。这里通过 DNR 规则主动移除 Origin 头。
      if (!requestHeaders.some((h) => h.header.toLowerCase() === "origin")) {
        requestHeaders.push({
          header: "Origin",
          operation: "remove" as chrome.declarativeNetRequest.HeaderOperation.REMOVE,
        });
      }

      if (requestHeaders.length > 0) {
        // 生成一个随机的请求 ID，与 chrome.declarativeNetRequest 匹配
        const dummyHeaderRequestId = Math.floor(Math.random() * 1e7);
        (config as any).dummyHeaderRequestId = dummyHeaderRequestId;

        const requestUrl = axios.getUri({ baseURL: config.baseURL, url: config.url });

        const rule = {
          id: dummyHeaderRequestId,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders,
          },
          condition: {
            urlFilter: requestUrl,
            resourceTypes: ["xmlhttprequest" as chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST],
            requestMethods: [(config.method || "GET").toLowerCase() as chrome.declarativeNetRequest.RequestMethod],
          },
        } as chrome.declarativeNetRequest.Rule;

        await sendMessage("updateDNRSessionRules", { rule });
      }
    }

    return config;
  });

  function removeDummyHeaderRequestId(config: any) {
    if (config?.config?.dummyHeaderRequestId) {
      // noinspection JSIgnoredPromiseFromCall
      sendMessage("removeDNRSessionRuleById", config.config.dummyHeaderRequestId);
    }
  }

  // 请求完成后，根据 dummyHeaderRequestId 自动删除 DNR 规则
  axiosAllowUnsafeHeaderInstance.interceptors.response.use(
    function (response) {
      removeDummyHeaderRequestId(response);
      return response;
    },
    function (error) {
      removeDummyHeaderRequestId(error);
      return Promise.reject(error);
    },
  );

  return axiosAllowUnsafeHeaderInstance;
}
