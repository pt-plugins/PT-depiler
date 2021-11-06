<script lang="ts" setup>
import { h, ref } from 'vue';
import { Component } from '@vue/runtime-core';
import { RouterLink } from 'vue-router';
import { NIcon } from 'naive-ui';
import { routes } from '../../router';
import { useI18n } from 'vue-i18n';
import { breakpoints } from '../../utils';

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const { t } = useI18n();

/**
 * 目录是否展开
 * 这里再使用 breakpoints.smaller('m') 做一次初始判断
 * 不使用已定义的 isMobile 是因为 ref(isTablet) 会导致 isTablet 值被更改
 */
const menuCollapsed = ref(breakpoints.smaller('m'));

// 自动从router.ts生成目录
const menuOptions = routes
  .filter(route => route.meta?.isMainMenu) // 根据 meta 的 isMainMenu 属性筛选出应该列在目录中的路径
  .map(route => {
    return {
      label: () => t(`layout.menu.${String(route.name)}.default`),
      key: route.path.replace(/^\//, ''),
      icon: renderIcon(route.meta!.icon as Component),
      children: route.children!.map(childrenRoute => {
        return {
          key: childrenRoute.path.replace(/^\//, ''),
          label: () => h(RouterLink,
            { to: { name: childrenRoute.name } },
            { default: () => t(`layout.menu.${String(route.name)}.${String(childrenRoute.name)}`) }
          ),
          icon: renderIcon(childrenRoute.meta!.icon as Component)
        };
      })
    };
  });
</script>

<template>
  <n-layout-sider bordered collapse-mode="width" show-trigger
                  :collapsed-width="64" :width="240"
                  :collapsed="menuCollapsed"
                  :native-scrollbar="false"
                  @collapse="menuCollapsed = true"
                  @expand="menuCollapsed = false"
  >
    <n-menu
      :collapsed="menuCollapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :root-indent="12"
      :indent="18"
      :options="menuOptions"
      :default-expanded-keys="['','settings','about']"
    />
  </n-layout-sider>
</template>
