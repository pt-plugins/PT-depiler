import type { ISiteMetadata, IUserInfo } from "../types";
import GazelleJSONAPI from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  name: "SugoiMusic",
  timezoneOffset: "+0800",
  description: "music",
  type: "private",
  url: "https://sugoimusic.me/",
  favicon: "https://sugoimusic.me/favicon.ico",
  tags: ["音乐"],
  schema: "GazelleJSONAPI",
  host: "sugoimusic.me",
  collaborator: ["MewX"],
  userInfo: {
    selectors: {
      seedingSize: {
        selector: "li:contains('Total Seeding:') > span",
        filters: [{ name: "parseSize" }],
      },
      bonus: {
        selector: "#bonus_points > span",
        filters: [(q: string) => q.replace(",", "")],
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

export default class sogoimusic extends GazelleJSONAPI {
  protected override async getUserSeedingTorrents(
    userId?: number,
  ): Promise<Partial<IUserInfo>> {
    const { data: userPage } = await this.request<Document>({
      url: "/user.php",
      params: { id: userId },
      responseType: "document",
    });
    return this.getFieldsData(userPage, "userInfo", ["seedingSize", "bonus"]);
  }
}
