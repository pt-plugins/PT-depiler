/**
 * 关于 logger 方法记录
 * 在 background 等其他页面中， 请使用 sendMessage("logger", {}).catch();
 * 在 offscreen 中， 请使用 logger({}) 直接调用
 */
import { nanoid } from "nanoid";
import { useSessionStorage } from "@vueuse/core";

import { onMessage } from "@/messages.ts";
import type { ILoggerItem } from "@/shared/types.ts";

export const loggerStorage = useSessionStorage<ILoggerItem[]>("logger", []);

export function logger(data: ILoggerItem) {
  data.id ??= nanoid();
  data.time ??= new Date().getTime();
  data.msg = data.msg?.trim();

  loggerStorage.value.push(data);
}

onMessage("logger", ({ data }) => logger(data));
onMessage("getLogger", async () => loggerStorage.value);
onMessage("clearLogger", async () => {
  loggerStorage.value = [];
});
