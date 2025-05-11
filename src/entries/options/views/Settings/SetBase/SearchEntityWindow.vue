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
          <v-label>站点搜索配置</v-label>
          <v-number-input
            v-model="configStore.searchEntity.queueConcurrency"
            :max="100"
            :min="1"
            controlVariant="default"
            hide-details
            label="请求队列长度"
          />
          <v-switch
            v-model="configStore.searchEntity.saveLastFilter"
            color="success"
            hide-details
            label="保存上一次使用的搜索筛选词"
            @update:model-value="(v) => clearLastFilter(v as boolean)"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6">
          <v-label>媒体服务器搜索配置</v-label>
          <v-number-input
            v-model="configStore.mediaServerEntity.queueConcurrency"
            :max="100"
            :min="1"
            controlVariant="default"
            label="请求队列长度"
          />
          <v-number-input
            v-model="configStore.mediaServerEntity.searchLimit"
            :max="500"
            :min="1"
            :step="configStore.mediaServerEntity.searchLimit >= 100 ? 10 : 1"
            controlVariant="default"
            label="单次搜索结果数量"
            messages="请不要一次性加载过多的搜索结果，未作 virtual-scroll 优化，可能会导致浏览器卡死，同时也会影响媒体服务器的性能"
          />
          <v-switch
            v-model="configStore.mediaServerEntity.autoSearchWhenMount"
            color="success"
            hide-details
            label="自动加载首屏媒体墙"
          />
          <v-switch
            v-model="configStore.mediaServerEntity.autoSearchMoreWhenScroll"
            color="success"
            hide-details
            label="当滚动到页面底部时，自动加载新的媒体墙"
          />
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
