<script setup lang="ts">
import { inject, shallowRef, ref } from "vue";
import { ISocialSitePageInformation, socialPageParserMatchesMap } from "@ptd/social";

import { useConfigStore } from "@/options/stores/config.ts";
import { doKeywordSearch, type IPtdData } from "../utils.ts";

import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import SocialSiteParseResultsDialog from "@/content-script/app/components/SocialSiteParseResultsDialog.vue";

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const ptdData = inject<IPtdData>("ptd_data", {});
const socialSiteParseResults = shallowRef<ISocialSitePageInformation[]>([]);
const showSocialSiteParseResultsDialog = ref<boolean>(false);

async function handleSearch() {
  // 解析页面
  try {
    const parserMatches = socialPageParserMatchesMap[ptdData.socialSite!];
    for (const [pattern, parser] of parserMatches) {
      if (new RegExp(pattern, "i").test(window.location.href)) {
        const parseResult = parser(document.cloneNode(true) as Document);
        if (parseResult) {
          const shouldShowChosenDialog =
            Array.isArray(parseResult) || (configStore.contentScript?.socialSiteSearchBy ?? "chosen") === "chosen";
          if (shouldShowChosenDialog) {
            socialSiteParseResults.value = Array.isArray(parseResult) ? parseResult : [parseResult];
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
                return doKeywordSearch(`${parseResult.titles[0]}`);
              }
            } else if (configStore.contentScript?.socialSiteSearchBy === "title") {
              return doKeywordSearch(`${parseResult.titles[0]}`);
            }

            // 其他情况默认按 主标题 搜索
            return doKeywordSearch(`${parseResult.titles[0]}`);
          }
        } else {
          runtimeStore.showSnakebar("未能解析出结果", { color: "error" });
        }
      }
    }
  } catch (e) {
    console.error("页面解析失败", e);
    runtimeStore.showSnakebar("页面解析失败", { color: "error" });
    return;
  }
}
</script>

<template>
  <SpeedDialBtn key="search" color="indigo" icon="mdi-home-search" title="快捷搜索" @click="handleSearch" />
  <SocialSiteParseResultsDialog v-model="showSocialSiteParseResultsDialog" :parse-results="socialSiteParseResults" />
</template>

<style scoped lang="scss"></style>
