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
  <v-alert class="mb-2" type="info">
    {{ $t("DevTeam.sortByName") }}
  </v-alert>
  <v-card class="mb-2">
    <v-table>
      <tbody>
        <tr v-for="(people, index) in sortedPeople" :key="index">
          <td>
            <v-avatar><v-icon icon="mdi-account-circle" /></v-avatar>
            {{ people }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <v-alert
    border="start" border-color="deep-purple accent-4"
    class="mb-2"
    elevation="2"
  >
    {{ $t("DevTeam.thank1") }}
    <br>
    {{ $t("DevTeam.thank2") }}
    <br>
    {{ $t("DevTeam.thank3") }}
    <br>
    {{ $t("DevTeam.contributors") }}:
    <a
      href="https://github.com/ronggang/PT-Plugin-Plus/graphs/contributors"
      rel="noopener noreferrer nofollow"
      target="_blank"
    >https://github.com/ronggang/PT-Plugin-Plus/graphs/contributors</a>
    <br>
    {{ $t("DevTeam.issues") }}:
    <a
      href="https://github.com/ronggang/PT-Plugin-Plus/issues"
      rel="noopener noreferrer nofollow"
      target="_blank"
    >https://github.com/ronggang/PT-Plugin-Plus/issues</a>
  </v-alert>
</template>

<style scoped>
.people {
  align-items: center;
  display: flex;
}
</style>
