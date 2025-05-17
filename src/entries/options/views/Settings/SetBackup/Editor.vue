<script setup lang="ts">
import { BackupFields, IBackupServerMetadata } from "@/shared/storages/types/metadata.ts";
import { getBackupServer, getBackupServerMetaData, IBackupMetadata } from "@ptd/backupServer";
import { computedAsync } from "@vueuse/core";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { formValidateRules } from "@/options/utils.ts";
import ConnectCheckButton from "@/options/components/ConnectCheckButton.vue";

const { t } = useI18n();

const clientConfig = defineModel<IBackupServerMetadata>();
const emits = defineEmits<{
  (e: "update:configValid", value: boolean): void;
}>();

const clientMeta = computedAsync<IBackupMetadata<any>>(
  async () => await getBackupServerMetaData(clientConfig.value!.type),
  {} as IBackupMetadata<any>,
);

const formValid = ref<boolean>(false);

async function checkConnect() {
  if (formValid) {
    const client = await getBackupServer(clientConfig.value!);
    return await client.ping();
  }
  return false;
}
</script>

<template>
  <v-card class="mb-5">
    <v-form v-if="clientConfig" v-model="formValid" fast-fail>
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="clientConfig.type" :label="t('SetDownloader.common.type')" disabled hide-details />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="clientConfig.name"
              :label="t('SetDownloader.common.name')"
              :placeholder="t('SetDownloader.common.name')"
              :rules="[formValidateRules.require(t('SetDownloader.editor.nameTip'))]"
              hide-details
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="clientConfig.id"
              :label="t('SetDownloader.common.uid') + t('SetDownloader.editor.uidPlaceholder')"
              disabled
              hide-details
            />
          </v-col>
        </v-row>

        <v-label class="my-2">服务器配置</v-label>

        <v-row no-gutters>
          <v-col v-for="metaField in clientMeta.requiredField" :key="metaField.key" class="my-1" cols="12">
            <v-textarea
              v-if="metaField.type === 'strings'"
              v-model="clientConfig.config[metaField.key! as string]"
              :hide-details="false"
              :label="metaField.name"
              :messages="metaField.description ?? undefined"
            />
            <v-text-field
              v-else-if="metaField.type === 'string'"
              v-model="clientConfig.config[metaField.key! as string]"
              :hide-details="false"
              :label="metaField.name"
              :messages="metaField.description ?? undefined"
            />
            <v-switch
              v-else-if="metaField.type === 'boolean'"
              v-model="clientConfig.config[metaField.key! as string]"
              :hide-details="false"
              :label="metaField.name"
              :messages="metaField.description ?? undefined"
              color="success"
            />
          </v-col>
        </v-row>

        <v-label class="my-2">备份配置</v-label>

        <v-row no-gutters>
          <v-col v-for="backupField in BackupFields" :key="backupField" cols="12" md="4">
            <v-switch
              v-model="clientConfig.backupFields"
              :label="backupField"
              :value="backupField"
              color="success"
              hide-details
            />
          </v-col>
        </v-row>

        <ConnectCheckButton
          :check-fn="checkConnect"
          :reset-timeout="3e3"
          @after:check-connect="
            () => emits('update:configValid', formValid && true) // 不管是否测试成功，都允许用户进行下一步操作（保存下载服务器配置）
          "
        />
      </v-container>
    </v-form>
  </v-card>
</template>

<style scoped lang="scss"></style>
