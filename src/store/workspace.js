import axios from 'axios'
import Vue from 'vue'
import { promisifyValidator, workspaceNotExist } from '../utils'
import { validateWorkspace } from '../utils/validators'

const state = {
  workspacesPreview: {},
  workspace: {}
}

const getters = {
  getWorkspacesPreview: (state) => state.workspacesPreview,
  getWorkspacePreview: (state) => (workspaceID) => state.workspacesPreview[workspaceID]
}

const mutations = {
  setWorkspacesPreview: (state, workspaces) => { state.workspacesPreview = workspaces },
  setWorkspacePreview: (state, workspace) => { Vue.set(state.workspacesPreview, workspace._id, workspace) },
  removeWorkspacePreview: (state, workspaceID) => { Vue.delete(state.workspacesPreview, workspaceID) }
}

const actions = {
  createWorkspace: ({ dispatch, getters }, { workspace, password }) => {
    workspace = { ...workspace, users: [...workspace.users, getters.getUser.email], boards: [] }
    return promisifyValidator(validateWorkspace, workspace)
      .then(() => workspaceNotExist(getters.couchURL, workspace._id))
      .then(() => axios.post(getters.serverURL + '/create', workspace))
      .then(() => dispatch('init'))
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data.reason)
        } else {
          return Promise.reject(error.reason)
        }
      })
  },
  readWorkspacesPreview: ({ dispatch, getters }) => {
    return Promise.all(getters.userWorkspaces.map((workspaceID) => {
      return dispatch('readWorkspacePreview', workspaceID)
    }))
  },
  readWorkspacePreview: ({ getters, dispatch, commit }, workspaceID) => {
    return getters.getWorkspaceDB(workspaceID).get(workspaceID)
      .then((workspace) => {
        commit('setWorkspacePreview', workspace)
        return Promise.resolve()
      })
  },
  workspaceChange: ({ state, commit, dispatch }, change) => {
    console.log(change)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
