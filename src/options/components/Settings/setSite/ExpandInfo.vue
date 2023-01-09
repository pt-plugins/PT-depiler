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
  <v-row no-gutters>
    <v-col>
      <ul style="list-style-type: none">
        <li>
          <slot :data="props.main" :field="`main`">
            {{ props.main }}
          </slot>
        </li>
        <template v-if="showExpand">
          <li v-for="(text, i) in expand" :key="i">
            <slot :data="text" :field="`expand`">
              {{ text }}
            </slot>
          </li>
        </template>
      </ul>
    </v-col>
    <v-col v-if="props.expand?.length > 0" style="max-width: 20px">
      <v-icon :icon="showExpand ? 'mdi-chevron-down' : 'mdi-chevron-up'" @click="toggleExpand()" />
    </v-col>
  </v-row>
</template>


<style scoped>

</style>
