import type { ISiteMetadata, IUserInfo } from "../types";
import GazelleJSONAPI from "../schemas/GazelleJSONAPI";

export const siteMetadata: ISiteMetadata = {
  name: "DIC",
  timezoneOffset: "+0800",
  description: "music",
  url: "https://dicmusic.club/",
  tags: ["音乐"],
  type: "private",
  schema: "GazelleJSONAPI",
  host: "dicmusic.club",
  collaborator: ["ylxb2016", "enigmaz"],
  userInfo: {
    selectors: {
      seedingSize: {
        selector: ["table#bprates_overview > tbody > tr > td:eq(1)"],
        filters: [{ name: "parseSize" }],
      },
      bonus: {
        selector: ["div#content > div.header > h3"],
        filters: [
          (query: string) => {
            const queryMatch = query.replace(/,/g, "").match(/.+?([\d.]+)/);
            return queryMatch && queryMatch.length >= 2 ? queryMatch[1] : 0;
          },
        ],
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

export default class dicmusic extends GazelleJSONAPI {
  protected override async getUserSeedingTorrents(): Promise<Partial<IUserInfo>> {
    const { data: bonusPage } = await this.request<Document>({
      url: "/bonus.php",
      params: { action: "bprates" },
      responseType: "document",
    });
    return this.getFieldsData(bonusPage, "userInfo", ["seedingSize", "bonus"]);
  }
}
