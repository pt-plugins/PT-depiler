import { nanoid } from "nanoid";

import { type CAddTorrentOptions } from "@ptd/downloader/types.ts";
import { datePathTemplateVars, expandPathTemplate } from "@ptd/downloader/utils/pathTemplate.ts";
import { getHostFromUrl } from "@ptd/site/utils/html.ts"; // 这里不能使用 @ptd/site 的主入口，会导致 sw 无法加载
import { type ITorrent } from "@ptd/site/types/torrent.ts";

import { extStorage } from "@/storage.ts";
import { onMessage, sendMessage } from "@/messages.ts";
import { type IDownloaderMetadata } from "@/shared/types/storages/metadata.ts";

import { openOptionsPage } from "./base.ts";

const contextMenusId = "PT-Depiler-Context-Menus";

const contextMenusClickEventBus = new Map<
  string | number,
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => void
>();

chrome.contextMenus?.onClicked.addListener((info, tab) => {
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

  // 必须传入 callback：否则 create 失败（如 ID 重复）只会以 Unchecked runtime.lastError 的形式暴露
  chrome.contextMenus?.create(data, () => {
    const error = chrome.runtime.lastError;
    if (error) {
      console.warn(`[PTD] Failed to create context menu "${data.id}": ${error.message}`);
    }
  });
  return data.id;
}

onMessage("addContextMenu", async ({ data }) => addContextMenu(data));

function removeContextMenu(id: string) {
  contextMenusClickEventBus.delete(id);
  chrome.contextMenus?.remove(id).catch(() => {}); // 菜单项可能已不存在，忽略错误
}

onMessage("removeContextMenu", async ({ data }) => removeContextMenu(data));

async function clearContextMenus() {
  contextMenusClickEventBus.clear();
  // 必须等待 removeAll 完成，否则紧随其后的 create 会因 ID 尚未被移除而报 duplicate id
  await chrome.contextMenus?.removeAll().catch(() => {});
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
  // title 由调用方补充（@types/chrome 0.3.4 起 CreateProperties 的 title 为必填），故此处排除
  extraCreateMenuProperties?: Omit<chrome.contextMenus.CreateProperties, "title">;
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
    onclick: (info) => {
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
        onclick: (info) => {
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
        onclick: (info) => {
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
      onclick: (info) => {
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

  // 菜单集合完全由下面这些输入决定（solutions / sites / siteNameMap / downloaders / contextMenus 配置，
  // 以及当前标签页命中的站点 —— 它会把自己从站内搜索子菜单里排除、并参与 $torrent.site$ 替换）。
  // 输入没变就不必再 removeAll + 逐个 create：切换标签页会频繁触发 onActivated，
  // 而站点多、下载器多时一次重建要发 300~400 次 contextMenus.create。
  const signature = JSON.stringify([
    configStore?.contextMenus ?? null,
    metadataStore?.solutions ?? null,
    Object.keys(metadataStore?.sites ?? {}),
    metadataStore?.siteNameMap ?? null,
    metadataStore?.downloaders ?? null,
    thisTabSiteId ?? null,
  ]);
  if (signature === lastContextMenusSignature) {
    console.debug("[PTD] Context menus unchanged, skip rebuilding.");
    return;
  }

  // 清除原来的菜单
  await clearContextMenus();

  // 如果配置中禁用右键菜单，则不进行任何操作
  if (configStore?.contextMenus?.enabled === false) {
    console.debug("[PTD] Context menus are disabled, skipping initialization.");
    lastContextMenusSignature = signature; // 记住「当前就应该没有菜单」，避免每次切标签页都白 removeAll 一遍
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
        onclick: (info) => {
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
          onclick: (info, tab) => {
            downloadLinkPush(info.linkUrl!, downloader, undefined, tab?.title, tab?.url);
          },
        });

        let suggestFolders = (downloader.suggestFolders ?? []).filter(
          (f) => !EXCLUDE_FOLDER_KEYWORDS.some((keywords) => f.includes(keywords)),
        );

        // 展开建议目录里的 $…$ 变量：当前标签页没有站点 / 站点名时，对应目录项直接不显示
        // （右键菜单里没有 prompt() 可用，遇到解析不了的变量只能整项丢掉）
        const siteReplaceMap: Record<string, string> = { ...datePathTemplateVars() };
        if (thisTabSiteId) {
          siteReplaceMap["torrent.site"] = thisTabSiteId;
        }
        if (thisTabSiteName) {
          siteReplaceMap["torrent.siteName"] = thisTabSiteName;
        }
        suggestFolders = suggestFolders
          .map((folder) => expandPathTemplate(folder, siteReplaceMap, { dropUnresolved: true }))
          .filter((folder): folder is string => folder !== null);

        if (suggestFolders.length > 0) {
          // 添加一个空字符串作为默认选项；变量替换后可能出现同名文件夹，去重以避免生成重复的菜单 ID
          suggestFolders = [...new Set(["", ...suggestFolders])];

          for (let suggestFolder of suggestFolders) {
            addContextMenu({
              id: `${downloaderPushSubMenuId}**${suggestFolder}`,
              parentId: downloaderPushSubMenuId,
              title: `-> ${suggestFolder || chrome.i18n.getMessage("contextMenuSendToDownloaderDefaultFolder")}`, // 如果是空字符串，则显示为 "默认文件夹"
              contexts: ["link"],
              onclick: (info, tab) => {
                downloadLinkPush(info.linkUrl!, downloader, suggestFolder, tab?.title, tab?.url);
              },
            });
          }
        }
      }
    }
  }

  // 整轮构建成功走完，记下签名：输入不变时下次激活标签页直接跳过重建。
  // 中途抛错则不会执行到这里，签名保持旧值 → 下次仍会重建。
  lastContextMenusSignature = signature;
}
// 串行化 initContextMenus：快速切换标签页会并发触发 onActivated，
// 多次 removeAll/create 交错执行同样会导致 duplicate id，因此这里用任务队列逐个执行
let initContextMenusTask: Promise<void> = Promise.resolve();

/** 上一次成功构建出的菜单所对应的输入签名；为 null 表示「下次激活必须重建」 */
let lastContextMenusSignature: string | null = null;

function scheduleInitContextMenus(tab: chrome.tabs.Tab) {
  initContextMenusTask = initContextMenusTask
    .catch(() => {}) // 前一次失败不应阻塞后续初始化
    .then(() => initContextMenus(tab))
    .catch((err) => console.error("Failed to initialize context menus:", err));
}

// 配置 / 元数据一旦变化就作废签名，让下一次激活标签页时重建。
// 这里不直接重建：签名比较需要先读一遍存储，而 $save() 的调用点很多，保存是高频事件。
if (chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes) => {
    if ("config" in changes || "metadata" in changes) {
      lastContextMenusSignature = null;
    }
  });
}

if (chrome.contextMenus) {
  chrome.tabs.onActivated.addListener((actionInfo: chrome.tabs.OnActivatedInfo) => {
    chrome.tabs.get(actionInfo.tabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        return; // 标签页可能已被关闭
      }
      scheduleInitContextMenus(tab);
    });
  });
}
