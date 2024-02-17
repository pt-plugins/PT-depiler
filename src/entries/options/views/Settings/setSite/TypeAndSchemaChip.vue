<script lang="ts" setup>
import { ISiteMetadata, SiteSchema } from "@ptd/site";

const props = withDefaults(defineProps<{
  site: Pick<ISiteMetadata, "type" | "schema">,
  direction?: "row" | "column",
  fullWidth?: boolean,
}>(), {
  direction: "column",
  fullWidth: true
});

const typeChipColorMap: Record<ISiteMetadata["type"], any>= {private: "primary", public: "secondary"};

function shortSchema (schema: SiteSchema) {
  if (schema.includes("Abstract") || schema.length > 10) {
    return schema.replace(/[a-z]/g, "");
  }

  return schema;
}
</script>

<template>
  <div :class="['d-flex', `flex-${props.direction}`, props.fullWidth ? 'w-100' : '']">
    <v-chip
      label
      :color="typeChipColorMap[props.site.type]"
      size="x-small"
      :title="props.site.type"
      class="justify-center"
    >
      {{ props.site.type.toUpperCase() }}
    </v-chip>
    <v-chip
      label
      color="green"
      size="x-small"
      :title="props.site.schema"
      class="justify-center"
    >
      {{ shortSchema(props.site.schema) }}
    </v-chip>
  </div>
</template>
