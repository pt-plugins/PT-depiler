<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { checkFn, resetTimeout } = defineProps<{
  checkFn: () => Promise<boolean>;
  resetTimeout?: number;
}>();
const emits = defineEmits<{
  (e: "after:checkConnect"): void;
}>();

const { t } = useI18n();

enum connectStatus {
  default = "default",
  success = "success",
  error = "error",
}

const connectBtnMap: Record<connectStatus, { icon: string; color: string }> = {
  [connectStatus.default]: { icon: "mdi-access-point", color: "info" },
  [connectStatus.success]: { icon: "mdi-access-point-check", color: "success" },
  [connectStatus.error]: { icon: "mdi-access-point-remove", color: "error" },
};

const isTestingConnectRef = ref<boolean>(false);
const connectStatusRef = ref<connectStatus>(connectStatus.default);

async function checkConnect() {
  isTestingConnectRef.value = true;
  try {
    connectStatusRef.value = (await checkFn()) ? connectStatus.success : connectStatus.error;
  } catch (e) {
    connectStatusRef.value = connectStatus.error;
    if (resetTimeout) {
      setTimeout(() => (connectStatusRef.value = connectStatus.default), resetTimeout);
    }
  } finally {
    isTestingConnectRef.value = false;
    emits("after:checkConnect");
  }
}
</script>

<template>
  <v-btn
    :color="connectBtnMap[connectStatusRef]['color']"
    :disabled="isTestingConnectRef"
    :loading="isTestingConnectRef"
    block
    variant="text"
    @click="checkConnect"
  >
    <v-icon :icon="connectBtnMap[connectStatusRef]['icon']" />
    {{ t("connectCheck." + connectStatusRef) }}
  </v-btn>
</template>

<style scoped lang="scss"></style>
