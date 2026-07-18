<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { saveAs } from "file-saver";

import type { IUserInfo, TSiteID } from "@ptd/site";

import { formatDate } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { sendMessage } from "@/messages.ts";

import { fixUserInfo } from "./utils/format.ts";

interface IHistoryUserInfo extends IUserInfo {
  date: string;
  site: TSiteID;
  siteName: string;
}

interface IExportField {
  key: string;
  label: string;
  required?: boolean;
}

const props = defineProps<{
  selectedSiteIds: TSiteID[];
}>();

const showDialog = defineModel<boolean>();
const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const isLoading = ref(false);

const allExportFields: IExportField[] = [
  { key: "site", label: "common.site", required: true },
  { key: "siteName", label: "MyData.exportDialog.fields.siteName", required: false },
  { key: "date", label: "common.date", required: true },
  { key: "name", label: "common.username", required: false },
  { key: "id", label: "MyData.exportDialog.fields.id", required: false },
  { key: "levelName", label: "MyData.exportDialog.fields.levelName", required: false },
  { key: "uploaded", label: "levelRequirement.uploaded", required: false },
  { key: "downloaded", label: "levelRequirement.downloaded", required: false },
  { key: "ratio", label: "levelRequirement.ratio", required: false },
  { key: "trueUploaded", label: "levelRequirement.trueUploaded", required: false },
  { key: "trueDownloaded", label: "levelRequirement.trueDownloaded", required: false },
  { key: "trueRatio", label: "levelRequirement.trueRatio", required: false },
  { key: "seeding", label: "levelRequirement.seeding", required: false },
  { key: "seedingSize", label: "levelRequirement.seedingSize", required: false },
  { key: "bonus", label: "levelRequirement.bonus", required: false },
  { key: "seedingBonus", label: "levelRequirement.seedingBonus", required: false },
  { key: "bonusPerHour", label: "levelRequirement.bonusPerHour", required: false },
  { key: "seedingBonusPerHour", label: "levelRequirement.seedingBonusPerHour", required: false },
  { key: "uploads", label: "levelRequirement.uploads", required: false },
  { key: "leeching", label: "levelRequirement.leeching", required: false },
  { key: "snatches", label: "levelRequirement.snatches", required: false },
  { key: "messageCount", label: "MyData.exportDialog.fields.messageCount", required: false },
  { key: "hnrUnsatisfied", label: "levelRequirement.hnrUnsatisfied", required: false },
  { key: "hnrPreWarning", label: "levelRequirement.hnrPreWarning", required: false },
  { key: "joinTime", label: "MyData.exportDialog.fields.joinTime", required: false },
  { key: "lastAccessAt", label: "MyData.exportDialog.fields.lastAccessAt", required: false },
  { key: "updateAt", label: "MyData.exportDialog.fields.updateAt", required: false },
];

const defaultKeys = allExportFields.map((f) => f.key);
const selectedKeys = ref<string[]>([...defaultKeys]);

const exportFormat = ref<"csv" | "json">("csv");

const querySiteIds = computed<TSiteID[]>(() => {
  if (props.selectedSiteIds.length > 0) {
    return props.selectedSiteIds;
  }
  return Object.keys(metadataStore.sites) as TSiteID[];
});

const isExportSelected = computed(() => props.selectedSiteIds.length > 0);

async function doExport() {
  isLoading.value = true;

  try {
    const tasks = querySiteIds.value.map(async (siteId) => {
      try {
        const history = (await sendMessage("getSiteUserInfo", siteId)) as Record<string, IUserInfo> | undefined;
        if (!history) return [];

        const siteName = metadataStore.siteNameMap[siteId] ?? siteId;
        const items: IHistoryUserInfo[] = [];
        for (const [date, item] of Object.entries(history)) {
          items.push({
            ...fixUserInfo(item),
            site: siteId,
            siteName,
            date,
          });
        }
        return items;
      } catch (e) {
        console.error(`加载站点 ${siteId} 历史数据失败`, e);
        return [];
      }
    });

    const results = await Promise.allSettled(tasks);
    const merged: IHistoryUserInfo[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        merged.push(...result.value);
      }
    }

    merged.sort((a, b) => b.date.localeCompare(a.date));

    if (merged.length === 0) {
      runtimeStore.showSnakebar(t("common.noData"), { color: "warning" });
      return;
    }

    const timestamp = formatDate(new Date(), "yyyyMMdd_HHmmss");
    const ext = exportFormat.value;
    const mime = exportFormat.value === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8";
    const content = exportFormat.value === "csv" ? convertToCSV(merged) : convertToJSON(merged);
    const blob = new Blob(exportFormat.value === "csv" ? ["\ufeff", content] : [content], { type: mime });
    saveAs(blob, `userinfo-${suffix}-${timestamp}.${ext}`);
    showDialog.value = false;
  } finally {
    isLoading.value = false;
  }
}

function getSortedExportFields(): IExportField[] {
  const site = allExportFields.find((f) => f.key === "site")!;
  const date = allExportFields.find((f) => f.key === "date")!;
  const others = allExportFields.filter((f) => f.key !== "site" && f.key !== "date");
  return [site, date, ...others];
}

function getActiveFields(): IExportField[] {
  return getSortedExportFields().filter((f) => selectedKeys.value.includes(f.key));
}

function convertToCSV(items: IHistoryUserInfo[]): string {
  const activeFields = getActiveFields();
  const headers = activeFields.map((f) => f.key);
  const rows = items.map((item) =>
    headers
      .map((key) => {
        const raw = (item as any)[key];
        const val =
          raw === Infinity || raw === -Infinity || (typeof raw === "number" && isNaN(raw)) ? "" : String(raw ?? "");
        if (/[",\n\r]/.test(val)) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

function convertToJSON(items: IHistoryUserInfo[]): string {
  const activeFields = getActiveFields();
  return JSON.stringify(
    items.map((item) => {
      const obj: Record<string, any> = {};
      for (const f of activeFields) {
        const raw = (item as any)[f.key];
        obj[f.key] =
          raw === Infinity || raw === -Infinity || (typeof raw === "number" && isNaN(raw)) ? null : (raw ?? null);
      }
      return obj;
    }),
    null,
    2,
  );
}
</script>

<template>
  <v-dialog v-model="showDialog" width="700">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="orange-darken-3">
          <v-toolbar-title>
            <template v-if="isExportSelected">
              {{ t("MyData.exportDialog.exportSelected", { count: querySiteIds.length }) }}
            </template>
            <template v-else>
              {{ t("MyData.exportDialog.exportAll", { count: querySiteIds.length }) }}
            </template>
          </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text class="pt-4">
        <v-row>
          <v-col cols="12">
            <v-label class="text-body-2 font-weight-bold mb-2 d-block">
              {{ t("MyData.exportDialog.formatLabel") }}
            </v-label>
            <v-btn-toggle v-model="exportFormat" color="orange-darken-3" density="compact" mandatory variant="outlined">
              <v-btn value="csv">
                <v-icon start icon="mdi-file-delimited-outline" />
                {{ t("MyData.exportDialog.formatCSV") }}
              </v-btn>
              <v-btn value="json">
                <v-icon start icon="mdi-code-json" />
                {{ t("MyData.exportDialog.formatJSON") }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-label class="text-body-2 font-weight-bold mb-2 d-block">
              {{ t("MyData.exportDialog.fieldsLabel") }}
            </v-label>
            <v-card variant="outlined" class="pa-2">
              <v-row dense>
                <v-col v-for="field in allExportFields" :key="field.key" cols="6" md="4">
                  <v-checkbox
                    :model-value="selectedKeys.includes(field.key)"
                    :disabled="field.required"
                    :label="t(field.label)"
                    density="compact"
                    hide-details
                    @update:model-value="
                      (v) => {
                        if (v) {
                          selectedKeys.push(field.key);
                        } else {
                          selectedKeys = selectedKeys.filter((k) => k !== field.key);
                        }
                      }
                    "
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          :disabled="isLoading"
          :loading="isLoading"
          color="orange-darken-3"
          variant="elevated"
          prepend-icon="mdi-export"
          @click="doExport"
        >
          {{ t("common.export") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
