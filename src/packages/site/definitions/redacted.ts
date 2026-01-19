import { ITorrent, IUserInfo, type ISiteMetadata } from "../types";
import GazelleJSONAPI, {
  jsonResponse,
  SchemaMetadata,
  torrentBrowseResult,
  groupBrowseResult,
  groupTorrent,
} from "../schemas/GazelleJSONAPI.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "redacted",
  name: "Redacted",
  aka: ["RED", "红"],
  description: "Redacted is a music-focused private tracker",
  tags: ["音乐"],
  timezoneOffset: "+0000",
  collaborator: ["ylxb2016", "enigamz"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["uggcf://erqnpgrq.fu/"],
  legacyUrls: ["uggcf://erqnpgrq.pu/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Music", value: 1 },
        { name: "Applications", value: 2 },
        { name: "E-Books", value: 3 },
        { name: "Audiobooks", value: 4 },
        { name: "E-Learning Videos", value: 5 },
        { name: "Comedy", value: 6 },
        { name: "Comics", value: 7 },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "发行类别",
      key: "releasetype",
      options: [
        { name: "Album", value: 1 },
        { name: "Soundtrack", value: 3 },
        { name: "EP", value: 5 },
        { name: "Anthology", value: 6 },
        { name: "Compilation", value: 7 },
        { name: "Single", value: 9 },
        { name: "Live album", value: 11 },
        { name: "Remix", value: 13 },
        { name: "Bootleg", value: 14 },
        { name: "Interview", value: 15 },
        { name: "Mixtape", value: 16 },
        { name: "Demo", value: 17 },
        { name: "Concert Recording", value: 18 },
        { name: "DJ Mix", value: 19 },
        { name: "Unknown", value: 21 },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    advanceKeywordParams: {
      imdb: false,
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      bonus: {
        text: "N/A",
      },
      bonusPerHour: {
        text: "N/A",
      },
      // /ajax.php?action=community_stats
      seedingSize: {
        selector: ["response.seedingsize"],
        filters: [{ name: "parseSize" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "User",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.65,
      privilege: "",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploads: 5,
      uploaded: "25GB",
      ratio: 0.65,
      privilege: "Invites forums; Immunity from inactivity disabling",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P4W",
      uploads: 50,
      uploaded: "100GB",
      ratio: 0.65,
      privilege: "",
    },
    {
      id: 5,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 500,
      uploaded: "500GB",
      ratio: 0.65,
      privilege: "Unlimited invites",
    },
    {
      id: 6,
      name: "Power TM",
      interval: "P8W",
      uniqueGroups: 500,
      uploaded: "500GB",
      ratio: 0.65,
      privilege: "",
    },
    {
      id: 7,
      name: "Elite TM",
      interval: "P8W",
      perfectFlacs: 500,
      uploaded: "500GB",
      ratio: 0.65,
      privilege: "",
    },
  ],
};

export interface communityStatsJsonResponse extends jsonResponse {
  response: {
    seedingsize?: string | null; // typically formatted like "418.36 GB"
    [key: string]: any;
  };
}

interface redTorrentBrowseResult extends torrentBrowseResult {
  isFreeload: boolean;
}

interface redTorrent extends groupTorrent {
  isFreeload: boolean;
}

export default class Redacted extends GazelleJSONAPI {
  protected override async transformUnGroupTorrent(group: redTorrentBrowseResult): Promise<ITorrent> {
    const tor = await super.transformUnGroupTorrent(group);
    if (group.isFreeload) {
      tor.tags?.push({ name: "Freeload", color: "red" });
    }
    return tor;
  }

  protected override async transformGroupTorrent(group: groupBrowseResult, torrent: redTorrent): Promise<ITorrent> {
    const tor = await super.transformGroupTorrent(group, torrent);
    if (torrent.isFreeload) {
      tor.tags?.push({ name: "Freeload", color: "red" });
    }
    return tor;
  }

  protected override async getSeedingSize(userId: number, sizeIndex: number = 0): Promise<Partial<IUserInfo>> {
    await this.sleepAction(this.metadata.userInfo?.requestDelay);

    const { data: apiUser } = await this.requestApi<communityStatsJsonResponse>("community_stats", {
      userid: userId,
    });

    return this.getFieldsData(apiUser, this.metadata.userInfo!.selectors!, [
      "seedingSize",
    ] as (keyof Partial<IUserInfo>)[]) as Partial<IUserInfo>;
  }
}
