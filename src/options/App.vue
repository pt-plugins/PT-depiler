<script lang="ts" setup>
import { isDark } from '@/options/utils';
import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
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
</style>
