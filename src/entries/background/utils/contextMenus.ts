import { nanoid } from "nanoid";
import { format as dateFormat } from "date-fns";

import { type CAddTorrentOptions } from "@ptd/downloader";
import { getHostFromUrl } from "@ptd/site/utils/html.ts"; // 这里不能使用 @ptd/site 的主入口，会导致 sw 无法加载
import { type ITorrent } from "@ptd/site/types/torrent.ts";

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

async function downloadLinkPush(
  link: string,
  downloader: IDownloaderMetadata,
  folder?: string,
  title?: string,
  url?: string,
) {
  // 从链接中提取站点信息，与 ContextMenuLinkPush.vue 保持一致
  const torrent: Partial<ITorrent> = {
    link,
    title,
    url,
  };

  // 尝试从 link 中解出site
  if (link.match(/https?:\/\/([^/]+)/)) {
    const host = getHostFromUrl(link);
    try {
      const metadataStore = await extStorage.getItem("metadata");
      if (metadataStore?.siteHostMap?.[host]) {
        torrent.site = metadataStore.siteHostMap[host];
      }
    } catch (error) {
      console.warn("[PTD] Failed to get metadata store for site detection:", error);
    }
  }

  // 发送下载请求
  sendMessage("downloadTorrent", {
    torrent, // 组装包含标题、URL和站点信息的种子对象
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

interface ICreateSearchMenuOption {
  thisTabSiteId?: string;
  extraCreateMenuProperties?: chrome.contextMenus.CreateProperties;
  selectionTextFilterFn?: (value?: chrome.contextMenus.OnClickData) => string;
}

async function createSearchMenu(baseMenuId: string, options: ICreateSearchMenuOption = {}) {
  const metadataStore = (await extStorage.getItem("metadata"))! ?? {};

  const {
    thisTabSiteId = null,
    selectionTextFilterFn = (a) => a?.selectionText ?? "",
    extraCreateMenuProperties = {},
  } = options;

  // 基本关键词搜索
  addContextMenu({
    parentId: baseMenuId,
    title: chrome.i18n.getMessage("contextMenuSearchInDefault"),
    contexts: ["selection"],
    ...extraCreateMenuProperties,
    onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
      openOptionsPage({
        path: "/search-entity",
        query: { search: selectionTextFilterFn(info), flush: 1 },
      });
    },
  });

  // 特定搜索方案搜索
  const solutions = Object.values(metadataStore.solutions ?? {})
    .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
    .sort((a, b) => b.sort - a.sort); // 按照 sort 降序排序
  if (solutions.length > 0) {
    const solutionSearchSubMenuId = addContextMenu({
      id: `${baseMenuId}**Search-In-Solutions`,
      parentId: baseMenuId,
      title: chrome.i18n.getMessage("contextMenuSearchInSolution"),
      contexts: ["selection"],
      ...extraCreateMenuProperties,
    });

    for (const solution of solutions) {
      addContextMenu({
        id: `${solutionSearchSubMenuId}**${solution.id}`,
        parentId: solutionSearchSubMenuId,
        title: solution.name,
        contexts: ["selection"],
        ...extraCreateMenuProperties,
        onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
          openOptionsPage({
            path: "/search-entity",
            query: { search: selectionTextFilterFn(info), plan: solution.id, flush: 1 },
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
      id: `${baseMenuId}**Search-In-Site`,
      parentId: baseMenuId,
      title: chrome.i18n.getMessage("contextMenuSearchInSite"),
      contexts: ["selection"],
      ...extraCreateMenuProperties,
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
        ...extraCreateMenuProperties,
        onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
          openOptionsPage({
            path: "/search-entity",
            query: { search: selectionTextFilterFn(info), plan: `site:${site.id}`, flush: 1 },
          });
        },
      });
    }
  }

  if (thisTabSiteId) {
    addContextMenu({
      id: `${baseMenuId}**Search-In-This-Site`,
      parentId: baseMenuId,
      title: chrome.i18n.getMessage("contextMenuSearchInThisSite"),
      contexts: ["selection"],
      ...extraCreateMenuProperties,
      onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
        openOptionsPage({
          path: "/search-entity",
          query: { search: info.selectionText, plan: `site:${thisTabSiteId}`, flush: 1 },
        });
      },
    });
  }
}

async function initContextMenus(tab: chrome.tabs.Tab) {
  // 这里不处理 https://github.com/pt-plugins/PT-depiler/pull/470#discussion_r2295102201 提到的情况，因为会导致后面的type错误
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
    await createSearchMenu(baseSearchMenusId);
  }

  // 创建社交链接搜索菜，所有页面可用
  if (configStore.contextMenus?.allowSocialLinkSearch ?? true) {
    // 豆瓣链接
    const donbanMenuId = addContextMenu({
      id: `${contextMenusId}**SearchByDoubanLink`,
      title: chrome.i18n.getMessage("contextMenuSearchWithDouban"),
      contexts: ["link"],
      targetUrlPatterns: ["*://movie.douban.com/subject/*"],
    });
    await createSearchMenu(donbanMenuId, {
      extraCreateMenuProperties: {
        contexts: ["link"],
        targetUrlPatterns: ["*://movie.douban.com/subject/*"],
      },
      selectionTextFilterFn: (info) => {
        const failSearchText = info?.selectionText ?? "";
        if (info?.linkUrl) {
          const link = info.linkUrl.match(/subject\/(\d+)/);
          return link ? `douban|${link[1]}` : failSearchText;
        }
        return failSearchText;
      },
    });

    // IMDb 链接
    const imdbMenuId = addContextMenu({
      id: `${contextMenusId}**SearchByIMDbLink`,
      title: chrome.i18n.getMessage("contextMenuSearchWithIMDb"),
      contexts: ["link"],
      targetUrlPatterns: ["*://www.imdb.com/title/tt*"],
    });

    await createSearchMenu(imdbMenuId, {
      extraCreateMenuProperties: {
        contexts: ["link"],
        targetUrlPatterns: ["*://www.imdb.com/title/tt*"],
      },
      selectionTextFilterFn: (info) => {
        const failSearchText = info?.selectionText ?? "";
        if (info?.linkUrl) {
          const link = info.linkUrl.match(/(tt\d+)/);
          return link ? `imdb|${link[1]}` : failSearchText;
        }
        return failSearchText;
      },
    });
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

      // 在 contextMenus 环境下，很多动态参数无法获取，因此要在生成的菜单栏中滤去
      const EXCLUDE_FOLDER_KEYWORDS = [
        "<...>", // chrome 在 service worker 环境下，无法使用 window.prompt 进行输入的文件夹
        "$search:", // 不存在search相关参数
        // 大概率也不可能存在下面和 torrent 相关的参数
        "$torrent.title$",
        "$torrent.subTitle$",
        "$torrent.category$",
      ];

      // 为每个下载器创建子菜单
      for (const downloader of downloaders) {
        const downloaderPushSubMenuId = addContextMenu({
          id: `${baseLinkDownloadPushMenuId}**${downloader.id}`,
          parentId: baseLinkDownloadPushMenuId,
          title: chrome.i18n.getMessage("contextMenuSendToDownloaderIn", [downloader.name, downloader.address]),
          contexts: ["link"],
          // 此处不用担心子目录问题，因为如果有子目录，此处的 onclick 不会被 chrome 触发
          onclick: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
            downloadLinkPush(info.linkUrl!, downloader, undefined, tab?.title, tab?.url);
          },
        });

        let suggestFolders = (downloader.suggestFolders ?? []).filter(
          (f) => !EXCLUDE_FOLDER_KEYWORDS.some((keywords) => f.includes(keywords)),
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
                downloadLinkPush(info.linkUrl!, downloader, suggestFolder, tab?.title, tab?.url);
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
  // 只在URL变化或loading完成时重建菜单
  if (changeInfo.url || changeInfo.status === "complete") {
    initContextMenus(tab).catch((err) => console.error("Failed to initialize context menus on tabUpdated:", err));
  }
});
