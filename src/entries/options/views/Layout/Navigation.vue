<script lang="ts" setup>
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

import { routes } from "@/options/plugins/router";
import { useConfigStore } from "@/options/stores/config.ts";

import { isDebug, REPO_URL } from "~/helper.ts";

const git = __GIT_VERSION__;
const ext_version = __EXT_VERSION__;
const year = new Date().getFullYear();

const { t } = useI18n();
const configStore = useConfigStore();

// 当页面窗口大小发生变化时，调整 Navigation 的显示
const display = useDisplay();

// 小屏幕（手机 / 平板）下侧边栏改为抽屉式浮层并从收起状态开始，
// 避免像桌面端那样挤占本就有限的内容宽度。
// 断点与 Vuetify 4 的 mobile 判定一致（lg = 1145px）：低于它时侧边栏临时浮层，达到后才常驻。
// 这里直接读 media query：组件 setup 阶段 display 的宽度可能尚未初始化，
// 用 display.lgAndDown 会把大屏也误关。在渲染前就置为收起，防止首帧先展开、下一帧再收起造成闪烁。
if (window.matchMedia("(max-width: 1144.98px)").matches) {
  configStore.isNavBarOpen = false;
}

watch(display.lgAndUp, () => {
  if (configStore.autoToggleNavBarOnDisplayChange) {
    configStore.isNavBarOpen = display.lgAndUp.value;
  }
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
</script>

<template>
  <v-navigation-drawer
    id="ptd-navigation"
    v-model="configStore.isNavBarOpen"
    :permanent="display.lgAndUp.value"
    :width="220"
    expand-on-hover
  >
    <!-- 侧边栏导航标题 -->
    <v-list density="compact" nav>
      <template v-for="(group, groupIndex) in menuOptions" :key="groupIndex">
        <v-list-subheader class="text-grey-darken-1">
          {{ t(group.title) }}
        </v-list-subheader>
        <v-list-item
          v-for="(nav, navIndex) in group.children"
          :key="`${groupIndex}-${navIndex}`"
          :prepend-icon="nav.icon! as string"
          :to="{ name: nav.name }"
          :value="nav"
          class="list-item-half-spacer"
        >
          {{ t(nav.title) }}
        </v-list-item>
      </template>
    </v-list>

    <!-- 页脚，用于展示版本信息 -->
    <template v-slot:append>
      <v-footer class="pa-0">
        <v-row gap="0" class="justify-center">
          <span class="pa-2 text-grey-darken-1">
            &copy; {{ year }},
            <a :href="`${REPO_URL}${git.long ? `/commit/${git.long}` : ''}`" target="_blank">{{ ext_version }}</a>
            <v-chip v-if="isDebug" class="pa-1 ml-1 mb-1" color="amber" label size="x-small">
              {{ t("common.test") }}
            </v-chip>
          </span>
        </v-row>
      </v-footer>
    </template>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped></style>
