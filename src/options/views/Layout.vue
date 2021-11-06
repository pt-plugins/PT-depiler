<script lang="ts" setup>
import Header from '../components/Layout/Header.vue';
import Menu from '../components/Layout/Menu.vue';
import Footer from '../components/Layout/Footer.vue';
import Content from '../components/Layout/Content.vue';
</script>

<template>
  <n-layout id="ptpp" :native-scrollbar="false" position="absolute">
    <Header/>

    <n-layout has-sider id="ptpp-main" position="absolute">
      <Menu/>
      <Content/>
    </n-layout>

    <Footer/>
  </n-layout>
</template>

<style lang="scss">
#ptpp-main {
  top: 64px;
  bottom: 40px;
  min-height: calc(100% - 104px);
}
</style>
