import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import CryptoPouch from 'crypto-pouch'
import { db } from '../config.js'
import { URL } from '../utils'
PouchDB.plugin(PouchAuth)
PouchDB.plugin(CryptoPouch)
const state = {
  authDB: new PouchDB(URL(db) + '/_users'),
  workspacesDBs: {},
  syncHandlers: {}
}

const getters = {
  getAuthDB: (state) => state.authDB,
  getWorkspaceDB: (state) => (workspaceID) => state.workspacesDBs[workspaceID],
  getWorkspacesDBs: (state) => state.workspacesDBs,
  getSyncHandler: (state) => (workspaceID) => state.syncHandlers[workspaceID]
}

const mutations = {
  setUserDB: (state, userDB) => { state.userDB = userDB },
  addWorkspaceDB: (state, { workspaceID, db }) => { state.workspacesDBs[workspaceID] = db },
  setSyncHandler: (state, { workspaceID, handler }) => { state.syncHandlers[workspaceID] = handler },
  removeSyncHandler: (state, workspaceID) => { delete state.syncHandlers[workspaceID] }
}

const actions = {
  initWorkspacesDBs: ({ commit }, workspaces) => {
    return Promise.resolve(workspaces.map((workspaceID) => {
      const db = new PouchDB(workspaceID)
      commit('addWorkspaceDB', { workspaceID, db })
      return db
    }))
  },
  fetchWorkspacesDBs: ({ getters, dispatch }, dbs) => {
    return Promise.all(dbs.map((db) => db.replicate.from(`${getters.couchURL}/${db.name}`)))
  },
  syncWorkspaceDB: ({ getters, commit, dispatch }, workspaceID) => {
    commit('setLoadingWorkspace', true)
    const remote = `${getters.couchURL}/${workspaceID}`
    const opts = { live: true, retry: true }
    const db = getters.getWorkspaceDB(workspaceID)
    commit('setSyncHandler', {
      workspaceID,
      handler: db.sync(remote, opts)
        .on('change', (change) => dispatch('workspaceChange', change))
        .on('error', (error) => commit('setMessage', error))
    })
    dispatch('readWorkspaceBoards', workspaceID)
      .then(() => commit('setLoadingWorkspace', false))
      .catch(() => commit('setLoadingWorkspace', false))
  },
  unsyncWorkspaceDB: ({ state, getters, commit }, workspaceID) => {
    state.syncHandlers[workspaceID].cancel()
    commit('removeSyncHandler', workspaceID)
    commit('setBoardsPreview', {})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
