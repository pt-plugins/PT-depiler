<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {REPO_URL} from "@/shared/constants.ts";

import EditorDialog from "./EditorDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import SolutionLabels from "./SolutionLabels.vue";

import {storedSearchSolution, useSiteStore} from "@/shared/store/site.ts";

const {t} = useI18n();
const siteStore = useSiteStore();

const showEditorDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);


const searchSolutionTableHeader = [
  {
    title: t("common.name"),
    key: "name",
    align: "start",
    width: 150
  },
  {
    title: "范围",
    key: "solution",
    align: "start",
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

const toDoSolution = ref<storedSearchSolution>();

function addSearchSolution() {
  toDoSolution.value = {
    id: "",
    name: "",
    plan: [],
    sort: 50
  };
  showEditorDialog.value = true;
}

function editSearchSolution(solution: storedSearchSolution) {
  toDoSolution.value = solution;
  showEditorDialog.value = true;
}

const toDeleteSolutionId = ref<string>("");

function deleteSearchSolution(solutionId: string) {
  toDeleteSolutionId.value = solutionId;
  showDeleteDialog.value = true;
}
</script>

<template>
  <v-alert type="info" :title="`搜索方案定义`" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          color="success" prepend-icon="mdi-plus"
          @click="addSearchSolution"
        >
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical/>
        <v-btn
          :href="REPO_URL + '/wiki'" color="info"
          rel="noopener noreferrer nofollow"
          prepend-icon="mdi-help"
          target="_blank"
        >
          如何使用
        </v-btn>
        <v-spacer/>
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
        {{ '<' + siteStore.getSolutionName(item.id) + '>' }}
      </template>

      <template #item.solution="{ item }">
        <span v-if="item.id === 'default'">
          默认搜索配置请在站点页面进行配置
        </span>
        <SolutionLabels v-else :solution="item"/>
      </template>
      <template #item.action="{ item }">
        <v-btn-group variant="plain">
          <v-btn
            size="small" icon="mdi-pencil"
            :title="$t('common.edit')"
            color="info"
            :disabled="item.id === 'default'"
            @click="editSearchSolution(item)"
          />
          <v-btn
            size="small" icon="mdi-delete"
            color="error"
            :title="$t('common.remove')"
            :disabled="item.id === 'default'"
            @click="deleteSearchSolution(item.id)"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <EditorDialog v-model="showEditorDialog" :solution="toDoSolution"/>
  <DeleteDialog v-model="showDeleteDialog" :to-delete-id="toDeleteSolutionId"/>
</template>

<style scoped></style>
