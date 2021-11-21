<script lang="ts" setup>

</script>

<template>
  <n-layout-content id="ptpp-content" content-style="padding: 16px;" :native-scrollbar="false">
    <router-view v-slot="{Component, route}">
      <transition :name="route.meta.transitionName || 'fade'">
        <keep-alive v-if="route.meta.keepAlive">
          <component :is="Component" />
        </keep-alive>
        <component v-else :is="Component" />
      </transition>
    </router-view>
  </n-layout-content>
</template>

<style scoped>

</style>
