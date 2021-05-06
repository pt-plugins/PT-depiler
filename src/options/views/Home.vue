<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import HelloWorld from '../components/HelloWorld.vue'; // @ is an alias to /src

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
};
</script>
