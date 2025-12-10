import type { ISiteMetadata } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "dajiao",
  name: "DAJIAO",
  description: "打胶",
  tags: ["综合", "纪录片"],

  type: "private",
  schema: "NexusPHP",

  urls: ["https://dajiao.cyou/"],

  isDead: true,

  officialGroupPattern: [/DJWEB|DJTV/i],
};
