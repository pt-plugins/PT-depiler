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
        { name: "Sampler", value: 8 },
        { name: "Single", value: 9 },
        { name: "Demo", value: 10 },
        { name: "Live album", value: 11 },
        { name: "Split", value: 12 },
        { name: "Remix", value: 13 },
        { name: "Bootleg", value: 14 },
        { name: "Interview", value: 15 },
        { name: "Mixtape", value: 16 },
        { name: "DJ Mix", value: 17 },
        { name: "Concert recording", value: 18 },
        { name: "Unknown", value: 21 },
      ],
    },
  ],

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
