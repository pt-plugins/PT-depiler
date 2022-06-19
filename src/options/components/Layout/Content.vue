<script lang="ts" setup></script>

<template>
  <v-container fluid>
    <router-view v-slot="{ Component, route }">
      <keep-alive v-if="route.meta.keepAlive">
        <component :is="Component" />
      </keep-alive>
      <component :is="Component" v-else />
    </router-view>
  </v-container>
</template>

<style scoped></style>
