<script lang="ts" setup>

import { ref } from "vue";
import { REPO_URL } from "@/shared/constants";
import { useI18n } from "vue-i18n";
import SolutionLabels from "@/options/components/Settings/setSearchSolution/SolutionLabels.vue";
import { storedSearchSolution, useSiteStore } from "@/shared/store/site";
import EditorDialog from "@/options/components/Settings/setSearchSolution/EditorDialog.vue";


const { t } = useI18n();
const siteStore = useSiteStore();

const showEditorDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);
const toDoSolution = ref<storedSearchSolution> ();

const searchSolutionTableHeader = [
  {
    title: t("common.name"),
    key: "name",
    align: "left",
    width: 150
  },
  {
    title: "范围",
    key: "solution",
    align: "left",
    filterable: false,
    sortable: false,
  },
  {
    title: "排序",
    key: "sort",
    align: "center",
    width: 100
  },
  {
    title: t("common.action"),
    key: "action",
    filterable: false,
    sortable: false,
    width: 200
  }
];

function addSearchSolution() {
  toDoSolution.value = {
    id: "",
    name: "",
    plan: [],
    sort: 50
  };
  showEditorDialog.value = true;
}

function editSearchSolution(solution) {
  toDoSolution.value = solution;
  showEditorDialog.value = true;
}

function deleteSearchSolution(solution) {
  siteStore.removeSearchSolution(solution.id);
}

</script>

<template>
  <v-alert type="info">
    搜索方案定义
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          color="success" prepend-icon="mdi-plus"
          @click="addSearchSolution"
        >
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical />
        <v-btn
          :href="REPO_URL + '/wiki'" color="info"
          rel="noopener noreferrer nofollow"
          prepend-icon="mdi-help"
          target="_blank"
        >
          如何使用
        </v-btn>
        <v-spacer />
        <v-text-field
          append-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          hide-details
        />
      </v-row>
    </v-card-title>

    <v-data-table
      :headers="searchSolutionTableHeader"
      :items="siteStore.getSolutionList"
      item-value="name"
      must-sort :sort-by="[{key: 'sort', order: 'asc'}, {key: 'name', order: 'asc'}]"
    >
      <template #item.name="{item}">
        {{ '<' + siteStore.getSolutionName(item.raw.id) + '>' }}
      </template>

      <template #item.solution="{ item }">
        <span v-if="item.raw.id === 'default'">
          默认搜索配置请在站点页面进行配置
        </span>
        <SolutionLabels v-else :solution="item.raw" />
      </template>
      <template #item.action="{ item }">
        <v-btn-group variant="plain">
          <v-btn
            size="small" icon="mdi-pencil"
            :title="$t('common.edit')"
            color="info"
            :disabled="item.raw.id === 'default'"
            @click="editSearchSolution(item.raw)"
          />
          <v-btn
            size="small" icon="mdi-delete"
            color="error"
            :title="$t('common.remove')"
            :disabled="item.raw.id === 'default'"
            @click="deleteSearchSolution(item.raw)"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditorDialog v-model="showEditorDialog" :solution="toDoSolution" />
</template>

<style scoped></style>
