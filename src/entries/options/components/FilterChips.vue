<script setup lang="ts">
import { computed } from "vue";
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
  allClears = false,
  soloOnDblclick = false,
  soloHint,
} = defineProps<{
  items: string[];
  allLabel: string;
  allIcon?: string;
  multiple?: boolean;
  mandatory?: boolean;
  /**
   * multiple 模式下「全部」chip 的含义：
   * - false（默认）：选中所有选项（等价于「每个选项都勾上」）
   * - true：清空已选（等价于「不做筛选」），适用于站点筛选这类「不选即全部」的场景
   */
  allClears?: boolean;
  /** 是否允许双击单个选项「只选它一个」（多选时快速收敛到单选） */
  soloOnDblclick?: boolean;
  /** 双击单个选项的提示文案，仅在 soloOnDblclick 开启时作为 title 展示 */
  soloHint?: string;
}>();

const model = defineModel<string[]>({ required: true });

const display = useDisplay();

function selectAll() {
  if (!multiple) {
    // 非 multiple 模式下「全部」表示不做筛选
    model.value = [];
    return;
  }
  // multiple 模式下默认表示选中所有选项，allClears 时改为清空（交给上层按「不筛选」处理）
  model.value = allClears ? [] : [...items];
}

// v-chip-group 在非 multiple 模式下回传的是单个值，这里统一成数组
function updateSelected(value: string | string[] | null) {
  model.value = Array.isArray(value) ? value : value ? [value] : [];
}

/**
 * 双击某个选项 = 只选它一个。
 * 多选场景下，从「勾了 6 个」收敛到「只看 1 个」如果只能逐个取消，要点 6 次；
 * 双击一步到位，且不影响单击的勾选 / 取消语义。
 *
 * 注意：浏览器会先派发两次 click 再派发 dblclick，中间的中间态会短暂生效
 * （表现为 chip 闪一下），最终状态以 dblclick 的赋值结果为准。
 */
function soloSelect(item: string) {
  if (!soloOnDblclick) return;
  model.value = [item];
}

/**
 * 「全部」chip 的选中态。
 * 只有 allClears（多选且「不选即全部」）时，空选才等价于「全部」；
 * 其他场景（如媒体服务器筛选）空选表示一个都没选，不宜高亮成「已选全部」。
 */
const showAllActive = computed(() => allClears && model.value.length === 0);
</script>

<template>
  <div class="d-flex align-center" style="min-width: 0">
    <v-chip
      class="chip_limit_width"
      :class="{ chip_content_hidden_fix: display.smAndDown.value }"
      :color="showAllActive ? 'primary' : undefined"
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
      <v-chip
        v-for="item in items"
        :key="item"
        class="mr-1 mb-1"
        size="small"
        :title="soloOnDblclick ? soloHint : undefined"
        :value="item"
        @dblclick.stop="soloSelect(item)"
      >
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
