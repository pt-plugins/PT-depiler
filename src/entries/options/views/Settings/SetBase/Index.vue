<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { setBaseChildren } from "@/options/plugins/router.ts";

const { t } = useI18n();
const router = useRouter();

const setBaseTabs = setBaseChildren.map((x) => ({
  key: x.alias ?? x.path,
  route: x.name,
  icon: x.meta!.icon,
}));

const setTab = ref<string>("");

function enterTab(routeName: string) {
  console.log("enterTab", routeName);
  router.push({
    name: routeName,
  });
}
</script>

<template>
  <v-card>
    <v-tabs
      v-model="setTab"
      align-tabs="center"
      bg-color="primary"
      stacked
      @update:model-value="(v) => enterTab(v as string)"
    >
      <v-tab v-for="tab in setBaseTabs" :key="tab.key as string" :value="tab.route">
        <v-icon :icon="tab.icon as string" />
        {{ t(`SetBase.tab.${tab.key}`) }}
      </v-tab>
    </v-tabs>

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </v-card>
</template>

<style scoped lang="scss"></style>
