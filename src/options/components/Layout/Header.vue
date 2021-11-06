<script lang="ts" setup>

</script>

<template>
  <n-layout-header id="ptpp-header" bordered>
    <n-space align="center" style="align-items: center">
      <n-space align="center">
        <n-button tag="img" src="/assets/icon-64.png" class="ptpp-icon" @click="$router.push('/')">
        </n-button>
        PT 助手 Plus
      </n-space>
      <div>
        <n-button type="warning">Warning</n-button>
      </div>

    </n-space>
  </n-layout-header>
</template>

<style scoped>
#ptpp-header {
  height: 64px;
  align-items: center;
  background-color: #ffc107;
  border-color: #ffc107;
}

.ptpp-icon {
  margin: 8px 0 0 2px;
  width: 32px;
  height: 32px;
}
</style>
