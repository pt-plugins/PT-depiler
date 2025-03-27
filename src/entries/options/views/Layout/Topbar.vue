<script lang="ts" setup>
import { log, REPO_URL } from "~/helper";

import { ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";

import { useUIStore } from "@/options/stores/ui";
import { useSiteStore } from "@/options/stores/site.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { computedAsync } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const display = useDisplay();

const uiStore = useUIStore();
const siteStore = useSiteStore();
const runtimeStore = useRuntimeStore();

const appendMenu: Array<{ title: string; icon: string; [str: string]: any }> = [
  {
    title: "layout.header.home",
    icon: "mdi-home",
    href: REPO_URL,
  },
  {
    title: "layout.header.wiki",
    icon: "mdi-help-circle",
    href: `${REPO_URL}/wiki`,
  },
];

const searchKey = ref((route.query?.search as string) ?? "");
const searchPlanKey = ref((route.query?.plan as string) ?? "default");

const searchPlans = computedAsync(async () => {
  const defaultPlan = {
    id: "default",
    name: "default",
  };

  const searchSolutions = siteStore.getSearchSolutions
    .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
    .sort((a, b) => b.sort - a.sort) // 按照 sort 降序排序
    .map((x) => ({
      id: x.id,
      name: x.name,
    }));

  return [defaultPlan, ...searchSolutions];
}, []);

function startSearchEntity() {
  router.push({
    name: "SearchEntity",
    query: {
      search: searchKey.value,
      plan: searchPlanKey.value,
      flush: 1,
    },
  });
}
</script>

<template>
  <v-app-bar id="ptpp-topbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon
        :title="$t('layout.header.navBarTip')"
        variant="text"
        @click="uiStore.isNavBarOpen = !uiStore.isNavBarOpen"
      >
        <template v-if="display.smAndUp.value">
          <v-icon icon="$menu"></v-icon>
        </template>
        <template v-else>
          <v-img src="/icons/logo/64.png" width="24" inline></v-img>
        </template>
      </v-app-bar-nav-icon>
    </template>

    <v-app-bar-title v-show="display.smAndUp.value" style="min-width: 120px; max-width: 160px" ref="titleTarget">
      <v-img src="/icons/logo/64.png" width="24" inline></v-img>
      {{ $t("manifest.extName") }}
    </v-app-bar-title>

    <v-text-field
      v-model="searchKey"
      hide-details
      class="ptpp-search-input pl-2"
      @keydown.enter="startSearchEntity"
      :placeholder="$t('layout.header.searchTip')"
      style="width: 300px"
    >
      <template #append>
        <v-btn icon="mdi-magnify" :disabled="runtimeStore.search.isSearching" @click="startSearchEntity" />
      </template>

      <template #prepend-inner>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> {{ siteStore.getSearchSolutionName(searchPlanKey) }} </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in searchPlans"
              :key="index"
              :value="index"
              @click="() => (searchPlanKey = item.id)"
            >
              <v-list-item-title>{{ siteStore.getSearchSolutionName(item.id) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-text-field>

    <v-spacer v-if="display.smAndUp.value" />

    <template #append>
      <!-- 处于大屏幕，完整显示所有btn -->
      <template v-if="!display.mdAndDown.value">
        <v-btn
          v-for="(append, index) in appendMenu"
          :key="index"
          v-bind.prop="append.prop"
          :href="append.href"
          :title="$t(append.title)"
          variant="text"
          rel="noopener noreferrer nofollow"
          size="large"
          target="_blank"
        >
          <v-icon :icon="append.icon" />
          <span class="ml-1">{{ $t(append.title) }}</span>
        </v-btn>
      </template>

      <!-- 处于小屏幕，只显示点，btn以menu列表形式展示 -->
      <template v-else>
        <v-menu bottom left offset-y>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in appendMenu"
              :key="index"
              :href="item.href"
              :prepend-icon="item.icon"
              :title="$t(item.title)"
              variant="text"
              rel="noopener noreferrer nofollow"
              size="large"
              class="menu-item"
              target="_blank"
            />
          </v-list>
        </v-menu>
      </template>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss">
.menu-item:deep(.v-list-item__prepend > .v-icon) {
  margin-inline-end: 16px;
}

.ptpp-search-input:deep(.v-input__append) {
  padding-top: 4px;
}
</style>
