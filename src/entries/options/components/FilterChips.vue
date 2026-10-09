<script setup lang="ts">
import { useDisplay } from "vuetify/framework";

/**
 * 通用的「全部 + 选项」chip 筛选器
 *
 * v-model 始终为数组：非 multiple 模式下最多只会有一个元素，空数组表示「全部」。
 * 选项内容（图标、名称等）通过 #chip 插槽自行渲染。
 */
const {
  items,
  allLabel,
  allIcon = "mdi-web",
  multiple = false,
  mandatory = false,
} = defineProps<{
  items: string[];
  allLabel: string;
  allIcon?: string;
  multiple?: boolean;
  mandatory?: boolean;
}>();

const model = defineModel<string[]>({ required: true });

const display = useDisplay();

function selectAll() {
  // 非 multiple 模式下「全部」表示不做筛选，multiple 模式下表示选中所有选项
  model.value = multiple ? [...items] : [];
}

// v-chip-group 在非 multiple 模式下回传的是单个值，这里统一成数组
function updateSelected(value: string | string[] | null) {
  model.value = Array.isArray(value) ? value : value ? [value] : [];
}
</script>

<template>
  <div class="d-flex align-center" style="min-width: 0">
    <v-chip
      class="chip_limit_width"
      :class="{ chip_content_hidden_fix: display.smAndDown.value }"
      :prepend-icon="allIcon"
      size="small"
      variant="outlined"
      @click.stop="selectAll"
    >
      {{ display.smAndDown.value ? "" : allLabel }}
    </v-chip>

    <v-chip-group
      color="primary"
      filter
      :mandatory="mandatory"
      :mobile="false"
      :model-value="model"
      :multiple="multiple"
      scroll-to-active
      show-arrows="always"
      variant="outlined"
      @update:model-value="updateSelected"
    >
      <v-chip v-for="item in items" :key="item" size="small" :value="item" class="mr-1 mb-1">
        <slot name="chip" :item="item" />
      </v-chip>
    </v-chip-group>
  </div>
</template>

<style lang="scss" scoped>
.chip_limit_width {
  min-width: fit-content;
}

/**
 * 在smAndDown环境下，全部 chip 中 文字内容被隐藏，但是由于使用了 prepend-icon 来设置图标，所以此处通过 hack css 的方法
 * 将 chip 整体变为圆形，并移除 icon 两侧的margin来居中
 */
.chip_content_hidden_fix {
  padding: 0 5px !important; // 0 10px -> 0 5px

  :deep(i.v-icon) {
    margin: 0; // 0 4px -> 0
  }
}
</style>
