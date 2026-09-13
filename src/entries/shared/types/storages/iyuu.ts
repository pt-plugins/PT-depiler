/**
 * IYUU 辅种中心配置存储
 * 注意：token 为敏感凭据，明文存本地 storage，**不进备份**（backup fields 不含 iyuu）
 */

/** IYUU 站点表缓存条目（轻量内联，避免依赖 @ptd/iyuu 包类型造成路径耦合） */
export interface IIyuuSiteCacheEntry {
  id: number; // IYUU sid
  site: string;
  nickname: string;
  base_url: string;
  download_page: string;
  details_page: string;
  is_https: 0 | 1 | 2;
  cookie_required: 0 | 1;
}

export interface IIyuuStorageSchema {
  /** IYUU token（iyuu.cn 获取） */
  token?: string;

  /** 已持有站点（本地 TSiteID 列表，设置页勾选/自动推导结果） */
  heldSites?: string[];

  /** 站点汇报得到的 sid_sha1（7 天有效，站点列表不变可复用） */
  sidSha1?: string;
  sidSha1ExpiresAt?: number;

  /** IYUU 站点表缓存（TTL 24h） */
  sitesCache?: {
    fetchedAt: number;
    sites: IIyuuSiteCacheEntry[];
  };
}
