<template>
  <v-app id="ptpp">
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  components: {
    HelloWorld
  },

  data () {
    return {
      //
    };
  }

});
</script>
