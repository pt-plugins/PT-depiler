import { onMessage, sendMessage } from "@/messages.ts";

onMessage("updateDNRSessionRules", async ({ data: { rule, extOnly = true } }) => {
  // 不影响其他非本扩展的网络请求规则
  if (extOnly) {
    const tabs = await chrome.tabs.query({});
    const excludedTabIds: number[] = [];
    tabs.forEach((tab) => {
      // 仅排除普通网页标签页；扩展自身页面（如 options）发起的请求仍应命中规则，
      // 否则从扩展页面调用的 replaceUnsafeHeader（如下载器连接测试）永远不生效
      if (tab.id && tab.url && !tab.url.startsWith("chrome-extension://")) {
        excludedTabIds.push(tab.id);
      }
    });
    rule.condition.excludedTabIds ??= excludedTabIds;
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
