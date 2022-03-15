import type { ISiteMetadata } from "../types";
import { selectorSearchProgress, selectorSearchStatus } from "./tjupt";

export const siteMetadata: ISiteMetadata = {
  name: "伊甸园",
  description: "这里是伊甸园 让我们赤裸坦诚相见",
  url: "https://pt.hdbd.us/",
  tags: ["综合", "XXX"],
  type: "private",
  schema: "NexusPHP",
  search: {
    selectors: {
      // FIXME 这个站基于TJUPT，所以 progress, status 两个选择器直接套用，但未测试过
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
    },
  },
};
