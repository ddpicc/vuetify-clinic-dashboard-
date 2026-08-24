import Vue from 'vue'

// Lib imports
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || ''

Vue.prototype.$http = axios
