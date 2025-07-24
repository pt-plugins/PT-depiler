<script setup lang="ts">
import { ISocialSitePageInformation } from "@ptd/social";
import { doKeywordSearch, type IPtdData } from "../utils.ts";
import { inject } from "vue";

const showDialog = defineModel<boolean>();
const { parseResults } = defineProps<{ parseResults: ISocialSitePageInformation[] }>();

const ptdData = inject<IPtdData>("ptd_data", {});
</script>

<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 快速搜索 </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="overflow-y-hidden">
        <v-list density="compact">
          <template v-for="(result, index) in parseResults" :key="result.id">
            <v-list-item
              :title="`${ptdData.socialSite}: ${result.id}`"
              @click="() => doKeywordSearch(`${ptdData.socialSite!}|${result.id}`)"
            >
              <template #append>
                <v-chip color="indigo">搜索ID</v-chip>
              </template>
            </v-list-item>
            <template v-if="result.external_ids">
              <v-list-item
                v-for="(externalId, externalType) in result.external_ids"
                :key="`${result.id}|${externalType}|${externalId}`"
                :title="`${externalType}: ${externalId}`"
                @click="() => doKeywordSearch(`${externalType}|${externalId}`)"
              >
                <template #append>
                  <v-chip color="green">搜索外部ID</v-chip>
                </template>
              </v-list-item>
            </template>
            <template v-for="title in result.titles" :key="`${result.id}|${title}`">
              <v-list-item :title="title" @click="() => doKeywordSearch(title)">
                <template #append>
                  <v-chip color="blue-grey">搜索标题</v-chip>
                </template>
              </v-list-item>
            </template>
            <v-divider v-if="index != parseResults.length - 1" inset></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
