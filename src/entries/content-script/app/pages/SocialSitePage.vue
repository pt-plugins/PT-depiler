<script setup lang="ts">
import { inject, shallowRef, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ISocialSitePageInformation, socialPageParserMatchesMap } from "@ptd/social";

import { useConfigStore } from "@/options/stores/config.ts";
import { doKeywordSearch, type IPtdData } from "../utils.ts";

import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import SocialSiteParseResultsDialog from "@/content-script/app/components/SocialSiteParseResultsDialog.vue";

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const { t } = useI18n();
const ptdData = inject<IPtdData>("ptd_data", {});
const socialSiteParseResults = shallowRef<ISocialSitePageInformation[]>([]);
const showSocialSiteParseResultsDialog = ref<boolean>(false);

function getSearchTitle(parseResult: ISocialSitePageInformation): string {
  if (ptdData.socialSite === "tmdb") {
    return parseResult.titles.filter(Boolean).join(" ");
  }

  return parseResult.titles[0] ?? "";
}

function buildTmdbExternalIdsUrl() {
  const url = new URL(window.location.href);
  const match = url.pathname.match(/^\/(movie|tv)\/\d+(?:-[^/]+)?/);
  if (!match) {
    return "";
  }

  return `${url.origin}${match[0]}/edit?active_nav_item=external_ids`;
}

async function tryGetTmdbImdbId() {
  const tmdbExternalIdsUrl = buildTmdbExternalIdsUrl();
  if (!tmdbExternalIdsUrl) {
    return "";
  }

  try {
    const resp = await fetch(tmdbExternalIdsUrl, { credentials: "include" });
    if (!resp.ok) {
      return "";
    }

    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector<HTMLInputElement>("#imdb_id")?.value?.trim() ?? "";
  } catch (error) {
    console.warn("Failed to fetch TMDb external ids page", error);
    return "";
  }
}

async function enrichTmdbParseResult(parseResult: ISocialSitePageInformation) {
  if (ptdData.socialSite !== "tmdb") {
    return parseResult;
  }

  const imdbId = await tryGetTmdbImdbId();
  if (!imdbId) {
    return parseResult;
  }

  return {
    ...parseResult,
    external_ids: {
      ...parseResult.external_ids,
      imdb: imdbId,
    },
  } satisfies ISocialSitePageInformation;
}

async function handleSearch() {
  // 解析页面
  try {
    const parserMatches = socialPageParserMatchesMap[ptdData.socialSite!];
    for (const [pattern, parser] of parserMatches) {
      if (new RegExp(pattern, "i").test(window.location.href)) {
        const parseResult = parser(document.cloneNode(true) as Document);
        if (parseResult) {
          const shouldShowChosenDialog =
            Array.isArray(parseResult) ||
            ptdData.socialSite === "tmdb" ||
            (configStore.contentScript?.socialSiteSearchBy ?? "chosen") === "chosen";
          if (shouldShowChosenDialog) {
            socialSiteParseResults.value = Array.isArray(parseResult)
              ? parseResult
              : [await enrichTmdbParseResult(parseResult)];
            showSocialSiteParseResultsDialog.value = true;
            return;
          } else {
            if (configStore.contentScript?.socialSiteSearchBy === "id") {
              return doKeywordSearch(`${ptdData.socialSite!}|${parseResult.id}`);
            } else if (configStore.contentScript?.socialSiteSearchBy === "imdb") {
              if (ptdData.socialSite === "imdb") {
                return doKeywordSearch(`imdb|${parseResult.id}`);
              } else if (parseResult?.external_ids?.imdb) {
                return doKeywordSearch(`imdb|${parseResult.external_ids.imdb}`);
              } else {
                return doKeywordSearch(getSearchTitle(parseResult));
              }
            } else if (configStore.contentScript?.socialSiteSearchBy === "title") {
              return doKeywordSearch(getSearchTitle(parseResult));
            }

            // 其他情况默认按 主标题 搜索
            return doKeywordSearch(getSearchTitle(parseResult));
          }
        } else {
          runtimeStore.showSnakebar(t("contentScript.parseResultEmpty"), { color: "error" });
        }
      }
    }
  } catch (e) {
    console.error("页面解析失败", e);
    runtimeStore.showSnakebar(t("contentScript.parsePageFailed"), { color: "error" });
    return;
  }
}
</script>

<template>
  <SpeedDialBtn key="search" color="indigo" icon="mdi-home-search" :title="t('contentScript.quickSearch')" @click="handleSearch" />
  <SocialSiteParseResultsDialog v-model="showSocialSiteParseResultsDialog" :parse-results="socialSiteParseResults" />
</template>

<style scoped lang="scss"></style>
