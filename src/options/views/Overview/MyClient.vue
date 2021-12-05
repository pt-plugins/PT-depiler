<script lang="ts" setup>
import { useStore } from '@/options/store';
import { reactive, watch, computed } from 'vue';
import { useToggle } from '@vueuse/core';
import { KeyboardArrowUpSharp, KeyboardArrowDownSharp, CircleOutlined } from '@vicons/material';
import { getClient, types as btClientTypes } from '@ptpp/btclients';
import { formatSizeString } from '@ptpp/utils/filter';
import { flatten } from 'lodash-es';

const store = useStore();

const torrentStatus = reactive<Record<string, btClientTypes.CTorrent[]>>({});
const clientStatus = reactive<Record<string, btClientTypes.TorrentClientStatus>>({});

const totalTorrentStatus = computed<{seeding: number, downloading: number, other: number }>(() =>
  Object.values(torrentStatus).reduce((a, b) => {
    const bSeedingLength = b.filter(torrent => torrent.state === btClientTypes.CTorrentState.seeding).length;
    const bDownloadLength = b.filter(torrent => torrent.state === btClientTypes.CTorrentState.downloading).length;

    a.seeding += bSeedingLength;
    a.downloading += bDownloadLength;
    a.other += b.length - bSeedingLength - bDownloadLength;

    return a;
  },
  { seeding: 0, downloading: 0, other: 0 }));

const totalTorrent = computed<btClientTypes.CTorrent[]>(() => flatten(Object.values(torrentStatus)));

const connectedClientCount = computed(() => Object.keys(clientStatus).length);
const totalClientStatus = computed<btClientTypes.TorrentClientStatus>(() =>
  Object.values(clientStatus).reduce((a, b) => {
    Object.entries(b).forEach(([key, value]) => { a[key as keyof btClientTypes.TorrentClientStatus] += value; });
    return a;
  },
  { upSpeed: 0, upData: 0, dlSpeed: 0, dlData: 0, freeSpace: 0 })
);

const [isLiveUpdate, toggleLiveUpdate] = useToggle(false);

// eslint-disable-next-line no-undef
const liveUpdateTimeouts: Record<string, NodeJS.Timeout> = {};

async function liveUpdatePerClient (config:btClientTypes.BittorrentClientBaseConfig) {
  const client = getClient(config);
  try {
    torrentStatus[config.id!] = await client.getAllTorrents();
    clientStatus[config.id!] = await client.getClientStatus();
  } catch (e) {
    delete torrentStatus[config.id!];
    delete clientStatus[config.id!];
  }
  liveUpdateTimeouts[config.id!] = setTimeout(() => liveUpdatePerClient(config), 5e3);
}

watch(isLiveUpdate, (liveUpdateStatus) => {
  if (liveUpdateStatus) {
    store.options.clients.map(config => liveUpdatePerClient(config));
  } else {
    Object.values(liveUpdateTimeouts).forEach(timeoutId => clearTimeout(timeoutId));
  }
});
</script>

<template>
  <n-space vertical>
    <n-alert type="info" :title="$t('route.Overview.MyClient')"></n-alert>
    <n-card>
      <n-space vertical>
        <n-grid :x-gap="8" :y-gap="8" :cols="6" item-responsive responsive="screen">
          <n-grid-item span="3 s:1">
            <n-statistic label="控制">
              <n-space>
                <n-button secondary type="info" @click="toggleLiveUpdate">{{ isLiveUpdate ? 'Pause' : 'Start' }}</n-button>
                <n-button secondary type="primary">Set.</n-button><!-- TODO -->
              </n-space>
            </n-statistic>
          </n-grid-item>
          <n-grid-item span="3 s:1">
            <n-statistic label="添加的下载器">
              {{ isLiveUpdate ? connectedClientCount : '-' }}/{{ store.options.clients.length }}
            </n-statistic>
          </n-grid-item>
          <n-grid-item span="6 s:2">
            <n-statistic label="种子情况">
              <template v-if="isLiveUpdate">
                <n-icon color="green"><keyboard-arrow-up-sharp /></n-icon>{{ totalTorrentStatus.seeding }} /
                <n-icon color="red"><keyboard-arrow-down-sharp /></n-icon>{{ totalTorrentStatus.downloading }} /
                <n-icon color="#f0a020"><circle-outlined /></n-icon>{{ totalTorrentStatus.other }}
              </template>
              <template v-else>—</template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item span="6 s:2">
            <n-statistic label="下载器情况">
              <template v-if="isLiveUpdate">
                <n-icon color="green"><keyboard-arrow-up-sharp /></n-icon>{{ formatSizeString(totalClientStatus.upSpeed) }}/s
                <n-icon color="red"><keyboard-arrow-down-sharp /></n-icon>{{ formatSizeString(totalClientStatus.dlSpeed) }}/s
              </template>
              <template v-else>—</template>
            </n-statistic>
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>
    <n-card>
      <n-data-table></n-data-table><!-- TODO -->
      <pre>{{JSON.stringify(totalTorrent, 0, 2)}}</pre>
    </n-card>
  </n-space>
</template>

<style scoped>

</style>
