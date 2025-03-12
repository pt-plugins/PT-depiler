<script lang="ts" setup>
import { useUIStore } from "@/options/stores/ui";
import { useDisplay } from "vuetify";
import { routes } from "@/options/plugins/router";
import { watch } from "vue";
import { buildInfo, REPO_URL } from "~/helper.ts";
import { version as EXT_VERSION } from "~/../package.json";

const year = new Date().getFullYear();
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

function clickMenuItem() {
  if (display.smAndDown.value && uiStore.isNavBarOpen) {
    uiStore.isNavBarOpen = false;
  }
}
</script>

<template>
  <v-navigation-drawer id="ptpp-navigation" v-model="uiStore.isNavBarOpen" :width="220" expand-on-hover permanent>
    <!-- 侧边栏导航标题 -->
    <v-list density="compact" nav>
      <template v-for="(group, groupIndex) in menuOptions" :key="groupIndex">
        <v-list-subheader class="grey--text text--darken-1">
          {{ $t(group.title) }}
        </v-list-subheader>
        <v-list-item
          v-for="(nav, navIndex) in group.children"
          :key="`${groupIndex}-${navIndex}`"
          :prepend-icon="nav.icon! as string"
          :to="{ name: nav.name }"
          :value="nav"
          @click="clickMenuItem"
        >
          {{ $t(nav.title) }}
        </v-list-item>
      </template>
    </v-list>

    <!-- 页脚 -->
    <template v-slot:append>
      <v-footer>
        <v-row justify="center">
          <span class="pa-2 grey--text text--darken-1">
            &copy; {{ year }}, {{ $t("common.version") }}
            <span>
              {{ "v" + EXT_VERSION }}
              <a v-if="buildInfo?.gitVersion" :href="`${REPO_URL}/commit/${buildInfo.gitVersion.long}`" target="_blank">
                +{{ buildInfo.gitVersion.short }}
              </a>
            </span>
          </span>
        </v-row>
      </v-footer>
    </template>
  </v-navigation-drawer>
</template>
