<script lang="ts" setup>
import { useConfigStore } from "@/options/stores/config.ts";
import { useDisplay } from "vuetify";
import { routes } from "@/options/plugins/router";
import { watch } from "vue";
import { isDebug, REPO_URL } from "~/helper.ts";

const git = __GIT_VERSION__;
const ext_version = __EXT_VERSION__;
const year = new Date().getFullYear();
const configStore = useConfigStore();

// 当页面窗口大小发生变化时，调整 Navigation 的显示
const display = useDisplay();
watch(display.mdAndUp, () => {
  configStore.isNavBarOpen = display.mdAndUp.value;
});

// 自动从router.ts生成目录
const menuOptions = routes
  .filter((route) => route.meta?.isMainMenu)
  .map((route) => {
    return {
      title: `route.${String(route.name)}.default`,
      name: route.name,
      icon: route.meta?.icon,
      children: route
        .children!.filter((childrenRoute) => !(childrenRoute.meta?.show === false)) // 允许通过 meta.show = false 隐藏子路由
        .map((childrenRoute) => {
          return {
            title: `route.${String(route.name)}.${String(childrenRoute.name)}`,
            name: childrenRoute.name,
            icon: childrenRoute.meta?.icon,
          };
        }),
    };
  }); // 根据 meta 的 isMainMenu 属性筛选出应该列在目录中的路径

function clickMenuItem() {
  if (display.smAndDown.value && configStore.isNavBarOpen) {
    configStore.isNavBarOpen = false;
  }
}
</script>

<template>
  <v-navigation-drawer id="ptd-navigation" v-model="configStore.isNavBarOpen" :width="220" expand-on-hover permanent>
    <!-- 侧边栏导航标题 -->
    <v-list density="compact" nav>
      <template v-for="(group, groupIndex) in menuOptions" :key="groupIndex">
        <v-list-subheader class="text-grey-darken-1">
          {{ $t(group.title) }}
        </v-list-subheader>
        <v-list-item
          v-for="(nav, navIndex) in group.children"
          :key="`${groupIndex}-${navIndex}`"
          :prepend-icon="nav.icon! as string"
          :to="{ name: nav.name }"
          :value="nav"
          class="list-item-half-spacer"
          @click="clickMenuItem"
        >
          {{ $t(nav.title) }}
        </v-list-item>
      </template>
    </v-list>

    <!-- 页脚，用于展示版本信息 -->
    <template v-slot:append>
      <v-footer>
        <v-row justify="center">
          <span class="pa-2 text-grey-darken-1">
            &copy; {{ year }},
            <a :href="`${REPO_URL}${git.long ? `/commit/${git.long}` : ''}`" target="_blank">{{ ext_version }}</a>
            <v-chip v-if="isDebug" class="pa-1 ml-1 mb-1" color="amber" label size="x-small">
              {{ $t("common.test") }}
            </v-chip>
          </span>
        </v-row>
      </v-footer>
    </template>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>
