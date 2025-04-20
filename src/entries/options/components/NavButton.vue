<script setup lang="ts">
import { useDisplay } from "vuetify/framework";

const display = useDisplay();

const props = defineProps<{
  icon: string;
  text: string;
}>();
</script>

<template>
  <v-btn
    v-bind="$attrs"
    :icon="display.smAndDown.value"
    :prepend-icon="display.smAndDown.value ? undefined : props.icon"
    :rounded="display.smAndDown.value ? 0 : 4 /* default rounded */"
    :size="display.smAndDown.value ? 'small' : 'default'"
    :title="props.text"
    :variant="display.smAndDown.value ? 'text' : 'elevated'"
  >
    <v-icon v-if="display.smAndDown.value" :icon="props.icon"></v-icon>
    <span v-else>{{ props.text }}</span>
  </v-btn>
</template>

<style scoped lang="scss"></style>
