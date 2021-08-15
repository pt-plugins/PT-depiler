/**
 * 同时支持 MDI 和 FontAwesome 5 （默认） 两套 icon 集
 */
import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.css';

import 'vuetify/lib/styles/main.sass';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';
import { aliases, fa } from 'vuetify/lib/iconsets/fa';
import { mdi } from 'vuetify/lib/iconsets/mdi';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
      mdi
    }
  }
});
