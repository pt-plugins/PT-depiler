<script lang="ts" setup>
import { getFullVersion } from "@/shared/constants";

const version = getFullVersion();
const year = new Date().getFullYear();
</script>

<template>
  <v-footer id="ptpp-footer" app fixed>
    <span class="pl-2 grey--text text--darken-1">
      PTPP-next &copy; {{ year }}, {{ $t("common.version") }} {{ version.full }}
    </span>
    <v-spacer />
  </v-footer>
</template>

<style lang="scss" scoped>
</style>
