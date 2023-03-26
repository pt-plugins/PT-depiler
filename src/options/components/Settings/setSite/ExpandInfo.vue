<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import { ref } from "vue";

const props = defineProps<{
  open?: boolean
  main: string,
  expand?: string[],
}>();

const showExpand = ref<boolean>(props.open ?? false);
const toggleExpand = useToggle(showExpand);
</script>

<template>
  <div class="d-flex justify-space-between">
    <ul style="list-style-type: none">
      <li class="text-left">
        <slot :data="props.main" :field="`main`">
          {{ props.main }}
        </slot>
      </li>
      <template v-if="showExpand">
        <li v-for="(text, i) in expand" :key="i" class="text-left">
          <slot :data="text" :field="`expand`">
            {{ text }}
          </slot>
        </li>
      </template>
    </ul>
    <v-icon
      v-if="props.expand?.length > 0" style="max-width: 20px"
      :icon="showExpand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      @click="toggleExpand()"
    />
  </div>
</template>

<style scoped>

</style>
