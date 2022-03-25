<script lang="ts" setup>
import { useDisplay } from 'vuetify';
import { useStore } from "@/options/store";

const store = useStore();
const display = useDisplay();

const appendMenu : Array<{title: string, icon: string, [str: string]: any}> = [
  {
    title: 'layout.header.home',
    icon: 'mdi-home',
    href: 'https://github.com/ronggang/PT-Plugin-Plus'
  },
  {
    title: 'layout.header.wiki',
    icon: 'mdi-help-circle',
    href: 'https://github.com/ronggang/PT-Plugin-Plus/wiki'
  },
  {
    title: 'layout.header.donate',
    icon: 'mdi-coffee',
    prop: {
      to: "/donate"
    }
  }
];
</script>

<template>
  <v-app-bar id="system-topbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon
        :title="$t('topbar.navBarTip')"
        @click="store.uiOptions.navBarIsOpen = !store.uiOptions.navBarIsOpen"
      />
    </template>

    <v-app-bar-title style="max-width: 220px">
      {{ $t("common.name") }}
    </v-app-bar-title>

    <!-- TODO Full searchbox -->
    <template v-if="!display.mdAndDown.value" />

    <v-spacer />

    <template #append>
      <!-- 处于大屏幕，完整显示所有btn -->
      <template v-if="!display.mdAndDown.value">
        <v-btn
          v-for="(append, index) in appendMenu"
          :key="index"
          :href="append.href"
          target="_blank"
          size="large"
          rel="noopener noreferrer nofollow"
          :title="$t(append.title)"
          v-bind.prop="append.prop"
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
          offset-y
          bottom left
        >
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" />
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in appendMenu"
              :key="index"
              :href="item.href"
              target="_blank"
              size="large"
              rel="noopener noreferrer nofollow"
              :title="$t(item.title)"
              :prepend-icon="item.icon"
            >
              {{ $t(item.title) }}
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped></style>
