import Vue from 'vue'
import Vuex from 'vuex'
import main from './main'
import auth from './auth'
import database from './database'
import workspace from './workspace'
import board from './board'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    auth,
    database,
    workspace,
    board
  }
})
