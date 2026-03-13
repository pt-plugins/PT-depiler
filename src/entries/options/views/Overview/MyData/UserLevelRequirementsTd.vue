<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { isEmpty } from "es-toolkit/compat";
import { useDisplay } from "vuetify";
import { getNextLevelUnMet, guessUserLevelGroupType, type IUserInfo, type TLevelGroupType } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import UserLevelsComponent from "./UserLevelsComponent.vue";
import UserNextLevelUnMet from "@/options/views/Overview/MyData/UserNextLevelUnMet.vue";

const { userInfo } = defineProps<{
  userInfo: IUserInfo;
}>();

const display = useDisplay();
const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

const userLevelRequirements = computedAsync(() => {
  return metadataStore.getSiteMergedMetadata(userInfo.site, "levelRequirements", []);
}, []);

const userInfoMetadata = computedAsync(() => {
  return metadataStore.getSiteMergedMetadata(userInfo.site, "userInfo");
}, undefined);

const matchedLevelRequirements = computed(() => {
  return userLevelRequirements.value?.find((r) => r.id === userInfo.levelId);
});

const levelName = computed(() => {
  if (!configStore.myDataTableControl.normalizeLevelName) {
    return userInfo.levelName;
  }

  return matchedLevelRequirements.value?.name ?? userInfo.levelName;
});

const nextLevelUnMet = computed(() => getNextLevelUnMet(userInfo, userLevelRequirements.value!));

const userLevelGroupType = computed(() => {
  // 首先尝试从 matchedLevelRequirements 中找到对应的等级组
  if (matchedLevelRequirements.value?.groupType) {
    return matchedLevelRequirements.value.groupType;
  }

  // 如果还是没有，则考虑从用户等级名中猜测
  return guessUserLevelGroupType(userInfo.levelName ?? "user");
});

const isDonorAccountKept = computed(() => {
  return userInfo.isDonor === true && userInfoMetadata.value?.donorConfig?.isAccountKept === true;
});

const currentUserLevelColor = computed(() => {
  switch (userLevelGroupType.value) {
    case "vip":
      return "green";
    case "manager":
      return "indigo";
    case "user": {
      if (matchedLevelRequirements.value?.isKept || isDonorAccountKept.value) return "light-blue"; // 保号用户
      return "";
    }
    default:
      return "";
  }
});

const userLevelGroupIconMap: Record<TLevelGroupType, string> = {
  user: "mdi-account-hard-hat",
  vip: "mdi-check-decagram",
  manager: "mdi-account-cog",
};

const userLevelGroupIcon = computed(() => {
  return userLevelGroupIconMap[userLevelGroupType.value] || userLevelGroupIconMap.user;
});
</script>

<template>
  <span v-if="userInfo.levelName" class="text-no-wrap">
    <v-tooltip
      v-if="
        configStore.myDataTableControl.showLevelRequirement && userLevelRequirements && userLevelRequirements.length > 0
      "
      content-class="bg-white pa-0"
      interactive
      location="end bottom"
      :open-on-click="display.mobile.value"
    >
      <template v-slot:activator="{ props }">
        <span v-bind="props">
          <v-icon :icon="userLevelGroupIcon" size="small" :color="currentUserLevelColor" class="mr-1" />
          <span :class="`text-${currentUserLevelColor}`">{{ levelName }}</span>
          <v-icon
            v-if="
              configStore.myDataTableControl.showNextLevelInTable &&
              userLevelGroupType === 'user' &&
              isEmpty(nextLevelUnMet)
            "
            icon="mdi-check"
            color="green"
            size="small"
            class="ml-1"
          />
          <br />
          <template
            v-if="
              configStore.myDataTableControl.showNextLevelInTable &&
              userLevelGroupType === 'user' &&
              !isEmpty(nextLevelUnMet)
            "
          >
            <UserNextLevelUnMet
              :next-level-un-met="nextLevelUnMet"
              :show-next-level-name="false"
              :user-info="userInfo"
              icon-class="mr-1"
            />
          </template>
        </span>
      </template>

      <template v-slot>
        <v-card class="border-sm overflow-y-auto" max-height="500" max-width="800">
          <v-card-text class="pa-2">
            <v-list class="pa-0 level_requirement_list" density="compact">
              <!-- 计算剩余升级情况 -->
              <template
                v-if="
                  configStore.myDataTableControl.showNextLevelInDialog &&
                  userLevelGroupType === 'user' &&
                  !isEmpty(nextLevelUnMet)
                "
              >
                <v-list-item border class="list-item-half-spacer px-1 py-0">
                  <UserNextLevelUnMet :next-level-un-met="nextLevelUnMet" :user-info="userInfo" />
                </v-list-item>
              </template>

              <v-list-subheader v-if="userLevelRequirements.length > 0">{{
                t("MyData.UserLevelRequirementsTd.levelList")
              }}</v-list-subheader>

              <!-- 展示站点用户等级 -->
              <template v-for="userLevel in userLevelRequirements" :key="userLevel.id">
                <template
                  v-if="
                    configStore.myDataTableControl.onlyShowUserLevelRequirement
                      ? (userLevel.groupType !== 'vip' && userLevel.groupType !== 'manager') ||
                        userLevelGroupType !== 'user'
                      : true
                  "
                >
                  <v-list-item class="list-item-half-spacer px-1 py-0">
                    <template #prepend>
                      <v-icon
                        :color="userLevel.id <= (userInfo.levelId ?? -1) ? 'green' : 'red'"
                        :icon="userLevel.id <= (userInfo.levelId ?? -1) ? 'mdi-check' : 'mdi-block-helper'"
                        size="small"
                      />
                    </template>

                    <div>
                      <span>{{ userLevel.name }}:&nbsp;</span>
                      <!-- 展示用户等级要求时， interval 向 date 的转换应该基于 joinTime 计算 -->
                      <UserLevelsComponent
                        :user-info="userInfo"
                        :level-requirement="userLevel"
                        :useJoinTimeAsRef="true"
                      />
                    </div>

                    <div class="text-ellipsis text-truncate" :title="userLevel.privilege">
                      {{ userLevel.privilege }}
                    </div>
                  </v-list-item>
                  <v-divider class="ma-1"></v-divider>
                </template>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </template>
    </v-tooltip>
    <span v-else>
      <v-icon :icon="userLevelGroupIcon" size="small"></v-icon>
      {{ levelName }}
    </span>
  </span>

  <!-- 信息还没获取 -->
  <template v-else>-</template>
</template>

<style scoped lang="scss">
.level_requirement_list {
  hr:last-child {
    display: none;
  }
}
</style>
