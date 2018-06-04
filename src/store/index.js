import Vue from 'vue'
import Vuex from 'vuex'
import { auth, board, column, database, main, note, workspace } from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    board,
    column,
    database,
    main,
    note,
    workspace
  }
})
