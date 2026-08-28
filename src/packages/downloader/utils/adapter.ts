/**
 * 此处为 @pkg/downloader 提供与平台相关的适配器（对齐 @pkg/site 的 utils/adapter 模式），
 * 将 axios 的包装统一收口在 utils 层，各下载器实体从 `../utils` 导入即可，无需自行包装。
 */

import axiosRaw from "axios";

import { setupReplaceUnsafeHeader } from "~/extends/axios/replaceUnsafeHeader.ts";

// 下载器专用 axios 实例：套上 replaceUnsafeHeader，
// 使「绕过 CSRF 保护」等能力可通过 DNR 移除浏览器自动添加的受限请求头
export const axios = setupReplaceUnsafeHeader(axiosRaw.create());
