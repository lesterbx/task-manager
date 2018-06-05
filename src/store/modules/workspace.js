import Vue from 'vue'
import { promisifyValidator, workspaceNotExist } from '@/utils'
import { validateWorkspace } from '@/utils/validators'
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
  workspaceUsers: {},
  /**
   * Boolean to tell if the workspace is loading
   */
  loadingWorkspace: true,
  /**
   * Pending action to run after entering the password
   */
  pendingAction: null
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
  getWorkspaceAdmins: (state) => state.workspaces && state.workspaces[state.currentWorkspace] && state.workspaces[state.currentWorkspace].admins,
  /**
   * Returns if the workspace is loading
   */
  getLoadingWorkspace: (state) => state.loadingWorkspace,
  /**
   * Return the pending action from the state
   */
  getPendingAction: (state) => state.pendingAction
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
  setWorkspaceUser: (state, user) => { Vue.set(state.workspaceUsers, user.email, user) },
  /**
   * Sets if the workspace is loading
   */
  setLoadingWorkspace: (state, loading) => { state.loadingWorkspace = loading },
  /**
   * Sets the pending action
   */
  setPendingAction: (state, action) => { state.pendingAction = action }
}

const actions = {
  /**
   * Creates a new workspace
   */
  createWorkspace: ({ dispatch, getters, commit }, { workspace, password }) => {
    // Prepares the workspace object
    workspace = { ...workspace, users: [...workspace.users, getters.getUser.email], admins: [getters.getUser.email], type: 'workspace', timestamp: Date.now() }
    // Validates the object
    return dispatch('checkConnection')
      .then(() => promisifyValidator(validateWorkspace, workspace))
      // Checks if the workspace already exists
      .then(() => workspaceNotExist(getters.couchURL, workspace._id))
      // Posts the workspace creation request to the node server
      .then(() => axios.post(getters.serverURL + '/workspace', workspace, { headers: { auth: `${getters.getUser.email}:${password}` } }))
      // Initializes the app again
      .then(() => dispatch('init'))
      // Handles the error
      .catch((error) => {
        console.log(JSON.stringify(error))
        return (error.response)
          ? Promise.reject(error.response.data)
          : Promise.reject(error.reason)
      })
  },
  /**
   * Updates the information fo a workspace
   */
  updateWorkspace: ({ getters }, workspace) => {
    let db = getters.getCurrentDB
    return db.get(workspace._id)
      .then((workspaceDoc) => db.put({ ...workspaceDoc, ...workspace, timestamp: Date.now() }))
      .catch((error) => console.log(error))
  },
  /**
   * Makes all the necessary actions to open a workspace
   */
  openWorkspace: ({ getters, dispatch, commit }, workspaceID) => {
    commit('setLoadingWorkspace', true)
    commit('setCurrentWorkspace', workspaceID)
    dispatch('syncWorkspaceDB', workspaceID)
    if (getters.isOnline) {
      dispatch('readWorkspaceUsers', workspaceID)
    }
    dispatch('readWorkspaceBoards', workspaceID)
      .then(() => commit('setLoadingWorkspace', false))
      .catch((error) => commit('setMessage', error.reason))
  },
  /**
   * Makes all the necessary actions to close a workspace
   */
  closeWorkspace: ({ dispatch, commit }, workspaceID) => {
    dispatch('unsyncWorkspaceDB', workspaceID)
    commit('setBoards', {})
    commit('setColumns', {})
    commit('setNotes', {})
  },
  /**
   * Reloads the currently opened workspace
   */
  reloadCurrentWorkspace: ({ getters, dispatch }) => {
    dispatch('closeWorkspace', getters.getCurrentWorkspace)
    dispatch('openWorkspace', getters.getCurrentWorkspace)
  },
  /**
   * Reads the information for all the workspaces
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
    return Promise.all(getters.getWorkspace(workspaceID).users.map((email) => dispatch('readWorkspaceUser', email)))
  },
  /**
   * Reads the full info for workspace a user and sets it to the state
   */
  readWorkspaceUser: ({ getters, commit }, email) => {
    return getters.getAuthDB.get('org.couchdb.user:' + email)
      .then((user) => {
        commit('setWorkspaceUser', { ...user, email: user.name })
        return Promise.resolve()
      })
  },
  /**
   * Sends the request to the server to add a new user to the workspace
   */
  addUserToWorkspace: ({ getters, commit, dispatch }, { email, password }) => {
    return axios.post(`${getters.serverURL}/workspace/${getters.getCurrentWorkspace}/user`, { email: email }, { headers: { auth: `${getters.getUser.email}:${password}` } })
      .then(() => {
        dispatch('readWorkspaceUsers', getters.getCurrentWorkspace)
        return Promise.resolve()
      })
      .catch((error) => Promise.reject(error.response.data))
  },
  /**
   * Sends the request to the server to add a new admin to the workspace
   */
  addAdminToWorkspace: ({ getters, commit, dispatch }, { email, password }) => {
    return axios.post(`${getters.serverURL}/workspace/${getters.getCurrentWorkspace}/admin`, { email: email }, { headers: { auth: `${getters.getUser.email}:${password}` } })
      .then(() => {
        dispatch('readWorkspaceUsers', getters.getCurrentWorkspace)
        return Promise.resolve()
      })
      .catch((error) => Promise.reject(error.response.data))
  },
  /**
   * Sends the request to the server to remove a user from the workspace
   */
  removeUserFromWorkspace: ({ getters, commit, dispatch }, { email, password }) => {
    return axios.delete(`${getters.serverURL}/workspace/${getters.getCurrentWorkspace}/user/${email}`, { headers: { auth: `${getters.getUser.email}:${password}` } })
      .then(() => dispatch('readWorkspaceUsers', getters.getCurrentWorkspace))
      .catch((error) => {
        commit('setMessage', error.response.data)
        return Promise.reject()
      })
  },
  /**
   * Sends the request to the server to remove an admin from the workspace
   */
  removeAdminFromWorkspace: ({ getters, commit, dispatch }, { email, password }) => {
    return axios.delete(`${getters.serverURL}/workspace/${getters.getCurrentWorkspace}/admin/${email}`, { headers: { auth: `${getters.getUser.email}:${password}` } })
      .then(() => dispatch('readWorkspaceUsers', getters.getCurrentWorkspace))
      .catch((error) => {
        commit('setMessage', error.response.data)
        return Promise.reject()
      })
  },
  /**
   * Function triggered when there is a change during the replication
   */
  syncChange: ({ dispatch }, { change }) => {
    change.docs.forEach((doc) => dispatch('handleChange', doc))
  },
  /**
   * Function trigger when there is a change on offline
   */
  docChange: ({ dispatch }, { doc }) => {
    dispatch('handleChange', doc)
  },
  /**
   * Handle a change in a document
   */
  handleChange: ({ getters, state, commit, dispatch }, doc) => {
    if (doc._deleted) {
      if (getters.getBoard(doc._id)) commit('removeBoard', doc._id)
      if (getters.getColumn(doc._id)) commit('removeColumn', doc._id)
      if (getters.getNote(doc._id)) commit('removeNote', doc._id)
    } else {
      if (doc.type === 'workspace') {
        commit('setWorkspace', doc)
      } else if (doc.type === 'board') {
        commit('setBoard', doc)
      } else if (doc.type === 'column') {
        commit('setColumn', doc)
      } else if (doc.type === 'note') {
        commit('setNote', doc)
      }
    }
  },
  /**
   * Runs the pending action
   */
  runPendingAction: ({ getters, dispatch, commit }, password) => {
    dispatch(getters.getPendingAction.action, { ...getters.getPendingAction.params, password })
      .then(() => commit('setMessage', getters.getPendingAction.success))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
