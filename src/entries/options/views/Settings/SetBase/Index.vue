<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { setBaseChildren } from "@/options/plugins/router.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

const setBaseTabs = setBaseChildren.map((x) => ({
  key: x.alias ?? x.path,
  route: x.name,
  icon: x.meta!.icon,
}));

const setTabRef = useTemplateRef<{ beforeSave?: () => Promise<void>; afterSave?: () => Promise<void> }>("setTabRef");

const activeTab = computed({
  get() {
    return route.name;
  },
  set(newRouteName) {
    router.push({ name: newRouteName });
  },
});

async function save() {
  await setTabRef.value?.beforeSave?.(); // 如果对应的 tab 有 afterSave 方法，则调用
  await configStore.$save();
  runtimeStore.showSnakebar("保存成功", { color: "success" });
  await setTabRef.value?.afterSave?.(); // 如果对应的 tab 有 afterSave 方法，则调用
}
</script>

<template>
  <v-card>
    <v-tabs v-model="activeTab" align-tabs="center" bg-color="primary" show-arrows stacked>
      <v-tab v-for="tab in setBaseTabs" :key="tab.key as string" :value="tab.route">
        <v-icon :icon="tab.icon as string" />
        {{ t(`SetBase.tab.${tab.key}`) }}
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
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
    </v-window>
  </v-card>
</template>

<style scoped lang="scss"></style>
