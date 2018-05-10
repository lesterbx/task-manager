import axios from 'axios'
import Vue from 'vue'
import slugify from 'slugify'
import { promisifyValidator, workspaceNotExist } from '../utils'
import { validateWorkspace } from '../utils/validators'

const state = {
  workspaces: {},
  boards: {}
}

const getters = {
  getWorkspaces: state => state.workspaces,
  getWorkspace: state => workspaceID => state.workspaces[workspaceID],
  getBoards: state => state.boards
}

const mutations = {
  setWorkspaces: (state, workspaces) => { state.workspaces = workspaces },
  setWorkspace: (state, workspace) => { Vue.set(state.workspaces, workspace._id, workspace) },
  removeWorkspace: (state, workspaceID) => { Vue.delete(state.workspaces, workspaceID) },
  setBoard: (state, board) => { Vue.set(state.boards, board._id, board) },
  removeBoard: (state, boardID) => { Vue.delete(state.boards, boardID) }
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
  createBoard: ({ getters, commit, dispatch }, { workspaceID, title }) => {
    let boardID = `board-${slugify(title)}-${Date.now()}`
    getters.workspacesDBs[workspaceID].put({
      _id: boardID,
      title
    }).then(() => {
      getters.workspacesDBs[workspaceID].get(workspaceID)
        .then((workspaceDoc) => {
          getters.workspacesDBs[workspaceID]
            .put({ ...workspaceDoc, boards: [...workspaceDoc.boards, boardID] })
            .then(() => dispatch('bindBoards', workspaceID))
        })
    })
  },
  readWorkspace: ({ getters, dispatch, commit }, workspaceID) => {
    return getters.workspaceDB(workspaceID).get(workspaceID)
      .then((workspace) => {
        commit('setWorkspace', workspace)
        return Promise.resolve()
      })
  },
  workspaceChange: ({ state, commit, dispatch }, change) => {

  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
