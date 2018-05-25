import { promisifyValidator } from '../utils'
import { validateUser } from '../utils/validators'

const state = {
  /**
   * Current user object
   */
  user: null,
  /**
   * Boolean to tells if the current user is authenticated
   */
  authenticated: false
}

const getters = {
  /**
 * Returns the current user object
 */
  getUser: (state) => state.user,
  /**
   * Returns if the user is authenticated
   */
  getAuthenticated: (state) => state.authenticated,
  /**
   * Returns the list of workspaces of the user
   */
  userWorkspaces: state => state.user && state.user.workspaces
}

const mutations = {
  /**
   * Sets the current user object
   */
  setUser: (state, user) => { state.user = user },
  /**
   * Sets if the current user is authenticated
   */
  setAuthenticated: (state, authenticated) => { state.authenticated = authenticated }
}

const actions = {
  /**
   * Checks if the user has a session opened and resolves with the email if it has
   */
  getSession: ({ commit, dispatch, getters }) => {
    return getters.getAuthDB.getSession()
      .then(({ userCtx }) => userCtx.name !== null
        ? Promise.resolve(userCtx.name)
        : Promise.reject('Wrong session'))
      .catch(() => Promise.reject('No session'))
  },
  /**
   * Fetch the user information from the database
   */
  fetchUser: ({ commit, dispatch, getters }, email) => {
    return getters.getAuthDB.getUser(email)
      .then(({ name, firstName, lastName, workspaces }) => {
        commit('setUser', { email: name, firstName, lastName, workspaces })
        dispatch('storeUser', { email: name, firstName, lastName, workspaces })
        return Promise.resolve({ email: name, firstName, lastName, workspaces })
      })
      .catch(() => Promise.reject('No user'))
  },
  /**
   * Creates a new user
   */
  signUp: ({ state, dispatch, commit, getters }, { email, password, ...metadata }) => {
    return dispatch('checkConnection')
      .then(() => promisifyValidator(validateUser, { name: email, password, ...metadata, workspaces: [] }))
      .then(() => getters.getAuthDB.signUp(email, password, { ...metadata, workspaces: [] }))
      .then(() => dispatch('login', { email, password }))
      .catch(error => (error.status === 409)
        ? Promise.reject('The email is already in use by some user')
        : Promise.reject(error.reason))
  },
  /**
   * Logs in a new user
   */
  login: ({ state, commit, dispatch, getters }, { email, password }) => {
    return dispatch('checkConnection')
      .then(() => getters.getAuthDB.logIn(email, password))
      .then(() => {
        commit('setAuthenticated', true)
        return dispatch('init')
      })
      .catch((error) => (error.status === 0)
        ? Promise.reject('No connection with the server')
        : Promise.reject(error.reason))
  },
  /**
   * Logs out the user, removes all the local data
   */
  logOut: ({ commit, getters, dispatch }) => {
    dispatch('removeWorkspacesDBs')
    dispatch('removeUser')
    commit('setAuthenticated', false)
    commit('setUser', null)
    getters.getAuthDB.logOut()
  },
  /**
   * Stores a user in the local storage
   */
  storeUser: (ctx, user) => {
    window.localStorage.setItem('task-manager-user', JSON.stringify(user))
  },
  /**
   * Returns a user from the local storage
   */
  readUser: ({ commit }) => {
    let localUser = JSON.parse(localStorage.getItem('task-manager-user'))
    if (localUser) {
      commit('setUser', localUser)
      return Promise.resolve(localUser)
    } else {
      return Promise.reject('No local user')
    }
  },
  /**
   * Removes the user from the local storage
   */
  removeUser: () => {
    window.localStorage.clear()
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
