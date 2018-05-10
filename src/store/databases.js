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
  authDB: (state) => state.authDB,
  workspaceDB: (state) => (workspaceID) => state.workspacesDBs[workspaceID],
  workspacesDBs: (state) => state.workspacesDBs,
  syncHandler: (state) => (workspaceID) => state.syncHandler[workspaceID]
}

const mutations = {
  setUserDB: (state, userDB) => { state.userDB = userDB },
  addWorkspaceDB: (state, { id, db }) => { state.workspacesDBs[id] = db },
  setSyncHandler: (state, { workspaceID, handler }) => { state.syncHandlers[workspaceID] = handler },
  removeSyncHandler: (state, workspaceID) => { delete state.syncHandlers[workspaceID] }
}

const actions = {
  initWorkspacesDBs: ({ commit, dispatch }, { workspaces, sync }) => {
    Promise.all(workspaces.map((workspaceID) => {
      commit('addWorkspaceDB', { id: workspaceID, db: new PouchDB(workspaceID) })
      return dispatch('readWorkspace', workspaceID)
    }))
  },
  syncWorkspaceDB: ({ getters, commit, dispatch }, workspaceID) => {
    console.log(getters.couchURL)
    commit('setLoading', true)
    const remote = `${getters.couchURL}/${workspaceID}`
    const opts = { live: true, retry: true }
    getters.workspaceDB(workspaceID).replicate.from(remote).on('complete', (info) => {
      commit('setSyncHandler', db.sync(remote, opts)
        .on('change', (change) => dispatch('workspaceChange', change))
        .on('error', (error) => commit('setMessage', error))
      )
      console.log(info)
      commit('setLoading', false)
    }).on('error', (error) => {
      console.log(error)
      commit('setMessage', error)
    })
  },
  unsyncWorkspaceDB: ({ getters, commit }, workspaceID) => {
    getters.syncHandler(workspaceID).cancel()
    commit('removeSyncHandler', workspaceID)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
