<template>
  <v-app-bar app class="changelog-header" color="amber">
    {{ version.full }} {{ $t('changeLog.changeLog') }}
  </v-app-bar>

  <v-main>
    <v-container fluid>
      <!-- 主版本说明 -->
      <div class="markdown-body release-content" v-html="marked(releaseContent)"></div>

      <!-- 当前commit版本说明 -->
      <template v-if="version.hash && commitData.html_url">
        <v-divider inset style="margin-top: 20px; margin-bottom: 20px"></v-divider>
        <div class="markdown-body commit-detail">
          <p>
            <strong>当前 Commit 号：<a :href="commitData.html_url">{{ version.hash }}</a></strong>
            by <a :href="commitData.author.html_url">@{{ commitData.author.login }}</a>
            ( 增: {{ commitData.stats.additions }} 删: {{ commitData.stats.deletions }} 共: {{ commitData.stats.total }} )
          </p>
          <pre>{{ commitData.commit.message }}</pre>
        </div>
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
          <div>&copy; 栽培者 {{ year }}, {{ $t('common.version') }} {{ version.full }}</div>
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
import { REPO_URL, REPO_API, getFullVersion, VersionDetail } from '@/shared/constants';

interface GHCommitData { // Partial
  commit: { message: string },
  author: { login: string, 'html_url': string }
  'html_url': string,
  stats: { total: number, additions: number, deletions: number }
}

export default defineComponent({
  name: 'ChangeLog',

  data () {
    return {
      REPO_URL,
      version: {} as VersionDetail,
      releaseContent: '', // 主版本发布说明
      commitData: {} as GHCommitData,
      year: new Date().getFullYear()
    };
  },

  async created () {
    this.version = await getFullVersion();

    // 加载主版本说明
    if (this.version.main) {
      this.releaseContent = `正在加载…… （如长时间未能加载成功，请前往 ${REPO_URL}/releases/tag/${this.version.main} 查看。）`;
      axios.get<{ body: string }>(`${REPO_API}/releases/tags/${this.version.main}`)
        .then(({ data }) => {
          this.releaseContent = data.body
            .replace(/(#)(\d+)/g, `[#$2](${REPO_URL}/issues/$2)`) // 生成 issue 的链接
            .replace(/(@)([\S]+)/g, '[@$2](https://github.com/$2)'); // 生成 committer 的主页链接
        })
        .catch(() => {
          this.releaseContent = `主版本发布说明加载失败，请前往 ${REPO_URL}/releases/tag/${this.version.main} 查看。`;
        });
    }

    // 加载对应 commit hash 的说明
    if (this.version.hash) {
      axios.get<GHCommitData>(`${REPO_API}/commits/${this.version.hash}`)
        .then(({ data }) => { this.commitData = data; });
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
