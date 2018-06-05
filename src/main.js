import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import Avatar from 'vue-avatar-component'

import 'vue-material/dist/vue-material.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import './assets/style/main.scss'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.component('avatar', Avatar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
