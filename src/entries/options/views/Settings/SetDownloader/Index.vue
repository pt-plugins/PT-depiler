<script setup lang="ts">
import { useMetadataStore } from "@/options/stores/metadata.ts";

const metadataStore = useMetadataStore();
</script>

<template>
  <v-alert type="info" :title="$t('route.Settings.SetDownloader')" />
  <v-card class="set-downloader">
    <v-card-title>
      <v-row class="ma-0"> </v-row>
    </v-card-title>
  </v-card>
</template>

<style scoped lang="scss"></style>
