/**
 * 存放一些不需要持久化（丢失没有关系的）的结构性数据，包括：
 * 1. 种子列表页面的多媒体数据
 * 2. 种子下载记录
 */

import type { DBSchema } from "idb";
import type { ISocialInformation } from "@ptd/social";
import type { ITorrent, TSiteID as TSiteKey } from "@ptd/site";
import type { CAddTorrentOptions } from "@ptd/downloader";

import type { TDownloaderKey } from "./metadata.ts";
import type { ISearchResultTorrent } from "./runtime.ts";

export type TTorrentDownloadKey = number;

export interface ITorrentDownloadMetadata extends Pick<ITorrent, "title" | "subTitle" | "url" | "link"> {
  id?: TTorrentDownloadKey; // 每个下载任务生成的唯一id
  siteId: TSiteKey; // 站点id
  torrentId: ITorrent["id"]; // 种子id
  downloaderId: TDownloaderKey | "local"; // 下载器id，注意 local 是一个特殊的关键词，表示本地下载
  downloadAt: number; // 下载时间
  downloadStatus: "pending" | "downloading" | "completed" | "failed"; // 下载状态
  torrent: ISearchResultTorrent; // 种子信息
  addTorrentOptions: Partial<CAddTorrentOptions>;
}

export interface IPtdDBSchemaV1 extends DBSchema {
  social_information: {
    key: string;
    value: ISocialInformation;
  };
}

export interface IPtdDBSchemaV2 extends IPtdDBSchemaV1 {
  download_history: {
    key: TTorrentDownloadKey;
    value: ITorrentDownloadMetadata;
  };
}

export interface IPtdDBSchema extends IPtdDBSchemaV2 {
  favicon: {
    key: TSiteKey;
    value: string;
  };
}
