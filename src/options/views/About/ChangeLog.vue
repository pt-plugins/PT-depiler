<script lang="ts" setup>
import axios from 'axios';
import marked from 'marked';
import { useStorage } from '@vueuse/core';
import { REPO_URL, REPO_API, getFullVersion, VersionDetail } from '@/shared/constants';

interface IVersionData {
  version: VersionDetail,
  releaseContent?: string,
  commitData?: { // Partial
    commit: { message: string },
    author: { login: string, 'html_url': string }
    'html_url': string,
    stats: { total: number, additions: number, deletions: number }
  }
}

const version = getFullVersion();
const versionData = useStorage<IVersionData>('version-data', { version });

// 加载主版本说明
let updateVersion = false;
if (versionData.value.version.main !== version.main || !versionData.value.releaseContent) {
  versionData.value.releaseContent = `正在加载…… （如长时间未能加载成功，请前往 ${REPO_URL}/releases/tag/${version.main} 查看。）`;
  axios.get<{ body: string }>(`${REPO_API}/releases/tags/${version.main}`)
    .then(({ data }) => {
      versionData.value.releaseContent = data.body
        .replace(/(#)(\d+)/g, `[#$2](${REPO_URL}/issues/$2)`) // 生成 issue 的链接
        .replace(/(@)([\S]+)/g, '[@$2](https://github.com/$2)'); // 生成 committer 的主页链接
    })
    .catch(() => {
      versionData.value.releaseContent = `主版本发布说明加载失败，请前往 ${REPO_URL}/releases/tag/${version.main} 查看。`;
    });
  updateVersion = true;
}

// 加载当前commit说明
if (versionData.value.version.hash !== version.hash || !versionData.value.commitData) {
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
  <n-grid :y-gap="8" :cols="1">
    <n-grid-item>
      <n-card hoverable>
        <template #header>
          <n-text type="success" strong>主版本说明</n-text>
        </template>
        <template #header-extra>
          {{ version.main }}
        </template>
        <div class="markdown-body release-content" v-html="marked(versionData.releaseContent)"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item>

      <n-card v-if="version.hash && versionData.commitData.html_url" hoverable>
        <template #header>
          <n-text type="success" strong>当前 Commit 说明</n-text>
        </template>
        <template #header-extra>
          <n-a :href="versionData.commitData.html_url">{{ version.hash }}</n-a>
          &nbsp;by&nbsp;
          <n-a :href="versionData.commitData.author.html_url" target="_blank">@{{
              versionData.commitData.author.login
            }}
          </n-a>
        </template>

        <div class="markdown-body commit-detail">
          ( 增: {{ versionData.commitData.stats.additions }} 删: {{ versionData.commitData.stats.deletions }} 共:
          {{ versionData.commitData.stats.total }} )
          <pre>{{ versionData.commitData.commit.message }}</pre>
        </div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>
