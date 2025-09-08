import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/GazelleJSONAPI.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "orpheus",
  name: "Orpheus",
  aka: ["OPS"],
  description: "Orpheus is a music-focused private tracker, successor to RED",
  tags: ["音乐"],
  timezoneOffset: "+0000",
  collaborator: ["ylxb2016", "enigamz"],

  type: "private",
  schema: "GazelleJSONAPI",

  urls: ["https://orpheus.network/"],

  levelRequirements: [
    {
      id: 1,
      name: "User",
      privilege: "None. Standard class for all new members",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploads: 5,
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "Must remain active per the Account Inactivity policy",
    },
    {
      id: 3,
      name: "Power User",
      interval: "P2W",
      uploads: 5,
      uploaded: "25GB",
      ratio: 1.05,
      privilege:
        "Immune to inactivity pruning;Torrent Notification system;Collage Creation (other than Personal) privileges;Access the Power User forums and IRC channels.",
    },
    {
      id: 4,
      name: "Elite",
      interval: "P4W",
      uploads: 50,
      uploaded: "100GB",
      ratio: 1.05,
      privilege:
        "ame as lower classes, plus can access the Invitations and Elite forums and IRC channels. Can edit torrents. Able to rename their personal collages.",
    },
    {
      id: 5,
      name: "Torrent Master",
      interval: "P8W",
      uploads: 500,
      uploaded: "500GB",
      ratio: 1.05,
      privilege:
        "Same as lower classes, plus can access TM forums and IRC channels. Can request their own custom title.",
    },
    {
      id: 6,
      name: "Power Torrent Master",
      interval: "P8W",
      uniqueGroups: 500,
      uploaded: "500GB",
      ratio: 1.05,
      privilege: "Same as lower classes",
    },
    {
      id: 7,
      name: "Elite Torrent Master",
      interval: "P8W",
      perfectFlacs: 500,
      uploaded: "500GB",
      ratio: 1.05,
      privilege:
        "Same as lower classes, plus can access ETM forums and IRC channels. Gets unlimited invites. Can edit Missing Lineage flag on torrents",
    },
    {
      id: 8,
      name: "Ultimate Torrent Master",
      interval: "P8W",
      perfectFlacs: 2000,
      uploaded: "2048GB",
      ratio: 1.05,
      privilege: "Can view search past page 20",
    },
  ],
};
