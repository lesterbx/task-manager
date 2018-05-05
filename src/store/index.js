import Vue from 'vue'
import Vuex from 'vuex'
import main from './main'
import auth from './auth'
import databases from './databases'
import workspaces from './workspaces'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    auth,
    databases,
    workspaces
  }
})
