<template>
  <v-app-bar app class="changelog-header" color="amber">
    {{ fullVersion }} {{ $t('changeLog.changeLog') }}
  </v-app-bar>

  <v-main>
    <v-container fluid>
      <div class="markdown-body release-content" v-html="marked(releaseContent)"></div>
      <template v-if="versionHash && commitDetail">
        <v-divider inset style="margin-top: 20px;margin-bottom: 20px"></v-divider>
        <div class="markdown-body commit-detail" v-html="marked(commitDetail)"></div>
      </template>
    </v-container>
  </v-main>

  <v-footer app>
    <v-container>
      <v-col>
        <v-row justify="center">
          <div class="markdown-body">
            <a :href="REPO_URL">{{ $t('changeLog.homepage') }}</a> -
            <a :href="`${REPO_URL}/wiki`">{{ $t('changeLog.wiki') }}</a> -
            <a :href="`${REPO_URL}/wiki/frequently-asked-questions`">{{ $t('changeLog.questions') }}</a> -
            <a :href="`${REPO_URL}/issues`">{{ $t('changeLog.report') }}</a> -
            <a href="/options.html">{{ $t('changeLog.optionsPage') }}</a>
          </div>
        </v-row>
        <v-row justify="center">
          <div>&copy; 栽培者 {{ new Date().getFullYear() }}, {{ $t('common.version') }} {{ fullVersion }}</div>
        </v-row>
        <v-row justify="center">
          <img src="/assets/donate.png" alt="donate"/>
        </v-row>
      </v-col>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import axios from 'axios';
import marked from 'marked';
import { defineComponent } from 'vue';
import { browser } from 'webextension-polyfill-ts';

const REPO_NAME = 'ronggang/PT-Plugin-Plus';
const REPO_URL = `https://github.com/${REPO_NAME}`;
const REPO_API = `https://api.github.com/repos/${REPO_NAME}`;

export default defineComponent({
  name: 'ChangeLog',

  data () {
    return {
      REPO_URL,
      fullVersion: '', // v2.0.0.b3f0a76
      version: '', // v2.0.0
      versionHash: '', // b3f0a76
      releaseContent: '', // 主版本发布说明
      commitDetail: ''
    };
  },

  async created () {
    const detail = await browser.management.getSelf();
    const version = detail.versionName || detail.version;
    this.fullVersion = `v${version}`;

    const mainVersionMatch = this.fullVersion.match(/(v\d+\.\d+\.\d+)\.?(.*)/);
    if (mainVersionMatch && mainVersionMatch[1]) {
      this.version = mainVersionMatch[1];
      this.versionHash = mainVersionMatch[2];
    } else {
      this.version = this.fullVersion;
    }

    // 加载主版本说明
    this.releaseContent = `正在加载…… （如长时间未能加载成功，请前往 ${REPO_URL}/releases/tag/${this.version} 查看。）`;
    try {
      const { data: releaseData } = await axios.get<{ body: string }>(`${REPO_API}/releases/tags/${this.version}`);
      this.releaseContent = releaseData.body
        .replace(/(#)(\d+)/g, `[#$2](${REPO_URL}/issues/$2)`) // 生成 issue 的链接
        .replace(/(@)([\S]+)/g, '[@$2](https://github.com/$2)'); // 生成 committer 的主页链接
    } catch (e) {
      this.releaseContent = `主版本发布说明加载失败，请前往 ${REPO_URL}/releases/tag/${this.version} 查看。`;
    }

    // 加载对应 commit hash 的说明
    if (this.versionHash) {
      try {
        const { data: commitData } = await axios.get<{
          commit: { message: string },
          author: { login: string, 'html_url': string }
          'html_url': string,
          stats: { total: number, additions: number, deletions: number }
        }>(`${REPO_API}/commits/${this.versionHash}`);
        this.commitDetail = `**当前 Commit 号：[${this.versionHash}](${commitData.html_url})** by [@${commitData.author.login}](${commitData.author.html_url})
( 增: ${commitData.stats.additions} 删: ${commitData.stats.deletions} 共: ${commitData.stats.total} )

#### ${commitData.commit.message}`;
      } catch {
      }
    }
  },
  methods: {
    marked
  }
});
</script>

<style scoped>
@import "~github-markdown-css";

.changelog-header {
  padding: 0 0 8px 30px;
  font-size: 25px;
}

.v-footer .v-row {
  margin: 0;
  line-height: 30px;
}
</style>
