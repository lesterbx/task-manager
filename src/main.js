import Vue from 'vue'
import App from './App'
import responsive from 'vue-responsive'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import VueLetterAvatar from 'vue-letter-avatar'
import 'vue-material/dist/vue-material.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import './assets/style/main.scss'

Vue.config.productionTip = false
Vue.use(responsive)
Vue.use(VueMaterial)
Vue.use(VueLetterAvatar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
