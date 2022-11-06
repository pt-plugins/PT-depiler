<script lang="ts" setup>
import {inject, ref, Ref} from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {BittorrentClientBaseConfig, getDownloader} from "@ptpp/downloader";

dayjs.extend(duration);

const clientConfig = inject<Ref<BittorrentClientBaseConfig>>("clientConfig")!;
const showPassword = ref<boolean>(false);

enum connectStatus {
  default = "default",
  success = "success",
  error = "error",
}

const connectBtnMap: Record<connectStatus, { icon: string, color: string }> = {
  [connectStatus.default]: {icon: "mdi-access-point", color: "info"},
  [connectStatus.success]: {icon: "mdi-access-point-check", color: "success"},
  [connectStatus.error]: {icon: "mdi-access-point-remove", color: "error"},
};

const connectBtnLoading = ref<boolean>(false);
const connectStatusRef = ref<connectStatus>(connectStatus.default);

async function checkConnect() {
  connectBtnLoading.value = true;
  const client = await getDownloader(clientConfig.value);
  try {
    connectStatusRef.value = (await client.ping()) ? connectStatus.success : connectStatus.error;
  } catch (e) {
    connectStatusRef.value = connectStatus.error;
    setTimeout(() => connectStatusRef.value = connectStatus.default, 5e3);
  } finally {
    connectBtnLoading.value = false;
  }
}
</script>

<template>
  <v-card class="mb-5">
    <v-form>
      <v-text-field v-model="clientConfig.type" :label="$t('setDownloader.editor.type')" disabled />
      <v-text-field
        v-model="clientConfig.name"
        :label="$t('setDownloader.editor.name')"
        :hint="$t('setDownloader.editor.nameTip')"
      />
      <v-text-field
        v-model="clientConfig.address"
        :label="$t('setDownloader.editor.address')"
        :hint="$t('setDownloader.editor.addressTip')"
      />
      <v-text-field
        v-if="typeof clientConfig.username !== 'undefined'"
        v-model="clientConfig.username" :label="$t('setDownloader.editor.username')"
      />
      <v-text-field
        v-model="clientConfig.password"
        :label="$t('setDownloader.editor.password')"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
      />
      <v-text-field
        v-model="clientConfig.id"
        :label="$t('setDownloader.editor.uid') + (clientConfig.id ? '' : $t('setDownloader.editor.uidPlaceholder'))"
        disabled
      />
      <div class="text-caption v-label ml-4">
        {{ $t('setDownloader.editor.timeout') }}
      </div>
      <v-slider
        v-model="clientConfig.timeout"
        :color="clientConfig.timeout > 8 * 60e3 ? 'red' : (clientConfig.timeout > 5 * 60e3 ? 'amber' : 'green')"
        :min="0" :max="10 * 60e3"
        :step="1e3"
      >
        <template #append>
          <v-btn
            variant="flat"
            @click="clientConfig.timeout = 60e3"
          >
            {{ dayjs.duration(clientConfig.timeout).format('mm:ss') }}
          </v-btn>
        </template>
      </v-slider>

      <v-btn
        :loading="connectBtnLoading" :disabled="connectBtnLoading"
        :color="connectBtnMap[connectStatusRef]['color']"
        block variant="text"
        @click="checkConnect"
      >
        <v-icon :icon="connectBtnMap[connectStatusRef]['icon']" />
        {{ $t("setDownloader.editor.connect." + connectStatusRef) }}
      </v-btn>
    </v-form>
  </v-card>
</template>

<style scoped></style>
