<script lang="ts" setup>
import { EXT_VERSION, EXT_GIT } from "@/shared/constants";

const year = new Date().getFullYear();
</script>

<template>
  <v-footer id="ptpp-footer" app fixed>
    <span class="pl-2 grey--text text--darken-1">
      PTPP-next &copy; {{ year }},
      {{ $t("common.version") }} <span>{{ EXT_VERSION }}{{ EXT_GIT?.short ? `+${EXT_GIT?.short}` : '' }}</span>
    </span>
    <v-spacer />
  </v-footer>
</template>

<style lang="scss" scoped>
</style>
