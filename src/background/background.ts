import PTPlugin from "@/background/ptplugin";

// @ts-ignore
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.target != "background") {
    return Promise.resolve(false);
  }
  console.log(message, sender);
});

PTPlugin.init();
