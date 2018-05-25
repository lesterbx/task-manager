import Vue from 'vue'
import { promisifyValidator, workspaceNotExist } from '../utils'
import { validateWorkspace } from '../utils/validators'
import axios from 'axios'

const state = {
  /**
   * All the workspace documents that beongs to the current user
   */
  workspaces: {},
  /**
   * Name of the current opened workspace
   */
  currentWorkspace: '',
  /**
   * Full information abaout the users that belong to the current opened workspace
   */
  workspaceUsers: {}
}

const getters = {
  /**
   * Returns the workspaces from the current user
   */
  getWorkspaces: (state) => state.workspaces,
  /**
   * Returns a single workspace given its ID
   */
  getWorkspace: (state) => (workspaceID) => state.workspaces[workspaceID],
  /**
   * Returns the name of the current opened workspace
   */
  getCurrentWorkspace: (state) => state.currentWorkspace,
  /**
   * Return the users that belongs to the current workpace
   */
  getWorkspaceUsers: (state) => state.workspaceUsers,
  /**
   * Return the admins from the current workspace
   */
  getWorkspaceAdmins: (state) => state.workspaces && state.workspaces[state.currentWorkspace] && state.workspaces[state.currentWorkspace].admins
}

const mutations = {
  /**
   * Sets the user's workspaces
   */
  setWorkspaces: (state, workspaces) => { state.workspaces = workspaces },
  /**
   * Sets a user workspace
   */
  setWorkspace: (state, workspace) => { Vue.set(state.workspaces, workspace._id, workspace) },
  /**
   * Removes a workspaces from the state
   */
  removeWorkspace: (state, workspaceID) => { Vue.delete(state.workspaces, workspaceID) },
  /**
   * Sets the current workspace
   */
  setCurrentWorkspace: (state, workspaceID) => { state.currentWorkspace = workspaceID },
  /**
   * Sets a user in the workspaces users list
   */
  setWorkspaceUser: (state, user) => { Vue.set(state.workspaceUsers, user.email, user) }
}

const actions = {
  /**
   * Creates a new workspace
   */
  createWorkspace: ({ dispatch, getters, commit }, { workspace, password }) => {
    // Prepares the workspace object
    workspace = { ...workspace, users: [...workspace.users, getters.getUser.email], admins: [getters.getUser.email], type: 'workspace' }
    // Validates the object
    return promisifyValidator(validateWorkspace, workspace)
      // Checks if the workspace already exists
      .then(() => workspaceNotExist(getters.couchURL, workspace._id))
      // Posts the workspace creation request to the node server
      .then(() => axios.post(getters.serverURL + '/workspace', workspace ))
      // Initializes the app again
      .then(() => dispatch('init'))
      // Handles the error
      .catch((error) => (error.response)
        ? Promise.reject(error.response.data.reason)
        : Promise.reject(error.reason))
  },
  /**
   * Reads the workspace information documents for all the user's workspaces
   */
  readWorkspacesPreview: ({ dispatch, getters }) => {
    return Promise.all(getters.userWorkspaces
      .map((workspaceID) => dispatch('readWorkspacePreview', workspaceID))
    )
  },
  /**
   * Reads the information document for a given workspace and stores it on the state
   */
  readWorkspacePreview: ({ getters, dispatch, commit }, workspaceID) => {
    return getters.getWorkspaceDB(workspaceID).get(workspaceID)
      .then((workspace) => {
        commit('setWorkspace', workspace)
        return Promise.resolve()
      })
      .catch(() => Promise.resolve())
  },
  /**
   * Reads the full information for the current workpsace users
   */
  readWorkspaceUsers: ({ getters, commit, dispatch }, workspaceID) => {
    return Promise.all(getters.getWorkspace(workspaceID).users.map((email) => dispatch('readUser', email)))
  },
  /**
   * Reads the full info for a user sets it to the state
   */
  readUser: ({ getters, commit }, email) => {
    return getters.getAuthDB.get('org.couchdb.user:' + email)
      .then((user) => {
        commit('setWorkspaceUser', { ...user, email: user.name })
        return Promise.resolve()
      })
  },
  /**
   * Sends the request to the server to add a new user to the workspace
   */
  addUserToWorkspace: ({ getters, commit }, { workspaceID, user }) => {
    axios.post(`${getters.serverURL}/${workspaceID}/user`, { user })
  },
  /**
   * Action trigerred when there is a change in the current workspace database
   */
  workspaceChange: ({ state, commit, dispatch }, { change }) => {
    console.log(change)
    change.docs.forEach((doc) => {
      if (doc.type === 'workspace') {
        commit('setWorkspace', doc)
      } else if (doc.type === 'board') {
        if (doc._deleted) {
          commit('removeBoard', doc._id)
        } else {
          commit('setBoard', doc)
        }
      } else if (doc.type === 'column') {
        if (doc._deleted) {
          commit('removeColumn', doc._id)
        } else {
          commit('setColumn', doc)
        }
      } else if (doc.type === 'note') {
        if (doc._deleted) {
          commit('removeNote', doc._id)
        } else {
          commit('setNote', doc)
        }
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
