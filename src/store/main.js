import { db, server } from '../config.js'
import { URL } from '../utils'

const state = {
  online: false,
  couchURL: URL(db),
  serverURL: URL(server),
  workspaces: {},
  dialog: null,
  message: '',
  loadingApp: true,
  loadingWorkspace: true
}

const getters = {
  isOnline: (state) => state.online,
  getDialog: (state) => state.dialog,
  getMessage: (state) => state.message,
  couchURL: (state) => state.couchURL,
  serverURL: (state) => state.serverURL,
  getLoadingApp: (state) => state.loadingApp,
  getLoadingWorkspace: (state) => state.loadingWorkspace
}

const mutations = {
  setOnline: (state, online) => { state.online = online },
  initialize: (state) => { state.initialized = true },
  setDialog: (state, dialog) => { state.dialog = dialog },
  setMessage: (state, message) => { state.message = message },
  setLoadingApp: (state, loading) => { state.loadingApp = loading },
  setLoadingWorkspace: (state, loading) => { state.loadingWorkspace = loading }
}

const actions = {
  init: ({ dispatch, commit }) => {
    commit('setLoadingApp', true)
    dispatch('setConnectionListeners')
    if (navigator.onLine) {
      return dispatch('getSession')
        .then((email) => {
          commit('setAuthenticated', true)
          return dispatch('fetchUser', email)
        })
        .then((user) => {
          commit('setUser', user)
          return dispatch('storeUser', user)
        })
        .then(({ workspaces }) => {
          return dispatch('initWorkspacesDBs', workspaces)
        })
        .then((dbs) => {
          return dispatch('fetchWorkspacesDBs', dbs)
        })
        .then(() => {
          return dispatch('readWorkspacesPreview')
        })
        .then(() => {
          commit('setLoadingApp', false)
          return Promise.resolve()
        })
        .catch((error) => {
          commit('setLoadingApp', false)
          console.log(error)
          return Promise.resolve()
        })
    } else {
      return dispatch('readUser')
        .then(({ workspaces }) => {
          return dispatch('initWorkspacesDBs', false)
        })
        .catch((error) => {
          console.log('error', error)
          return Promise.resolve()
        })
    }
  },
  setConnectionListeners: ({ commit }) => {
    commit('setOnline', navigator.onLine)
    window.addEventListener('online', () => {
      commit('setOnline', navigator.onLine)
    })
    window.addEventListener('offline', () => {
      commit('setOnline', navigator.onLine)
    })
  },
  checkConnection: ({ state }) => {
    return Promise.resolve()
    // return state.online ? Promise.resolve() : Promise.reject({ reason: 'Sorry, you need connection for this.' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
