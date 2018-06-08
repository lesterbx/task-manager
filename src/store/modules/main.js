import { db, server } from '@/config.js'
import { URL } from '@/utils'

const state = {
  /**
   * Indicates if there is connection
   */
  online: false,
  /**
   * Url for the couchDB database
   */
  couchURL: URL(db),
  /**
   * URL for the axuiliar server
   */
  serverURL: URL(server),
  /**
   * Sets the message, if there is a message it will be shown in a snackbar
   */
  message: '',
  /**
   * Boolean to tell if the app is loading
   */
  loadingApp: true,
  /**
   * Object for handling dialogs
   */
  dialog: {
    name: null, // Name of the dialog
    action: null, // Action to be triggered after the confirmation of the dialog
    params: null, // Params to pass to the action
    success: null // Message to show after the action success
  }
}

const getters = {
  /**
   * Returns the online state
   */
  isOnline: (state) => state.online,
  /**
   * Returns the current dialog object
   */
  getDialog: (state) => state.dialog,
  /**
   * Returns the current message
   */
  getMessage: (state) => state.message,
  /**
   * Returns the url for the couchDB databse
   */
  couchURL: (state) => state.couchURL,
  /**
   * Returns the url for the server
   */
  serverURL: (state) => state.serverURL,
  /**
   * Returns the loading app boolean
   */
  getLoadingApp: (state) => state.loadingApp
}

const mutations = {
  /**
   * Sets the online state
   */
  setOnline: (state, online) => { state.online = online },
  /**
   * Sets the dialog object
   */
  setDialog: (state, dialog) => { state.dialog = dialog },
  /**
   * Sets the app message
   */
  setMessage: (state, message) => { state.message = message },
  /**
   * Sets the loading app boolean
   */
  setLoadingApp: (state, loading) => { state.loadingApp = loading },
  /**
   * Restes the dialog object
   */
  closeDialog: (state) => { state.dialog = { name: null, action: null, params: null, success: null } }
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
        return dispatch('initWorkspacesDBs', { workspaces, online: true })
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
        commit('setAuthenticated', true)
        return dispatch('initWorkspacesDBs', { workspaces, online: false })
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
  setConnectionListeners: ({ commit, dispatch }) => {
    commit('setOnline', navigator.onLine)
    window.addEventListener('online', () => {
      commit('setOnline', navigator.onLine)
      dispatch('init')
    })
    window.addEventListener('offline', () => {
      commit('setOnline', navigator.onLine)
      dispatch('init')
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
