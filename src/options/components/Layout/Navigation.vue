<script lang="ts" setup>
import { useStore } from "@/options/store";
import { routes } from "../../router";

const store = useStore();

// 自动从router.ts生成目录
const menuOptions = routes
  .filter((route) => route.meta?.isMainMenu)
  .map((route) => {
    return {
      title: `route.${String(route.name)}.default`,
      name: route.name,
      icon: route.meta?.icon,
      children: route.children!.map((childrenRoute) => {
        return {
          title: `route.${String(route.name)}.${String(childrenRoute.name)}`,
          name: childrenRoute.name,
          icon: childrenRoute.meta?.icon,
        };
      }),
    };
  }); // 根据 meta 的 isMainMenu 属性筛选出应该列在目录中的路径
</script>

<template>
  <v-navigation-drawer
    id="ptpp-navigation"
    v-model="store.uiOptions.navBarIsOpen"
    expand-on-hover
    permanent
    :width="220"
  >
    <v-list
      v-for="(group, groupIndex) in menuOptions"
      :key="groupIndex"
      nav
      density="compact"
    >
      <v-list-subheader class="grey--text text--darken-1">
        {{ $t(group.title) }}
      </v-list-subheader>
      <v-list-item
        v-for="(nav, navIndex) in group.children"
        :key="navIndex"
        :value="nav"
        :to="{ name: nav.name }"
        :prepend-icon="nav.icon"
      >
        {{ $t(nav.title) }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
