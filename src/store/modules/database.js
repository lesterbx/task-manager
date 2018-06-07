import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import { db } from '@/config.js'
import { URL } from '@/utils'

PouchDB.plugin(PouchAuth)
PouchDB.debug.disable()

const state = {
  authDB: new PouchDB(URL(db) + '/_users'),
  workspacesDBs: {},
  syncHandlers: {}
}

const getters = {
  getAuthDB: (state) => state.authDB,
  getWorkspaceDB: (state) => (workspaceID) => state.workspacesDBs[workspaceID],
  getWorkspacesDBs: (state) => state.workspacesDBs,
  getSyncHandler: (state) => (workspaceID) => state.syncHandlers[workspaceID],
  getCurrentDB: (state, getters) => getters.getWorkspaceDB(getters.getCurrentWorkspace)
}

const mutations = {
  setUserDB: (state, userDB) => { state.userDB = userDB },
  setWorkspaceDB: (state, { workspaceID, db }) => { state.workspacesDBs[workspaceID] = db },
  setSyncHandler: (state, { workspaceID, handler }) => { state.syncHandlers[workspaceID] = handler },
  removeSyncHandler: (state, workspaceID) => { delete state.syncHandlers[workspaceID] },
  setCurrentDB: (state, db) => { state.currentDB = db }
}

const actions = {
  /**
   * Initializes the workspaces databases
   */
  initWorkspacesDBs: ({ commit, getters, dispatch }, { workspaces, online }) => {
    return Promise.all(workspaces.map((workspaceID) => {
      let db = new PouchDB(workspaceID)
      commit('setWorkspaceDB', { workspaceID, db })
      return online ? dispatch('fetchDB', db) : Promise.resolve()
    }))
  },
  /**
   * Removes the databases from the local storage
   */
  removeWorkspacesDBs: ({ getters }) => {
    return Promise.all(Object.keys(getters.getWorkspacesDBs).map((db) => getters.getWorkspaceDB(db).destroy()))
  },
  /**
   * Replicate the remote database in the local database
   */
  fetchDB: ({ getters, dispatch }, db) => {
    return db.replicate.from(`${getters.couchURL}/${db.name}`)
  },
  /**
   * Syncronizes a local database with the remote one, will be executed when a workspace in opened
   */
  syncWorkspaceDB: ({ getters, commit, dispatch }, workspaceID) => {
    let handler
    if (getters.isOnline) {
      handler = getters.getWorkspaceDB(workspaceID)
        .sync(`${getters.couchURL}/${workspaceID}`, { live: true, retry: true, include_docs: true })
        .on('change', (change) => dispatch('syncChange', change))
    } else {
      handler = getters.getWorkspaceDB(workspaceID)
        .changes({ since: 'now', live: true, include_docs: true })
        .on('change', (change) => dispatch('docChange', change))
    }
    commit('setSyncHandler', { workspaceID, handler: handler.on('error', (error) => console.log(error)) })
  },
  /**
   * Stops the syncronization with the remote database
   */
  unsyncWorkspaceDB: ({ state, getters, commit }, workspaceID) => {
    state.syncHandlers[workspaceID].cancel()
    commit('removeSyncHandler', workspaceID)
    commit('setBoards', {})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
