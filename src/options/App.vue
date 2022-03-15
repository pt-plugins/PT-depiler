<script lang="ts" setup>
import { isDark } from "@/options/utils";
import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS } from "naive-ui";
import { useI18n } from "vue-i18n";
import { useStore } from "@/options/store";
import browser from "webextension-polyfill";

const { locale } = useI18n();

const store = useStore();

// 从浏览器中加载数据
browser.storage.local.get("PTPP-v2-Data").then((initPersistData) => {
  if (initPersistData["PTPP-v2-Data"]) {
    // 如果有值，则使用persist data替换整个store
    store.$patch(initPersistData["PTPP-v2-Data"]);
  }
  store.isReady = true;

  // 当store出现任何变更的时候，更新浏览器数据，这样我们就不用在每个action中写方法了
  store.$subscribe((mutation, state) => {
    console.log("Store subscribe ", mutation, state);
    browser.storage.local.set({
      "PTPP-v2-Data": JSON.parse(JSON.stringify(state)),
    });
  });
});
</script>

<template>
  <n-config-provider
    :theme="isDark ? darkTheme : null"
    :locale="locale === 'zh-CN' ? zhCN : enUS"
    :date-locale="locale === 'zh-CN' ? dateZhCN : dateEnUS"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <router-view />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style lang="scss">
@import "~github-markdown-css";

// 用一种比较hack的方法来实现markdown区域的暗黑模式
.markdown-body {
  color: var(--text-color);
  background-color: var(--color);

  pre {
    background-color: var(--color-neutral-muted);
  }
}

// https://docs.microsoft.com/en-us/microsoft-edge/web-platform/password-reveal
::-ms-reveal {
  display: none;
}
</style>
