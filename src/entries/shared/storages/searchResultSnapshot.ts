import { ISearchData } from "./runtime.ts";

export type TSearchSnapshotKey = string;

export interface ISearchSnapshotMetaData {
  id: TSearchSnapshotKey;
  name: string; // [搜索方案] 搜索词 (搜索时间)
  createdAt: number;
  recordCount: number; // 记录数
}

export interface ISearchResultSnapshotPiniaStorageSchema {
  snapshot: {
    [key: TSearchSnapshotKey]: ISearchSnapshotMetaData;
  };
}

export interface ISearchResultSnapshotDataStorageSchema {
  [key: TSearchSnapshotKey]: ISearchData;
}
