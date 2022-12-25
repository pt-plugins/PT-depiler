<script lang="ts" setup>

import { reactive, computed } from "vue";
import { useToggle } from "@vueuse/core";
import {
  getDownloader,
  CTorrentState,
  CTorrent,
  TorrentClientStatus,
  BittorrentClientBaseConfig
} from "@ptpp/downloader";
import { flatten } from "lodash-es";



const torrentStatus = reactive<Record<string, CTorrent[]>>({});
const clientStatus = reactive<Record<string, TorrentClientStatus>>({});

const totalTorrentStatus = computed<{ seeding: number, downloading: number, other: number }>(() =>
  Object.values(torrentStatus).reduce((a, b) => {
      const bSeedingLength = b.filter(torrent => torrent.state === CTorrentState.seeding).length;
      const bDownloadLength = b.filter(torrent => torrent.state === CTorrentState.downloading).length;

      a.seeding += bSeedingLength;
      a.downloading += bDownloadLength;
      a.other += b.length - bSeedingLength - bDownloadLength;

      return a;
    },
    {
      seeding: 0,
      downloading: 0,
      other: 0
    }));

const totalTorrent = computed<CTorrent[]>(() => flatten(Object.values(torrentStatus)));

const connectedClientCount = computed(() => Object.keys(clientStatus).length);
const totalClientStatus = computed<TorrentClientStatus>(() =>
  Object.values(clientStatus).reduce((a, b) => {
      Object.entries(b).forEach(([key, value]) => {
        a[key as keyof TorrentClientStatus] += value;
      });
      return a;
    },
    {
      upSpeed: 0,
      upData: 0,
      dlSpeed: 0,
      dlData: 0,
      // freeSpace: 0
    })
);

const [isLiveUpdate, toggleLiveUpdate] = useToggle(false);

// eslint-disable-next-line no-undef
const liveUpdateTimeouts: Record<string, NodeJS.Timeout> = {};

async function liveUpdatePerClient (config: BittorrentClientBaseConfig) {
  const client = await getDownloader(config);
  try {
    torrentStatus[config.id!] = await client.getAllTorrents();
    clientStatus[config.id!] = await client.getClientStatus();
  } catch (e) {
    delete torrentStatus[config.id!];
    delete clientStatus[config.id!];
  }
  liveUpdateTimeouts[config.id!] = setTimeout(() => liveUpdatePerClient(config), 5e3);
}


</script>

<template>
  <div />
  <!--
    <n-space vertical>
      <n-alert
        type="info"
        :title="$t('route.Overview.MyClient')"
      />
      <n-card>
        <n-space vertical>
          <n-grid
            :x-gap="8"
            :y-gap="8"
            :cols="6"
            item-responsive
            responsive="screen"
          >
            <n-grid-item span="3 s:1">
              <n-statistic label="控制">
                <n-space>
                  <n-button
                    secondary
                    type="info"
                    @click="toggleLiveUpdate"
                  >
                    {{ isLiveUpdate ? 'Pause' : 'Start' }}
                  </n-button>
                  <n-button
                    secondary
                    type="primary"
                  >
                    Set.
                  </n-button>
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
                  <n-icons color="green">
                    <keyboard-arrow-up-sharp />
                  </n-icons>{{ totalTorrentStatus.seeding }} /
                  <n-icons color="red">
                    <keyboard-arrow-down-sharp />
                  </n-icons>{{ totalTorrentStatus.downloading }} /
                  <n-icons color="#f0a020">
                    <circle-outlined />
                  </n-icons>{{ totalTorrentStatus.other }}
                </template>
                <template v-else>
                  —
                </template>
              </n-statistic>
            </n-grid-item>
            <n-grid-item span="6 s:2">
              <n-statistic label="下载器情况">
                <template v-if="isLiveUpdate">
                  <n-icons color="green">
                    <keyboard-arrow-up-sharp />
                  </n-icons>{{ filesize(totalClientStatus.upSpeed) }}/s
                  <n-icons color="red">
                    <keyboard-arrow-down-sharp />
                  </n-icons>{{ filesize(totalClientStatus.dlSpeed) }}/s
                </template>
                <template v-else>
                  —
                </template>
              </n-statistic>
            </n-grid-item>
          </n-grid>
        </n-space>
      </n-card>
      <n-card>
        <n-data-table />
        <pre>{{ JSON.stringify(totalTorrent, null, 2) }}</pre>
      </n-card>
    </n-space>
    TODO -->
</template>

<style scoped>

</style>
