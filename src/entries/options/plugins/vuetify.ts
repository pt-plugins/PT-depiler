import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export const vuetifyInstance = createVuetify({
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
});
