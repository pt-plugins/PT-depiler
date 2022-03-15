<script lang="ts" setup>
import { AccountCircleSharp } from "@vicons/material";

const sortedPeople = [
  "Rhilip (R酱)",
  "ted423",
  "luckiestone",
  "sabersalv",
  "bimzcy (白鸽男孩)",
  "DXV5 (贝壳)",
  "An",
  "Abel袁",
  "Мало",
  "tongyifan (杯杯杯杯具)",
  "the chosen one (三哥)",
  "橙子",
  "frank777777777 (杀死那个异教徒)",
].sort();
</script>

<template>
  <n-grid
    :y-gap="8"
    :cols="1"
  >
    <n-grid-item>
      <n-alert type="info">
        {{ $t("DevTeam.thank1") }}<br>
        {{ $t("DevTeam.thank2") }}<br>
        {{ $t("DevTeam.thank3") }}<br>
        {{ $t("DevTeam.contributors") }}:
        <n-a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://github.com/ronggang/PT-Plugin-Plus/graphs/contributors"
        >
          https://github.com/ronggang/PT-Plugin-Plus/graphs/contributors
        </n-a>
        <br>
        {{ $t("DevTeam.issues") }}:
        <n-a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://github.com/ronggang/PT-Plugin-Plus/issues"
        >
          https://github.com/ronggang/PT-Plugin-Plus/issues
        </n-a>
      </n-alert>
    </n-grid-item>
    <n-grid-item>
      <n-list bordered>
        <template #header>
          {{ $t("DevTeam.sortByName") }}
        </template>
        <n-list-item
          v-for="people in sortedPeople"
          :key="people"
        >
          <n-text class="people">
            <n-icon size="20">
              <account-circle-sharp />
            </n-icon>&nbsp;&nbsp;
            <span><n-text strong>{{ people }}</n-text></span>
          </n-text>
        </n-list-item>
      </n-list>
    </n-grid-item>
  </n-grid>
</template>

<style scoped>
.people {
  align-items: center;
  display: flex;
}
</style>
