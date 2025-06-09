<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { setBaseChildren } from "@/options/plugins/router.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const { t } = useI18n();
const router = useRouter();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

const setBaseTabs = setBaseChildren.map((x) => ({
  key: x.alias ?? x.path,
  route: x.name,
  icon: x.meta!.icon,
}));

const setTab = ref<string>("");
const setTabRef = useTemplateRef<{ afterSave?: () => Promise<void> }>("setTabRef");

function enterTab(routeName: string) {
  router.push({ name: routeName });
}

async function save() {
  await configStore.$save();
  runtimeStore.showSnakebar("保存成功", { color: "success" });
  await setTabRef.value?.afterSave?.(); // 如果对应的 tab 有 afterSave 方法，则调用
}
</script>

<template>
  <v-card>
    <v-tabs
      v-model="setTab"
      align-tabs="center"
      bg-color="primary"
      show-arrows
      stacked
      @update:model-value="(v) => enterTab(v as string)"
    >
      <v-tab v-for="tab in setBaseTabs" :key="tab.key as string" :value="tab.route">
        <v-icon :icon="tab.icon as string" />
        {{ t(`SetBase.tab.${tab.key}`) }}
      </v-tab>
    </v-tabs>

    <v-card>
      <v-card-text>
        <router-view v-slot="{ Component }">
          <component :is="Component" ref="setTabRef" />
        </router-view>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-row class="ml-2 my-1">
          <v-btn color="green" prepend-icon="mdi-check-circle-outline" variant="elevated" @click="save">
            {{ t("common.save") }}
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<style scoped lang="scss"></style>
