<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

async function clearLastFilter(v: boolean) {
  if (!v) {
    await metadataStore.setLastSearchFilter("");
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
          <v-number-input
            v-model="configStore.searchEntity.queueConcurrency"
            :max="100"
            :min="1"
            controlVariant="default"
            label="请求队列长度"
          ></v-number-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6">
          <v-switch
            v-model="configStore.searchEntity.saveLastFilter"
            color="success"
            hide-details
            label="保存上一次使用的搜索筛选词"
            @update:model-value="(v) => clearLastFilter(v as boolean)"
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
