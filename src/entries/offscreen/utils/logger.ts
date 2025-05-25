/**
 * 关于 logger 方法记录
 * 在 background 中， 请使用 sendMessage("logger", {}).catch();
 * 在 offscreen 或者 options 中， 请使用 logger({}) 直接调用
 */
import { useSessionStorage } from "@vueuse/core";
import type { ILoggerItem } from "@/shared/types.ts";
import { nanoid } from "nanoid";
import { onMessage } from "@/messages.ts";

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
