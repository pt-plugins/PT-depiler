import { onMessage, sendMessage } from "@/messages.ts";

onMessage("updateDNRSessionRules", async ({ data: { rule, extOnly = true } }) => {
  // 将规则正向圈定到本扩展发起的请求，避免误改普通网页的请求头（见 #1465）。
  //
  // DNR 的 initiatorDomains 按「请求 initiator 的 host」匹配。两浏览器下扩展自身上下文
  // （background/offscreen/options 等）发起的请求，其 initiator host 均等于扩展自身 origin 的 host：
  // - Chrome：chrome-extension://<id>，host 即 chrome.runtime.id；
  // - Firefox：moz-extension://<uuid>，host 是扩展的 moz-extension UUID。而 chrome.runtime.id 返回
  //   manifest 声明的 gecko.id（本扩展为 ptdepiler.ptplugins@gmail.com），与 UUID 并不相同（也非合法
  //   domain），规则将永不命中，导致扩展发起的 unsafe header 请求（如 M-Team 校验所需的 Origin 头）
  //   在 Firefox 中全部失效（见 #1486）。因此 Firefox 侧取 new URL(chrome.runtime.getURL("")).host
  //   作为匹配值（在任何扩展上下文均可计算，不依赖 location）。
  if (extOnly) {
    rule.condition.initiatorDomains = [
      __BROWSER__ === "firefox" ? new URL(chrome.runtime.getURL("")).host : chrome.runtime.id,
    ];
    delete rule.condition.excludedTabIds;
  }

  sendMessage("logger", {
    msg: `Update DNR session rules ${rule.id} for url: ${rule.condition?.urlFilter}`,
    data: rule,
  }).catch();

  return await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [rule.id],
    addRules: [rule],
  });
});

onMessage("removeDNRSessionRuleById", async ({ data: ruleId }) => {
  sendMessage("logger", { msg: `Remove DNR session rule by ID: ${ruleId}` }).catch();
  return await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [ruleId],
  });
});
