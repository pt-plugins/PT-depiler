<script setup lang="ts">
import { useDisplay } from "vuetify/framework";

const display = useDisplay();

const { disabled = false, ...props } = defineProps<{
  icon: string;
  text: string;
  disabled?: boolean;
}>();
</script>

<template>
  <v-btn
    v-bind="$attrs"
    :class="{ 'nav-button-full': !display.smAndDown.value }"
    :icon="display.smAndDown.value"
    :prepend-icon="display.smAndDown.value ? undefined : props.icon"
    :rounded="display.smAndDown.value ? 0 : 4 /* default rounded */"
    :size="display.smAndDown.value ? 'small' : 'default'"
    :disabled="disabled"
    :title="props.text"
    :variant="display.smAndDown.value ? 'text' : 'elevated'"
  >
    <v-icon v-if="display.smAndDown.value" class="nav-button-icon" :icon="props.icon"></v-icon>
    <span v-else class="nav-button-text">{{ props.text }}</span>
  </v-btn>
</template>

<style scoped lang="scss">
.nav-button-full + .nav-button-full {
  margin-left: 4px;
}

/* Vuetify 4 的排版默认值（MD3 label-large 等）与 v3 存在差异，导致升级后 nav 按钮文字观感变大。
 * 这里按 Vuetify 3 下 VBtn 默认尺寸（size=default）的排版规格显式固定：
 * 14px / 字重 500 / 大写 / 字距，保证升级前后（含两档响应式尺寸）观感一致。
 * refs: vuetify v3→v4 Upgrade Guide, Typography Migration */
.nav-button-text {
  font-size: 0.875rem; // 14px，v3 默认按钮文字大小
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.0892857143em; // v3 button 的 letter-spacing
  text-transform: uppercase; // v3 默认按钮文字大写
  white-space: nowrap;
}

/* Vuetify 4 下按钮内图标（v-icon 的 --v-icon-size-multiplier / size 计算）默认值与 v3 有出入，
 * 导致升级后 nav 按钮图标观感变大。按 Vuetify 3 的计算结果显式固定图标字号：
 *   - 大屏（文字按钮，prepend 图标）：calc(0.8571428571 * 1.5em * 14px) ≈ 18px
 *   - 小屏（纯图标按钮 size=small）：calc(1 * 1.5em * 12px) ≈ 18px
 * em 以按钮文字（见上方钉死的 .nav-button-text / --v-btn-size）为基准，保证两档观感与 v3 一致。 */
.nav-button-full :deep(.v-btn__prepend > .v-icon) {
  --v-icon-size-multiplier: 1; // 显式接管，避免依赖 v4 层叠中的 multiplier
  font-size: 1.2857142857em; // = 18px @ 按钮 14px（v3 .v-btn .v-icon 的等价结果）
}

.nav-button-icon {
  --v-icon-size-multiplier: 1;
  font-size: 1.5em; // = 18px @ size=small 按钮 12px
}
</style>
