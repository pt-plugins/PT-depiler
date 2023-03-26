<script lang="ts" setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { useUIStore } from "@/shared/store/ui";
import { REPO_URL } from "@/shared/constants";

const uiStore = useUIStore();
const display = useDisplay();
const router = useRouter();

const appendMenu: Array<{ title: string, icon: string, [str: string]: any }> = [
  {
    title: "layout.header.home",
    icon: "mdi-home",
    href: REPO_URL
  },
  {
    title: "layout.header.wiki",
    icon: "mdi-help-circle",
    href: `${REPO_URL}/wiki`
  }
];

const searchText = ref<string>("");
function startSearchEntity() {
  router.push({
    name: "SearchEntity",
    query: {
      q: searchText.value
    }
  });
}

</script>

<template>
  <v-app-bar id="ptpp-topbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon
        :title="$t('layout.header.navBarTip')"
        variant="text"
        :style="[display.mdAndDown.value ? 'margin-right: 10px' : '']"
        @click="uiStore.isNavBarOpen = !uiStore.isNavBarOpen"
      />
    </template>

    <v-app-bar-title v-show="display.smAndUp.value" style="max-width: 160px">
      {{ $t("common.name") }}
    </v-app-bar-title>

    <v-text-field
      v-model="searchText"
      hide-details
      class="ptpp-search-input"
      @keydown.enter="startSearchEntity"
    >
      <template #append-inner>
        <!-- TODO 搜索方案 -->
      </template>
      <template #append>
        <v-btn icon="mdi-magnify" @click="startSearchEntity" />
      </template>
    </v-text-field>

    <v-spacer v-if="!display.mdAndDown.value" />

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
        <v-menu
          v-if="display.mdAndDown.value"
          bottom
          left offset-y
        >
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

<style lang="scss" scoped>
.menu-item:deep(.v-list-item__prepend > .v-icon) {
  margin-inline-end: 16px;
}

.ptpp-search-input:deep(.v-input__append) {
  padding-top: 4px;
}
</style>
