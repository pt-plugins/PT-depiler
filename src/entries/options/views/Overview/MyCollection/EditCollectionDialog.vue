<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { ICollectionFolder, TCollectionId } from "@/shared/types.ts";

const { t } = useI18n();

const showDialog = defineModel<boolean>();

const props = defineProps<{
  collection?: ICollectionFolder | null;
}>();

const emits = defineEmits<{
  (e: "save", data: { id?: TCollectionId; name: string; color?: string; sortIndex?: number }): void;
}>();

const formName = ref("");
const formColor = ref("primary");
const formSortIndex = ref(100);

const colorOptions = [
  "primary",
  "secondary",
  "red",
  "pink",
  "purple",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "brown",
  "grey",
];

watch(showDialog, (val) => {
  if (val) {
    if (props.collection) {
      formName.value = props.collection.name;
      formColor.value = props.collection.color ?? "primary";
      formSortIndex.value = props.collection.sortIndex ?? 100;
    } else {
      formName.value = "";
      formColor.value = "primary";
      formSortIndex.value = 100;
    }
  }
});

function save() {
  if (!formName.value.trim()) return;
  emits("save", {
    id: props.collection?.id,
    name: formName.value.trim(),
    color: formColor.value,
    sortIndex: formSortIndex.value,
  });
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="480">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar :color="formColor">
          <v-toolbar-title>
            {{ collection ? t("MyCollection.editDialog.titleEdit") : t("MyCollection.editDialog.titleAdd") }}
          </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <v-text-field
          v-model="formName"
          :label="t('MyCollection.editDialog.name')"
          hide-details="auto"
          class="mb-4"
          :rules="[(v) => !!v || t('MyCollection.editDialog.nameRequired')]"
        />

        <v-text-field
          v-model.number="formSortIndex"
          :label="t('common.sortIndex')"
          type="number"
          hide-details
          class="mb-4"
        />

        <div class="mb-2 text-caption text-grey-darken-1">{{ t("MyCollection.editDialog.color") }}</div>
        <v-chip-group v-model="formColor" mandatory selected-class="text-primary">
          <v-chip v-for="c in colorOptions" :key="c" :value="c" :color="c" size="small" label>
            {{ c }}
          </v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">{{ t("common.dialog.cancel") }}</v-btn>
        <v-btn color="primary" variant="tonal" @click="save">{{ t("common.dialog.ok") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
