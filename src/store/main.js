import { db, server } from '../config.js'
import { URL } from '../utils'

const state = {
  online: false,
  couchURL: URL(db),
  serverURL: URL(server),
  workspaces: {},
  dialog: null,
  message: '',
  loading: false
}

const getters = {
  isOnline: (state) => state.online,
  getDialog: (state) => state.dialog,
  getMessage: (state) => state.message,
  couchURL: (state) => state.couchURL,
  serverURL: (state) => state.serverURL,
  getLoading: (state) => state.loading
}

const mutations = {
  setOnline: (state, online) => { state.online = online },
  initialize: (state) => { state.initialized = true },
  setDialog: (state, dialog) => { state.dialog = dialog },
  setMessage: (state, message) => { state.message = message },
  setLoading: (state, loading) => { state.loading = loading }
}

const actions = {
  init: ({ dispatch, commit }) => {
    commit('setLoading', true)
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
        .then(({ workspaces }) => dispatch('initWorkspacesDBs', { workspaces }))
        .then(() => {
          commit('setLoading', false)
          return Promise.resolve()
        })
        .catch((error) => {
          commit('setLoading', false)
          console.log('Error: ', error)
          return Promise.resolve()
        })
    } else {
      return dispatch('readUser')
        .then(({ workspaces }) => dispatch('initWorkspacesDBs', false))
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
    return state.online ? Promise.resolve() : Promise.reject({ reason: 'Sorry, you need connection for this' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
