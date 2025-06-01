import { nanoid } from "nanoid";
import { onMessage } from "@/messages.ts";
import { stringify } from "urlencode";
import { extStorage } from "@/storage.ts";

const contextMenusId = "PT-Depiler-Context-Menus";

const contextMenusClickEventBus = new Map<
  string | number,
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => void
>();

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.menuItemId || !contextMenusClickEventBus.has(info.menuItemId)) {
    return;
  }
  const clickHandler = contextMenusClickEventBus.get(info.menuItemId);
  if (clickHandler) {
    clickHandler(info, tab!);
  }
});

function addContextMenu(data: chrome.contextMenus.CreateProperties) {
  if (!data.id) {
    data.id = nanoid();
  }

  if (data.onclick) {
    // 如果有 onclick 事件，则将其存入事件总线
    contextMenusClickEventBus.set(data.id, data.onclick);
    delete data.onclick; // 删除 onclick 属性，因为 chrome.contextMenus.create 不支持直接传入 onclick
  }

  chrome.contextMenus.create(data);
  return data.id;
}

onMessage("addContextMenu", async ({ data }) => addContextMenu(data));

function removeContextMenu(id: string) {
  chrome.contextMenus.remove(id).catch();
  contextMenusClickEventBus.delete(id);
}

onMessage("removeContextMenu", async ({ data }) => removeContextMenu(data));

function clearContextMenus() {
  chrome.contextMenus.removeAll().catch();
  contextMenusClickEventBus.clear();
}

onMessage("clearContextMenus", async () => clearContextMenus());

async function initContextMenus() {
  const configStore = (await extStorage.getItem("config"))!;

  // 清除原来的菜单
  clearContextMenus();

  // 创建关键字搜索菜单，所有页面可用
  if (configStore.contextMenus?.allowSelectionTextSearch ?? true) {
    addContextMenu({
      id: contextMenusId,
      title: '搜索 "%s" 相关的种子',
      contexts: ["selection"],
      onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
        chrome.tabs.create({
          url:
            "/src/entries/options/index.html#/search-entity?" +
            stringify({
              search: info.selectionText,
              flush: 1,
            }),
        });
      },
    });
  }
}

chrome.tabs.onActivated.addListener((actionInfo: chrome.tabs.TabActiveInfo) => {
  chrome.tabs.get(actionInfo.tabId, (tab: chrome.tabs.Tab) => {
    initContextMenus().then();
  });
  chrome.tabs.onUpdated.addListener(() => {
    initContextMenus().then();
  });
});
