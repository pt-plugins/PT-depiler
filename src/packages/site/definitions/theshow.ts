/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/theshow.yml
 *
 * TheShow uses the TCG engine, like TheGeeks. Authenticated pages checked on 2026-11-26:
 * category IDs match Jackett, but the live search form uses c<ID>=1, not filter_cat[ID]=1.
 * Search results, torrent details and user-information selectors match the TCG schema.
 */
import type { ISiteMetadata } from "../types.ts";
import { SchemaMetadata } from "../schemas/TCG.ts";
import { definedFilters, buildCategoryOptionsFromDict } from "../utils.ts";

// Omit the two vacant (-empty-) categories in the upstream definition.
const categoryMap: Record<number, string> = {
  17: "A-V: Film/Video Editing",
  30: "A-V: Sound Recording/Design",
  6: "A-V: Videography",
  9: "A-V: Visual FX",
  29: "Business / Distribution",
  56: "Creative Writing",
  25: "Digital Craft: 3D Modeling",
  63: "Everything Else",
  65: "Film History / Theory",
  64: "Graphics / Photo Editing",
  32: "Magazines / Trade Journals",
  66: "Mindset / Creativity",
  67: "Music Business / Promotion",
  73: "Music: Shows/Special Events",
  200: "NEW A-V: Videography",
  70: "Performances: Competitions",
  94: "Performances: Dance/Ballet",
  82: "Performances: Drama/Art",
  76: "Performances: Sketch/Improv",
  75: "Performances: Spoken Word",
  78: "Performances: Standup Comedy",
  51: "Performing Craft: Acting",
  4: "Performing Craft: Dance",
  10: "Production: Cinematography",
  1: "Production: Directing (Film)",
  7: "Production: Directing(Theatre)",
  53: "Production: Visuals",
  77: "Radio: Comedy/Drama/Mystery",
  79: "Radio: Entertain/Arts/Narrativ",
  80: "Radio: Music Performances",
  83: "Scripts: Radio",
  84: "Scripts: Television",
  85: "Scripts: Theatre",
  49: "Software / Tutorials",
  26: "Stock: Film / Video",
  54: "Stock: Music / Sound FX",
  13: "Stock: Photos / Illustrations",
  69: "TV Shows: Action/Drama/Mystery",
  68: "TV Shows: Comedy",
  71: "TV Shows: Entertain/Chat/Goss",
  92: "Visual Craft: Design Theory",
  91: "Visual Craft: Drawing/Drafting",
  87: "Visual Craft: Fashion/Makeup",
  90: "Visual Craft: Handcraft/Sculpt",
  93: "Visual Craft: Jewelry Making",
  11: "Visual Craft: Needlework",
  52: "Visual Craft: Photography",
  89: "Visual Craft: Scrapbooking",
  88: "Visual Craft: Tattoos/Body Art",
  21: "Writing Craft: Screenwriting",
};

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "theshow",
  name: "TheShow",
  aka: ["TSBZ"],
  description: "TheShow is a private tracker for entertainment-industry e-learning.",
  tags: ["学习"],

  type: "private",
  schema: "TCG",
  urls: ["https://theshow.click/"],

  category: [
    {
      name: "类别",
      key: "category",
      options: buildCategoryOptionsFromDict(categoryMap),
      cross: { mode: "append", key: "c" },
    },
    {
      name: "种子状态",
      key: "incldead",
      options: [
        { name: "Active", value: 0 },
        { name: "Including Inactive", value: 1 },
        { name: "Only Inactive", value: 2 },
        { name: "Exclusive", value: 4 },
        { name: "Neutral", value: 5 },
      ],
    },
    {
      name: "搜索类型",
      key: "nonboolean",
      options: [
        { name: "Exact", value: 0 },
        { name: "Fuzzy", value: 1 },
        { name: "Parsed", value: 3 },
        { name: "Simple", value: 4 },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search,
    selectors: {
      ...SchemaMetadata.search.selectors,
      category: {
        selector: "a[href^='browse.php?cat=']",
        attr: "href",
        filters: [
          (query: string) => {
            const catId = definedFilters.querystring(query, ["cat"]);
            return categoryMap[Number(catId)] ?? catId;
          },
        ],
      },
    },
  },
};
