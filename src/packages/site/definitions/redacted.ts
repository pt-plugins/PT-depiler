import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";

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
  formerHosts: ["erqnpgrq.pu"],

  levelRequirements: [
    {
      id: 1,
      name: "Member",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.65,
      privilege: "",
    },
    {
      id: 2,
      name: "Power User",
      interval: "P2W",
      uploads: 5,
      uploaded: "25GB",
      ratio: 0.65,
      privilege: "Invites forums; Immunity from inactivity disabling",
    },
    {
      id: 3,
      name: "Elite",
      interval: "P4W",
      uploads: 50,
      uploaded: "100GB",
      ratio: 0.65,
      privilege: "",
    },
    {
      id: 4,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 500,
      uploaded: "500GB",
      ratio: 0.65,
      privilege: "Unlimited invites",
    },
    {
      id: 5,
      name: "Power TM",
      interval: "P8W",
      uniqueGroups: 500,
      uploaded: "500GB",
      ratio: 0.65,
      privilege: "",
    },
    {
      id: 6,
      name: "Elite TM",
      interval: "P8W",
      perfectFlacs: 500,
      uploaded: "500GB",
      ratio: 0.65,
      privilege: "",
    },
  ],
};
