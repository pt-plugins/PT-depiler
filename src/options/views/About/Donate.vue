<script lang="ts" setup>
</script>

<template>
  <v-alert type="info" style="margin-bottom: 10px;">
    <v-alert-title>
      {{ $t('Donate.thanks') }}
    </v-alert-title>
    {{ $t("Donate.note") }}
  </v-alert>
  <v-row>
    <v-col cols="12" sm="4">
      <v-card>
        <v-card-title>
          <v-container>
            <v-row>
              <a href="https://github.com/ronggang" target="_blank">ronggang</a>
              <v-spacer />
              <v-chip label color="primary">
                Creator
              </v-chip>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-text>
          <v-img src="/img/donate/ronggang.png" />
          <v-btn
            variant="text"
            color="warning" href="https://www.paypal.me/ronggang"
            target="_blank"
            prepend-icon="mdi-currency-usd"
          >
            PayPal
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card>
        <v-card-title>
          <v-container>
            <v-row>
              <a href="https://github.com/Rhilip" target="_blank">Rhilip</a>
              <v-spacer />
              <v-chip label color="green">
                Maintainer
              </v-chip>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-text>
          <v-img src="/img/donate/Rhilip.png" />
          <v-btn
            variant="text"
            color="warning" href="https://blog.rhilip.info"
            target="_blank"
            prepend-icon="mdi-post"
          >
            Blog
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
</style>
