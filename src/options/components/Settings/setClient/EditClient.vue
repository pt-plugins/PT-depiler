<script lang="ts" setup>
import { inject } from 'vue';
import { Ref } from '@vue/reactivity';

const showEditModal = inject<Ref>('showEditModal');
</script>

<template>
  <n-modal v-model:show="showEditModal">
    <n-card style="max-width: 800px;" :title="$t('setClient.add.title')" :bordered="false" size="huge">
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
