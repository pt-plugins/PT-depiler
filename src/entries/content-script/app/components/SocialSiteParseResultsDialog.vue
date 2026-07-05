<script setup lang="ts">
import { ISocialSitePageInformation } from "@ptd/social";
import { doKeywordSearch, type IPtdData } from "../utils.ts";
import { computed, inject, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { sendMessage } from "@/messages.ts";

const { t } = useI18n();
const metadataStore = useMetadataStore();
const metadataReady = ref(false);

const showDialog = defineModel<boolean>();
const { parseResults, defaultPlan = "default" } = defineProps<{
  parseResults: ISocialSitePageInformation[];
  defaultPlan?: string;
}>();

const ptdData = inject<IPtdData>("ptd_data", {});

onMounted(() => {
  metadataStore.$onReady(() => {
    metadataReady.value = true;
  });
});

const customSearchPlans = computed(() => {
  if (!metadataReady.value) {
    return [];
  }

  return metadataStore.getSearchSolutions
    .filter((solution) => !!solution.enabled)
    .sort((a, b) => b.sort - a.sort)
    .map((solution) => ({
      id: solution.id,
      name: metadataStore.getSearchSolutionName(solution.id),
    }));
});

const searchPlans = computed(() => {
  const plans = [{ id: "default", name: t("layout.header.searchPlan.default") }];

  if (metadataStore.defaultSolutionId !== "default") {
    plans.push({ id: "all", name: t("layout.header.searchPlan.all") });
  }

  plans.push(...customSearchPlans.value);

  return plans;
});

const shouldShowSearchPlanMenu = computed(() => customSearchPlans.value.length > 0);

function buildSiteSearchKeyword(result: ISocialSitePageInformation) {
  return `${ptdData.socialSite!}|${result.id}`;
}

function shouldCollapseTitles(result: ISocialSitePageInformation) {
  return ptdData.socialSite === "tmdb" && result.pageCategory === "season_list";
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

function searchByPlan(keyword: string, plan: string = defaultPlan) {
  if (plan === "default") {
    doKeywordSearch(keyword);
    return;
  }

  if (!keyword) {
    keyword = prompt("未解析到搜索关键词，请输入：", "")!;
  }

  if (keyword) {
    sendMessage("openOptionsPage", {
      path: "/search-entity",
      query: { search: keyword, plan, flush: 1 },
    }).catch();
  }
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
              :title="`${ptdData.socialSite}: ${result.id}`"
              @click="() => searchByPlan(buildSiteSearchKeyword(result))"
            >
              <template #append>
                <v-chip color="indigo">{{ t("contentScript.SocialSiteParseResultsDialog.searchId") }}</v-chip>
              </template>
              <v-menu v-if="shouldShowSearchPlanMenu" activator="parent" location="end" open-on-hover>
                <v-list density="compact">
                  <v-list-subheader>{{ t("contentScript.SocialSiteParseResultsDialog.searchPlan") }}</v-list-subheader>
                  <v-list-item
                    v-for="plan in searchPlans"
                    :key="`${result.id}|id|${plan.id}`"
                    :title="plan.name"
                    @click.stop="searchByPlan(buildSiteSearchKeyword(result), plan.id)"
                  />
                </v-list>
              </v-menu>
            </v-list-item>
            <template v-if="result.external_ids && shouldShowExternalIds(result, index)">
              <v-list-item
                v-for="(externalId, externalType) in result.external_ids"
                :key="`${result.id}|${externalType}|${externalId}`"
                :title="`${externalType}: ${externalId}`"
                @click="() => searchByPlan(`${externalType}|${externalId}`)"
              >
                <template #append>
                  <v-chip color="green">{{ t("contentScript.SocialSiteParseResultsDialog.searchExternalId") }}</v-chip>
                </template>
                <v-menu v-if="shouldShowSearchPlanMenu" activator="parent" location="end" open-on-hover>
                  <v-list density="compact">
                    <v-list-subheader>{{ t("contentScript.SocialSiteParseResultsDialog.searchPlan") }}</v-list-subheader>
                    <v-list-item
                      v-for="plan in searchPlans"
                      :key="`${result.id}|${externalType}|${plan.id}`"
                      :title="plan.name"
                      @click.stop="searchByPlan(`${externalType}|${externalId}`, plan.id)"
                    />
                  </v-list>
                </v-menu>
              </v-list-item>
            </template>
            <v-list-item
              v-if="shouldShowSeriesTitle(result, index)"
              :title="result.seriesTitle"
              @click="() => searchByPlan(result.seriesTitle!)"
            >
              <template #append>
                <v-chip color="blue-grey">{{ t("contentScript.SocialSiteParseResultsDialog.searchTitle") }}</v-chip>
              </template>
              <v-menu v-if="shouldShowSearchPlanMenu" activator="parent" location="end" open-on-hover>
                <v-list density="compact">
                  <v-list-subheader>{{ t("contentScript.SocialSiteParseResultsDialog.searchPlan") }}</v-list-subheader>
                  <v-list-item
                    v-for="plan in searchPlans"
                    :key="`${result.id}|series|${plan.id}`"
                    :title="plan.name"
                    @click.stop="searchByPlan(result.seriesTitle!, plan.id)"
                  />
                </v-list>
              </v-menu>
            </v-list-item>
            <template v-if="shouldCollapseTitles(result)">
              <v-expansion-panels variant="accordion" flat>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    {{ getCollapseTitle(result) }} ({{ result.titles.length }})
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="pa-0">
                    <v-list density="compact">
                      <template v-for="title in result.titles" :key="`${result.id}|${title}`">
                        <v-list-item :title="title" @click="() => searchByPlan(title)">
                          <template #append>
                            <v-chip color="blue-grey">{{
                              t("contentScript.SocialSiteParseResultsDialog.searchTitle")
                            }}</v-chip>
                          </template>
                          <v-menu v-if="shouldShowSearchPlanMenu" activator="parent" location="end" open-on-hover>
                            <v-list density="compact">
                              <v-list-subheader>{{ t("contentScript.SocialSiteParseResultsDialog.searchPlan") }}</v-list-subheader>
                              <v-list-item
                                v-for="plan in searchPlans"
                                :key="`${result.id}|${title}|${plan.id}`"
                                :title="plan.name"
                                @click.stop="searchByPlan(title, plan.id)"
                              />
                            </v-list>
                          </v-menu>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-else v-for="title in result.titles" :key="`${result.id}|${title}`">
              <v-list-item :title="title" @click="() => searchByPlan(title)">
                <template #append>
                  <v-chip color="blue-grey">{{ t("contentScript.SocialSiteParseResultsDialog.searchTitle") }}</v-chip>
                </template>
                <v-menu v-if="shouldShowSearchPlanMenu" activator="parent" location="end" open-on-hover>
                  <v-list density="compact">
                    <v-list-subheader>{{ t("contentScript.SocialSiteParseResultsDialog.searchPlan") }}</v-list-subheader>
                    <v-list-item
                      v-for="plan in searchPlans"
                      :key="`${result.id}|${title}|${plan.id}`"
                      :title="plan.name"
                      @click.stop="searchByPlan(title, plan.id)"
                    />
                  </v-list>
                </v-menu>
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
