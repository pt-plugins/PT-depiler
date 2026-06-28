<script setup lang="ts">
import { ISocialSitePageInformation } from "@ptd/social";
import { doKeywordSearch, type IPtdData } from "../utils.ts";
import { inject } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const showDialog = defineModel<boolean>();
const { parseResults } = defineProps<{ parseResults: ISocialSitePageInformation[] }>();

const ptdData = inject<IPtdData>("ptd_data", {});

function buildSiteSearchKeyword(result: ISocialSitePageInformation) {
  if (ptdData.socialSite === "tmdb") {
    return `tmdb|${result.mediaType ?? "movie"}${result.id}`;
  }

  return `${ptdData.socialSite!}|${result.id}`;
}

function shouldCollapseTitles(result: ISocialSitePageInformation) {
  return ptdData.socialSite === "tmdb" && result.pageCategory === "season_list";
}

function getCollapsedTitles(result: ISocialSitePageInformation) {
  return result.titles;
}

function getVisibleTitles(result: ISocialSitePageInformation) {
  return shouldCollapseTitles(result) ? [] : result.titles;
}

function getCollapseTitle(result: ISocialSitePageInformation) {
  if (ptdData.socialSite === "tmdb" && result.pageCategory === "season_list") {
    return `搜索${result.entryTitle || "单季"}`;
  }

  return t("contentScript.SocialSiteParseResultsDialog.searchTitle");
}

function getResultKey(result: ISocialSitePageInformation, index: number) {
  return `${result.id}|${result.pageCategory ?? "default"}|${result.titles[0] ?? index}`;
}

function shouldShowSiteId(result: ISocialSitePageInformation, index: number) {
  if (!(ptdData.socialSite === "tmdb" && result.pageCategory === "season_list")) {
    return true;
  }

  return index === 0;
}

function shouldShowExternalIds(result: ISocialSitePageInformation, index: number) {
  if (!(ptdData.socialSite === "tmdb" && result.pageCategory === "season_list")) {
    return true;
  }

  return index === 0;
}

function shouldShowSeriesTitle(result: ISocialSitePageInformation, index: number) {
  return ptdData.socialSite === "tmdb" && result.pageCategory === "season_list" && index === 0 && !!result.seriesTitle;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("contentScript.SocialSiteParseResultsDialog.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-list density="compact">
          <template v-for="(result, index) in parseResults" :key="getResultKey(result, index)">
            <v-list-item
              v-if="shouldShowSiteId(result, index)"
              :title="`${ptdData.socialSite}: ${ptdData.socialSite === 'tmdb' ? `${result.mediaType ?? 'movie'}${result.id}` : result.id}`"
              @click="() => doKeywordSearch(buildSiteSearchKeyword(result))"
            >
              <template #append>
                <v-chip color="indigo">{{ t("contentScript.SocialSiteParseResultsDialog.searchId") }}</v-chip>
              </template>
            </v-list-item>
            <template v-if="result.external_ids && shouldShowExternalIds(result, index)">
              <v-list-item
                v-for="(externalId, externalType) in result.external_ids"
                :key="`${result.id}|${externalType}|${externalId}`"
                :title="`${externalType}: ${externalId}`"
                @click="() => doKeywordSearch(`${externalType}|${externalId}`)"
              >
                <template #append>
                  <v-chip color="green">{{ t("contentScript.SocialSiteParseResultsDialog.searchExternalId") }}</v-chip>
                </template>
              </v-list-item>
            </template>
            <v-list-item v-if="shouldShowSeriesTitle(result, index)" :title="result.seriesTitle" @click="() => doKeywordSearch(result.seriesTitle!)">
              <template #append>
                <v-chip color="blue-grey">{{ t("contentScript.SocialSiteParseResultsDialog.searchTitle") }}</v-chip>
              </template>
            </v-list-item>
            <template v-if="shouldCollapseTitles(result)">
              <v-expansion-panels variant="accordion" flat>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    {{ getCollapseTitle(result) }} ({{ getCollapsedTitles(result).length }})
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="pa-0">
                    <v-list density="compact">
                      <template v-for="title in getCollapsedTitles(result)" :key="`${result.id}|${title}`">
                        <v-list-item :title="title" @click="() => doKeywordSearch(title)">
                          <template #append>
                            <v-chip color="blue-grey">{{ t("contentScript.SocialSiteParseResultsDialog.searchTitle") }}</v-chip>
                          </template>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-else v-for="title in result.titles" :key="`${result.id}|${title}`">
              <v-list-item :title="title" @click="() => doKeywordSearch(title)">
                <template #append>
                  <v-chip color="blue-grey">{{ t("contentScript.SocialSiteParseResultsDialog.searchTitle") }}</v-chip>
                </template>
              </v-list-item>
            </template>
            <v-divider v-if="index != parseResults.length - 1" inset />
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
