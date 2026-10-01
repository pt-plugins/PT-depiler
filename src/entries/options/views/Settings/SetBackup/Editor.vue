<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { cloneDeep } from "es-toolkit";
import { getBackupServer, getBackupServerMetaData, IBackupMetadata } from "@ptd/backupServer";
import type { IBackupRetention } from "@ptd/backupServer";
import { DEFAULT_BACKUP_RETENTION_SAMPLE_RULES, hasBackupRetentionToApply } from "@ptd/backupServer/utils.ts";

import { BackupFields, type IBackupServerMetadata } from "@/shared/types.ts";
import { formValidateRules } from "@/options/utils.ts";

import ConnectCheckButton from "@/options/components/ConnectCheckButton.vue";

const { t } = useI18n();

const clientConfig = defineModel<IBackupServerMetadata>();
const emits = defineEmits<{
  (e: "update:configValid", value: boolean): void;
}>();

const hasRetention = computed(() => hasBackupRetentionToApply(clientConfig.value?.retention));

/* -------------------------------------------------------------------------- */
/*                              备份保留策略（内联）                            */
/* -------------------------------------------------------------------------- */

/**
 * 备份保留策略的表单值。界面上始终展示一份完整的默认配置（避免用户勾选后出现空输入框），
 * 再从已保存的配置覆盖，因此这里持有一份本地副本而不是直接双向绑定到 clientConfig
 */
function createDefaultRetention(): IBackupRetention {
  return {
    time: { enabled: false, maxAge: 90 },
    count: { enabled: false, maxCount: 30 },
    sample: {
      enabled: false,
      rules: Object.fromEntries(
        Object.entries(DEFAULT_BACKUP_RETENTION_SAMPLE_RULES).map(([type, rule]) => [type, { ...rule }]),
      ),
    },
  };
}

const retentionDraft = ref<IBackupRetention>(createDefaultRetention());

/** 判断一份保留策略中是否真的有已启用的规则，没有则需要将其置空以保持一致 */
function hasEnabledRetentionRule(value: IBackupRetention): boolean {
  return !!(
    (value.time?.enabled && (value.time.maxAge ?? 0) > 0) ||
    (value.count?.enabled && (value.count.maxCount ?? 0) > 0) ||
    (value.sample?.enabled &&
      Object.values(value.sample.rules ?? {}).some((rule) => rule && rule.interval > 0 && rule.horizon > 0))
  );
}

const retentionSampleRules = computed(() => Object.entries(retentionDraft.value.sample?.rules ?? {}));

/**
 * 把已保存的保留策略同步到本地草稿，使界面回显保存过的配置。
 *
 * 这里监听 `clientConfig.retention` 而不是只在挂载时初始化一次：
 * `EditDialog` 关闭后并不会销毁 Editor，再次编辑另一台服务器时需要跟着切换草稿。
 * 保存的配置可能是旧版本写入的、字段不全，因此以默认配置为基础再合并。
 *
 * 注意：本同步与下面的「草稿 → 配置」写入互为对方的输入，若不加标记会来回互相触发，
 * 因此用 `syncingFromConfig` 打断回环，并额外比较内容避免无意义的重复写入。
 */
let syncingFromConfig = false;
let lastSyncedRetention: string | undefined;

watch(
  () => clientConfig.value?.retention,
  (saved) => {
    syncingFromConfig = true;
    try {
      const draft = createDefaultRetention();

      retentionDraft.value = saved
        ? {
            time: { ...draft.time, ...saved.time },
            count: { ...draft.count, ...saved.count },
            sample: {
              ...draft.sample,
              ...saved.sample,
              rules: { ...draft.sample!.rules, ...saved.sample?.rules },
            },
          }
        : draft;

      lastSyncedRetention = JSON.stringify(retentionDraft.value);
    } finally {
      syncingFromConfig = false;
    }
  },
  { immediate: true },
);

watch(
  retentionDraft,
  (value) => {
    // 本次变化来自上面的「配置 → 草稿」同步，无需再写回配置
    if (syncingFromConfig || !clientConfig.value) {
      return;
    }

    // 未启用任何有效规则时置空，避免把一份「全未启用」的配置写入 metadata
    const nextRetention = hasEnabledRetentionRule(value) ? cloneDeep(value) : undefined;
    const nextSerialized = JSON.stringify(nextRetention ?? null);
    if (nextSerialized === lastSyncedRetention) {
      return; // 内容没有变化，避免重复写入触发无谓的持久化
    }

    lastSyncedRetention = nextSerialized;
    clientConfig.value.retention = nextRetention;
  },
  { deep: true },
);

/** 清空全部保留规则（对应「不自动清理历史备份」） */
function clearRetention() {
  retentionDraft.value = createDefaultRetention();
}

const retentionSummary = computed(() => {
  const retention = clientConfig.value?.retention;
  if (!hasBackupRetentionToApply(retention)) {
    return t("SetBackup.RetentionDialog.none");
  }

  const summary: string[] = [];
  if (retention?.time?.enabled && (retention.time.maxAge ?? 0) > 0) {
    summary.push(t("SetBackup.RetentionDialog.summary.time", { n: retention.time.maxAge }));
  }
  if (retention?.count?.enabled && (retention.count.maxCount ?? 0) > 0) {
    summary.push(t("SetBackup.RetentionDialog.summary.count", { n: retention.count.maxCount }));
  }
  if (retention?.sample?.enabled) {
    for (const [type, rule] of Object.entries(retention.sample.rules ?? {})) {
      if (rule && rule.interval > 0 && rule.horizon > 0) {
        summary.push(
          t("SetBackup.RetentionDialog.summary.sample", {
            type: t(`SetBackup.RetentionDialog.sample.type.${type}`),
            n: rule.horizon,
            interval: rule.interval,
          }),
        );
      }
    }
  }

  return summary.join(t("SetBackup.RetentionDialog.summary.separator"));
});

const clientMeta = computedAsync<IBackupMetadata<any>>(
  async () => {
    const clientType = clientConfig.value?.type;
    if (!clientType) {
      return { requiredField: [] } as IBackupMetadata<any>;
    }
    return await getBackupServerMetaData(clientType);
  },
  { requiredField: [] } as IBackupMetadata<any>,
);

const formValid = ref<boolean>(false);

async function checkConnect() {
  const clientType = clientConfig.value?.type;
  if (formValid.value && clientConfig.value && clientType) {
    const client = await getBackupServer(clientConfig.value);
    return await client.ping();
  }
  return false;
}
</script>

<template>
  <v-card class="mb-5">
    <v-form v-if="clientConfig" v-model="formValid" fast-fail>
      <v-container class="pa-0">
        <v-label class="my-2">{{ t("common.basicInfo") }}</v-label>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="clientConfig.type" :label="t('common.type')" disabled hide-details />
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

        <v-label class="my-2">{{ t("SetBackup.Editor.serverConfig") }}</v-label>

        <v-row no-gutters>
          <v-col v-for="metaField in clientMeta.requiredField" :key="metaField.key" cols="12">
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

        <v-divider class="my-2" />

        <v-label class="my-2">{{ t("SetBackup.Editor.backupConfig") }}</v-label>

        <!-- 以下三项为相互独立的备份设置，分别用子标题区分：备份内容 / 自动备份间隔 / 备份保留策略 -->
        <!-- 备份内容 -->
        <v-row density="compact" no-gutters>
          <v-col cols="12">
            <v-label class="text-body-medium font-weight-medium text-medium-emphasis">
              {{ t("SetBackup.Editor.backupFields") }}
            </v-label>
          </v-col>
          <v-col v-for="backupField in BackupFields" :key="backupField" cols="12" md="4">
            <v-switch
              v-model="clientConfig.backupFields"
              :label="t(`SetBackup.fields.${backupField}`)"
              :value="backupField"
              color="success"
              density="compact"
              hide-details
            />
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <!-- 自动备份间隔 -->
        <v-row density="compact" no-gutters>
          <v-col cols="12">
            <v-label class="text-body-medium font-weight-medium text-medium-emphasis">
              {{ t("SetBackup.Editor.backupInterval") }}
            </v-label>
          </v-col>
          <v-col cols="12">
            <!-- 子标题已说明用途，此处标签仅表示单位，避免与子标题重复 -->
            <v-text-field
              v-model.number="clientConfig.backupInterval"
              :label="t('SetBackup.Editor.backupIntervalField')"
              :messages="t('SetBackup.Editor.backupIntervalHint')"
              :min="0"
              clearable
              hide-details="auto"
              suffix="h"
              type="number"
            />
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <!-- 备份保留策略：设置项直接内联展示，不再单独弹出对话框 -->
        <v-row density="compact" no-gutters>
          <v-col class="d-flex flex-wrap align-center ga-2" cols="12">
            <v-label class="text-body-medium font-weight-medium text-medium-emphasis">
              {{ t("SetBackup.Editor.retention") }}
            </v-label>
            <!-- 仅在启用了保留策略时展示摘要，避免未启用时出现无意义的提示文字 -->
            <span v-if="hasRetention" class="text-body-small retention-summary">{{ retentionSummary }}</span>
            <v-btn
              v-if="hasRetention"
              color="error"
              density="comfortable"
              icon="mdi-filter-remove-outline"
              size="x-small"
              variant="text"
              :title="t('SetBackup.Editor.clearRetention')"
              @click="clearRetention"
            />
          </v-col>

          <v-col class="text-body-small text-medium-emphasis" cols="12">
            {{ t("SetBackup.RetentionDialog.tip") }}
          </v-col>

          <v-col cols="12" class="retention-group pa-4">
            <!-- 按时间期限保留 -->
            <v-row density="compact" no-gutters>
              <v-col cols="auto">
                <v-switch
                  v-model="retentionDraft.time!.enabled"
                  color="success"
                  density="compact"
                  hide-details
                  :label="t('SetBackup.RetentionDialog.time.title')"
                />
              </v-col>
              <v-col class="retention-field" cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="retentionDraft.time!.maxAge"
                  :disabled="!retentionDraft.time!.enabled"
                  :label="t('SetBackup.RetentionDialog.time.maxAge')"
                  :min="1"
                  :suffix="t('SetBackup.RetentionDialog.daySuffix')"
                  density="compact"
                  hide-details
                  type="number"
                />
              </v-col>
            </v-row>

            <v-divider class="my-2" />

            <!-- 按数量保留 -->
            <v-row density="compact" no-gutters>
              <v-col cols="auto">
                <v-switch
                  v-model="retentionDraft.count!.enabled"
                  color="success"
                  density="compact"
                  hide-details
                  :label="t('SetBackup.RetentionDialog.count.title')"
                />
              </v-col>
              <v-col class="retention-field" cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="retentionDraft.count!.maxCount"
                  :disabled="!retentionDraft.count!.enabled"
                  :label="t('SetBackup.RetentionDialog.count.maxCount')"
                  :min="1"
                  :suffix="t('SetBackup.RetentionDialog.countSuffix')"
                  density="compact"
                  hide-details
                  type="number"
                />
              </v-col>
            </v-row>

            <v-divider class="my-2" />

            <!-- 按时间窗口采样保留 -->
            <v-row density="compact" no-gutters>
              <v-col cols="12">
                <v-switch
                  v-model="retentionDraft.sample!.enabled"
                  color="success"
                  density="compact"
                  hide-details
                  :label="t('SetBackup.RetentionDialog.sample.title')"
                />
              </v-col>
              <v-col class="text-body-small text-medium-emphasis" cols="12">
                {{ t("SetBackup.RetentionDialog.sample.hint") }}
              </v-col>

              <!-- 采样规则：窗口名称 / 保留窗口数 / 窗口宽度（天） -->
              <v-col cols="12">
                <div class="retention-table" :class="{ 'retention-table--disabled': !retentionDraft.sample!.enabled }">
                  <div class="retention-table__row retention-table__head text-body-small text-medium-emphasis">
                    <div />
                    <div>{{ t("SetBackup.RetentionDialog.sample.horizon") }}</div>
                    <div>{{ t("SetBackup.RetentionDialog.sample.interval") }}</div>
                  </div>

                  <div v-for="[type, rule] in retentionSampleRules" :key="type" class="retention-table__row">
                    <div class="text-no-wrap">{{ t(`SetBackup.RetentionDialog.sample.type.${type}`) }}</div>
                    <!-- 展示顺序为「窗口名称 / 保留窗口数 / 窗口宽度」，与表头一致 -->
                    <v-text-field
                      v-model.number="rule.horizon"
                      :disabled="!retentionDraft.sample!.enabled"
                      :min="0"
                      density="compact"
                      hide-details
                      type="number"
                      variant="outlined"
                    />
                    <v-text-field
                      v-model.number="rule.interval"
                      :disabled="!retentionDraft.sample!.enabled"
                      :min="0"
                      :suffix="t('SetBackup.RetentionDialog.daySuffix')"
                      density="compact"
                      hide-details
                      type="number"
                      variant="outlined"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
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

<style scoped lang="scss">
/* 已启用保留策略时，摘要使用成功色以突出状态（Vuetify 4 未生成 text-success 之类的工具类） */
.retention-summary {
  color: rgb(var(--v-theme-success));
}

/* 数值输入框不铺满整行，避免数字输入框被拉得过长（与开关之间的间距由 v-col cols="auto" 提供） */
.retention-field {
  max-width: 260px;
}

/* 采样规则表：三列对齐（窗口名称 / 保留窗口数 / 窗口宽度），用 Grid 比嵌套 v-row 更直观 */
.retention-table {
  display: grid;
  gap: 6px;
}

.retention-table__row {
  display: grid;
  grid-template-columns: minmax(56px, 1fr) minmax(0, 190px) minmax(0, 190px);
  align-items: center;
  gap: 12px;
}

.retention-table--disabled {
  opacity: 0.55;
}

/**
 * 保留策略容器的可用宽度受外层对话框与浏览器窗口限制，
 * 与 Vuetify 基于视口宽度的断点无关，因此这里用容器查询。
 */
.retention-group {
  container-type: inline-size;
}

/* 容器较窄时隐藏表头，采样规则改为紧凑三列（窗口名称 + 两个铺满的输入框） */
@container (max-width: 479px) {
  .retention-table__row {
    grid-template-columns: minmax(36px, auto) minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px;
  }

  .retention-table__head {
    display: none;
  }
}
</style>
