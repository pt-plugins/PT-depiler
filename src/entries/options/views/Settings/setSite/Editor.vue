<script setup lang="ts">
import { timezoneOffset, ISiteUserConfig, type TSiteID, ISiteMetadata, TSiteFullUrl } from "@ptd/site";
import { watch, ref, onMounted, inject } from "vue";
import { useSiteStore } from "@/options/stores/site.ts";
import { formValidateRules } from "@/options/utils.ts";
import { get, set } from "es-toolkit/compat";

const siteStore = useSiteStore();

const siteId = defineModel<TSiteID>({ default: "" });
const siteMetaData = ref<ISiteMetadata>({} as unknown as ISiteMetadata);
const siteUserConfig = inject<ISiteUserConfig & { valid: boolean }>("storedSiteUserConfig", { valid: false });
const customSiteUrl = ref<string>("");

async function overrideSiteConfig(path: string, value: string) {
  const rawSiteMetaData = await siteStore.getSiteMetadata(siteId.value);
  if (get(rawSiteMetaData, path) === value) return;
  set(siteUserConfig.value.merge!, path, value);
}

function setSiteUserInputSetting(path: string, value: string) {
  siteUserConfig.value.inputSetting ??= {};
  set(siteUserConfig.value.inputSetting, path, value);
}

async function initSiteData(siteId: TSiteID) {
  siteMetaData.value = await siteStore.getSiteMetadata(siteId);
  siteUserConfig.value = {
    url: siteMetaData.value.urls[0],
    isOffline: false,
    allowSearch: Object.hasOwn(siteMetaData.value, "search"),
    allowQueryUserInfo: Object.hasOwn(siteMetaData.value, "userInfo"),
    inputSetting: {},
    merge: {},
    ...(await siteStore.getSiteUserConfig(siteId)),
  };
}

function deleteUrl(url: string) {}

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

const log = console.log;
</script>

<template>
  <v-card class="mb-5">
    <v-form fast-fail validate-on="eager invalid-input" v-model="siteUserConfig.valid">
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="siteMetaData.name"
              :label="$t('setSite.common.name')"
              :rules="[formValidateRules.require()]"
              @update:modelValue="(val) => overrideSiteConfig('name', val)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="siteMetaData.schema" :label="$t('setSite.common.type')" disabled />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="siteUserConfig.sortIndex"
              :label="$t('common.sortIndex')"
              :placeholder="$t('setSite.editor.sortIndexTip')"
              :rules="[formValidateRules.require()]"
              type="number"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-radio-group v-model="siteUserConfig.url" :label="$t('setSite.common.url')" class="edit-select-url">
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
                  :placeholder="$t('setSite.editor.customUrlPlaceholder')"
                  :rules="[(val) => (val ? formValidateRules.url()(val) : true)]"
                  @update:modelValue="(val) => (siteUserConfig.url = val as TSiteFullUrl)"
                ></v-text-field>
              </template>
            </v-radio>
          </v-radio-group>
        </v-row>

        <v-autocomplete
          v-model="siteMetaData.timezoneOffset"
          :items="timeZone"
          :label="$t('setSite.editor.timezone')"
          @update:modelValue="(val) => overrideSiteConfig('timezoneOffset', val)"
        />

        <template v-if="siteMetaData.userInputSettingMeta">
          <v-divider />
          <v-label class="my-2">{{ $t("setSite.editor.extraUserInputSetting") }}</v-label>
          <v-text-field
            v-for="userInputMeta in siteMetaData.userInputSettingMeta"
            :key="userInputMeta.name"
            :label="userInputMeta.label"
            :hint="userInputMeta.hint"
            :rules="[(val) => (userInputMeta.required ? formValidateRules.require()(val) : true)]"
            @update:modelValue="(val) => setSiteUserInputSetting(userInputMeta.name, val)"
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
