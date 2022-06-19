<script lang="ts" setup>
import { useDisplay } from "vuetify";
import {useUIStore} from "@/shared/store/ui";
import {REPO_URL} from "@/shared/constants";

const uiStore = useUIStore();
const display = useDisplay();

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
</script>

<template>
  <v-app-bar id="ptpp-topbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon
        :title="$t('topbar.navBarTip')"
        :style="{
          'margin-inline-start': !display.mdAndDown.value ? '0px' : null
        }"
        @click="uiStore.isNavBarOpen = !uiStore.isNavBarOpen"
      />
    </template>

    <v-app-bar-title style="max-width: 220px">
      {{ $t("common.name") }}
    </v-app-bar-title>

    <!-- TODO Full searchbox -->
    <v-spacer />

    <template #append>
      <!-- 处于大屏幕，完整显示所有btn -->
      <template v-if="!display.mdAndDown.value">
        <v-btn
          v-for="(append, index) in appendMenu"
          :key="index"
          v-bind.prop="append.prop"
          :href="append.href"
          :title="$t(append.title)"
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
        <!-- TODO small searchbox -->
        <v-btn icon="mdi-magnify" />

        <v-menu
          v-if="display.mdAndDown.value"
          bottom
          left offset-y
        >
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" />
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in appendMenu"
              :key="index"
              :href="item.href"
              :prepend-icon="item.icon"
              :title="$t(item.title)"
              rel="noopener noreferrer nofollow"
              size="large"
              target="_blank"
            >
              {{ $t(item.title) }}
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped>
</style>
