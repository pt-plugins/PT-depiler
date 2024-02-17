<script lang="ts" setup>
import {useUIStore} from "@/shared/store/ui";
import { useDisplay } from "vuetify";
import { routes } from "../../router";
import { watch } from "vue";

const uiStore = useUIStore();

// 当页面窗口大小发生变化时，调整 Navigation 的显示
const display = useDisplay();
watch(display.mdAndUp, () => {
  uiStore.isNavBarOpen = display.mdAndUp.value;
});

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

function clickMenuItem () {
  if (display.smAndDown.value && uiStore.isNavBarOpen) {
    uiStore.isNavBarOpen = false;
  }
}

</script>

<template>
  <v-navigation-drawer
    id="ptpp-navigation"
    v-model="uiStore.isNavBarOpen"
    :width="220"
    expand-on-hover
    permanent
  >
    <v-list
      v-for="(group, groupIndex) in menuOptions" :key="groupIndex"
      density="compact"
      nav
    >
      <v-list-subheader class="grey--text text--darken-1">
        {{ $t(group.title) }}
      </v-list-subheader>
      <v-list-item
        v-for="(nav, navIndex) in group.children"
        :key="`${groupIndex}-${navIndex}`"
        :prepend-icon="nav.icon"
        :to="{ name: nav.name }"
        :value="nav"
        @click="clickMenuItem"
      >
        {{ $t(nav.title) }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
