import { ISearchInput, ISiteMetadata, ITorrent } from "../types";
import { buildCategoryOptionsFromList } from "../utils";
import { browseJsonResponse, SchemaMetadata } from "../schemas/GazelleJSONAPI";
import GreatPosterWall, { siteMetadata as GPWSiteMetadata } from "./greatposterwall";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "mooko",
  name: "MooKo",
  description: "MooKo is a CHINESE Private Torrent Tracker for MOVIES / TV / GENERAL",
  tags: ["影视"],
  timezoneOffset: "+0800",

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["uggcf://zbbxb.bet/"],

  category: [
    ...(GPWSiteMetadata.category?.filter((c) => c.key !== "taglist") || []),
    {
      name: "标签",
      key: "taglist",
      options: buildCategoryOptionsFromList([
        ["动作", "青涩", "冒险", "动画", "传记", "喜剧", "犯罪", "纪录片", "剧情", "家庭", "奇幻", "历史"],
        ["恐怖", "音乐", "歌舞", "悬疑", "真人秀", "爱情", "科幻", "短片", "运动", "惊悚", "战争", "西部"],
      ]),
      cross: { mode: "comma" },
    },
  ],

  userInfo: {
    ...GPWSiteMetadata.userInfo,
  },

  // 没有说明
  // levelRequirements: [],
};

export default class MooKo extends GreatPosterWall {
  public override async transformSearchPage(
    doc: browseJsonResponse | any,
    searchConfig: ISearchInput,
  ): Promise<ITorrent[]> {
    const torrents = await super.transformSearchPage(doc, searchConfig);
    return torrents.map((torrent) => {
      if (typeof torrent.ext_imdb === "string" && torrent.ext_imdb.startsWith("tmdb")) {
        // 格式是 tmdb_12345
        // torrent.ext_tmdb = torrent.ext_imdb.split("_")[1];
        torrent.ext_imdb = null;
      }
      // 做种数 >= 5 都是 HR 种
      if (torrent.seeders && torrent.seeders >= 5) {
        torrent.tags!.push({ name: "H&R", color: "red" });
      }
      return torrent;
    });
  }
}
