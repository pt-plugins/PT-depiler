import { onMessage, sendMessage } from "@/messages.ts";

onMessage("updateDNRSessionRules", async ({ data: { rule, extOnly = true } }) => {
  // 不影响其他非本扩展的网络请求规则
  if (extOnly) {
    const tabs = await chrome.tabs.query({});
    const excludedTabIds: number[] = [];
    tabs.forEach((tab) => {
      if (tab.id && tab.url) {
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
