<script lang="ts" setup>
import axios from 'axios';
import marked from 'marked';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { REPO_URL, REPO_API, getFullVersion, VersionDetail } from '@/shared/constants';

const { t } = useI18n();

interface IVersionData {
  version: VersionDetail,
  releaseContent: string,
  commitData: { // Partial
    commit: { message: string },
    author: { login: string, 'html_url': string }
    'html_url': string,
    stats: { total: number, additions: number, deletions: number }
  }
}

const version = getFullVersion();
const versionData = useStorage<IVersionData>('version-data', { version } as IVersionData);

// 加载主版本说明
let updateVersion = false;
const releasePage = `${REPO_URL}/releases/tag/${version.main}`;
const releaseLoading = t('ChangeLog.loading', { releasePage });
const releaseLoadingFail = t('ChangeLog.loadFail', { releasePage });
if (
  versionData.value.version.main !== version.main ||
  !versionData.value.releaseContent ||
  versionData.value.releaseContent === releaseLoading ||
  versionData.value.releaseContent === releaseLoadingFail
) {
  /**
   * releaseContent在加载过程失去i18n特性，
   * 不过考虑到并不会经常遇到，而且我们大多数releaseLog都是中文而不是双语的
   * 所以不修复这个问题，也没有多少问题
   */
  versionData.value.releaseContent = releaseLoading;
  axios.get<{ body: string }>(`${REPO_API}/releases/tags/${version.main}`)
    .then(({ data }) => {
      versionData.value.releaseContent = data.body
        .replace(/(#)(\d+)/g, `[#$2](${REPO_URL}/issues/$2)`) // 生成 issue 的链接
        .replace(/(@)([\S]+)/g, '[@$2](https://github.com/$2)'); // 生成 committer 的主页链接
    })
    .catch(() => {
      versionData.value.releaseContent = releaseLoadingFail;
    });
  updateVersion = true;
}

// 加载当前commit说明
if (versionData.value.version.hash !== version.hash || 
!versionData.value.commitData ||
 !versionData.value.commitData.stats) {
  versionData.value.commitData = {} as IVersionData['commitData'];
  axios.get<IVersionData['commitData']>(`${REPO_API}/commits/${version.hash}`)
    .then(({ data }) => {
      versionData.value.commitData = data;
    });
  updateVersion = true;
}

if (updateVersion) {
  versionData.value.version = version;
}
</script>

<template>
  <n-grid
    :y-gap="8"
    :cols="1"
  >
    <n-grid-item>
      <n-card hoverable>
        <template #header>
          <n-text
            type="success"
            strong
          >
            {{ $t('ChangeLog.noteVersion') }}
          </n-text>
        </template>
        <template #header-extra>
          <n-a
            :href="releasePage"
            target="_blank"
          >
            {{ version.main }}
          </n-a>
        </template>
        <div
          class="markdown-body release-content"
          v-html="marked(versionData.releaseContent)"
        />
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card
        v-if="version.hash && versionData.commitData.stats"
        hoverable
      >
        <template #header>
          <n-text
            type="success"
            strong
          >
            {{ $t('ChangeLog.noteCommit') }}
          </n-text>
        </template>
        <template #header-extra>
          Commit&nbsp;<n-a
            :href="versionData.commitData.html_url"
            target="_blank"
          >
            {{ version.hash }}
          </n-a>&nbsp;
          ( <n-icon color="green">
            <plus-sharp />
          </n-icon>{{ versionData.commitData.stats.additions }}&nbsp;
          <n-icon color="red">
            <minus-sharp />
          </n-icon>{{ versionData.commitData.stats.deletions }})
          &nbsp;by&nbsp;
          <n-a
            :href="versionData.commitData.author.html_url"
            target="_blank"
          >
            @{{ versionData.commitData.author.login }}
          </n-a>
        </template>

        <div class="markdown-body commit-detail">
          <pre>{{ versionData.commitData.commit.message }}</pre>
        </div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>
