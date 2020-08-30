import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import './login.js'
import vuetify from './plugins/vuetify'
import { sync } from 'vuex-router-sync'
import Print from './utils/print'



sync(store, router)

Vue.config.productionTip = false
Vue.use(Print);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
