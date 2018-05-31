import Vue from 'vue'
import slugify from 'slugify'
import uuid from 'uuid/v1'
import values from 'object.values'
import { updateDocsPositions } from '../utils'

const state = {
  boards: {},
  currentBoard: '',
  columns: {},
  notes: {}
}

const getters = {
  getBoards: (state) => state.boards,
  getBoard: (state) => (boardID) => state.boards[boardID],
  getColumns: (state) => state.columns,
  getColumn: (state) => (columnID) => state.columns[columnID],
  getColumnNotes: (state) => (columnID) => values(state.notes).filter((note) => note.columnID === columnID),
  getCurrentBoard: (state) => state.currentBoard
}

const mutations = {
  setCurrentBoard: (state, board) => { Vue.set(state, 'currentBoard', board) },
  setBoards: (state, boards) => { Vue.set(state, 'boards', boards) },
  setBoard: (state, board) => { Vue.set(state.boards, board._id, board) },
  setColumn: (state, column) => { Vue.set(state.columns, column._id, column) },
  setNote: (state, note) => { Vue.set(state.notes, note._id, note) },
  setColumns: (state, columns) => { state.columns = columns },
  setNotes: (state, notes) => { state.notes = notes }
}

const actions = {
  /**
   * Create a new board
   */
  createBoard: ({ getters, commit, dispatch }, { workspaceID, title }) => {
    return getters.getCurrentDB.put({
      _id: `${slugify(title, { lower: true })}-${Date.now()}`,
      type: 'board',
      title,
      timestamp: Date.now()
    })
  },
  renameBoard: ({ getters }, title) => {
    let db = getters.getCurrentDB
    return db.get(getters.getCurrentBoard)
      .then((boardDoc) => db.put({ ...boardDoc, title: title }))
  },
  deleteBoard: ({ getters }) => {
    let db = getters.getCurrentDB
    return db.get(getters.getCurrentBoard)
      .then((boardDoc) => db.remove(boardDoc))
      .then(() => getters.getCurrentDB.query('workspace/boardContent', { include_docs: true, key: getters.getCurrentBoard }))
      .then(({ rows }) => Promise.all(rows.map(({ doc }) => db.remove(doc))))
  },
  /**
   * Create a new column
   */
  createColumn: ({ getters, commit, dispatch }, { boardID, title }) => {
    return getters.getCurrentDB.put({
      _id: `column-${uuid()}`,
      type: 'column',
      title,
      boardID,
      position: Object.keys(getters.getColumns).length,
      timestamp: Date.now()
    })
  },
  /**
   * Create a new note
   */
  createNote: ({ getters, dispatch }, { boardID, columnID, text }) => {
    let noteID = `note-${uuid()}`
    return getters.getCurrentDB.put({
      _id: noteID,
      boardID,
      columnID,
      text: text,
      position: 0,
      type: 'note',
      timestamp: Date.now()
    }).then(() => dispatch('addNoteToColumn', { columnID, noteID, position: 0 }))
  },
  /**
   * Read all de boards from a workspace and stores them in the store
   * @param ctx Vuex context object
   * @param workspaceID workspace to read the boards from
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
  },
  /**
   * Move a column inside a board, it will change the position of the rest of the columns
   */
  moveColumn: ({ getters, dispatch }, { columnID, oldPosition, newPosition }) => {
    let db = getters.getCurrentDB
    return db.get(columnID)
      .then((columnDoc) => db.bulkDocs([
        { ...columnDoc, position: newPosition },
        ...updateDocsPositions({ docs: Object.values(getters.getColumns), oldPosition, newPosition })
      ]))
  },
  /**
   * Adds a note to a column, it will change the position of the rest of the notes
   */
  addNoteToColumn: ({ getters }, { columnID, noteID, position }) => {
    let db = getters.getCurrentDB
    // let updatedNotes = dispatch('updateDocsPositions', { docs: getters.getColumnNotes(columnID)})
    let updatedNotes = getters.getColumnNotes(columnID)
      .filter((note) => note.position >= position)
      .map((note) => ({ ...note, position: note.position + 1 }))
    return db.get(noteID).then((noteDoc) => db.bulkDocs([{ ...noteDoc, position: position, columnID: columnID }, ...updatedNotes]))
  },
  /**
   * Removes a note from a column, it will change the position of the rest of the notes
   */
  removeNoteFromColumn: ({ getters }, { columnID, noteID, position }) => {
    let db = getters.getCurrentDB
    let updatedNotes = getters.getColumnNotes(columnID)
      .filter((note) => note.position > position)
      .map((note) => ({ ...note, position: note.position - 1 }))
    return db.bulkDocs(updatedNotes)
  },
  /**
   * Moves a note inside a column, it will change the position of the rest of the notes
   */
  moveNoteInColumn: ({ getters }, { columnID, noteID, oldPosition, newPosition }) => {
    let db = getters.getCurrentDB
    let updatedNotes = []
    if (newPosition < oldPosition) {
      updatedNotes = Object.values(getters.getColumnNotes(columnID))
        .filter(({ position }) => position >= newPosition && position < oldPosition)
        .map((note) => ({ ...note, position: note.position + 1 }))
    } else if (newPosition > oldPosition) {
      updatedNotes = Object.values(getters.getColumnNotes(columnID))
        .filter(({ position }) => position <= newPosition && position > oldPosition)
        .map((note) => ({ ...note, position: note.position - 1 }))
    }
    db.get(noteID)
      .then((noteDoc) => db.bulkDocs([{ ...noteDoc, position: newPosition }, ...updatedNotes]))
  },
  /**
   * Updates the position of a note
   */
  updateNotePosition: ({ getters }, { noteID, newPosition }) => {
    let db = getters.getCurrentDB
    db.get(noteID).then((noteDoc) => db.put({ ...noteDoc, position: newPosition }))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
