<script lang="ts" setup>
import ky from "ky";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";

const { t } = useI18n();

const ptppHistory = [
  {
    name: "PTPP Next",
    time: "2020-10-25",
    link: "https://github.com/pt-plugins/ptpp-next",
    color: "info",
  },
  {
    name: "PT Plugin Plus",
    time: "2018-12-16",
    link: "https://github.com/ronggang/PT-Plugin-Plus"
  },
  {
    name: "PT Plugin （Rhilip修改版）",
    time: "2018-04-18",
    link: "https://github.com/Rhilip/PT-Plugin"
  },
  {
    name: "PT Plugin",
    time: "2014-10-10",
    link: "https://github.com/ronggang/PT-Plugin"
  }
];

interface ITData {
  name: string,
  version: string,
  url: string
}

const technologyData = useStorage<Record<string, ITData>>("technology-data", {
  "Jackett": {
    name: "Jackett",
    version: "latest",
    url: "https://github.com/Jackett/Jackett"
  }
});

// Load deps from package.json
const rawDependencyContext = import.meta.webpackContext!("@/..", {
  regExp: /package\.json$/,
  exclude: /node_module/,
  mode: "sync"
});

const npmjsPrefix = "https://www.npmjs.com/package/";
for (const dependencyKey of rawDependencyContext.keys()) {
  const { dependencies } = rawDependencyContext(dependencyKey);

  Object.entries(dependencies).forEach(value => {
    const [name, version] = value;

    if (name.startsWith("@ptpp")) {
      return;
    }

    technologyData.value[name] ??= {
      name,
      version: (version as string),
      url: `${npmjsPrefix}${name}`
    };

    if (technologyData.value[name].version !== version || technologyData.value[name].url.startsWith(npmjsPrefix)) {
      ky.get(`https://registry.npmjs.org/${name}`)
        .json<{ homepage: string }>()
        .then(data => {
          technologyData.value[name].url = data?.homepage;
        });
    }
  });
}

const TechnologyStackTableHeader = [
  {
    title: t("TechnologyStack.stackTableColumn.name"),
    key: "name",
    align: "center",
    filterable: false,
  },
  {
    title: t("common.version"),
    key: "version",
    align: "center",
    filterable: false,
    sortable: false,
  },
  {
    title: t("TechnologyStack.stackTableColumn.homepage"),
    key: "url",
    align: "left",
    filterable: false,
    sortable: false,
  },
];

const tableDependencies = computed(() => Object.entries(technologyData.value));
</script>

<template>
  <v-alert class="mb-2" type="info">
    {{ $t('TechnologyStack.thankNote') }}
  </v-alert>
  <v-card class="mb-2">
    <v-card-title>{{ $t('TechnologyStack.ptppHistory') }}</v-card-title>
    <v-card-text>
      <v-timeline :side="$vuetify.display.mdAndUp ? undefined : 'end'">
        <v-timeline-item
          v-for="history in ptppHistory" :key="history.name"
          rounded
          :size="history.color ? 'default' : 'x-small'"
          :dot-color="history.color ?? ''"
        >
          <template #opposite>
            {{ history.time }}
          </template>
          <template v-if="$vuetify.display.smAndUp">
            <strong>{{ history.name }}</strong><br>
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
    <v-card-title>{{ $t('TechnologyStack.dependency') }}</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="TechnologyStackTableHeader" :items="tableDependencies"
        item-value="id"
        :items-per-page="-1"
        must-sort
        :sort-by="[{key: 'name', order: 'asc'}]"
      >
        <template #item.url="{ item }">
          <a :href="item.raw.url" target="_blank" rel="noopener noreferrer nofollow">{{ item.raw.url }}</a>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
