import { nanoid } from "nanoid";
import { onMessage } from "@/messages.ts";

onMessage("addContextMenu", async ({ data }) => {
  if (!data.id) {
    data.id = nanoid();
  }
  chrome.contextMenus.create(data);
  return data.id;
});

onMessage("removeContextMenu", async ({ data }) => {
  try {
    await chrome.contextMenus.remove(data);
  } catch (e) {}
});
