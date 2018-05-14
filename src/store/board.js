import Vue from 'vue'
import slugify from 'slugify'

const state = {
  boardsPreview: {},
  board: {
    columns: {},
    cards: {}
  }
}

const getters = {
  getBoardsPreview: (state) => state.boardsPreview,
  getBoardPreview: (state) => (boardID) => state.boardsPreview[boardID],
  getBoard: (state) => state.board
}

const mutations = {
  setBoardsPreview: (state, boards) => { state.boardsPreview = boards },
  setBoardPreview: (state, board) => { Vue.set(state.boardsPreview, board._id, board) },
  removeBoardPreview: (state, boardID) => { Vue.delete(state.boardsPreview, boardID) },
  setColumn: (state, column) => { Vue.set(state.board.columns, column._id, column) },
  setBoard: (state, board) => { Vue.set(state, 'board', board) }
}

const actions = {
  createBoard: ({ getters, commit, dispatch }, { workspaceID, title }) => {
    let boardID = `${slugify(title)}-${Date.now()}`
    getters.getWorkspaceDB(workspaceID).put({
      _id: boardID,
      title,
      columns: []
    }).then(() => {
      getters.getWorkspacesDBs[workspaceID].get(workspaceID)
        .then((workspaceDoc) => {
          getters.getWorkspacesDBs[workspaceID]
            .put({ ...workspaceDoc, boards: [...workspaceDoc.boards, boardID] })
        })
    })
  },
  createColumn: ({ getters, commit, dispatch }, { workspaceID, boardID, title }) => {
    let workspaceDB = getters.getWorkspaceDB(workspaceID)
    let columnID = `column-${slugify(title)}-${Date.now()}`
    workspaceDB.put({
      _id: columnID,
      title: title,
      cards: []
    }).then(() => {
      workspaceDB.get(boardID)
        .then((boardDoc) => {
          workspaceDB.put({
            ...boardDoc,
            columns: [...boardDoc.columns, columnID]
          })
        })
    })
  },
  readWorkspaceBoards: ({ getters, dispatch }, workspaceID) => {
    return Promise.all(getters.getWorkspacePreview(workspaceID).boards.map((boardID) => dispatch('readBoardPreview', { workspaceID, boardID })))
  },
  readBoardPreview: ({ getters, commit }, { workspaceID, boardID }) => {
    return getters.getWorkspaceDB(workspaceID).get(boardID)
      .then((board) => {
        commit('setBoardPreview', board)
        return Promise.resolve()
      })
  },
  readBoardColumns: ({ getters, state, commit }, { workspaceID, boardID }) => {
    getters.getBoardPreview(boardID).columns.forEach((columnID) => {
      getters.getWorkspaceDB(workspaceID).get(columnID)
        .then((column) => commit('setColumn', column))
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
