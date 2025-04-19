<script lang="ts" setup>
import axios from "axios";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";
import { dependencies, devDependencies } from "~/../package.json";
import { REPO_URL } from "~/helper.ts";

const { t } = useI18n();

const ptppHistory = [
  { name: "PT Depiler", time: "2020-10-25", link: REPO_URL, color: "info" },
  { name: "PT Plugin Plus", time: "2018-12-16", link: "https://github.com/ronggang/PT-Plugin-Plus" },
  { name: "PT Plugin （Rhilip修改版）", time: "2018-04-18", link: "https://github.com/Rhilip/PT-Plugin" },
  { name: "PT Plugin", time: "2014-10-10", link: "https://github.com/ronggang/PT-Plugin" },
];

type ITDataName = string;
interface ITData {
  name: ITDataName;
  version: string;
  url: string;
}

const technologyData = useLocalStorage<Record<ITDataName, ITData>>("PTD_TechnologyData", {
  Jackett: {
    name: "Jackett",
    version: "latest",
    url: "https://github.com/Jackett/Jackett",
  },
});

const npmjsPrefix = "https://www.npmjs.com/package/";

// Load deps from package.json
Object.entries({ ...dependencies, ...devDependencies }).forEach((value) => {
  const [name, version] = value;

  technologyData.value[name] ??= {
    name,
    version: "",
    url: `${npmjsPrefix}${name}`,
  };

  if (
    technologyData.value[name].version !== version &&
    (technologyData.value[name].url ?? "").startsWith(npmjsPrefix)
  ) {
    axios
      .get(`https://registry.npmjs.org/${name}`)
      .then(({ data }) => {
        technologyData.value[name].url = data?.homepage ?? `${npmjsPrefix}${name}`;
      })
      .finally(() => {
        technologyData.value[name].version = version;
      });
  }
});

const TechnologyStackTableHeader = [
  { title: t("common.name"), key: "name", align: "start", filterable: false },
  { title: t("common.version"), key: "version", align: "center", filterable: false, sortable: false },
  {
    title: t("TechnologyStack.stackTableColumn.homepage"),
    key: "url",
    align: "start",
    filterable: false,
    sortable: false,
  },
];

const tableDependencies = computed(() => Object.values(technologyData.value));
</script>

<template>
  <v-alert :title="$t('TechnologyStack.thankNote')" class="mb-2" type="info" />
  <v-card class="mb-2">
    <v-card-title>{{ t("TechnologyStack.ptppHistory") }}</v-card-title>
    <v-card-text>
      <v-timeline side="end">
        <v-timeline-item
          v-for="history in ptppHistory"
          :key="history.name"
          :dot-color="history.color ?? ''"
          :size="history.color ? 'default' : 'x-small'"
          rounded
        >
          <template #opposite>
            {{ history.time }}
          </template>
          <template v-if="$vuetify.display.smAndUp">
            <strong>{{ history.name }}</strong
            ><br />
            <a :href="history.link" target="_blank">{{ history.link }}</a>
          </template>
          <template v-else>
            <a :href="history.link" target="_blank">{{ history.name }}</a>
          </template>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
  <v-card>
    <v-card-title>{{ t("TechnologyStack.dependency") }}</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="TechnologyStackTableHeader"
        :items="tableDependencies"
        :items-per-page="-1"
        :sort-by="[{ key: 'name', order: 'asc' }]"
        hover
        item-value="id"
        must-sort
      >
        <template #item.url="{ item }">
          <a :href="item.url" rel="noopener noreferrer nofollow" target="_blank">{{ item.url }}</a>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
