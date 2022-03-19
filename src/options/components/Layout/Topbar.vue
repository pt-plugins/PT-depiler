<script lang="ts" setup>
import { useStore } from "@/options/store";

const store = useStore();
</script>

<template>
  <v-app-bar id="ptpp-appbar" app color="amber">
    <template #prepend>
      <v-app-bar-nav-icon 
        :title="$t('topbar.navBarTip')"
        @click="store.uiOptions.navBarIsOpen = !store.uiOptions.navBarIsOpen"
      />
    </template>

    <v-app-bar-title style="width: 220px" class="hidden-md-and-down">
      {{ $t("common.name") }}
    </v-app-bar-title>
  </v-app-bar>
</template>

<style lang="scss" scoped></style>
