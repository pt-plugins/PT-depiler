/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/blueroms.yml
 */
import BittorrentSite from "../schemas/AbstractBittorrentSite";
import { type ISiteMetadata, type ITorrent } from "../types";

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "blueroms",
  name: "BlueRoms",
  description: "BlueRoms is a Public Torrent Tracker for ROMS",
  tags: ["游戏"],

  type: "public",
  urls: ["https://www.blueroms.ws/"],

  category: [
    {
      name: "平台",
      key: "p",
      options: [
        { name: "Arcade", value: "arcade" },
        { name: "Dreamcast", value: "dreamcast" },
        { name: "Game Boy Advance", value: "gba" },
        { name: "Mega Drive - Genesis", value: "genesis" },
        { name: "Neo Geo", value: "neogeo" },
        { name: "Nintendo 3DS", value: "3ds" },
        { name: "Nintendo 64", value: "n64" },
        { name: "Nintendo DS", value: "nds" },
        { name: "Nintendo GameCube", value: "gamecube" },
        { name: "Nintendo Switch", value: "switch" },
        { name: "Nintendo Wii", value: "wii" },
        { name: "Nintendo Wii U", value: "wiiu" },
        { name: "PlayStation", value: "ps1" },
        { name: "PlayStation 2", value: "ps2" },
        { name: "PlayStation 3", value: "ps3" },
        { name: "PlayStation 4", value: "ps4" },
        { name: "PlayStation Portable", value: "psp" },
        { name: "PlayStation Vita", value: "psvita" },
        { name: "Saturn", value: "saturn" },
        { name: "Super Nintendo", value: "snes" },
        { name: "Xbox", value: "xbox" },
      ],
      cross: false,
    },
  ],

  search: {
    keywordPath: "params.q",
    requestConfig: {
      url: "/search",
      responseType: "document",
      params: { page: 1, g: 0, p: 0, ord: "desc", at: "date" },
    },
    selectors: {
      rows: { selector: "div.row > div.col-xs-12" },
      // 同一个游戏可能同时登录多个平台，url 末段（slug）会撞车，这里把平台名一起当作 id
      id: {
        selector: "h4.card-title a",
        attr: "href",
        filters: [(query: string) => query.replace(/^\/game\//, "")],
      },
      title: { selector: "h4.card-title a" },
      subTitle: { selector: "p.card-text a" },
      url: { selector: "h4.card-title a", attr: "href" },
      // 列表页给的是 /download/<token> 中转页，真正的 magnet 需要在中转页取（见类里的 getTorrentDownloadLink）
      link: { selector: "div.card-footer a", attr: "href" },
      size: { selector: "p.card-text", filters: [{ name: "parseSize" }] },
      category: { selector: "p.card-text a" },
      // 页面上的日期是「游戏的发售日期」，不是种子发布时间，故不取
    },
  },
};

export default class BlueRoms extends BittorrentSite {
  public override async getTorrentDownloadLink(torrent: ITorrent): Promise<string> {
    if (torrent.link && !torrent.link.startsWith("magnet:")) {
      // /download/<token> 页面上的 button#magnet-button[data-link] 是 base64 编码的 magnet
      const { data } = await this.request<Document>({ url: torrent.link, responseType: "document" });
      const encoded = this.getFieldData(data, { selector: "button#magnet-button", attr: "data-link" }) as string;
      if (encoded) {
        return atob(encoded.replace(/\s+/g, ""));
      }
    }

    return super.getTorrentDownloadLink(torrent);
  }
}
