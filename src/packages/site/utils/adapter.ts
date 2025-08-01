/**
 * 此处为 @pkg/site 提供一些与平台相关的工具函数和适配器，
 *
 * 在 pkg/site 中，难免使用一些与平台有关的工具，比如 使用 axios 进行网络请求，获取cookies
 * 此处为这些操作提供统一的出口
 * 来尽可能实现 pkg/site 的 schemas 和 definitions 实现与浏览器平台能解耦
 * （其他地方只要修改此处的实现即可）
 *
 */

import axiosRaw from "axios";
import { get, set } from "es-toolkit/compat";

import { sendMessage } from "@/messages.ts";
import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";
import { setupRetryWhenCloudflareBlock } from "~/extends/axios/retryWhenCloudflareBlock.ts";

export { isCloudflareBlocked } from "~/extends/axios/retryWhenCloudflareBlock.ts";

import type { ISiteUserConfig } from "../types";
import type { IExtensionStorageSchema } from "@/storage.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types/storages/metadata.ts";

// 默认允许 pkg/site 中的 axios 请求替换 unsafeHeader
export const axios = setupRetryWhenCloudflareBlock(setupReplaceUnsafeHeader(axiosRaw));

/**
 * 存储数据到 metadata.site[siteId].runtimeSettings[key] 中，
 * 这样对应站点实例可以使用 this.userConfig?.runtimeSettings?.[key] 或者 this.retrieveRuntimeSettings(key) 来获取
 */
export async function store(
  siteId: string,
  key: string,
  value: any,
  field: keyof ISiteUserConfig = "runtimeSettings",
): Promise<void> {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  set(metadataStore, `sites.${siteId}.${field}.${key}`, value);
  await sendMessage("setExtStorage", { key: "metadata", value: metadataStore });
}

export async function retrieve<T extends any>(
  siteId: string,
  key: string,
  field: keyof ISiteUserConfig = "runtimeSettings",
): Promise<T | null> {
  const metadataStore = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  return get(metadataStore, `sites.${siteId}.${field}.${key}`, null) as T | null;
}

export async function retrieveStore(store: keyof IExtensionStorageSchema, keyPath: string): Promise<any> {
  const metadataStore = (await sendMessage("getExtStorage", store)) as IMetadataPiniaStorageSchema;
  return get(metadataStore, keyPath, null);
}

/**
 * 允许调用来获取获取单个 cookie 信息
 */
export async function cookie(detail: chrome.cookies.CookieDetails): Promise<chrome.cookies.Cookie | null> {
  return await sendMessage("getCookie", detail);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
