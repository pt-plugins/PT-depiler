<script lang="ts" setup>
import Header from '../components/Layout/Header.vue';
import Menu from '../components/Layout/Menu.vue';
import Footer from '../components/Layout/Footer.vue';
</script>

<template>
    <n-layout id="ptpp" :native-scrollbar="false" position="absolute">
      <n-layout-header id="ptpp-header" bordered>
        <Header />
      </n-layout-header>

      <n-space vertical>
        <n-layout has-sider id="ptpp-main">
          <Menu/>
          <n-layout-content id="ptpp-content" content-style="padding: 16px;">
            <router-view></router-view>
          </n-layout-content>
        </n-layout>
      </n-space>

      <n-layout-footer id="ptpp-footer" bordered>
        <Footer/>
      </n-layout-footer>
    </n-layout>
</template>

<style lang="sass">
#ptpp-header
  height: 64px
  align-items: center
  background-color: #ffc107
  border-color: #ffc107

#ptpp-main
  min-height: calc(100% - 104px)

#ptpp-footer
  background: rgba(128, 128, 128, 0.2)
  height: 40px
  padding: 0 8px
</style>
