import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#2E7D32',
        secondary: '#37474F',
        accent: '#FFB677',
        error: '#F44336',
        info: '#0288D1',
        success: '#2E7D32',
        warning: '#F57C00'
      }
    }
  },
  icons: {
    iconfont: 'mdi'
  }
})
