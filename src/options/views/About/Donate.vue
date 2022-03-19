<script lang="ts" setup>
import { openUrl } from "@/options/utils";
</script>

<template>
  <n-grid
    :y-gap="8"
    :cols="1"
  >
    <n-grid-item>
      <n-alert
        type="info"
        :title="$t('Donate.thanks')"
      >
        {{ $t("Donate.note") }}
      </n-alert>
    </n-grid-item>
    <n-grid-item>
      <n-grid
        :x-gap="8"
        :y-gap="8"
        :cols="3"
        item-responsive
        responsive="screen"
      >
        <n-grid-item span="3 s:1">
          <n-card>
            <template #header>
              <n-a
                href="https://github.com/ronggang"
                target="_blank"
              >
                ronggang
              </n-a>&nbsp;
              <n-tag type="success">
                Owner
              </n-tag>
            </template>
            <n-space
              vertical
              align="center"
            >
              <img
                src="/assets/donate/ronggang.png"
                style="max-width: 100%"
              >
              <n-button
                ghost
                type="warning"
                @click="openUrl('https://www.paypal.me/ronggang')"
              >
                <n-icon><Paypal /></n-icon>&nbsp;Paypal
              </n-button>
            </n-space>
          </n-card>
        </n-grid-item>
        <n-grid-item span="3 s:1">
          <n-card>
            <template #header>
              <n-a
                href="https://github.com/Rhilip"
                target="_blank"
              >
                Rhilip
              </n-a>&nbsp;
              <n-tag type="info">
                Collaborator
              </n-tag>
            </template>
            <n-space
              align="center"
              justify="center"
            >
              <img
                src="/assets/donate/Rhilip.png"
                style="max-width: 100%"
              >
            </n-space>
          </n-card>
        </n-grid-item>
        <n-grid-item span="3 s:1">
          <n-card>
            <template #header>
              <n-a
                href="https://github.com/ted423"
                target="_blank"
              >
                ted423
              </n-a>&nbsp;
              <n-tag type="info">
                Collaborator
              </n-tag>
            </template>
            <n-space
              align="center"
              justify="center"
            >
              <n-empty size="large" />
            </n-space>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-grid-item>
  </n-grid>
</template>

<style scoped></style>
