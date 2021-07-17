<template>
  <v-app-bar app class="changelog-header">
    {{ version }} 更新日志
  </v-app-bar>

  <v-main>
    <v-container fluid>
      <div class="markdown-body" v-html="marked(content)"></div>
    </v-container>
  </v-main>

  <v-footer app>
    <div class="markdown-body" v-html="marked(footer)"></div>
  </v-footer>
</template>

<script lang="ts">
// TODO 其余样式待补充，version的获取方式需要调整
import { defineComponent } from 'vue';
import axios from 'axios';
import marked from 'marked';

const REPO_URL = 'https://github.com/ronggang/PT-Plugin-Plus';

export default defineComponent({
  name: 'ChangeLog',

  data () {
    return {
      content: `正在加载…… （如长时间未能加载成功，请前往 ${REPO_URL}/releases/ 查看发布说明。）`,
      footer: `[项目主页](${REPO_URL}) - [使用说明](${REPO_URL}/wiki) - [常见问题](${REPO_URL}/wiki/frequently-asked-questions) - [意见反馈](${REPO_URL}/issues) - [打开助手](options.html)`,
      version: 'v1.5.1', // FIXME
      failContent: `更新日志加载失败，请前往 ${REPO_URL}/releases/ 查看发布说明`,
      year: new Date().getFullYear()
    };
  },
  async created () {
    try {
      const { data } = await axios.get<{ body: string }>(`https://api.github.com/repos/ronggang/PT-Plugin-Plus/releases/tags/${this.version}`);
      this.content = data.body
        .replace(/(#)(\d+)/g, `[#$2](${REPO_URL}/issues/$2)`) // 生成 issue 的链接
        .replace(/(@)([\S]+)/g, '[@$2](https://github.com/$2)'); // 生成 committer 的主页链接
    } catch (e) {
      this.content = this.failContent;
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
  padding: 8px 0 8px 30px;
  font-size: 25px;
}
</style>
