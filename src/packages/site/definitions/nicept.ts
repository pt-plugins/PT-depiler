/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  name: "NicePT",
  description: "老师站，又称小馒头",
  url: "https://www.nicept.net/",
  tags: ["Adult"],
  schema: "NexusPHP",
  type: "private",
  collaborator: ["DXV5"],
  category: {
    key: "cat",
    options: [
      { value: 401, name: "无码（限制级）" },
      { value: 500, name: "有码（限制级）" },
      { value: 402, name: "三级情色（限制级）" },
      { value: 501, name: "其他（限制级）" },
      { value: 403, name: "动漫（限制级）" },
      { value: 503, name: "真人秀，自拍（限制级）" },
      { value: 404, name: "套图（限制级）" },
      { value: 504, name: "SM调教（限制级）" },
    ],
    cross: { mode: "append" },
  },
};
