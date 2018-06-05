import { db, server } from '@/config.js'
import { URL } from '@/utils'

const state = {
  online: false,
  couchURL: URL(db),
  serverURL: URL(server),
  workspaces: {},
  message: '',
  loadingApp: true,
  dialog: {
    name: null,
    action: null,
    params: null,
    success: null
  }
}

const getters = {
  isOnline: (state) => state.online,
  getDialog: (state) => state.dialog,
  getMessage: (state) => state.message,
  couchURL: (state) => state.couchURL,
  serverURL: (state) => state.serverURL,
  getLoadingApp: (state) => state.loadingApp
}

const mutations = {
  setOnline: (state, online) => { state.online = online },
  initialize: (state) => { state.initialized = true },
  setDialog: (state, dialog) => { state.dialog = dialog },
  setMessage: (state, message) => { state.message = message },
  setLoadingApp: (state, loading) => { state.loadingApp = loading },
  closeDialog: (state, loading) => { state.dialog = { name: null, action: null, params: null, success: null } }
}

const actions = {
  /**
   * Initializes the application
   */
  init: ({ dispatch, commit }) => {
    commit('setLoadingApp', true)
    dispatch('setConnectionListeners')
    return (navigator.onLine)
      ? dispatch('initOnline')
      : dispatch('initOffline')
  },
  /**
   * Initializes the application when online
   */
  initOnline: ({ dispatch, commit }) => {
    return dispatch('getSession')
      .then((email) => dispatch('fetchUser', email))
      .then(({ workspaces }) => {
        commit('setAuthenticated', true)
        return dispatch('initWorkspacesDBs', workspaces)
      })
      .then(() => dispatch('readWorkspacesPreview'))
      .then(() => {
        commit('setLoadingApp', false)
        return Promise.resolve()
      })
      .catch(() => {
        commit('setLoadingApp', false)
        return Promise.resolve()
      })
  },
  /**
   * Initializes the application when offline
   */
  initOffline: ({ dispatch, commit }) => {
    return dispatch('readLocalUser')
      .then(({ workspaces }) => {
        console.log(workspaces)
        commit('setAuthenticated', true)
        return dispatch('initWorkspacesDBs', workspaces)
      })
      .then(() => dispatch('readWorkspacesPreview'))
      .then(() => {
        commit('setLoadingApp', false)
        return Promise.resolve()
      })
      .catch(() => {
        commit('setLoadingApp', false)
        return Promise.resolve()
      })
  },
  /**
   * Sets the connection listeners
   */
  setConnectionListeners: ({ commit }) => {
    commit('setOnline', navigator.onLine)
    window.addEventListener('online', () => {
      commit('setOnline', navigator.onLine)
    })
    window.addEventListener('offline', () => {
      commit('setOnline', navigator.onLine)
    })
  },
  /**
   * Checks if there is connection
   */
  checkConnection: ({ state }) => {
    return state.online
      ? Promise.resolve()
      : Promise.reject({ reason: 'No connection' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
