<script setup lang="ts">
import { useConfigStore } from "@/options/stores/config.ts";
import { useI18n } from "vue-i18n";
import { LocalDownloadMethod } from "@/shared/storages/types/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

async function clearLastDownloader(v: boolean) {
  if (!v) {
    await metadataStore.setLastDownloader({});
  }
}

async function save() {
  await configStore.$save();
  runtimeStore.showSnakebar("保存成功", { color: "success" });
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col md="6">
          <v-select
            v-model="configStore.download.localDownloadMethod"
            label="本地下载方式"
            :items="
              LocalDownloadMethod.map((item) => ({
                title: t(`SetBase.download.localDownloadMethod.${item}`),
                value: item,
              }))
            "
            :hint="t(`SetBase.download.localDownloadMethod.${configStore.download.localDownloadMethod}Tip`)"
            persistent-hint
          >
          </v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6">
          <v-switch
            v-model="configStore.download.saveLastDownloader"
            color="success"
            hide-details
            label="保存上一次使用的下载服务器设置"
            @update:model-value="clearLastDownloader"
          ></v-switch>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row class="ml-2 my-1">
        <v-btn color="green" variant="elevated" prepend-icon="mdi-check-circle-outline" @click="save">
          {{ t("common.save") }}
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
