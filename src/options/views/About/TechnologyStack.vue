<script lang="ts" setup>
import axios from 'axios';
import { h } from 'vue';
import { NA } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { ExternalLinkAlt } from '@vicons/fa';
import { dependencies as rawDependencies } from '@/../package.json';
import { getFullVersion, VersionDetail } from '@/shared/constants';

const { t } = useI18n();

const ptppHistory = [
  {
    name: 'PTPP Next',
    type: 'success',
    time: '2020-10-25',
    link: 'https://github.com/ronggang/PT-Plugin-Plus/tree/next'
  },
  {
    name: 'PT Plugin Plus',
    type: 'info',
    time: '2018-12-16',
    link: 'https://github.com/ronggang/PT-Plugin-Plus'
  },
  {
    name: 'PT Plugin （Rhilip修改版）',
    time: '2018-04-18',
    link: 'https://github.com/Rhilip/PT-Plugin'
  },
  {
    name: 'PT Plugin',
    time: 'before 2014-10-10',
    link: 'https://github.com/ronggang/PT-Plugin'
  }
];

const version = getFullVersion();

interface ITData {
  name: string,
  ver: string,
  url: string
}

interface ITechnologyData {
  version: VersionDetail,
  technologyData: ITData[],
}

const technologyTableColumn = [
  {
    title: () => t('TechnologyStack.stackTableColumn.name'),
    key: 'name',
    sorter: 'default',
    defaultSortOrder: 'ascend'
  },
  {
    title: () => t('TechnologyStack.stackTableColumn.version'),
    key: 'ver',
    align: 'center'
  },
  {
    title: () => t('TechnologyStack.stackTableColumn.homepage'),
    key: 'url',
    render (row: { url: any; }) {
      return h(NA, { target: '_blank', href: row.url }, { default: () => row.url });
    }
  }
];

const technologyData = useStorage<ITechnologyData>('technology-data', { version, technologyData: [] });
if (technologyData.value.version.full !== version.full || technologyData.value.technologyData.length === 0) {
  // 清空原缓存的信息
  technologyData.value.technologyData = [];

  function updateTechnologyData (name: string, version: string, url?: string) {
    if (!name.startsWith('@ptpp')) {
      const oldCache = technologyData.value.technologyData.find(x => x.name === name);
      if (!oldCache) {
        technologyData.value.technologyData.push({
          name: name,
          ver: version,
          url: url ?? `https://www.npmjs.com/package/${name}`
        });
      }
    }
  }

  // 主项目依赖
  Object.entries(rawDependencies).forEach(([name, version]) => {
    updateTechnologyData(name, version);
  });

  // monorepo的其他依赖
  const deepDependency = require.context('@/resource', true, /package\.json$/);
  deepDependency.keys().forEach(key => {
    Object.entries(deepDependency(key).dependencies).forEach(([name, version]) => {
      updateTechnologyData(name, version as string);
    });
  });

  // 其他特别依赖/参考项目
  [
    {
      name: 'Jackett',
      ver: 'latest',
      url: 'https://github.com/Jackett/Jackett'
    }
  ].forEach(({ name, ver, url }) => updateTechnologyData(name, ver, url));
}

// 从 npmjs.org 加载对应homepage信息
for (let i = 0; i < technologyData.value.technologyData.length; i++) {
  const { name, url } = technologyData.value.technologyData[i];
  if (url.match(/npmjs/)) {
    axios.get(`https://registry.npmjs.org/${name}`)
      .then(({ data }) => {
        technologyData.value.technologyData[i].url = data?.homepage;
      });
  }
}
</script>

<template>
  <n-grid :y-gap="8" :cols="1">
    <n-grid-item>
      <n-card hoverable>
        <template #header>
          <n-text type="success" strong>{{ $t('TechnologyStack.ptppHistory') }}</n-text>
        </template>
        <n-timeline>
          <n-timeline-item v-for="history in ptppHistory"
                           :type="history.type || undefined"
                           :time="history.time"
                           :key="history"
          >
            <template #header>
              {{ history.name }}&nbsp;&nbsp;<n-a :href="history.link" target="_blank"><n-icon><ExternalLinkAlt/></n-icon></n-a>
            </template>
          </n-timeline-item>
        </n-timeline>
      </n-card>
    </n-grid-item>

    <n-grid-item>
      <n-card hoverable>
        <template #header>
          <n-text type="success" strong>{{ $t('TechnologyStack.dependency') }}</n-text>
        </template>
        <n-grid :y-gap="8" :cols="1">
          <n-grid-item>
            <n-alert type="info" :title="$t('TechnologyStack.thankNote')">
            </n-alert>
          </n-grid-item>
          <n-grid-item>
            <n-data-table :columns="technologyTableColumn" :data="technologyData.technologyData" />
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<style scoped>

</style>
