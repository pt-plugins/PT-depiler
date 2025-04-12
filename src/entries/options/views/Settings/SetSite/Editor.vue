<script setup lang="ts">
import { watch, ref, onMounted, inject, computed } from "vue";
import { useI18n } from "vue-i18n";
import { timezoneOffset, ISiteUserConfig, type TSiteID, ISiteMetadata } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { formatDate, formValidateRules } from "@/options/utils.ts";

const { t } = useI18n();
const metadataStore = useMetadataStore();

const siteId = defineModel<TSiteID>({ default: "" });
const siteMetaData = ref<ISiteMetadata>({} as unknown as ISiteMetadata);
const siteUserConfig = inject<ISiteUserConfig & { valid: boolean }>("storedSiteUserConfig", { valid: false });
const siteName = computed({
  get: () => siteUserConfig.value.merge?.name ?? siteMetaData.value.name,
  set: (value) => metadataStore.simplePatchSite(siteId.value, "merge.name", value),
});
const siteTimezoneOffset = computed({
  get: () => siteUserConfig.value.merge?.timezoneOffset ?? siteMetaData.value.timezoneOffset,
  set: (value) => metadataStore.simplePatchSite(siteId.value, "merge.timezoneOffset", value),
});
const customSiteUrl = ref<string>("");

async function initSiteData(siteId: TSiteID) {
  siteMetaData.value = await metadataStore.getSiteMetadata(siteId);
  siteUserConfig.value = await metadataStore.getSiteUserConfig(siteId);
}

onMounted(() => {
  initSiteData(siteId.value);
});

watch(siteId, (newValue) => {
  initSiteData(newValue);
});

const timeZone: Array<{ value: timezoneOffset; title: string }> = [
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
  { value: "+1200", title: "(UTC +12:00) Auckland, Fiji, Marshall Island" },
];
</script>

<template>
  <v-card class="mb-5 pa-1">
    <v-form fast-fail validate-on="eager invalid-input" v-model="siteUserConfig.valid">
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="siteName"
              :label="t('SetSite.common.name')"
              :rules="[formValidateRules.require()]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="siteMetaData.schema" :label="t('SetSite.common.type')" disabled />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="siteUserConfig.sortIndex"
              :label="t('common.sortIndex')"
              :placeholder="t('SetSite.editor.sortIndexTip')"
              :rules="[formValidateRules.require()]"
              type="number"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-radio-group v-model="siteUserConfig.url" :label="t('SetSite.common.url')" class="edit-select-url">
            <v-radio v-for="url in siteMetaData.urls" :key="url" :value="url" @click="siteUserConfig.valid = true">
              <template #label style="width: 100%">
                {{ url }}
                <v-spacer />
                <v-btn
                  icon="mdi-arrow-top-right-bold-box-outline"
                  variant="text"
                  color="info"
                  :href="url"
                  target="_blank"
                />
              </template>
            </v-radio>
            <v-radio v-model="customSiteUrl" :value="customSiteUrl" @click="siteUserConfig.valid = false">
              <template #label>
                <v-text-field
                  v-model="customSiteUrl"
                  :placeholder="t('SetSite.editor.customUrlPlaceholder')"
                  :rules="[(val) => (val ? formValidateRules.url()(val) : true)]"
                  @update:modelValue="(val) => (siteUserConfig.url = val)"
                ></v-text-field>
              </template>
            </v-radio>
          </v-radio-group>
        </v-row>

        <v-autocomplete v-model="siteTimezoneOffset" :items="timeZone" :label="t('SetSite.editor.timezone')" />

        <v-slider
          label="请求超时"
          v-model="siteUserConfig.timeout"
          :color="siteUserConfig.timeout! > 8 * 60e3 ? 'red' : siteUserConfig.timeout! > 5 * 60e3 ? 'amber' : 'green'"
          :min="0"
          :max="10 * 60e3"
          :step="1e3"
          hint="影响该站点请求（种子搜索、用户信息获取）的超时等待时间"
          persistent-hint
        >
          <template #append>
            <v-btn variant="flat" @click="siteUserConfig.timeout = 30e3">
              {{ formatDate(siteUserConfig.timeout!, "mm:ss") }}
            </v-btn>
          </template>
        </v-slider>

        <template v-if="siteMetaData.userInputSettingMeta">
          <v-divider />
          <v-label class="my-2">{{ t("SetSite.editor.extraUserInputSetting") }}</v-label>
          <v-text-field
            v-for="userInputMeta in siteMetaData.userInputSettingMeta"
            v-model="siteUserConfig.inputSetting![userInputMeta.name]"
            :key="userInputMeta.name"
            :label="userInputMeta.label"
            :hint="userInputMeta.hint"
            :rules="[(val) => (userInputMeta.required ? formValidateRules.require()(val) : true)]"
          >
          </v-text-field>
        </template>
      </v-container>
    </v-form>
  </v-card>
</template>

<style scoped lang="scss">
.edit-select-url {
  :deep(.v-selection-control) {
    padding-left: 15px;
    padding-right: 15px;
  }
  :deep(.v-selection-control .v-label) {
    width: 100%;
  }
}
</style>
