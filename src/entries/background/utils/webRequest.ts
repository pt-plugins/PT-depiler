import { onMessage, sendMessage } from "@/messages.ts";

onMessage("updateDNRSessionRules", async ({ data: { rule, extOnly = true } }) => {
  // 不影响其他非本扩展的网络请求：将规则正向圈定到本扩展页面发起的请求
  // （offscreen/options 等扩展上下文发起的请求，其 initiator 为 chrome-extension://<id>，可用扩展 ID 表示）。
  //
  // 此前采用 excludedTabIds 快照方案（排除安装规则时已存在的非扩展标签页），存在两个缺陷（见 #1465）：
  // 1. 快照过期：之后新开的标签页不在豁免名单内，其中命中 urlFilter 的请求会被误改请求头；
  // 2. urlFilter 为无锚点子串匹配：规则中的 URL 片段可能命中完全无关的请求，放大误伤面。
  if (extOnly) {
    rule.condition.initiatorDomains = [chrome.runtime.id];
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
