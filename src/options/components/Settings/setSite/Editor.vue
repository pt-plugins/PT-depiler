<script setup lang="ts">
import { computed, ref, unref } from "vue";
import { useVModel } from "@vueuse/core";
import { ISiteRuntimeConfig } from "@/shared/adapters/site";
import { formValidateRules } from "@/options/utils";

import { type VForm } from "vuetify/components";
import { type fullUrl, type timezoneOffset } from "@ptpp/site";

const componentProps = defineProps<{
  modelValue: ISiteRuntimeConfig,
}>();

const siteConfig = useVModel(componentProps);

const siteUrls = computed({
  get: () => {
    const urls = [];
    if (siteConfig.value.url) {
      urls.push(siteConfig.value.url);
    }
    if (siteConfig.value.legacyUrls?.length) {
      urls.push(...siteConfig.value.legacyUrls);
    }

    return urls;
  },
  set: (val) => {
    siteConfig.value.url = val[0] as fullUrl;
    if (val.length > 1) {
      siteConfig.value.legacyUrls = val.slice(1) as fullUrl[];
    }
    if (siteConfig.value?.activateUrl && !val.includes(siteConfig.value.activateUrl)) {
      siteConfig.value.activateUrl = val[0] as fullUrl;
    }
  }
});

function deleteUrl(url: string) {
  const currentUrls = unref(siteUrls);
  currentUrls.splice(currentUrls.indexOf(url), 1);
  siteUrls.value = currentUrls;
}

const preAddUrl = ref<fullUrl>();
const preAddUrlError = ref<boolean>(false);
function addUrl() {
  const currentUrls = unref(siteUrls);
  const url = preAddUrl.value! ?? "";
  if (!currentUrls.includes(url) && /^https?:\/\//.test(url) && /\/$/.test(url)) {
    currentUrls.push(url);
    siteUrls.value = currentUrls;
    siteConfig.value.activateUrl = url;
  } else {
    preAddUrlError.value = true;
  }
}

const timeZone: Array<{value: timezoneOffset, title: string}> = [
  { value: "-1200", title: "(UTC -12:00) Enitwetok, Kwajalien" },
  { value: "-1100", title: "(UTC -11:00) Midway Island, Samoa" },
  { value: "-1000", title: "(UTC -10:00) Hawaii" },
  { value: "-0900", title: "(UTC -09:00) Alaska" },
  { value: "-0800", title: "(UTC -08:00) Pacific Time (US & Canada)" },
  { value: "-0700", title: "(UTC -07:00) Mountain Time (US & Canada)" },
  { value: "-0600", title: "(UTC -06:00) Central Time (US & Canada), Mexico City" },
  { value: "-0500", title: "(UTC -05:00) Eastern Time (US & Canada), Bogota, Lima" },
  { value: "-0400", title: "(UTC -04:00) Atlantic Time (Canada), Caracas, La Paz" },
  { value: "-0330", title: "(UTC -03:30) Newfoundland" },
  { value: "-0300", title: "(UTC -03:00) Brazil, Buenos Aires, Falkland Is." },
  { value: "-0200", title: "(UTC -02:00) Mid-Atlantic, Ascention Is., St Helena" },
  { value: "-0100", title: "(UTC -01:00) Azores, Cape Verde Islands" },
  { value: "+0000", title: "(UTC ±00:00) Casablanca, Dublin, London, Lisbon, Monrovia" },
  { value: "+0100", title: "(UTC +01:00) Brussels, Copenhagen, Madrid, Paris" },
  { value: "+0200", title: "(UTC +02:00) Sofia, Izrael, South Africa," },
  { value: "+0300", title: "(UTC +03:00) Baghdad, Riyadh, Moscow, Nairobi" },
  { value: "+0330", title: "(UTC +03:30) Tehran" },
  { value: "+0400", title: "(UTC +04:00) Abu Dhabi, Baku, Muscat, Tbilisi" },
  { value: "+0430", title: "(UTC +04:30) Kabul" },
  { value: "+0500", title: "(UTC +05:00) Ekaterinburg, Karachi, Tashkent" },
  { value: "+0530", title: "(UTC +05:30) Bombay, Calcutta, Madras, New Delhi" },
  { value: "+0600", title: "(UTC +06:00) Almaty, Colomba, Dhakra" },
  { value: "+0700", title: "(UTC +07:00) Bangkok, Hanoi, Jakarta" },
  { value: "+0800", title: "(UTC +08:00) ShangHai, HongKong, Perth, Singapore, Taipei" },
  { value: "+0900", title: "(UTC +09:00) Osaka, Sapporo, Seoul, Tokyo, Yakutsk" },
  { value: "+0930", title: "(UTC +09:30) Adelaide, Darwin" },
  { value: "+1000", title: "(UTC +10:00) Melbourne, Papua New Guinea, Sydney" },
  { value: "+1100", title: "(UTC +11:00) Magadan, New Caledonia, Solomon Is." },
  { value: "+1200", title: "(UTC +12:00) Auckland, Fiji, Marshall Island" }
];

</script>

<template>
  <v-card class="mb-5">
    <v-form fast-fail>
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="siteConfig.name" :label="$t('setSite.common.name')"
              :rules="[formValidateRules.require()]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="siteConfig.schema" :label="$t('setSite.common.type')" disabled />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="siteConfig.sortIndex"
              :label="$t('setSite.editor.sortIndex')"
              :placeholder="$t('setSite.editor.sortIndexTip')"
              :rules="[formValidateRules.require()]"
              type="number"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-radio-group v-model="siteConfig.activateUrl" :label="$t('setSite.common.url')">
        <v-radio
          v-for="url in siteUrls" :key="url"
          :value="url"
        >
          <template #label>
            {{ url }}
            <v-spacer />
            <v-btn
              icon="mdi-arrow-top-right-bold-box-outline" variant="text"
              color="info"
              :href="url"
              target="_blank"
            />
            <v-btn
              icon="mdi-delete" variant="text"
              color="error"
              :disabled="siteUrls.length <= 1"
              @click="() => deleteUrl(url)"
            />
          </template>
        </v-radio>
        <v-text-field
          v-model="preAddUrl"
          style="margin-left: 40px"
          density="compact"
          single-line
          persistent-hint
          variant="underlined"
          :error="preAddUrlError"
          :hint="$t('setSite.editor.addUrlTip')"
          @update:model-value="() => preAddUrlError = false"
        >
          <template #append>
            <v-btn
              icon="mdi-plus" variant="text"
              color="success"
              @click="addUrl"
            />
          </template>
        </v-text-field>
      </v-radio-group>

      <v-combobox
        v-model="siteConfig.aka" chips
        multiple
        :label="$t('setSite.common.aka')"
      />

      <v-text-field v-model="siteConfig.description" :label="$t('setSite.editor.description')" />

      <v-combobox
        v-model="siteConfig.tags" chips
        multiple
        :label="$t('setSite.common.tags')"
        :hint="$t('setSite.editor.tagTip')"
        persistent-hint
      />

      <v-autocomplete
        v-model="siteConfig.timezoneOffset"
        :items="timeZone"
        :label="$t('setSite.editor.timezone')"
      />
    </v-form>
  </v-card>
</template>

<style scoped>

</style>
