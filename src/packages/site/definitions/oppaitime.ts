import type { ISiteMetadata, IUserInfo } from "../types";
import GazelleJSONAPI from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  name: "Oppaitime",
  timezoneOffset: "+0000",
  description: "成人动漫站",
  schema: "GazelleJSONAPI",
  type: "private",
  tags: ["动画", "漫画", "游戏", "影视"],
  url: "https://oppaiti.me/",
  collaborator: ["bimzcy"],
  category: {
    key: "filter_cat",
    options: [
      { value: 1, name: "Movies" },
      { value: 2, name: "Anime" },
      { value: 3, name: "Manga" },
      { value: 4, name: "Games" },
      { value: 5, name: "Audio" },
      { value: 6, name: "Other" },
    ],
    cross: { mode: "append" },
  },
  userInfo: {
    selectors: {
      seedingSize: {
        selector: ["li:contains('Total Seeding: ') > span"],
        filters: [{ name: "parseSize" }],
      },
      bonus: {
        selector: ["span.stat > a[href]"],
        filters: [(query: string) => query.replace(",", "")],
      },
    },
  },
  search: {
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
  },
};

export default class oppaitime extends GazelleJSONAPI {
  protected override async getUserSeedingTorrents(
    userId: number,
  ): Promise<Partial<IUserInfo>> {
    const { data: bonusPage } = await this.request<Document>({
      url: "/user.php",
      params: { id: userId },
      responseType: "document",
    });
    return this.getFieldsData(bonusPage, "userInfo", ["seedingSize", "bonus"]);
  }
}
