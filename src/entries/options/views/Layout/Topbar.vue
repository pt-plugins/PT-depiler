<script lang="ts" setup>
import { REPO_URL } from "~/helper";

import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { useUIStore } from "@/options/stores/ui";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { ref, watch } from "vue";

const route = useRoute();
const router = useRouter();
const display = useDisplay();
const uiStore = useUIStore();
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

console.log(route, router);

const searchKey = ref((route.query?.search as string) ?? "");
const searchPlanKey = ref((route.query?.plan as string) ?? "default");

function initSearchInput(route) {
  if (route.name === "SearchEntity") {
    searchKey.value = (route.query?.search as string) ?? "";
    searchPlanKey.value = (route.query?.plan as string) ?? "default";
  }
}

watch(
  () => route,
  (newValue) => {
    console.log("route changed", newValue);
    initSearchInput(newValue);
  },
);

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
