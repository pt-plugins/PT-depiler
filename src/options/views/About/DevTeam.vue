<script lang="ts" setup>
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
  <v-alert type="info">
    {{ $t("DevTeam.thank1") }}
    <br>
    {{ $t("DevTeam.thank2") }}
    <br>
    {{ $t("DevTeam.thank3") }}
    <br>
    {{ $t("DevTeam.contributors") }}:
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href="https://github.com/ronggang/PT-Plugin-Plus/graphs/contributors"
    >https://github.com/ronggang/PT-Plugin-Plus/graphs/contributors</a>
    <br>
    {{ $t("DevTeam.issues") }}:
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href="https://github.com/ronggang/PT-Plugin-Plus/issues"
    >https://github.com/ronggang/PT-Plugin-Plus/issues</a>
  </v-alert>
  <v-card>
    <v-card-title>{{ $t("DevTeam.sortByName") }}</v-card-title>
    <v-list density="compact">
      <v-list-item v-for="(item, index) in sortedPeople" :key="index">
        <v-list-item-avatar start>
          <v-icon icon="mdi-account-circle" />
        </v-list-item-avatar>
        &nbsp;{{ item }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.people {
  align-items: center;
  display: flex;
}
</style>
