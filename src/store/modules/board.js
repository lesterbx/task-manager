import Vue from 'vue'
import slugify from 'slugify'
import router from '@/router'

const state = {
  boards: {},
  currentBoard: ''
}

const getters = {
  getBoards: (state) => state.boards,
  getBoard: (state) => (boardID) => state.boards[boardID],
  getCurrentBoard: (state) => state.currentBoard
}

const mutations = {
  setCurrentBoard: (state, board) => { Vue.set(state, 'currentBoard', board) },
  setBoards: (state, boards) => { Vue.set(state, 'boards', boards) },
  setBoard: (state, board) => { Vue.set(state.boards, board._id, board) },
  removeBoard: (state, boardID) => { Vue.delete(state.boards, boardID) }
}

const actions = {
  /**
   * Create a new board
   */
  createBoard: ({ getters, commit, dispatch }, { title }) => {
    if (title === '') {
      return Promise.reject('Enter a title')
    } else {
      return getters.getCurrentDB.put({
        _id: `${slugify(title, { lower: true })}-${Date.now()}`,
        type: 'board',
        title,
        timestamp: Date.now()
      })
    }
  },
  /**
   * Updates the name for a board
   */
  renameBoard: ({ getters }, { title }) => {
    if (title === '') {
      return Promise.reject('Enter the title')
    } else {
      let db = getters.getCurrentDB
      return db.get(getters.getCurrentBoard)
        .then((boardDoc) => db.put({ ...boardDoc, title: title, timestamp: Date.now() }))
        .then(() => Promise.resolve())
        .catch((error) => Promise.reject(error.reason))
    }
  },
  /**
   * Deletes a board from the database
   */
  deleteBoard: ({ getters, commit }) => {
    let db = getters.getCurrentDB
    return db.get(getters.getCurrentBoard)
      .then((boardDoc) => db.remove(boardDoc))
      .then(() => getters.getCurrentDB.query('workspace/boardContent', { include_docs: true, key: getters.getCurrentBoard }))
      .then(({ rows }) => Promise.all(rows.map(({ doc }) => db.remove(doc))))
      .then(() => {
        commit('removeBoard', getters.getCurrentBoard)
        router.push(`/workspace/${getters.getCurrentWorkspace}`)
        return Promise.resolve()
      })
      .catch((error) => Promise.reject(error.reason))
  },
  /**
   * Read all de boards from a workspace and stores them in the store.
   */
  readWorkspaceBoards: ({ getters, commit }, workspaceID) => {
    return getters.getCurrentDB.query('workspace/boards', { include_docs: true })
      .then(({ rows }) => {
        rows.forEach(({ doc }) => commit('setBoard', doc))
        return Promise.resolve()
      })
  },
  /**
   * Read the columns and notes for a board
   */
  readBoardContent: ({ getters, commit, dispatch }, boardID) => {
    return getters.getCurrentDB.query('workspace/boardContent', { include_docs: true, key: boardID })
      .then(({ rows }) => {
        rows.forEach(({ doc }) => doc.type === 'column' ? commit('setColumn', doc) : commit('setNote', doc))
        return Promise.resolve()
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
