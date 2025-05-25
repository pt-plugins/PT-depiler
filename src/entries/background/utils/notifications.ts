import { onMessage } from "@/messages.ts";

onMessage("showNotification", async ({ data: { options, timeout = 5e3 } }) => {
  const createNotificationOptions = {
    type: "basic",
    iconUrl: chrome.runtime.getURL("/icons/logo/128.png"),
    title: "PT-Depiler",
    priority: 0,
    message: "",
    ...options,
  } as chrome.notifications.NotificationCreateOptions;
  let id = Math.floor(Math.random() * 99999) + "";

  chrome.notifications.create(id, createNotificationOptions, function (myId) {
    id = myId;
  });

  setTimeout(() => {
    chrome.notifications.clear(id, () => {});
  }, timeout);
});
