<template>
  <v-app id="ptpp">
    <v-app-bar app clipped-left color="amber">
    </v-app-bar>
    <v-main app>
      <v-navigation-drawer>
        <!-- -->
      </v-navigation-drawer>
      <!-- 根据应用组件来调整你的内容 -->
      <v-container fluid><!-- 如果使用 vue-router -->
        <router-view></router-view>
      </v-container>

    </v-main>
    <v-footer app>
      <span class="pl-2 grey--text text--darken-1">
        Footer
      </span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  components: {
  },

  data () {
    return {
      //
    };
  }

});
</script>
