import { promisifyValidator } from '../utils'
import { validateUser } from '../utils/validators'

const state = {
  user: null,
  authenticated: false
}

const getters = {
  getAuthenticated: (state) => state.authenticated,
  getUser: (state) => state.user
}

const mutations = {
  setAuthenticated: (state, authenticated) => { state.authenticated = authenticated },
  setUser: (state, user) => { state.user = user }
}

const actions = {
  getSession: ({ commit, dispatch, getters }) => {
    return getters.authDB.getSession()
      .then(({ userCtx }) => {
        if (userCtx.name !== null) {
          return Promise.resolve(userCtx.name)
        } else {
          return Promise.reject('Wrong session')
        }
      })
      .catch(() => Promise.reject('No session'))
  },
  fetchUser: ({ state, commit, dispatch, getters }, email) => {
    return getters.authDB.getUser(email)
      .then(({ name, first_name, last_name, workspaces }) => {
        return Promise.resolve({ email: name, first_name, last_name, workspaces })
      })
      .catch(() => Promise.reject('No user'))
  },
  signUp: ({ state, dispatch, commit, getters }, { email, password, ...metadata }) => {
    metadata.workspaces = []
    return dispatch('checkConnection')
      .then(() => promisifyValidator(validateUser, { name: email, password, ...metadata }))
      .then(() => getters.authDB.signUp(email, password, { metadata }))
      .then(() => dispatch('login', { email, password }))
      .catch(error => (error.status === 409)
        ? Promise.reject('The email is already in use by some user')
        : Promise.reject(error.reason)
      )
  },
  login: ({ state, commit, dispatch, getters }, { email, password }) => {
    if (email === '' || password === '') {
      return Promise.reject('Enetr your email and password')
    }
    return dispatch('checkConnection')
      .then(() => getters.authDB.logIn(email, password))
      .then((session) => {
        commit('setAuthenticated', true)
        return dispatch('init')
      }).then(() => {
        return dispatch('readWorkspacesPreviews')
      })
      .catch(error => Promise.reject(error.reason))
  },
  logOut: ({ state, commit, getters }) => {
    commit('setAuthenticated', false)
    commit('setUser', null)
    getters.authDB.logOut()
  },
  storeUser: (ctx, user) => {
    window.localStorage.setItem('task-manager-user', JSON.stringify(user))
    return Promise.resolve(user)
  },
  readUser: ({ commit }) => {
    let localUser = JSON.parse(localStorage.getItem('task-manager-user'))
    if (localUser) {
      commit('setUser', localUser)
      return Promise.resolve(localUser)
    } else {
      return Promise.reject('No local user')
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
