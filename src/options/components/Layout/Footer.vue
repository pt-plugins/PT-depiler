<script lang="ts" setup>
import { EXT_VERSION, getBuildInfo, REPO_URL } from "@/shared/constants";
import { asyncComputed } from "@vueuse/core";

const year = new Date().getFullYear();
const buildInfo = asyncComputed(getBuildInfo);
</script>

<template>
  <v-footer id="ptpp-footer" app fixed>
    <span class="pl-2 grey--text text--darken-1">
      PTPP-next &copy; {{ year }},
      {{ $t('common.version') }}
      <span>
        {{ EXT_VERSION }}
        <a
          v-if="buildInfo?.gitVersion"
          :href="`${REPO_URL}/commit/${buildInfo.gitVersion.long}`"
          target="_blank"
        >+{{ buildInfo.gitVersion.short }}</a>
      </span>
    </span>
    <v-spacer />
  </v-footer>
</template>

<style lang="scss" scoped>
</style>
