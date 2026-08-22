/**
 * 关于 logger 方法记录
 * 在 background 等其他页面中， 请使用 sendMessage("logger", {}).catch();
 * 在 offscreen 中， 请使用 logger({}) 直接调用
 */
import { nanoid } from "nanoid";
import { useSessionStorage } from "@vueuse/core";

import { onMessage } from "@/messages.ts";
import type { ILoggerItem } from "@/shared/types.ts";

const MAX_LOGGER_LENGTH = 500;
export const loggerStorage = useSessionStorage<ILoggerItem[]>("logger", []);

export function logger(data: ILoggerItem) {
  try {
    data.id ??= nanoid();
    data.time ??= new Date().getTime();
    data.msg = data.msg?.trim();

    loggerStorage.value.push(data);
    if (loggerStorage.value.length > MAX_LOGGER_LENGTH) {
      loggerStorage.value.shift();
    }
  } catch (e) {
    // 日志记录失败不应影响主流程（如传入不可序列化数据、sessionStorage 写入异常等）
    console.error("[PTD] logger failed:", e);
  }
}

onMessage("logger", ({ data }) => logger(data));
onMessage("getLogger", async () => loggerStorage.value);
onMessage("clearLogger", async () => {
  loggerStorage.value = [];
});
