import type { IFetchSocialSiteInformationConfig, ISocialInformation, TSupportSocialSite } from "./types.ts";

import { parse as parseAnidb, build as buildAnidb, fetchInformation as fetchAnidb } from "./entity/anidb.ts";
import {
  parse as parseBangumi,
  build as buildBangumi,
  transformPtGen as transBangumi,
  fetchInformation as fetchBangumi,
} from "./entity/bangumi.ts";
import {
  parse as parseDouban,
  build as buildDouban,
  transformPtGen as transDouban,
  fetchInformation as fetchDouban,
} from "./entity/douban.ts";
import {
  parse as parseImdb,
  build as buildImdb,
  transformPtGen as transImdb,
  fetchInformation as fetchImdb,
} from "./entity/imdb.ts";
import { parse as parseTmdb, build as buildTmdb, fetchInformation as fetchTmdb } from "./entity/tmdb.ts";
import { parse as parseTvdb, build as buildTvdb, fetchInformation as fetchTvdb } from "./entity/tvdb.ts";

import axios from "axios";

import { log } from "~/helper.ts";

export const buildInPtGenApi = [
  "https://pt-gen.netlify.app/<site>/<sid>.json",
  "https://ourbits.github.io/PtGen/<site>/<sid>.json",
  "https://cdn.ourhelp.club/ptgen/<site>/<sid>.json",
  "https://api.ourhelp.club/infogen?site=<site>&sid=<sid>",
];

const PtGenApiSupportSite: TSupportSocialSite[] = ["imdb", "douban", "bangumi"] as const;

export const socialBuildUrlMap: Record<TSupportSocialSite, (id: string) => string> = {
  imdb: buildImdb,
  douban: buildDouban,
  bangumi: buildBangumi,
  tmdb: buildTmdb,
  tvdb: buildTvdb,
  anidb: buildAnidb,
};

export const socialParseUrlMap: Record<TSupportSocialSite, (query: string) => string> = {
  anidb: parseAnidb,
  bangumi: parseBangumi,
  douban: parseDouban,
  imdb: parseImdb,
  tmdb: parseTmdb,
  tvdb: parseTvdb,
};

export async function getSocialSiteInformation(
  site: TSupportSocialSite,
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
  // @ts-ignore
): Promise<ISocialInformation | undefined> {
  const { usePtGen = true, ptGenEndpoint = buildInPtGenApi[0], timeout = 5e3 } = config;

  if (usePtGen && PtGenApiSupportSite.includes(site)) {
    log("Use PtGen API to fetch social site information ", { site, id });

    for (const ptGenEndpointElement of new Set<string>([ptGenEndpoint, ...buildInPtGenApi])) {
      const ptGenUrl = ptGenEndpointElement.replace("<site>", site).replace("<sid>", id);
      try {
        const req = await axios.get(ptGenUrl, { timeout, responseType: "json" });
        if (req.status === 200) {
          const data = req.data as any;
          if (data.success !== false) {
            // @ts-ignore
            const transformers: Record<(typeof PtGenApiSupportSite)[number], (data: any) => ISocialInformation> = {
              bangumi: transBangumi,
              douban: transDouban,
              imdb: transImdb,
            };

            if (transformers[site as (typeof PtGenApiSupportSite)[number]]) {
              return transformers[site as (typeof PtGenApiSupportSite)[number]](data);
            }
          }
        }
      } catch (error) {}
    }
  } else {
    log("Use build-in API to fetch social site information:", { site, id });

    const fetchFunctions: Record<
      TSupportSocialSite,
      (id: string, config: IFetchSocialSiteInformationConfig) => Promise<ISocialInformation>
    > = {
      anidb: fetchAnidb,
      bangumi: fetchBangumi,
      douban: fetchDouban,
      imdb: fetchImdb,
      tmdb: fetchTmdb,
      tvdb: fetchTvdb,
    };

    if (fetchFunctions[site]) {
      return await fetchFunctions[site](id, config);
    }
  }
}
