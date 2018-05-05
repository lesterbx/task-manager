import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import CryptoPouch from 'crypto-pouch'
import { db } from '../config.js'
import { URL } from '../utils'
PouchDB.plugin(PouchAuth)
PouchDB.plugin(CryptoPouch)
const state = {
  authDB: new PouchDB(URL(db) + '/_users'),
  workspacesDBs: {}
}

const getters = {
  authDB: (state) => state.authDB,
  workspacesDBs: (state) => state.workspacesDBs
}

const mutations = {
  setUserDB: (state, userDB) => { state.userDB = userDB },
  addWorkspaceDB: (state, { id, db }) => { state.workspacesDBs[id] = db }
}

const actions = {
  initWorkspacesDBs: ({ dispatch, getters }, { workspaces, sync }) => {
    workspaces.forEach((workspaceID) => dispatch('initWorkspaceDB', { workspaceID, sync }))
  },
  initWorkspaceDB: ({ dispatch, commit, getters }, { workspaceID, sync }) => {
    let localDB = new PouchDB(workspaceID)
    commit('addWorkspaceDB', { id: workspaceID, db: localDB })
    if (sync) {
      dispatch('syncWorkspaceDB', { localDB, workspaceID })
    }
  },
  syncWorkspaceDB: ({getters}, { localDB, workspaceID }) => {
    const remoteDB = new PouchDB(`${getters.couchURL}/${workspaceID}`)
    localDB.sync(remoteDB, { live: true })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
