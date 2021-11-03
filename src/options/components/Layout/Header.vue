<script lang="ts" setup>
// TODO
</script>

<template>
  <n-space align="center">
    <n-text>
      <img src="/assets/icon-64.png" class="ptpp-icon"/>
      PT 助手 Plus
    </n-text>
    <n-input-group>
      <n-button type="primary">搜索</n-button>
      <n-input :style="{ width: '50%' }" />
      <n-button type="primary" ghost>搜索</n-button>
    </n-input-group>
  </n-space>
</template>

<style scoped>
.ptpp-icon {
  width: 32px;
  height: 32px;
}
</style>
