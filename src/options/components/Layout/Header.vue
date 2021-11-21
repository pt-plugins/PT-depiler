<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { REPO_URL } from '@/shared/constants';
import { isMobile, isTablet } from '@/options/utils';
import { useDebounce } from '@vueuse/core';
import { HomeSharp, HelpSharp, FreeBreakfastSharp } from '@vicons/material';
import axios from 'axios';

const route = useRoute();
const { t } = useI18n();

const mainStyle = computed(() => {
  return {
    'grid-template-columns': isTablet.value ? 'auto 1fr auto' : 'calc(240px - var(--side-padding)) 1fr auto'
  };
});

// 将路径中的搜索信息 更新到 Headers 中（单向）
const searchKey = ref<string>(route.query.searchKey as string ?? '');
const searchPlan = ref(route.query.searchPlan ?? 'default');
watch(route.query, (query) => {
  if (query.searchKey && query.searchKey !== searchKey.value) {
    searchKey.value = query.searchKey as string;
  }
  if (query.searchPlan && query.searchPlan !== searchPlan.value) {
    searchPlan.value = query.searchPlan as string;
  }
});

// 控制搜索框的自动更新
const searchLoadingStatus = ref(false);
const searchOptions = ref<any>([]);

const debouncedSearchKey = useDebounce(searchKey, 1e3);
watch(debouncedSearchKey, () => { // FIXME 从background加载
  searchLoadingStatus.value = true;
  axios.get<Array<Record<string, any>>>('https://movie.douban.com/j/subject_suggest', { params: { q: searchKey.value } })
    .then(({ data }) => {
      searchOptions.value = data
        .filter((d) => d.type === 'movie')
        .map((d) => {
          return {
            label: d.title,
            value: `douban|${d.id}|${d.title}`
          };
        });
      searchLoadingStatus.value = false;
    });
});

// TODO 加载搜索方案
const searchPlanOptions = reactive([
  {
    label: () => t('layout.header.searchPlan.default'),
    value: 'default'
  },
  {
    label: () => t('layout.header.searchPlan.all'),
    value: 'all'
  }
]);

</script>

<template>
  <n-layout-header id="ptpp-header" bordered class="nav" :style="mainStyle">
    <n-text tag="div" class="ui-logo" :depth="1" @click="$router.push('/')">
      <img src="/assets/icon-64.png" alt="ptpp-icon"/>
      <span v-if="!isTablet" class="nav-title">{{ $t('common.name') }}</span>
    </n-text>
    <div :style="!isMobile ? 'display: flex; align-items: center' : ''">
      <n-input-group
        :style="!isMobile ? 'max-width: 600px; margin-left: 24px' : undefined"
      >
        <n-auto-complete
          :placeholder="$t('layout.header.searchTip')"
          v-model:value="searchKey"
          :options="searchOptions"
          :loading="searchLoadingStatus"
          blur-after-select
        />
        <n-select
          v-model:value="searchPlan"
          :options="searchPlanOptions"
          style="width: 120px"
        />
        <n-popover trigger="hover">
          <template #trigger>
            <n-button type="primary" ghost
                      @click="() => {$router.push({name:'SearchData', query: {searchKey,searchPlan}})}"
            >
              {{ $t('layout.header.search') }}
            </n-button>
          </template>
          <span>{{ $t('layout.header.emptySearchNotice') }}</span>
        </n-popover>
      </n-input-group>
    </div>
    <n-space align="center" class="nav-end" :size="20" v-if="!isMobile">
      <n-button tag="a" :href="REPO_URL" target="_blank"
                text size="large" class="nav-picker"
      >
        <n-icon>
          <home-sharp/>
        </n-icon>
        <span v-if="!isTablet">{{ $t('layout.header.home') }}</span>
      </n-button>
      <n-button tag="a" :href="`${REPO_URL}/wiki`" target="_blank"
                text size="large" class="nav-picker"
      >
        <n-icon>
          <help-sharp/>
        </n-icon>
        <span v-if="!isTablet">{{ $t('layout.header.wiki') }}</span>
      </n-button>
      <n-button text size="large" class="nav-picker"
                @click="$router.push({name: 'Donate'})"
      >
        <n-icon>
          <free-breakfast-sharp/>
        </n-icon>
        <span v-if="!isTablet">{{ $t('layout.header.donate') }}</span>
      </n-button>
    </n-space>
  </n-layout-header>
</template>

<style lang="scss" scoped>
.nav {
  --header-height: 64px;
  --side-padding: 16px;
  // background-color: #ffc107;
  // border-color: #ffc107;
  display: grid;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  padding: 0 var(--side-padding);
}

.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.ui-logo > img {
  margin-right: 27px;
  height: 32px;
  width: 32px;
}

.nav-title {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: .02em;
}

.nav-end {
  margin-left: 16px;
}

.nav-picker {
  .n-icon {
    font-size: 24px;
    margin-right: 4px;
  }

  font-size: 15px;
}
</style>
