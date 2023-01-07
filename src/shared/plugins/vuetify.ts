import "@mdi/font/css/materialdesignicons.css";

import "vuetify/lib/styles/main.sass";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import { VDataTable } from "vuetify/labs/VDataTable";

export const vuetifyInstance = createVuetify({
  components: {
    ...components,
    VDataTable
  },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
