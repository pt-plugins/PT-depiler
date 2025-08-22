import { nanoid } from "nanoid";
import { getHostFromUrl } from "@ptd/site/utils/html.ts"; // 这里不能使用 @ptd/site 的主入口，会导致 sw 无法加载

import { extStorage } from "@/storage.ts";
import { onMessage } from "@/messages.ts";

import { openOptionsPage } from "./base.ts";

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

async function initContextMenus(tab: chrome.tabs.Tab) {
  const configStore = (await extStorage.getItem("config"))! ?? {};
  const metadataStore = (await extStorage.getItem("metadata"))! ?? {};
  const tabHost = getHostFromUrl(tab.url || "https://example.com");
  const thisTabSiteId = metadataStore.siteHostMap?.[tabHost];

  // 清除原来的菜单
  clearContextMenus();

  // 如果配置中禁用右键菜单，则不进行任何操作
  if (configStore?.contextMenus?.enabled === false) {
    console.debug("[PTD] Context menus are disabled, skipping initialization.");
    return;
  }

  // 创建关键字搜索菜单，所有页面可用
  if (configStore.contextMenus?.allowSelectionTextSearch ?? true) {
    // 创建基础菜单
    addContextMenu({
      id: contextMenusId,
      title: `使用 ${chrome.i18n.getMessage("extName")} 搜索 "%s" 相关的种子`,
      contexts: ["selection"],
    });

    // 基本关键词搜索
    addContextMenu({
      parentId: contextMenusId,
      title: "使用默认方案搜索",
      contexts: ["selection"],
      onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
        openOptionsPage({ path: "/search-entity", query: { search: info.selectionText, flush: 1 } });
      },
    });

    addContextMenu({ parentId: contextMenusId, type: "separator" });

    // 特定搜索方案搜索
    const solutions = Object.values(metadataStore.solutions ?? {})
      .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
      .sort((a, b) => b.sort - a.sort); // 按照 sort 降序排序
    if (solutions.length > 0) {
      const solutionSearchSubMenuId = addContextMenu({
        id: `${contextMenusId}**Search-In-Solutions`,
        parentId: contextMenusId,
        title: "以指定的方案中搜索", // FIXME i18n
        contexts: ["selection"],
      });

      for (const solution of solutions) {
        addContextMenu({
          id: `${solutionSearchSubMenuId}**${solution.id}`,
          parentId: solutionSearchSubMenuId,
          title: solution.name,
          contexts: ["selection"],
          onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
            openOptionsPage({
              path: "/search-entity",
              query: { search: info.selectionText, plan: solution.id, flush: 1 },
            });
          },
        });
      }
    }

    // 特定站点搜索
    const sites = Object.entries(metadataStore.sites ?? {})
      .map(([siteId, site]) => ({
        id: siteId,
        ...site,
      }))
      .filter((x) => !x.isOffline && !!x.allowSearch)
      .sort((a, b) => (b.sortIndex ?? 0) - (a.sortIndex ?? 0));

    if (sites.length > 0) {
      const siteSearchSubMenuId = addContextMenu({
        id: `${contextMenusId}**Search-In-Site`,
        parentId: contextMenusId,
        title: "在指定的站点进行搜索", // FIXME i18n
        contexts: ["selection"],
      });

      for (const site of sites) {
        if (site.id === thisTabSiteId) {
          continue; // 如果是当前站点，则不再添加到子菜单中
        }

        const title = metadataStore.siteNameMap?.[site.id] || site.id;

        addContextMenu({
          id: `${siteSearchSubMenuId}**${site.id}`,
          parentId: siteSearchSubMenuId,
          title,
          contexts: ["selection"],
          onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
            openOptionsPage({ path: "/search-entity", query: { search: info.selectionText, site: site.id, flush: 1 } });
          },
        });
      }
    }

    if (thisTabSiteId) {
      addContextMenu({
        id: `${contextMenusId}**Search-In-This-Site`,
        parentId: contextMenusId,
        title: "仅搜索本站相关的种子", // FIXME i18n
        contexts: ["selection"],
        onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
          openOptionsPage({
            path: "/search-entity",
            query: { search: info.selectionText, site: thisTabSiteId, flush: 1 },
          });
        },
      });
    }
  }
}

chrome.tabs.onActivated.addListener((actionInfo: chrome.tabs.OnActivatedInfo) => {
  chrome.tabs.get(actionInfo.tabId, (tab: chrome.tabs.Tab) => {
    initContextMenus(tab).catch();
  });
  chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
    initContextMenus(tab).catch();
  });
});
