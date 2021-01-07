// 适用于公网BT站点
export abstract class BittorrentSite {
  protected readonly feature : {
    [key in SiteFeature]: boolean
  } = {
    '': false
  }

  abstract searchTorrents(filter: searchFilter) : Promise<searchResult>;
}

// 适用于PT站点
export abstract class PrivateSite extends BittorrentSite {
  abstract getUserInfo(): Promise<UserInfo> ;
}
