import { sendMessage } from "@/messages.ts";

import "./adapter/indexdb.ts";

import "./utils/site.ts";
import "./utils/search.ts";
import "./utils/download.ts";
import "./utils/userInfo.ts";
import "./utils/socialInformation.ts";

if (import.meta.env.DEV) {
  // @ts-ignore
  globalThis.sendMessage = sendMessage;
}
