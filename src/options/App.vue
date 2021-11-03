<script lang="ts" setup>
import { isDark } from '@/options/utils';
import { darkTheme } from 'naive-ui';
import Layout from '@/options/views/Layout.vue';
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : null">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <Layout/>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
