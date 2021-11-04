<script lang="ts" setup>
import { TelegramPlane, Language, Adjust } from '@vicons/fa';
import { isDark, openUrl, toggleDark, isMobile } from '../../utils';
import { getFullVersion, GROUP_TELEGRAM } from '@/shared/constants';
import { setI18nLanguage } from '@/shared/plugins/i18n';
import LangOptions from '@/shared/locale';

const FULL_VERSION = getFullVersion();
const YEAR = new Date().getFullYear();
</script>

<template>
  <n-space justify="space-between"
           style="margin: 0"
  >
    <div id="ptpp-copyright">
      <n-text depth="2">&copy; {{ $t('app.author') }} {{ YEAR }}, {{ $t('common.version') }} {{ FULL_VERSION[isMobile ? 'main' : 'full'] }}</n-text>
    </div>
    <div id="ptpp-footer-sider">
      <n-button text
                @click="openUrl(GROUP_TELEGRAM,'_blank')"
      >
        <template #icon>
          <n-icon>
            <telegram-plane/>
          </n-icon>
        </template>
        <span v-if="!isMobile">Telegram</span>
      </n-button>

      <n-dropdown
        placement="top-start"
        :options="LangOptions"
        label-field="name" key-field="code"
        @select="(e) => setI18nLanguage(e)"
      >
        <n-button text>
          <template #icon>
            <n-icon>
              <language/>
            </n-icon>
          </template>
          <span v-if="!isMobile">{{ $t('common.footer.changeLanguage') }}</span>
        </n-button>
      </n-dropdown>

      <n-button text
                @click="toggleDark()">
        <template #icon>
          <n-icon>
            <adjust/>
          </n-icon>
        </template>
        <span v-if="!isMobile">{{ $t(`common.footer.displayMode.${isDark ? 'light' : 'dark'}`) }}</span>
      </n-button>
    </div>
  </n-space>
</template>

<style lang="scss" scoped>
#ptpp-copyright {
  margin-top: 4px  // 与右侧的图标对齐
}

#ptpp-footer-sider .n-button {
  padding: 0 10px
}
</style>
