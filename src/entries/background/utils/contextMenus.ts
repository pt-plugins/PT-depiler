import { nanoid } from "nanoid";
import { format as dateFormat } from "date-fns";

import { CAddTorrentOptions } from "@ptd/downloader";
import { getHostFromUrl } from "@ptd/site/utils/html.ts"; // 这里不能使用 @ptd/site 的主入口，会导致 sw 无法加载

import { IDownloaderMetadata } from "@/shared/types/storages/metadata.ts";
import { extStorage } from "@/storage.ts";
import { onMessage, sendMessage } from "@/messages.ts";

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

function downloadLinkPush(link: string, downloader: IDownloaderMetadata, folder?: string) {
  sendMessage("downloadTorrentToDownloader", {
    torrent: { link }, // 组装一个最小的种子对象
    downloaderId: downloader.id,
    addTorrentOptions: {
      addAtPaused: !(downloader?.feature?.DefaultAutoStart ?? true),
      savePath: folder!,
    } as CAddTorrentOptions,
  })
    .then((result) => {
      const messageName =
        result.downloadStatus === "failed"
          ? "notificationSendLinkToDownloaderFailure"
          : "notificationSendLinkToDownloaderSuccess";

      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/logo/128.png"),
        title: chrome.i18n.getMessage("extName"),
        message: chrome.i18n.getMessage(messageName, [downloader.name]),
      });
    })
    .catch(() => {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/logo/128.png"),
        title: chrome.i18n.getMessage("extName"),
        message: chrome.i18n.getMessage("notificationSendLinkToDownloaderFailure", [downloader.name]),
      });
    });
}

async function initContextMenus(tab: chrome.tabs.Tab) {
  const configStore = (await extStorage.getItem("config"))! ?? {};
  const metadataStore = (await extStorage.getItem("metadata"))! ?? {};
  const tabHost = getHostFromUrl(tab.url || "https://example.com");
  const thisTabSiteId = metadataStore?.siteHostMap?.[tabHost];
  const thisTabSiteName = metadataStore?.siteNameMap?.[thisTabSiteId];

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
    const baseSearchMenusId = addContextMenu({
      id: `${contextMenusId}**Search`,
      title: chrome.i18n.getMessage("contextMenuSearch"),
      contexts: ["selection"],
    });

    // 基本关键词搜索
    addContextMenu({
      parentId: baseSearchMenusId,
      title: chrome.i18n.getMessage("contextMenuSearchInDefault"),
      contexts: ["selection"],
      onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
        openOptionsPage({ path: "/search-entity", query: { search: info.selectionText, flush: 1 } });
      },
    });

    // 特定搜索方案搜索
    const solutions = Object.values(metadataStore.solutions ?? {})
      .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
      .sort((a, b) => b.sort - a.sort); // 按照 sort 降序排序
    if (solutions.length > 0) {
      const solutionSearchSubMenuId = addContextMenu({
        id: `${baseSearchMenusId}**Search-In-Solutions`,
        parentId: baseSearchMenusId,
        title: chrome.i18n.getMessage("contextMenuSearchInSolution"),
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
        id: `${baseSearchMenusId}**Search-In-Site`,
        parentId: baseSearchMenusId,
        title: chrome.i18n.getMessage("contextMenuSearchInSite"),
        contexts: ["selection"],
      });

      for (const site of sites) {
        if (site.id === thisTabSiteId) {
          continue; // 如果是当前站点，则不再添加到子菜单中
        }

        // 如果用户没有预构建站点名称，则使用站点ID作为标题
        const siteTitle = metadataStore.siteNameMap?.[site.id] || site.id;

        addContextMenu({
          id: `${siteSearchSubMenuId}**${site.id}`,
          parentId: siteSearchSubMenuId,
          title: siteTitle,
          contexts: ["selection"],
          onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
            openOptionsPage({ path: "/search-entity", query: { search: info.selectionText, site: site.id, flush: 1 } });
          },
        });
      }
    }

    if (thisTabSiteId) {
      addContextMenu({
        id: `${baseSearchMenusId}**Search-In-This-Site`,
        parentId: baseSearchMenusId,
        title: chrome.i18n.getMessage("contextMenuSearchInThisSite"),
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

  // 创建下载链接菜单，所有页面可用
  if (configStore.contextMenus?.allowLinkDownloadPush ?? true) {
    // 查找是否有可用的下载服务器
    const downloaders = Object.values(metadataStore.downloaders ?? {})
      .filter((x) => !!x.enabled)
      .sort((a, b) => (b.sortIndex ?? 100) - (a.sortIndex ?? 100));

    if (downloaders.length > 0) {
      // 创建基础菜单
      const baseLinkDownloadPushMenuId = addContextMenu({
        id: `${contextMenusId}**Link-Download-Push`,
        title: chrome.i18n.getMessage("contextMenuSendToDownloader"),
        contexts: ["link"],
      });

      // 跳转到 options 页面实现高级推送
      addContextMenu({
        id: `${baseLinkDownloadPushMenuId}**Link-Push`,
        parentId: baseLinkDownloadPushMenuId,
        title: chrome.i18n.getMessage("contextMenuSendToDownloaderAdvanced"),
        contexts: ["link"],
        onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
          openOptionsPage({ path: "/link-push", query: { link: info.linkUrl! } });
        },
      });

      // 为每个下载器创建子菜单
      for (const downloader of downloaders) {
        const downloaderPushSubMenuId = addContextMenu({
          id: `${baseLinkDownloadPushMenuId}**${downloader.id}`,
          parentId: baseLinkDownloadPushMenuId,
          title: chrome.i18n.getMessage("contextMenuSendToDownloaderIn", [downloader.name, downloader.address]),
          contexts: ["link"],
          // 此处不用担心子目录问题，因为如果有子目录，此处的 onclick 不会被 chrome 触发
          onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
            downloadLinkPush(info.linkUrl!, downloader);
          },
        });

        let suggestFolders = (downloader.suggestFolders ?? []).filter(
          (f) =>
            !f.includes("<...>") && // chrome 在 service worker 环境下，无法使用 window.prompt 进行输入的文件夹
            !f.includes("$search:") && // 不存在search相关参数
            !f.includes("$torrent.category$"), // 大概率也不可能存在和 torrent.category 相关的参数
        );

        // 如果没有当前站点，则不显示 $torrent.site$
        if (thisTabSiteId) {
          suggestFolders = suggestFolders.map((f) => f.replace("$torrent.site$", thisTabSiteId));
        } else {
          suggestFolders = suggestFolders.filter((f) => !f.includes("$torrent.site$"));
        }

        // 如果没有当前站点名称，则不显示 $torrent.siteName$
        if (thisTabSiteName) {
          suggestFolders = suggestFolders.map((f) => f.replace("$torrent.siteName$", thisTabSiteName));
        } else {
          suggestFolders = suggestFolders.filter((f) => !f.includes("$torrent.siteName$"));
        }

        // 替换 $date:YYYY$ 等日期变量
        const nowDate = new Date();
        suggestFolders = suggestFolders.map((f) =>
          f
            .replace("$date:YYYY$", dateFormat(nowDate, "yyyy"))
            .replace("$date:MM$", dateFormat(nowDate, "MM"))
            .replace("$date:DD$", dateFormat(nowDate, "dd")),
        );

        if (suggestFolders.length > 0) {
          suggestFolders = ["", ...suggestFolders]; // 添加一个空字符串作为默认选项

          for (let suggestFolder of suggestFolders) {
            addContextMenu({
              id: `${downloaderPushSubMenuId}**${suggestFolder}`,
              parentId: downloaderPushSubMenuId,
              title: `-> ${suggestFolder || chrome.i18n.getMessage("contextMenuSendToDownloaderDefaultFolder")}`, // 如果是空字符串，则显示为 "默认文件夹"
              contexts: ["link"],
              onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
                downloadLinkPush(info.linkUrl!, downloader, suggestFolder);
              },
            });
          }
        }
      }
    }
  }
}

chrome.tabs.onActivated.addListener((actionInfo: chrome.tabs.OnActivatedInfo) => {
  chrome.tabs.get(actionInfo.tabId, (tab: chrome.tabs.Tab) => {
    initContextMenus(tab).catch((err) => console.error("Failed to initialize context menus:", err));
  });
});

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
  initContextMenus(tab).catch((err) => console.error("Failed to initialize context menus on tabUpdated:", err));
});
