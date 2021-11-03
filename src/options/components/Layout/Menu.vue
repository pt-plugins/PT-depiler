<script lang="ts" setup>
import { h, ref } from 'vue';
import { NIcon } from 'naive-ui';
import { RouteLocationRaw, RouterLink } from 'vue-router';
import { TachometerAlt } from '@vicons/fa';
import { breakpoints } from '@/options/utils';
import { DashboardSharp, SearchSharp, CloudDownloadSharp } from '@vicons/material';
import { Component } from '@vue/runtime-core';

function renderRouterLabel (text: string, routerProps: RouteLocationRaw) {
  return () => h(RouterLink, { to: routerProps }, { default: () => text });
}

function renderIcon (icon:Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

/**
 * 目录是否展开
 * 这里再使用 breakpoints.smaller('s') 做一次初始判断
 * 不使用已定义的 isMobile 是因为 ref(isMobile) 会导致 isMobile 值被更改
 */
const menuCollapsed = ref(breakpoints.smaller('s'));

// 定义目录
const menuOptions = [
  {
    label: '概览',
    key: 'overview',
    icon: renderIcon(TachometerAlt),
    children: [
      {
        key: 'search-data',
        label: renderRouterLabel('搜索结果', { name: 'Home' }),
        icon: renderIcon(SearchSharp)
      },
      {
        key: 'my-data',
        label: renderRouterLabel('我的数据', { name: 'Home' }),
        icon: renderIcon(DashboardSharp)
      },
      {
        key: 'my-client',
        label: renderRouterLabel('我的下载器', { name: 'Home' }),
        icon: renderIcon(CloudDownloadSharp)
      }
    ]
  }
];
</script>

<template>
  <n-layout-sider bordered collapse-mode="width" show-trigger
                  :collapsed-width="64" :width="240"
                  :collapsed="menuCollapsed"
                  @collapse="menuCollapsed = true"
                  @expand="menuCollapsed = false"
  >
    <n-menu
      :collapsed="menuCollapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :root-indent="16"
      :indent="32"
      :options="menuOptions"
      :default-expand-all="true"
    />
  </n-layout-sider>
</template>
