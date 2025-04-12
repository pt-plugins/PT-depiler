<script lang="ts" setup>
import { REPO_URL } from "~/helper";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";

import { useUIStore } from "@/options/stores/ui";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const route = useRoute();
const router = useRouter();
const display = useDisplay();
const { t } = useI18n();

const uiStore = useUIStore();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const appendMenu = computed<Array<{ title: string; icon: string; [str: string]: any }>>(() => [
  { title: t("layout.header.home"), icon: "mdi-home", href: REPO_URL },
  { title: t("layout.header.wiki"), icon: "mdi-help-circle", href: `${REPO_URL}/wiki` },
]);

const searchKey = ref((route.query?.search as string) ?? "");
const searchPlanKey = ref((route.query?.plan as string) ?? "default");

const searchPlans = computed(() =>
  metadataStore.getSearchSolutions
    .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
    .sort((a, b) => b.sort - a.sort) // 按照 sort 降序排序
    .map((x) => ({
      id: x.id,
      name: x.name,
    })),
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
  <v-app-bar id="ptd-topbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon
        :title="t('layout.header.navBarTip')"
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
      {{ t("manifest.extName") }}
    </v-app-bar-title>

    <!-- 搜索输入框 -->
    <v-text-field
      v-model="searchKey"
      hide-details
      class="ptd-search-input pl-2"
      @keydown.enter="startSearchEntity"
      :placeholder="t('layout.header.searchTip')"
      style="width: 300px"
    >
      <template #append>
        <v-btn icon="mdi-magnify" :disabled="runtimeStore.search.isSearching" @click="startSearchEntity" />
      </template>

      <!-- 搜索方案选择框 -->
      <template #prepend-inner>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props">
              {{
                searchPlanKey == "default"
                  ? t("layout.header.searchPlan.default")
                  : metadataStore.getSearchSolutionName(searchPlanKey)
              }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="() => (searchPlanKey = 'default')"
              :title="t('layout.header.searchPlan.default')"
              :subtitle="
                '<' +
                (metadataStore.defaultSolutionId !== 'default'
                  ? metadataStore.getSearchSolutionName(metadataStore.defaultSolutionId)
                  : t('layout.header.searchPlan.all')) +
                '>'
              "
            ></v-list-item>
            <v-divider />
            <v-list-item
              v-for="(item, index) in searchPlans"
              :key="index"
              :value="index"
              @click="() => (searchPlanKey = item.id)"
            >
              <v-list-item-title>{{ metadataStore.getSearchSolutionName(item.id) }}</v-list-item-title>
            </v-list-item>
            <template v-if="metadataStore.defaultSolutionId !== 'default'">
              <v-divider />
              <v-list-item
                @click="() => (searchPlanKey = 'all')"
                :title="t('layout.header.searchPlan.all')"
              ></v-list-item>
            </template>
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
          :title="append.title"
          variant="text"
          rel="noopener noreferrer nofollow"
          size="large"
          target="_blank"
        >
          <v-icon :icon="append.icon" />
          <span class="ml-1">{{ append.title }}</span>
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
              :title="item.title"
              variant="text"
              rel="noopener noreferrer nofollow"
              size="large"
              class="menu-item list-item-none-spacer"
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

.ptd-search-input:deep(.v-input__append) {
  padding-top: 4px;
}
</style>
