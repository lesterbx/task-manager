import axios from 'axios'
import { promisifyValidator, workspaceNotExist } from '../utils'
import { validateWorkspace } from '../utils/validators'

const state = {
  workspacesPreviews: []
}

const getters = {
  getWorkspacesPreviews: state => state.workspacesPreviews
}

const mutations = {
  setWorkspacesPreviews: (state, previews) => { state.workspacesPreviews = previews }
}

const actions = {
  createWorkspace: ({ dispatch, getters }, { workspace, password }) => {
    workspace = { ...workspace, users: [...workspace.users, getters.getUser.email] }
    return promisifyValidator(validateWorkspace, workspace)
      .then(() => workspaceNotExist(getters.couchURL, workspace._id))
      .then(() => axios.post(getters.serverURL + '/create', workspace))
      .then(() => dispatch('init'))
      .then(() => dispatch('readWorkspacesPreviews'))
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data.reason)
        } else {
          return Promise.reject(error.reason)
        }
      })
  },
  readWorkspacesPreviews: ({ getters, commit, dispatch }) => {
    return new Promise((resolve) => {
      let previews = []
      getters.getUser.workspaces.forEach((workspaceID) => {
        previews.push(dispatch('readWorkspacePreview', workspaceID))
      })
      Promise.all(previews).then((workspacesPreviews) => {
        commit('setWorkspacesPreviews', workspacesPreviews)
        resolve()
      })
    })
  },
  readWorkspacePreview: ({ getters }, workspaceID) => {
    return getters.workspacesDBs[workspaceID].get(workspaceID)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
